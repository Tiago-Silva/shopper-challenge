import { Request, Response } from "express";
import {HttpMethod, Route} from "../route";
import {
    GetMeasureListByCustomerCodeAndTypeUsecase
} from "../../../../../application/usecases/measure/get-measure-list-by-customer-code-and-type.usecase";


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
                if (error.message === "INVALID_TYPE") {
                    response.status(400).json({
                        error_code: "INVALID_DATA",
                        error_description: "Tipo de medição não permitida"
                    });
                } else if (error.message === "MEASURES_NOT_FOUND") {
                    response.status(404).json({
                        error_code: "MEASURES_NOT_FOUND",
                        error_description: "Nenhuma leitura encontrada"
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

}
