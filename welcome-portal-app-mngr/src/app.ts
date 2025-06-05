import express, { Router } from 'express';
import cors from 'cors';
import path from 'path';
import config from './config';
import TransformErrors from './middlewares/TransformErrors';
import { UserRequestsController } from './modules/users/controllers/UserRequestsController';
import { UserController } from './modules/users/controllers/UserController';
import { AccessRequestController } from './modules/access-requests/controllers/AccessRequestController';
import { ComputerController } from './modules/computers/controllers/ComputerController';
import { ComputerRequestsController } from './modules/computers/controllers/ComputerRequestsController';
import { HistoryController } from './modules/history/controllers/HistoryController';
import OpenApiValidatorProvider from './utils/OpenApiValidatorProvider';
import { UserService } from './modules/users/services/UserService';
import { PrismaClient } from '@prisma/client';
import { UserRequestsService } from './modules/users/services/UserRequestsService';
import { HistoryService } from './modules/history/services/HistoryService';
import { ComputerService } from './modules/computers/services/ComputerService';
import { ComputerRequestsService } from './modules/computers/services/ComputerRequestsService';
import { AccessRequestsService } from './modules/access-requests/services/AccessRequestsService';

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

const validator = OpenApiValidatorProvider.getValidator();
const prisma = new PrismaClient();

const UserRouter = Router();
const userService = new UserService(prisma);
const userController = new UserController(userService);
UserRouter.get(
    '/users',
    validator.validate('get', '/v1/users'),
    userController.GetAllUsers.bind(userController)
);
app.use(fullApiPath, UserRouter);

const UserRequestRouter = Router();
const userRequestService = new UserRequestsService(prisma);
const userRequestsController = new UserRequestsController(userRequestService);
UserRequestRouter.post(
  '/user-requests',
  validator.validate('post', '/v1/user-requests'),
  userRequestsController.CreateUserRequest.bind(userRequestsController)
);
UserRequestRouter.patch(
  '/user-requests/:id',
  validator.validate('patch', '/v1/user-requests/{id}'),
  userRequestsController.UpdateUserRequestStatus.bind(userRequestsController)
);
app.use(fullApiPath, UserRequestRouter);

const ComputertRouter = Router();
const computerService = new ComputerService(prisma, userService);
const computerController = new ComputerController(computerService);
ComputertRouter.get(
  '/computers',
  computerController.GetAllComputers.bind(computerController)
);
ComputertRouter.get(
  '/computers/team',
  validator.validate('get', '/v1/computers/team'),
  computerController.GetAllComputersForTeam.bind(computerController)
);
app.use(fullApiPath, ComputertRouter);


const ComputerRequestsRouter = Router();
const computerRequestsService = new ComputerRequestsService(prisma,userService);
const computerRequestsController = new ComputerRequestsController(computerRequestsService);
ComputerRequestsRouter.post(
  '/computer-requests',
  validator.validate('post', '/v1/computer-requests'),
  computerRequestsController.CreateComputerRequest.bind(computerRequestsController)
);
ComputerRequestsRouter.patch(
  '/computer-requests/:id',
  validator.validate('patch', '/v1/computer-requests/{id}'),
    computerRequestsController.UpdateComputerRequestStatus.bind(computerRequestsController)
);
app.use(fullApiPath, ComputerRequestsRouter);

const AccessRequestsRouter = Router();
const accessRequestsService = new AccessRequestsService(prisma,userService);
const accessRequestsController = new AccessRequestController(accessRequestsService)
AccessRequestsRouter.post(
  '/access-requests',
  validator.validate('post', '/v1/access-requests'),
  accessRequestsController.CreateAccessRequest.bind(accessRequestsController)
);
AccessRequestsRouter.patch(
  '/access-requests/:id',
  validator.validate('patch', '/v1/access-requests/{id}'),
  accessRequestsController.UpdateAccessRequestStatus.bind(accessRequestsController)
);
app.use(fullApiPath, AccessRequestsRouter);

const HistoryRouter = Router();
const historyService = new HistoryService(accessRequestsService,computerRequestsService,userRequestService);
const historyController = new HistoryController(historyService);
HistoryRouter.get(
  '/history/requests',
  validator.validate('get', '/v1/history/requests'),
   historyController.GetAllRequests.bind(historyController)
);
app.use(fullApiPath, HistoryRouter);
app.use(TransformErrors.parseErrors);
export default app;
