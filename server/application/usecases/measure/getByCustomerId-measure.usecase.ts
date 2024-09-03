import {Usecase} from "../usecase";
import {Measure, MeasureProps} from "../../../domain/entity/Measure";
import {MeasureGateway} from "../../gateway/MeasureGateway";


export class GetByCustomerIdMeasureUsecase implements Usecase<string, MeasureProps[]> {

    private constructor(private readonly measureGateway: MeasureGateway) {};

    public static getByCustomerId(measureGateway: MeasureGateway) {
        return new GetByCustomerIdMeasureUsecase(measureGateway);
    }

    public async exec(inputDTO: string): Promise<MeasureProps[]> {

        return await this.measureGateway.getByCustomerId(inputDTO);
    }
}
