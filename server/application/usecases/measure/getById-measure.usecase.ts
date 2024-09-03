import {Usecase} from "../usecase";
import {Measure, MeasureProps} from "../../../domain/entity/Measure";
import {MeasureGateway} from "../../gateway/MeasureGateway";


export class GetByIdMeasureUsecase implements Usecase<MeasureProps, MeasureProps> {

    private constructor(private readonly measureGateway: MeasureGateway) {};

    public static create(measureGateway: MeasureGateway) {
        return new GetByIdMeasureUsecase(measureGateway);
    }

    public async exec(inputDTO: MeasureProps): Promise<MeasureProps> {
        const newMeasure = Measure.createWithProps(inputDTO);

        await this.measureGateway.save(newMeasure);

        return newMeasure;
    }
}
