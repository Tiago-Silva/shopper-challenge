import express, { Request, Response, NextFunction } from 'express';
import {MeasureService} from "../service/measureService";
import {IPathRequestDTO, IRequestDTO} from "../interface/interface";

const router = express.Router();
const measureService = new MeasureService();

router.post('/upload', async (req: Request, res: Response, next: NextFunction) => {
    const data: IRequestDTO = req.body;
    try {
        const result = await measureService.upload(data);
        if ('error_code' in result) {
            if (result.error_code === "INVALID_DATA") {
                res.status(400).json(result);
            } else if (result.error_code === "DOUBLE_REPORT") {
                res.status(409).json(result);
            }
        } else {
            res.status(201).json(result);
        }
    } catch (e) {
        next(e);
    }
});

router.patch('/confirm', async (req: Request, res: Response, next: NextFunction) => {
    const data: IPathRequestDTO = req.body;
    try {
        const result = await measureService.confirm(data);
        if ('error_code' in result) {
            if (result.error_code === "INVALID_DATA") {
                res.status(400).json(result);
            } else if (result.error_code === "MEASURE_NOT_FOUND") {
                res.status(404).json(result);
            } else if (result.error_code === "CONFIRMATION_DUPLICATE") {
                res.status(409).json(result);
            }
        } else {
            res.status(200).json(result);
        }
    } catch (e) {
        next(e);
    }
});

router.get('/:customerCode/list', async (req: Request, res: Response, next: NextFunction) => {
    const { customerCode } = req.params;
    const { measure_type } = req.query;

    try {
        const result = await measureService.getMeasureList(customerCode, measure_type ? measure_type.toString() : null);
        if ('error_code' in result) {
            if (result.error_code === "INVALID_TYPE") {
                res.status(400).json(result);
            } else if (result.error_code === "MEASURES_NOT_FOUND") {
                res.status(404).json(result);
            }
        } else {
            res.status(200).json(result);
        }
    } catch (e) {
        next(e);
    }
});

export default router;
