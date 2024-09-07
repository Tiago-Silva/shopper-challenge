import {Usecase} from "../usecase";
import {MeasureGateway} from "../../gateway/MeasureGateway";

export type UploadInputData = {
    image: string,
    custom_code: string
}

export type UploadOutputData = {
    file_path: string,
    measure_value: number
}

export class UploadImageMeasureUsecase implements Usecase<UploadInputData, UploadOutputData> {

    private constructor(private readonly measureGateway: MeasureGateway) {};

    public static create(measureGateway: MeasureGateway) {
        return new UploadImageMeasureUsecase(measureGateway);
    }

    public async exec(inputDTO: UploadInputData): Promise<UploadOutputData> {

        const base64Data = inputDTO.image.replace(/^data:image\/\w+;base64,/, '');
        return this.measureGateway.upload({
            image: base64Data,
            custom_code: inputDTO.custom_code
        });
    }
}
