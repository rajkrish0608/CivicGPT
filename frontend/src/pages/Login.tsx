import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await client.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            if (res.data.user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/cases');
            }
        } catch (error) {
            console.error('Login Error:', error);
            alert('Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ padding: '4rem 1rem', display: 'flex', justifyContent: 'center' }}>
            <div className="glass-panel" style={{ padding: '3rem', width: '100%', maxWidth: '400px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Login</h2>
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="admin@civicgpt.in"
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••"
                        />
                    </div>
                    <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%' }}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    <p>Demo Credentials:</p>
                    <p>Admin: admin@civicgpt.in / admin</p>
                    <p>User: citizen@civicgpt.in / user</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
