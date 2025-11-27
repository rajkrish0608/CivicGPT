import 'reflect-metadata';
import { AppDataSource } from './data-source';
import { User, UserRole } from './models/User';
import { Scheme } from './models/Scheme';

const seed = async () => {
    try {
        await AppDataSource.initialize();
        console.log('Data Source initialized for seeding');

        const userRepo = AppDataSource.getRepository(User);
        const schemeRepo = AppDataSource.getRepository(Scheme);

        // Seed Users
        const admin = userRepo.create({
            email: 'admin@civicgpt.in',
            password: 'admin', // In prod, hash this!
            role: UserRole.ADMIN,
            language: 'en',
        });
        await userRepo.save(admin);

        const citizen = userRepo.create({
            email: 'citizen@civicgpt.in',
            password: 'user',
            role: UserRole.CITIZEN,
            language: 'hi',
        });
        await userRepo.save(citizen);

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
        await schemeRepo.save(rationCard);

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
        await schemeRepo.save(pmKisan);

        console.log('Schemes seeded');

        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seed();
