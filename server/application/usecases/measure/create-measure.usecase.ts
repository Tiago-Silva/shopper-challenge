import {Usecase} from "../usecase";
import {Measure} from "../../../domain/entity/Measure";
import {MeasureGateway} from "../../gateway/MeasureGateway";


export class CreateMeasureUsecase implements Usecase<Measure, Measure> {

    private constructor(private readonly measureGateway: MeasureGateway) {};

    public static create(measureGateway: MeasureGateway) {
        return new CreateMeasureUsecase(measureGateway);
    }

    public async exec(inputDTO: Measure): Promise<Measure> {
        await this.measureGateway.save(inputDTO);
        return inputDTO;
    }
}
