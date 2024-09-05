import { PrismaClient, Measure as PrismaMeasure } from '@prisma/client';
import { MeasureGateway } from "../../application/gateway/MeasureGateway";
import { MeasureRequestDTO } from "../DTO/MeasureRequestDTO";
import { Measure } from "../../domain/entity/Measure";

export class MeasureRepositoryPrisma implements MeasureGateway {
    constructor(private readonly prisma: PrismaClient) {
        this.prisma = prisma;
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

    async getByData(customerId: string, measureDatetime: string): Promise<Measure> {
        const date = new Date(measureDatetime);
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const measure: PrismaMeasure | null = await this.prisma.measure.findFirst({
            where: {
                customer_code: customerId,
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
}
