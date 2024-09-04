export type CustomerProps = {
    customer_code?: string;
    email: string;
    name: string;
    address: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Customer {
    private constructor(private props: CustomerProps) {}

    public static createWithProps(props: CustomerProps) {
        return new Customer(props);
    }

    public static createWithPrisma(prisma: any): Customer {
        return new Customer({
            customer_code: prisma.customer_code,
            email: prisma.email,
            name: prisma.name,
            address: prisma.address,
            createdAt: prisma.createdAt,
            updatedAt: prisma.updatedAt
        });
    }

    private validate() {
        if (this.props.name.length <= 0) {
            throw new Error('Name is required');
        }
    }

    public get customer_code(): string {
        return this.props.customer_code || '';
    }

    public get email(): string {
        return this.props.email;
    }

    public get name(): string {
        return this.props.name;
    }

    public get address(): string {
        return this.props.address;
    }

    public get createdAt(): Date {
        return this.props.createdAt || new Date();
    }

    public get updatedAt(): Date {
        return this.props.updatedAt || new Date();
    }
}
