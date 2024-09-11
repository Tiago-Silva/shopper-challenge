import prisma from "./config/prismaConfig";
import {MeasureRepositoryPrisma} from "./infrastructure/repository/measure.repository.prisma";
import {CreateMeasureUsecase} from "./application/usecases/measure/create-measure.usecase";
import {CreateMeasureExpressRoute} from "./infrastructure/api/express/routes/measure/create-measure.express.route";
import {ApiExpress} from "./infrastructure/api/express/api.express";
import {UploadImageMeasureUsecase} from "./application/usecases/measure/upload-image-measure.usecase";
import {GetMeasureByCustomerCodeDateAndTypeUsecase} from "./application/usecases/measure/get-measure-by-customer-code-date-and-type.usecase";
import {
    GetMeasureListByCustomerCodeAndTypeUsecase
} from "./application/usecases/measure/get-measure-list-by-customer-code-and-type.usecase";
import {
    GetMeasureListByCustomerCodeAndTypeExporessRoute
} from "./infrastructure/api/express/routes/measure/get-measure-list-by-customer-code-and-type.exporess.route";
import {UpdateMeasureUsecase} from "./application/usecases/measure/update-measure.usecase";
import {ConfirmMeasureExpressRoute} from "./infrastructure/api/express/routes/measure/confirm-measure.express.route";

const Server = () => {

    const aRepository = MeasureRepositoryPrisma.create(prisma);

    const createMeasureUserCase = CreateMeasureUsecase.create(aRepository);
    const uploadMeasureUserCase = UploadImageMeasureUsecase.create(aRepository);
    const getMeasureByDateAndType = GetMeasureByCustomerCodeDateAndTypeUsecase.create(aRepository);
    const getMeasureListByCustomerCodeAntType = GetMeasureListByCustomerCodeAndTypeUsecase.create(aRepository);
    const updateMeasureUserCase = UpdateMeasureUsecase.create(aRepository);

    const createRoute = CreateMeasureExpressRoute.create(createMeasureUserCase,uploadMeasureUserCase,getMeasureByDateAndType);
    const getMeasureListByCustomerCodeAndTypeRoute = GetMeasureListByCustomerCodeAndTypeExporessRoute.create(getMeasureListByCustomerCodeAntType);
    const confirmMeasureRoute = ConfirmMeasureExpressRoute.create(updateMeasureUserCase);

    const api = ApiExpress.create([createRoute,getMeasureListByCustomerCodeAndTypeRoute,confirmMeasureRoute]);
    const port = 3000;
    api.start(port);
}

Server();
