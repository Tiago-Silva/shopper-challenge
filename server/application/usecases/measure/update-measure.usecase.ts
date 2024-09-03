import {Usecase} from "../usecase";
import {Measure, MeasureProps} from "../../../domain/entity/Measure";
import {MeasureGateway} from "../../gateway/MeasureGateway";

export class UpdateMeasureUsecase implements Usecase<MeasureProps, MeasureProps> {

    private constructor(private readonly measureGateway: MeasureGateway) {};

    public static create(measureGateway: MeasureGateway) {
        return new UpdateMeasureUsecase(measureGateway);
    }

    public async exec(inputDTO: MeasureProps): Promise<MeasureProps> {
        const newMeasure = Measure.createWithProps(inputDTO);

        await this.measureGateway.update(newMeasure);

        return newMeasure;
    }
}
