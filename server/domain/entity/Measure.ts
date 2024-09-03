export type MeasureProps = {
    measure_uuid?: string;
    customer_code: string;
    measure_datetime: Date;
    measure_type: string;
    measure_value: number;
    has_confirmed: Boolean;
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

    private validate() {
        if (
            !this.props.customer_code
            || !this.props.measure_datetime
            || !this.props.measure_type
            || !this.props.measure_value
        ) {
            throw new Error('Invalid data');
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
        return this.props.measure_value;
    }

    public get has_confirmed(): Boolean {
        return this.props.has_confirmed;
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
