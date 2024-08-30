
export interface CustomerRequest {
    email: string;
    name: string;
    address: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Customer {
    id: string;
    email: string;
    name: string;
    address: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Measure {
    id?: string;
    customer_code: string;
    measure_datetime: Date;
    measure_type: string;
    measure_value: number;
    confirmed_value: boolean;
    image?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ICustomer {
    createInitial(): Promise<void>;
    save(newCustomer: CustomerRequest): Promise<Customer>;
    update(customer: Customer): Promise<Customer>;
    getById(id: string): Promise<Customer>;
}

export interface IMeasure {
    save(newMeasure: Measure): Promise<Measure>;
    update(measure: Measure): Promise<Measure>;
    getById(id: string): Promise<Measure>;
    getByCustomerId(customerId: string): Promise<Measure[]>;
}
