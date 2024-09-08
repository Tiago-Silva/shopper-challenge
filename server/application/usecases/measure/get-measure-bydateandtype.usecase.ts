import {Usecase} from "../usecase";
import {Measure} from "../../../domain/entity/Measure";
import {MeasureGateway} from "../../gateway/MeasureGateway";

export class GetMeasureBydateandtypeUsecase implements Usecase<Measure, Measure> {

    private constructor(private readonly measureGateway: MeasureGateway) {};

    public static create(measureGateway: MeasureGateway) {
        return new GetMeasureBydateandtypeUsecase(measureGateway);
    }

    public async exec(input: Measure): Promise<Measure> {
        const {customer_code, measure_datetime, measure_type} = input;
        const existingMeasure =  await this.measureGateway.getByDateAndType(customer_code, measure_datetime.toString(), measure_type);
        if (existingMeasure) {
            throw new Error('DOUBLE_REPORT');
        }

        return existingMeasure;
    }

}
