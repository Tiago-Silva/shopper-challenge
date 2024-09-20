import {Measure} from "../../domain/entity/Measure";
import {UploadInputData, UploadOutputData} from "../usecases/measure/upload-image-measure.usecase";
import {Gateway} from "./gateway";

export interface MeasureGateway extends Gateway<Measure> {
    upload(input: UploadInputData): Promise<UploadOutputData>;
    getByMeasureId(id: string): Promise<Measure>;
    getByCustomerCode(customerCode: string): Promise<Measure[]>;
    getByCustomerCodeDateAndType(customerCode: string, measureDatetime: string, measureType: string): Promise<Measure>;
    getByCustomerCodeAndType(customerCode: string, measureType: string): Promise<Measure[]>;
}
