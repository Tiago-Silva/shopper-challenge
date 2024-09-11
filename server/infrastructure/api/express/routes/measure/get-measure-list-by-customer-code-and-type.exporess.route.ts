import { Request, Response } from "express";
import {HttpMethod, Route} from "../route";
import {
    GetMeasureListByCustomerCodeAndTypeUsecase
} from "../../../../../application/usecases/measure/get-measure-list-by-customer-code-and-type.usecase";
import {ErrorResponse} from "../../../../../interface/interface";

const errorResponses: Map<string, ErrorResponse> = new Map([
    ["INVALID_TYPE", { statusCode: 400, error_code: "INVALID_DATA", error_description: "Tipo de medição não permitida" }],
    ["MEASURES_NOT_FOUND", { statusCode: 404, error_code: "MEASURES_NOT_FOUND", error_description: "Nenhuma leitura encontrada" }]
]);

export class GetMeasureListByCustomerCodeAndTypeExporessRoute implements Route {

    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly getMeasureListByCustomerCodeAndTypeService: GetMeasureListByCustomerCodeAndTypeUsecase
    ) {};

    public static create(
        getMeasureListByCustomerCodeAndTypeService: GetMeasureListByCustomerCodeAndTypeUsecase
    ) {
        return new GetMeasureListByCustomerCodeAndTypeExporessRoute(
            '/measure/:customer_code/list',
            HttpMethod.GET,
            getMeasureListByCustomerCodeAndTypeService
        )
    }

    getHandler(): (request: Request, response: Response) => Promise<void> {
        return async (request: Request, response: Response) => {
            try {
                const { customer_code } = request.params;
                const measure_type = request.query.measure_type ? request.query.measure_type.toString() : null;

                const output = await this.getMeasureListByCustomerCodeAndTypeService.exec({
                   customer_code,
                   measure_type
                });

                response.status(200).json(output).send();
            } catch (e) {
                const error = e as Error;
                const errorResponse = errorResponses.get(error.message) || {
                    statusCode: 500,
                    error_code: 'INTERNAL_SERVER_ERROR',
                    error_description: 'Ocorreu um erro interno no servidor'
                };
                response.status(errorResponse.statusCode).json(errorResponse);
            }
        }
    };

    getPath(): string {
        return this.path;
    };

    getMethod(): HttpMethod {
        return this.method;
    };

}
