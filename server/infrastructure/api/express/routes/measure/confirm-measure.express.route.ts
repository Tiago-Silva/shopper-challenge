import { Request, Response } from "express";
import {HttpMethod, Route} from "../route";
import {UpdateMeasureUsecase} from "../../../../../application/usecases/measure/update-measure.usecase";
import {ConfirmMeasureDTO} from "../../../../DTO/ConfirmMeasureDTO";
import {ErrorResponse} from "../../../../../interface/interface";

const errorResponses: Map<string, ErrorResponse> = new Map([
    ["INVALID_DATA", { statusCode: 400, error_code: "INVALID_DATA", error_description: "Invalid data" }],
    ["MEASURE_NOT_FOUND", { statusCode: 409, error_code: "MEASURE_NOT_FOUND", error_description: "Leitura não encontrada" }],
    ["CONFIRMATION_DUPLICATE", { statusCode: 409, error_code: "CONFIRMATION_DUPLICATE", error_description: "Leitura do mês já realizada" }]
]);

export class ConfirmMeasureExpressRoute implements Route {

    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly  updateMeasureService: UpdateMeasureUsecase
    ) {};

    public static create(updateMeasureService: UpdateMeasureUsecase) {
        return new ConfirmMeasureExpressRoute(
            '/measure/confirm',
            HttpMethod.PATCH,
            updateMeasureService
        )
    };

    getHandler(): (request: Request, response: Response) => Promise<void> {
        return async (request: Request, response: Response) => {
            try {
                const requestDTO: ConfirmMeasureDTO = request.body;
                const output = await this.updateMeasureService.exec(requestDTO);

                response.status(200).json({success: output.has_confirmed});
            } catch (e) {
                const error = e as Error;
                const errorResponse = errorResponses.get(error.message) || {
                    statusCode: 500,
                    error_code: 'INTERNAL_SERVER_ERROR',
                    error_description: 'Ocorreu um erro interno no servidor'
                }
                response.status(errorResponse.statusCode).json(errorResponse);
            }
        }
    }

    getPath(): string {
        return this.path;
    }

    getMethod(): HttpMethod {
        return this.method;
    }

}
