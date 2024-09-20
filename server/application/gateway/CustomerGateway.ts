import {Customer} from "../../domain/entity/Customer";
import {Gateway} from "./gateway";


export interface CustomerGateway extends Gateway<Customer> {
    createInitial(): Promise<void>;
}
