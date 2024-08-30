import prisma from "../config/prismaConfig";
import fs from 'fs';
import path from 'path';
import dotenv from "dotenv";
import {IRequestDTO, IResponseDTO, Measure} from "../interface/interface";
import {GenerateContentResult, GoogleGenerativeAI} from "@google/generative-ai";
import {MeasureRepository} from "../repository/measureRepository";
dotenv.config();

const configuration = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const modelId = 'gemini-1.5-flash';
const model = configuration.getGenerativeModel({ model: modelId });

export class MeasureService {
    private measureRepository = new MeasureRepository(prisma);

    async uploadImage(data: IRequestDTO): Promise<IResponseDTO | { error_code: string, error_description: string }> {
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
            const measure = await this.saveMeasure(data, parseInt(result.response.text()), false);

            return {
                image_url: filePath,
                measure_value: measure.measure_value.toString(),
                measure_uuid: measure.id
            };
        } catch (e) {
            throw new Error('Error processing image');
        }
    }

    async saveMeasure(requestDTO: IRequestDTO, measureValue: number, confirmed: boolean): Promise<Measure> {
        return this.measureRepository.save({
            customer_code: requestDTO.customer_code,
            measure_datetime: new Date(),
            measure_type: requestDTO.measure_type,
            measure_value: measureValue,
            confirmed_value: confirmed,
            image: requestDTO.image
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
