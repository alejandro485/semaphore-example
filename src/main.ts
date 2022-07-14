import 'reflect-metadata';
import * as express from 'express';
import { appController } from './app.controller';

const app = express();
app.use(appController);

app.listen(process.env.PORT || 8080,() => {
    console.log('running backend app')
});
