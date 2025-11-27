"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = require("./models/User");
const Scheme_1 = require("./models/Scheme");
const Case_1 = require("./models/Case");
const Feedback_1 = require("./models/Feedback");
dotenv_1.default.config();
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'civicgpt',
    synchronize: true, // Set to false in production
    logging: false,
    entities: [User_1.User, Scheme_1.Scheme, Case_1.Case, Feedback_1.Feedback],
    migrations: [],
    subscribers: [],
});
