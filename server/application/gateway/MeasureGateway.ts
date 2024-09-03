import {Measure} from "../../domain/entity/Measure";

export interface MeasureGateway {
    save(newMeasure: Measure): Promise<Measure>;
    update(measure: Measure): Promise<Measure>;
    getById(id: string): Promise<Measure>;
    getByCustomerId(customerId: string): Promise<Measure[]>;
    getByData(customerId: string, measureDatetime: string): Promise<Measure>;
    getByIdAndType(customerId: string, measureType: string): Promise<Measure[]>;
}
