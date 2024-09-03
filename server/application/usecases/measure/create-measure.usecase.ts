import {Usecase} from "../usecase";
import {Measure, MeasureProps} from "../../../domain/entity/Measure";
import {MeasureGateway} from "../../gateway/MeasureGateway";


export type CreateMeasureInputDTO = MeasureProps;

export type CreateMeasureOutputDTO = MeasureProps;

export class CreateMeasureUsecase implements Usecase<CreateMeasureInputDTO, CreateMeasureOutputDTO> {

    private constructor(private readonly measureGateway: MeasureGateway) {};

    public static create(measureGateway: MeasureGateway) {
        return new CreateMeasureUsecase(measureGateway);
    }

    public async exec(inputDTO: CreateMeasureInputDTO): Promise<CreateMeasureOutputDTO> {
        const newMeasure = Measure.createWithProps(inputDTO);

        await this.measureGateway.save(newMeasure);

        return newMeasure;
    }
}
