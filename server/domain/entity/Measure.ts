import {MeasureInputDTO, MeasureRequestDTO} from "../../infrastructure/DTO/MeasureRequestDTO";
import { Measure as PrismaMeasure } from '@prisma/client';

export type MeasureProps = {
    measure_uuid?: string;
    customer_code: string;
    measure_datetime: Date;
    measure_type: string;
    measure_value?: number;
    has_confirmed?: Boolean;
    image_url?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Measure {

    private constructor(private props: MeasureProps) {
        this.validate();
    }

    public static createWithProps(props: MeasureProps) {
        return new Measure(props);
    }

    public static createWithRequestDTO(requestDTO: MeasureRequestDTO) {
        return new Measure({
            customer_code: requestDTO.customer_code,
            measure_datetime: requestDTO.measure_datetime,
            measure_type: requestDTO.measure_type,
            measure_value: requestDTO.measure_value,
            image_url: requestDTO.image_url
        });
    }

    public static createWithInputDTO(requestDTO: MeasureInputDTO) {
        return new Measure({
            customer_code: requestDTO.customer_code,
            measure_datetime: requestDTO.measure_datetime,
            measure_type: requestDTO.measure_type,
        });
    }

    public static fromPrismaToMeasure(data: PrismaMeasure): Measure {
        return new Measure({
            measure_uuid: data.measure_uuid,
            customer_code: data.customer_code,
            measure_datetime: data.measure_datetime,
            measure_type: data.measure_type,
            measure_value: data.measure_value,
            has_confirmed: data.has_confirmed,
            image_url: data.image_url,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
        });
    }

    private validate() {
        if (
            !this.props.customer_code
            || !this.props.measure_datetime
            || !this.props.measure_type
        ) {
            throw new Error('Invalid data');
        } else if (this.props.measure_type !== 'WATER') {
            throw new Error('We do not perform this type of reading');
        }
    }

    public get measure_uuid(): string {
        return this.props.measure_uuid || '';
    }

    public get customer_code(): string {
        return this.props.customer_code;
    }

    public get measure_datetime(): Date {
        return this.props.measure_datetime;
    }

    public get measure_type(): string {
        return this.props.measure_type;
    }

    public get measure_value(): number {
        return this.props.measure_value || 0;
    }

    public get has_confirmed(): Boolean {
        return this.props.has_confirmed || false;
    }

    public get image_url(): string {
        return this.props.image_url || '';
    }

    public get createdAt(): Date {
        return this.props.createdAt || new Date();
    }

    public get updatedAt(): Date {
        return this.props.updatedAt || new Date();
    }
}
