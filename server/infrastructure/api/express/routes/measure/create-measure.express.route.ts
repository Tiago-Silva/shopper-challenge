import {Request, Response} from "express";
import {HttpMethod, Route} from "../route";
import {
    CreateMeasureUsecase
} from "../../../../../application/usecases/measure/create-measure.usecase";
import {Measure} from "../../../../../domain/entity/Measure";
import {MeasureRequestDTO} from "../../../../DTO/MeasureRequestDTO";

export class CreateMeasureExpressRoute implements Route {

    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly createMeasureService: CreateMeasureUsecase
    ) {};

    getHandler(): (request: Request, response: Response) => Promise<void> {
        return async (request: Request, response: Response) => {
            try {
                const requestDTO: MeasureRequestDTO = request.body;

                const input: Measure = Measure.createWithRequestDTO(requestDTO);

                const output: Measure = await this.createMeasureService.exec(input);

                response.status(201).json(output).send();
            } catch (e) {
                const error = e as Error;
                if (error.message === "INVALID_DATA") {
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

    public static create(createMeasureService: CreateMeasureUsecase) {
        return new CreateMeasureExpressRoute(
            '/measure',
            HttpMethod.POST,
            createMeasureService
        )
    };
}
