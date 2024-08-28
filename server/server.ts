import express from 'express';
import measureRoute from "./routes/measureRoute";

const app = express();

app.use(express.json());
app.use('/',  measureRoute);

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
