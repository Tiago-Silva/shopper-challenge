import { PrismaClient, Measure as PrismaMeasure } from '@prisma/client';
import { MeasureGateway } from "../../application/gateway/MeasureGateway";
import { MeasureRequestDTO } from "../DTO/MeasureRequestDTO";
import { Measure } from "../../domain/entity/Measure";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import {GenerateContentResult, GoogleGenerativeAI} from "@google/generative-ai";
import {UploadInputData, UploadOutputData} from "../../application/usecases/measure/upload-image-measure.usecase";

dotenv.config();
const configuration = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const modelId = 'gemini-1.5-flash';
const model = configuration.getGenerativeModel({ model: modelId })

export class MeasureRepositoryPrisma implements MeasureGateway {

    constructor(private readonly prisma: PrismaClient) {
        this.prisma = prisma;
    }

    public static create(prismaClient: PrismaClient) {
        return new MeasureRepositoryPrisma(prismaClient);
    }

    async save(newMeasure: MeasureRequestDTO): Promise<Measure> {
        const createdMeasure: PrismaMeasure = await this.prisma.measure.create({ data: newMeasure });
        return Measure.fromPrismaToMeasure(createdMeasure);
    }

    async update(measure: Measure): Promise<Measure> {
        const updatedMeasure: PrismaMeasure = await this.prisma.measure.update({
            where: {
                measure_uuid: measure.measure_uuid
            },
            data: {
                customer_code: measure.customer_code,
                measure_datetime: measure.measure_datetime,
                measure_type: measure.measure_type,
                measure_value: measure.measure_value,
                has_confirmed: measure.has_confirmed as boolean,
                image_url: measure.image_url,
                createdAt: measure.createdAt,
                updatedAt: measure.updatedAt
            }
        });
        return Measure.fromPrismaToMeasure(updatedMeasure);
    }

    async upload(inputData: UploadInputData): Promise<UploadOutputData> {
        const result = await this.getGeminiAI(inputData.image);
        const filePath = this.saveImage(inputData.image,inputData.custom_code);

        return {
            file_path: filePath,
            measure_value: parseInt(result.response.text())
        }
    }

    async getById(id: string): Promise<Measure> {
        const measure: PrismaMeasure | null = await this.prisma.measure.findUnique({
            where: { measure_uuid: id }
        });

        if (!measure) {
            throw new Error('Measure not found');
        }

        return Measure.fromPrismaToMeasure(measure);
    }

    async getByCustomerId(customerId: string): Promise<Measure[]> {
        const measures: PrismaMeasure[] = await this.prisma.measure.findMany({
            where: { customer_code: customerId }
        });

        return measures.map(Measure.fromPrismaToMeasure);
    }

    async getByDateAndType(customerId: string, measureDatetime: string, measureType: string): Promise<Measure> {
        const date = new Date(measureDatetime);
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const measure: PrismaMeasure | null = await this.prisma.measure.findFirst({
            where: {
                customer_code: customerId,
                measure_type: measureType,
                AND: [
                    {
                        measure_datetime: {
                            gte: new Date(`${year}-${month}-01`),
                            lt: new Date(`${year}-${month + 1}-01`)
                        }
                    }
                ]
            }
        });

        if (!measure) {
            throw new Error('Measure not found');
        }

        return Measure.fromPrismaToMeasure(measure);
    }

    async getByIdAndType(customerId: string, measureType: string): Promise<Measure[]> {
        const measures: PrismaMeasure[] = await this.prisma.measure.findMany({
            where: {
                customer_code: customerId,
                measure_type: measureType,
            }
        });

        return measures.map(Measure.fromPrismaToMeasure);
    }

    private saveImage(base64Data: string, customer_code: string): string {

        const buffer = Buffer.from(base64Data, 'base64');
        const filename = `${customer_code}_${Date.now()}.png`;
        const filePath = path.join(__dirname, '../../../assets', filename);

        try {
            fs.writeFileSync(filePath, buffer);
            return `/assets/${filename}`;
        } catch (e) {
            console.log('save image error: ', e);
            throw new Error('Error processing image');
        }
    }

    private async getGeminiAI(base64Data: string): Promise<GenerateContentResult> {
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
