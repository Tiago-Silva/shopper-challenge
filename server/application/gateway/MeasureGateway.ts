import {Measure} from "../../domain/entity/Measure";
import {UploadInputData, UploadOutputData} from "../usecases/measure/upload-image-measure.usecase";

export interface MeasureGateway {
    save(newMeasure: Measure): Promise<Measure>;
    update(measure: Measure): Promise<Measure>;
    upload(input: UploadInputData): Promise<UploadOutputData>;
    getById(id: string): Promise<Measure>;
    getByCustomerId(customerId: string): Promise<Measure[]>;
    getByData(customerId: string, measureDatetime: string): Promise<Measure>;
    getByIdAndType(customerId: string, measureType: string): Promise<Measure[]>;
}
