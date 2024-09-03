import {Usecase} from "../usecase";
import {Customer} from "../../../domain/entity/Customer";
import {CustomerGateway} from "../../gateway/CustomerGateway";


export class CreateCustomerUsecase implements Usecase<Customer, Customer> {

    private constructor(private readonly customerGateway: CustomerGateway) {};

    public async exec(input: Customer): Promise<Customer> {
        const newCustomer = Customer.createWithProps(input);

        await this.customerGateway.save(newCustomer);

        return newCustomer;
    }

}
