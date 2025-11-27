import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

import authRoutes from './routes/authRoutes';
import qaRoutes from './routes/qaRoutes';
import caseRoutes from './routes/caseRoutes';
import autofillRoutes from './routes/autofillRoutes';
import schemeRoutes from './routes/schemeRoutes';

// Register Routes
app.use('/api/auth', authRoutes);
app.use('/api/qa', qaRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/autofill', autofillRoutes);
app.use('/api/schemes', schemeRoutes);

export default app;
