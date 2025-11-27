import 'reflect-metadata';
import dotenv from 'dotenv';
import app from './app';
import { AppDataSource } from './data-source';

dotenv.config();

const PORT = process.env.PORT || 4000;

const startServer = async () => {
    try {
        await AppDataSource.initialize();
        console.log('Data Source has been initialized!');

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Error during Data Source initialization:', err);
        process.exit(1);
    }
};

startServer();
