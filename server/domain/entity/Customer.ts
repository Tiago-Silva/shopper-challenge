export type CustomerProps = {
    customer_code: string;
    email: string;
    name: string;
    address: string;
    createdAt: Date;
    updatedAt: Date;
}

export class Customer {
    private constructor(private props: CustomerProps) {}

    public static createWithProps(props: CustomerProps) {
        return new Customer(props);
    }

    private validate() {
        if (this.props.name.length <= 0) {
            throw new Error('Name is required');
        }
    }

    public get customer_code(): string {
        return this.props.customer_code;
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
        return this.props.createdAt;
    }

    public get updatedAt(): Date {
        return this.props.updatedAt;
    }
}
