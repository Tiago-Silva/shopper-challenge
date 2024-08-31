import prisma from "../config/prismaConfig";
import fs from 'fs';
import path from 'path';
import dotenv from "dotenv";
import {IMeasureListDTO, IPathRequestDTO, IRequestDTO, IResponseDTO, Measure} from "../interface/interface";
import {GenerateContentResult, GoogleGenerativeAI} from "@google/generative-ai";
import {MeasureRepository} from "../repository/measureRepository";
dotenv.config();

const configuration = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const modelId = 'gemini-1.5-flash';
const model = configuration.getGenerativeModel({ model: modelId });

export class MeasureService {
    private measureRepository = new MeasureRepository(prisma);

    async upload(data: IRequestDTO): Promise<IResponseDTO | { error_code: string, error_description: string }> {
        const { image, customer_code, measure_datetime, measure_type } = data;
        if (!image || !customer_code || !measure_datetime || !measure_type) {
            return {
                error_code: "INVALID_DATA",
                error_description: "Invalid data"
            };
        }

        const existingMeasure = await this.measureRepository.getByData(customer_code,measure_datetime);
        if (existingMeasure) {
            return {
                error_code: "DOUBLE_REPORT",
                error_description: "Leitura do mês já realizada"
            };
        }

        const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
        try {
            const result = await this.getGeminiAI(base64Data);
            const filePath = this.saveImage(base64Data, customer_code);
            const measure = await this.saveMeasure(data, parseInt(result.response.text()), false, filePath);

            return {
                image_url: filePath,
                measure_value: measure.measure_value.toString(),
                measure_uuid: measure.measure_uuid
            };
        } catch (e) {
            throw new Error('Error processing image');
        }
    }

    async confirm(data: IPathRequestDTO): Promise<{ success: boolean } | { error_code: string, error_description: string }> {
        const { measure_uuid, confirmed_value } = data;
        if (!measure_uuid || !confirmed_value) {
            return {
                error_code: "INVALID_DATA",
                error_description: "Invalid data"
            };
        }

        const measure = await this.measureRepository.getById(measure_uuid);
        if (!measure) {
            return {
                error_code: "MEASURE_NOT_FOUND",
                error_description: "Leitura não encontrada"
            }
        }

        if (this.checkDuplication(measure.measure_datetime) && measure.has_confirmed) {
            return {
                error_code: "CONFIRMATION_DUPLICATE",
                error_description: "Leitura do mês já realizada"
            };
        }

        measure.has_confirmed = true;
        const update = await this.measureRepository.update(measure);

        return {success: update.has_confirmed};
    }

    async getMeasureList(customerId: string, measureType: string | null): Promise<IMeasureListDTO | { error_code: string, error_description: string }> {
        let measures;
        if (measureType && measureType.trim() !== '') {
            const validMeasureType = ['WATER', 'GAS'];
            const measureTypeUpper = (measureType as string).toUpperCase();
            if (!validMeasureType.includes(measureTypeUpper)) {
                return {
                    error_code: "INVALID_TYPE",
                    error_description: "Tipo de medição não permitida"
                }
            }
            measures = await this.getByCustomerIdAndType(customerId, measureTypeUpper);
        } else {
            measures = await this.getByCustomerId(customerId);
        }

        if (measures.length <= 0) {
            return {
                error_code: "MEASURES_NOT_FOUND",
                error_description: "Nenhuma leitura encontrada"
            }
        }

        return {
            customer_code: customerId,
            measures: measures
        };
    }

    async getByCustomerId(customerId: string): Promise<Measure[]> {
        try {
            return this.measureRepository.getByCustomerId(customerId);
        } catch (e) {
            throw new Error('Error get measures by customer id');
        }
    }

    async getByCustomerIdAndType(customerId: string, measureType: string): Promise<Measure[]> {
        try {
            return this.measureRepository.getByIdAndType(customerId, measureType);
        } catch (e) {
            throw new Error('Error get measures by customer id and type');
        }
    }

    checkDuplication(measureDateTime: Date): boolean {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        const measureDate = new Date(measureDateTime);
        const measureMonth = measureDate.getMonth();
        const measureYear = measureDate.getFullYear();

        return measureMonth === currentMonth && measureYear === currentYear;
    }

    async saveMeasure(requestDTO: IRequestDTO, measureValue: number, confirmed: boolean, image_url: string): Promise<Measure> {
        return this.measureRepository.save({
            customer_code: requestDTO.customer_code,
            measure_datetime: new Date(),
            measure_type: requestDTO.measure_type,
            measure_value: measureValue,
            has_confirmed: confirmed,
            image_url: image_url
        });
    }

    saveImage(base64Data: string, customer_code: string): string {

        const buffer = Buffer.from(base64Data, 'base64');
        const filename = `${customer_code}_${Date.now()}.png`;
        const filePath = path.join(__dirname, '../../assets', filename);

        try {
            fs.writeFileSync(filePath, buffer);
            return `/assets/${filename}`;
        } catch (e) {
            throw new Error('Error processing image');
        }
    }

    async getGeminiAI(base64Data: string): Promise<GenerateContentResult> {
        const prompt = 'Extract the numerical reading from the following image, which shows a water/gas meter reading. The reading is in the form of a number, such as 12345';
        const image = {
            inlineData: {
                data: base64Data,
                mimeType: "image/png",
            },
        };

        return await model.generateContent([prompt,image]);
    }
}
