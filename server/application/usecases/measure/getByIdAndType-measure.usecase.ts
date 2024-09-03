import {Usecase} from "../usecase";
import {Measure} from "../../../domain/entity/Measure";
import {MeasureGateway} from "../../gateway/MeasureGateway";


export class GetByIdAndTypeMeasureUsecase implements Usecase<[string, string], Measure[]> {

    private constructor(private readonly measureGateway: MeasureGateway) {}

    public async exec(input: [customerId: string, measureType: string]): Promise<Measure[]> {
        const [customerId, measureType] = input;
        return await this.measureGateway.getByIdAndType(customerId, measureType);
    }

}
