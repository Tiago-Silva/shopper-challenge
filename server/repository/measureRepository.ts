import { PrismaClient } from '@prisma/client'
import {IMeasure, Measure, MeasureRequestDTO} from "../interface/interface";


export class MeasureRepository implements IMeasure {
    private prisma: PrismaClient;
    constructor(prisma: PrismaClient) {
        this.prisma = prisma
    }

    async save(newMeasure: MeasureRequestDTO): Promise<Measure> {
        return this.prisma.measure.create({data: newMeasure});
    }

    async update(measure: Measure): Promise<Measure> {
        return this.prisma.measure.update({
            where: { id: measure.id },
            data: measure
        });
    }

    async getById(id: string): Promise<Measure> {
        const measure = await this.prisma.measure.findUnique(({
            where: { id: id }
        }));

        if (!measure) {
            throw new Error('Measure not found');
        }

        return measure as Measure;
    }

    async getByCustomerId(customerId: string): Promise<Measure[]> {
        return this.prisma.measure.findMany({
            where: { customer_code: customerId }
        });
    }

    async getByData(customerId: string, measureDatetime: string): Promise<Measure> {
        const date = new Date(measureDatetime);
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const measure = await this.prisma.measure.findFirst({
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

        return measure;
    }
}
