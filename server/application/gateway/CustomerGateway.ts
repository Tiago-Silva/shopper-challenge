import {Customer} from "../../domain/entity/Customer";


export interface CustomerGateway {
    save(newCustomer: Customer): Promise<Customer>;
    update(customer: Customer): Promise<Customer>;
    delete(customer: Customer): Promise<void>;
    createInitial(): Promise<void>;
}
