import * as express from 'express';
import { appController } from './app.controller';

export const app = express();
app.use(appController);
