import {Customer, CustomerRequest, ICustomer} from "../interface/interface";
import { PrismaClient } from '@prisma/client'

export class CustomerRepository implements ICustomer {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async createInitial(): Promise<void> {

        const existingCustomer = await this.prisma.customer.findUnique({
            where: { email: 'customer01@gmail.com'}
        })

        if (!existingCustomer) {
            this.prisma.customer.create({
                data: {
                    email: 'customer01@gmail.com',
                    name: 'customer01',
                    address: 'Avenida customer'
                }
            });
        }
    }

    async getById(id: string): Promise<Customer> {
        const customer = await this.prisma.customer.findUnique({
            where: { id: id }
        });

        if (!customer) {
            throw new Error('Customer not found');
        }

        return customer as Customer;
    }

    async save(newCustomer: CustomerRequest): Promise<Customer> {
        return this.prisma.customer.create({data: newCustomer});
    }

    async update(customer: Customer): Promise<Customer> {
        return this.prisma.customer.update({
            where: { id: customer.id },
            data: customer
        });
    }
}
