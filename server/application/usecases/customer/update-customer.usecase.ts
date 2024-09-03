import {Usecase} from "../usecase";
import {Customer} from "../../../domain/entity/Customer";
import {CustomerGateway} from "../../gateway/CustomerGateway";


export class UpdateCustomerUsecase implements Usecase<Customer, Customer> {

    private constructor(private readonly customerGateway: CustomerGateway) {};

    public async exec(input: Customer): Promise<Customer> {
        const updateCustomer = Customer.createWithProps(input);

        await this.customerGateway.update(updateCustomer);

        return updateCustomer;
    }

}
