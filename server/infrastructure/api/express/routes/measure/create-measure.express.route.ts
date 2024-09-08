import {Request, Response} from "express";
import {HttpMethod, Route} from "../route";
import {
    CreateMeasureUsecase
} from "../../../../../application/usecases/measure/create-measure.usecase";
import {Measure} from "../../../../../domain/entity/Measure";
import {UploadMeasureDTO} from "../../../../DTO/UploadMeasureDTO";
import {
    UploadImageMeasureUsecase,
    UploadOutputData
} from "../../../../../application/usecases/measure/upload-image-measure.usecase";
import {MeasureRequestDTO} from "../../../../DTO/MeasureRequestDTO";
import {
    GetMeasureBydateandtypeUsecase
} from "../../../../../application/usecases/measure/get-measure-bydateandtype.usecase";

export class CreateMeasureExpressRoute implements Route {

    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly createMeasureService: CreateMeasureUsecase,
        private readonly uploadMeasureService: UploadImageMeasureUsecase,
        private readonly getMeasureByDateAndTypeService: GetMeasureBydateandtypeUsecase
    ) {};

    getHandler(): (request: Request, response: Response) => Promise<void> {
        return async (request: Request, response: Response) => {
            try {
                const requestDTO: UploadMeasureDTO = request.body;

                await this.getMeasureByDateAndTypeService.exec(Measure.createWithInputDTO({
                    customer_code: requestDTO.customer_code,
                    measure_datetime: requestDTO.measure_datetime,
                    measure_type: requestDTO.measure_type
                }));

                const upload: UploadOutputData = await this.uploadMeasureService.exec({image: requestDTO.image, custom_code: requestDTO.customer_code});

                const input: Measure = Measure.createWithRequestDTO(this.createMeasureRequestDTO(requestDTO,upload));

                const output: Measure = await this.createMeasureService.exec(input);

                response.status(201).json(output).send();
            } catch (e) {
                const error = e as Error;
                if (error.message === "Invalid data") {
                    response.status(400).json({
                        error_code: "INVALID_DATA",
                        error_description: "Invalid data"
                    });
                } else if (error.message === "DOUBLE_REPORT") {
                    response.status(409).json({
                        error_code: "DOUBLE_REPORT",
                        error_description: "Leitura do mês já realizada"
                    });
                }
            }
        }
    };

    getPath(): string {
        return this.path;
    };

    getMethod(): HttpMethod {
        return this.method;
    };

    public static create(
        createMeasureService: CreateMeasureUsecase,
        uploadMeasureService: UploadImageMeasureUsecase,
        getMeasureByDateAndTypeService: GetMeasureBydateandtypeUsecase
    ) {
        return new CreateMeasureExpressRoute(
            '/measure',
            HttpMethod.POST,
            createMeasureService,
            uploadMeasureService,
            getMeasureByDateAndTypeService
        )
    };

    private createMeasureRequestDTO(requestDTO: UploadMeasureDTO, upload: UploadOutputData): MeasureRequestDTO {
        return {
            customer_code: requestDTO.customer_code,
            measure_datetime: requestDTO.measure_datetime,
            measure_type: requestDTO.measure_type,
            measure_value: upload.measure_value,
            image_url: upload.file_path
        }
    }
}
