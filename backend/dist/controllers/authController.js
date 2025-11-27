"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const data_source_1 = require("../data-source");
const User_1 = require("../models/User");
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, language } = req.body;
        const userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
        const existingUser = yield userRepo.findOneBy({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const user = userRepo.create({ email, password, language }); // In prod, hash password!
        yield userRepo.save(user);
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({ token, user });
    }
    catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
        const user = yield userRepo.findOne({ where: { email }, select: ['id', 'email', 'password', 'role', 'language'] });
        if (!user || user.password !== password) { // In prod, compare hash!
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user });
    }
    catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
});
exports.login = login;
