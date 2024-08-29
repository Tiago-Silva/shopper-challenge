import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import dotenv from "dotenv";
import {GoogleGenerativeAI} from "@google/generative-ai";

dotenv.config();

const router = express.Router();
const configuration = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const modelId = 'gemini-1.5-flash';
const model = configuration.getGenerativeModel({ model: modelId });

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

        const prompt = 'Extract the numerical reading from the following image, which shows a water/gas meter reading. The reading is in the form of a number, such as 12345';
        const image = {
            inlineData: {
                data: base64Data,
                mimeType: "image/png",
            },
        };

        const result = await model.generateContent([prompt,image]);

        res.status(201).json({
           image_url: `/assets/${filename}`,
           measure_value: result.response.text(),
           measure_uuid: '9l2n3ekn3nio'
        });
    } catch (e) {
        next(e);
    }
});

export default router;
