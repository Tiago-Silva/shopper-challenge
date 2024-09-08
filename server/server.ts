import prisma from "./config/prismaConfig";
import {MeasureRepositoryPrisma} from "./infrastructure/repository/measure.repository.prisma";
import {CreateMeasureUsecase} from "./application/usecases/measure/create-measure.usecase";
import {CreateMeasureExpressRoute} from "./infrastructure/api/express/routes/measure/create-measure.express.route";
import {ApiExpress} from "./infrastructure/api/express/api.express";
import {UploadImageMeasureUsecase} from "./application/usecases/measure/upload-image-measure.usecase";
import {GetMeasureBydateandtypeUsecase} from "./application/usecases/measure/get-measure-bydateandtype.usecase";

const Server = () => {

    const aRepository = MeasureRepositoryPrisma.create(prisma);

    const createMeasureUserCase = CreateMeasureUsecase.create(aRepository);
    const uploadMeasureUserCase = UploadImageMeasureUsecase.create(aRepository);
    const getMeasureByDateAndType = GetMeasureBydateandtypeUsecase.create(aRepository);

    const createRoute = CreateMeasureExpressRoute.create(createMeasureUserCase,uploadMeasureUserCase,getMeasureByDateAndType);

    const api = ApiExpress.create([createRoute]);
    const port = 3000;
    api.start(port);
}

Server();
