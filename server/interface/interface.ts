
export interface CustomerRequest {
    email: string;
    name: string;
    address: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Customer {
    customer_code: string;
    email: string;
    name: string;
    address: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface MeasureRequestDTO {
    customer_code: string;
    measure_datetime: Date;
    measure_type: string;
    measure_value: number;
    has_confirmed: boolean;
    image_url: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Measure {
    measure_uuid: string;
    customer_code: string;
    measure_datetime: Date;
    measure_type: string;
    measure_value: number;
    has_confirmed: boolean;
    image_url: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IResponseDTO {
    image_url: string;
    measure_value: string;
    measure_uuid: string;
}

export interface IRequestDTO{
    image: string;
    customer_code: string;
    measure_datetime: string;
    measure_type: 'WATER' | 'GAS';
}

export interface IPathRequestDTO{
    measure_uuid: string;
    confirmed_value: number;
}

export interface IMeasureListDTO{
    customer_code: string;
    measures: Measure[];
}

export interface ICustomer {
    createInitial(): Promise<void>;
    save(newCustomer: CustomerRequest): Promise<Customer>;
    update(customer: Customer): Promise<Customer>;
    getById(id: string): Promise<Customer>;
    getByEmail(email: string): Promise<Customer>;
}

export interface IMeasure {
    save(newMeasure: MeasureRequestDTO): Promise<Measure>;
    update(measure: Measure): Promise<Measure>;
    getById(id: string): Promise<Measure>;
    getByCustomerId(customerId: string): Promise<Measure[]>;
    getByData(customerId: string, measureDatetime: string): Promise<Measure>;
    getByIdAndType(customerId: string, measureType: string): Promise<Measure[]>;
}
