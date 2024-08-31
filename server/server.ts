import express from 'express';
import measureRoute from "./routes/measureRoute";
import {CustomerRepository} from "./repository/customerRepository";
import prisma from "./config/prismaConfig";

const app = express();
const customerService = new CustomerRepository(prisma);

app.use(express.json());
app.use('/',  measureRoute);

app.listen(3000, async () => {
    await customerService.createInitial();
    console.log('Server is running on http://localhost:3000');
});
