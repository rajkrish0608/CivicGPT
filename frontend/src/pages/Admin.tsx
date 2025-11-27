import React, { useEffect, useState } from 'react';
import client from '../api/client';

interface Case {
    id: string;
    scheme: { name: string };
    user: { email: string };
    status: string;
    createdAt: string;
}

const Admin: React.FC = () => {
    const [cases, setCases] = useState<Case[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCases = async () => {
            try {
                const res = await client.get('/cases/admin/all');
                setCases(res.data);
            } catch (error) {
                console.error('Error fetching cases:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCases();
    }, []);

    const updateStatus = async (id: string, status: string) => {
        try {
            await client.patch(`/cases/${id}/status`, { status });
            setCases(cases.map((c) => (c.id === id ? { ...c, status } : c)));
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Admin Dashboard</h1>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid #444', textAlign: 'left' }}>
                        <th style={{ padding: '0.5rem' }}>ID</th>
                        <th style={{ padding: '0.5rem' }}>User</th>
                        <th style={{ padding: '0.5rem' }}>Scheme</th>
                        <th style={{ padding: '0.5rem' }}>Status</th>
                        <th style={{ padding: '0.5rem' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {cases.map((c) => (
                        <tr key={c.id} style={{ borderBottom: '1px solid #333' }}>
                            <td style={{ padding: '0.5rem' }}>{c.id.slice(0, 8)}...</td>
                            <td style={{ padding: '0.5rem' }}>{c.user?.email}</td>
                            <td style={{ padding: '0.5rem' }}>{c.scheme?.name}</td>
                            <td style={{ padding: '0.5rem' }}>{c.status}</td>
                            <td style={{ padding: '0.5rem' }}>
                                <select
                                    value={c.status}
                                    onChange={(e) => updateStatus(c.id, e.target.value)}
                                    style={{ padding: '0.3rem' }}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Admin;
