import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

router.post('/upload', async (req: Request, res: Response, next: NextFunction) => {
    const  { imageBase64, filename } = req.body;

    if (!imageBase64 || !filename) {
        return res.status(400).send('Invalid data or filename');
    }

    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    const filePath = path.join(__dirname, '../../assets', filename);

    try {
        fs.writeFileSync(filePath, buffer);

        res.status(201).json({
           image_url: `/assets/${filename}`,
           measure_value: '65',
           measure_uuid: '9l2n3ekn3nio'
        });
    } catch (e) {
        next(e);
    }
});

export default router;
