import {Usecase} from "../usecase";
import {Customer} from "../../../domain/entity/Customer";
import {CustomerGateway} from "../../gateway/CustomerGateway";


export class CreateInitialCustomerUsecase implements Usecase<void, void> {

    private constructor(private readonly customerGateway: CustomerGateway) {};

    public async exec(): Promise<void> {
        await this.customerGateway.createInitial();
    }

}
