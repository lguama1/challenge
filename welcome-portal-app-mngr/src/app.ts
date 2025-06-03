import express from 'express';
import cors from 'cors';
import path from 'path';
import config from './config';
import TransformErrors from './middlewares/TransformErrors';
import { UserRequestsController } from './modules/users/controllers/UserRequestsController';
import { UserController } from './modules/users/controllers/UserController';
import { AccessRequestsController } from './modules/access-requests/controllers/AccessRequestController';
import { ComputerController } from './modules/computers/controllers/ComputerController';
import { ComputerRequestsController } from './modules/computers/controllers/ComputerRequestsController';
import { HistoryController } from './modules/history/controllers/HistoryController';

const app = express();

const { API_PATH } = config;
const fullApiPath = `${API_PATH}v1`;

const corsOptions = {
    origin: '*', // NOSONAR
    credentials: true,
    optionSuccessStatus: 200,
    methods: '*',
    allowedHeaders: 'Content-Type,X-Amz-Date,Authorization,x-api-key,X-Amz-Security-Token,X-Name,X-RqUID,X-Channel,X-IPAddr'
};

app.disable('x-powered-by');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions)); // NOSONAR
app.use(express.static(path.join(__dirname, '../static')));

app.use(fullApiPath, UserRequestsController);
app.use(fullApiPath, UserController);
app.use(fullApiPath, HistoryController);
app.use(fullApiPath, AccessRequestsController);
app.use(fullApiPath, ComputerController);
app.use(fullApiPath, ComputerRequestsController);

app.use(TransformErrors.parseErrors);

export default app;
