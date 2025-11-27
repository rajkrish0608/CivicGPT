import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import client from '../api/client';

interface Case {
    id: string;
    scheme: { name: string };
    status: string;
    createdAt: string;
    pdfUrl?: string;
}

const MyCases: React.FC = () => {
    const { t } = useTranslation();
    const [cases, setCases] = useState<Case[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCases = async () => {
            try {
                const res = await client.get('/cases/my-cases');
                setCases(res.data);
            } catch (error) {
                console.error('Error fetching cases:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCases();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div style={{ padding: '2rem' }}>
            <h1>{t('nav.cases')}</h1>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid #444', textAlign: 'left' }}>
                        <th style={{ padding: '0.5rem' }}>{t('cases.id')}</th>
                        <th style={{ padding: '0.5rem' }}>{t('cases.scheme')}</th>
                        <th style={{ padding: '0.5rem' }}>{t('cases.status')}</th>
                        <th style={{ padding: '0.5rem' }}>{t('cases.date')}</th>
                        <th style={{ padding: '0.5rem' }}>{t('cases.action')}</th>
                    </tr>
                </thead>
                <tbody>
                    {cases.map((c) => (
                        <tr key={c.id} style={{ borderBottom: '1px solid #333' }}>
                            <td style={{ padding: '0.5rem' }}>{c.id.slice(0, 8)}...</td>
                            <td style={{ padding: '0.5rem' }}>{c.scheme?.name}</td>
                            <td style={{ padding: '0.5rem' }}>{c.status}</td>
                            <td style={{ padding: '0.5rem' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                            <td style={{ padding: '0.5rem' }}>
                                {c.pdfUrl && (
                                    <a href={`${import.meta.env.VITE_API_URL}${c.pdfUrl}`} target="_blank" rel="noreferrer" style={{ color: '#007bff' }}>
                                        Download PDF
                                    </a>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MyCases;
