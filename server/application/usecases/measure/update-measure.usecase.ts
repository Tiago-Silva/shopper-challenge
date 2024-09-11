import {Usecase} from "../usecase";
import {Measure} from "../../../domain/entity/Measure";
import {MeasureGateway} from "../../gateway/MeasureGateway";
import {ConfirmMeasureDTO} from "../../../infrastructure/DTO/ConfirmMeasureDTO";


export class UpdateMeasureUsecase implements Usecase<ConfirmMeasureDTO, Measure> {

    private constructor(private readonly measureGateway: MeasureGateway) {};

    public static create(measureGateway: MeasureGateway) {
        return new UpdateMeasureUsecase(measureGateway);
    }

    public async exec(inputDTO: ConfirmMeasureDTO): Promise<Measure> {

        if (!inputDTO.measure_uuid || inputDTO.confirmed_value <= 0) {
            throw new Error('INVALID_DATA');
        }

        const existingMeasure = await this.measureGateway.getByMeasureId(inputDTO.measure_uuid);
        if (!existingMeasure) {
            throw new Error('MEASURE_NOT_FOUND');
        }

        if (this.checkDuplication(existingMeasure.measure_datetime) && existingMeasure.has_confirmed) {
            throw new Error('CONFIRMATION_DUPLICATE');
        }

        const update = Measure.createWithProps({
            measure_uuid: existingMeasure.measure_uuid,
            customer_code: existingMeasure.customer_code,
            measure_datetime: existingMeasure.measure_datetime,
            measure_type: existingMeasure.measure_type,
            measure_value: existingMeasure.measure_value,
            has_confirmed: true,
            image_url: existingMeasure.image_url,
            createdAt: existingMeasure.createdAt,
            updatedAt: new Date()
        });

        return await this.measureGateway.update(update);
    }

    private checkDuplication(measureDateTime: Date): boolean {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        const measureDate = new Date(measureDateTime);
        const measureMonth = measureDate.getMonth();
        const measureYear = measureDate.getFullYear();

        return measureMonth === currentMonth && measureYear === currentYear;
    }
}
