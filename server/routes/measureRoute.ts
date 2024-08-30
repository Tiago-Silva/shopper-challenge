import express, { Request, Response, NextFunction } from 'express';
import {MeasureService} from "../service/measureService";
import {IRequestDTO} from "../interface/interface";

const router = express.Router();
const measureService = new MeasureService();

router.post('/upload', async (req: Request, res: Response, next: NextFunction) => {
    const data: IRequestDTO = req.body;
    try {
        const result = await measureService.uploadImage(data);
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

export default router;
