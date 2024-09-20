import { PrismaClient } from '@prisma/client'
import {CustomerGateway} from "../../application/gateway/CustomerGateway";
import {Customer} from "../../domain/entity/Customer";

export class CustomerRepositoryPrisma implements CustomerGateway {
    constructor(private readonly prisma: PrismaClient) {
        this.prisma = prisma;
    }

    public static create(prismaClient: PrismaClient) {
        return new CustomerRepositoryPrisma(prismaClient);
    }

    async createInitial(): Promise<void> {

        const existingCustomer = await this.prisma.customer.findUnique({
            where: { email: 'customer01@gmail.com'}
        });

        if (!existingCustomer) {
            const customer = await this.prisma.customer.create({
                data: {
                    email: 'customer01@gmail.com',
                    name: 'customer01',
                    address: 'Avenida customer'
                }
            });
            console.log("Customer_ID: ", customer.customer_code);
        } else {
            console.log("Customer_existing_ID: ", existingCustomer.customer_code);
        }
    }

    async getById(id: string): Promise<Customer> {
        const customer = await this.prisma.customer.findUnique({
            where: { customer_code: id }
        });

        if (!customer) {
            throw new Error('Customer not found');
        }

        return customer as Customer;
    }

    async getByEmail(email: string): Promise<Customer> {
        const customer = await this.prisma.customer.findUnique({
            where: { email: email }
        })

        if (!customer) {
            throw new Error('Customer not found');
        }

        return customer as Customer;
    }

    async save(newCustomer: Customer): Promise<Customer> {
         this.prisma.customer.create({data: newCustomer});
         return newCustomer;
    }

    async update(customer: Customer): Promise<Customer> {
        const update = this.prisma.customer.update({
            where: { customer_code: customer.customer_code },
            data: customer
        });

        return Customer.createWithPrisma(update);
    }

    delete(customer: Customer): Promise<void> {
        throw new Error('Method not implemented.');
    }
}
