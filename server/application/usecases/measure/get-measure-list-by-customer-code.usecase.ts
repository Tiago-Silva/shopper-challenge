import {Usecase} from "../usecase";
import {MeasureProps} from "../../../domain/entity/Measure";
import {MeasureGateway} from "../../gateway/MeasureGateway";


export class GetMeasureListByCustomerCodeUsecase implements Usecase<string, MeasureProps[]> {

    private constructor(private readonly measureGateway: MeasureGateway) {};

    public static create(measureGateway: MeasureGateway) {
        return new GetMeasureListByCustomerCodeUsecase(measureGateway);
    }

    public async exec(inputDTO: string): Promise<MeasureProps[]> {

        return await this.measureGateway.getByCustomerCode(inputDTO);
    }
}
