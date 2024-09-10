import {Usecase} from "../usecase";
import {Measure} from "../../../domain/entity/Measure";
import {MeasureGateway} from "../../gateway/MeasureGateway";

export type InputGetMeasureListDTO = {
    customer_code: string,
    measure_type: string | null;
}

export class GetMeasureListByCustomerCodeAndTypeUsecase implements Usecase<InputGetMeasureListDTO, Measure[]> {

    private constructor(private readonly measureGateway: MeasureGateway) {}

    public static create(measureGateway: MeasureGateway) {
        return new GetMeasureListByCustomerCodeAndTypeUsecase(measureGateway);
    }

    public async exec(input: InputGetMeasureListDTO): Promise<Measure[]> {
        const {customer_code, measure_type} = input;
        let measureList: Measure[];

        if (measure_type) {
            if (this.validateMeasureType(measure_type)) {
                throw new Error('INVALID_TYPE');
            }
            measureList = await this.measureGateway.getByCustomerCodeAndType(customer_code, measure_type);
        } else {
            measureList = await this.measureGateway.getByCustomerCode(customer_code);
        }

        if (measureList.length <= 0) {
            throw new Error('MEASURES_NOT_FOUND');
        }

        return measureList;
    }

    private validateMeasureType (measure_type: string) {
        const validMeasureType = ['WATER', 'GAS'];

        return !validMeasureType.includes(measure_type);
    }

}
