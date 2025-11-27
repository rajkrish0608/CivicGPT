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
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const data_source_1 = require("./data-source");
const User_1 = require("./models/User");
const Scheme_1 = require("./models/Scheme");
const seed = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield data_source_1.AppDataSource.initialize();
        console.log('Data Source initialized for seeding');
        const userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
        const schemeRepo = data_source_1.AppDataSource.getRepository(Scheme_1.Scheme);
        // Seed Users
        const admin = userRepo.create({
            email: 'admin@civicgpt.in',
            password: 'admin', // In prod, hash this!
            role: User_1.UserRole.ADMIN,
            language: 'en',
        });
        yield userRepo.save(admin);
        const citizen = userRepo.create({
            email: 'citizen@civicgpt.in',
            password: 'user',
            role: User_1.UserRole.CITIZEN,
            language: 'hi',
        });
        yield userRepo.save(citizen);
        console.log('Users seeded');
        // Seed Schemes
        const rationCard = schemeRepo.create({
            name: 'Ration Card Application',
            description: 'Apply for a new ration card for subsidized food grains.',
            template: {
                fullName: 'string',
                age: 'number',
                address: 'string',
                income: 'number',
                familyMembers: 'number',
            },
            htmlTemplate: '<h1>Ration Card Application</h1><p>Name: {{fullName}}</p><p>Address: {{address}}</p>',
        });
        yield schemeRepo.save(rationCard);
        const pmKisan = schemeRepo.create({
            name: 'PM Kisan Samman Nidhi',
            description: 'Financial support for farmers.',
            template: {
                farmerName: 'string',
                landSize: 'number',
                aadhaar: 'string',
                bankAccount: 'string',
            },
            htmlTemplate: '<h1>PM Kisan Application</h1><p>Farmer: {{farmerName}}</p><p>Aadhaar: {{aadhaar}}</p>',
        });
        yield schemeRepo.save(pmKisan);
        console.log('Schemes seeded');
        process.exit(0);
    }
    catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
});
seed();
