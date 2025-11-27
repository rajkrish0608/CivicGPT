import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="container" style={{ padding: '6rem 1rem', textAlign: 'center' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{
                    display: 'inline-block',
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(14, 165, 164, 0.1)',
                    color: 'var(--accent-primary)',
                    marginBottom: '2rem',
                    fontSize: '0.9rem',
                    fontWeight: 600
                }}>
                    New: Multilingual Support for 10+ Schemes
                </div>

                <h1 style={{ marginBottom: '1.5rem', fontSize: '4rem' }}>
                    Government Services, <br />
                    <span className="text-gradient">Simplified for Everyone.</span>
                </h1>

                <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '3rem', lineHeight: '1.8' }}>
                    CivicGPT helps you find schemes, autofill applications, and track status—all in your local language.
                    Powered by advanced AI for instant assistance.
                </p>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <Link to="/ask">
                        <button className="btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
                            {t('home.start')}
                        </button>
                    </Link>
                    <Link to="/cases">
                        <button className="btn-secondary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
                            Track Application
                        </button>
                    </Link>
                </div>

                {/* Abstract Visual / Screenshot Placeholder */}
                <div style={{
                    marginTop: '5rem',
                    height: '400px',
                    background: 'linear-gradient(180deg, rgba(26,35,50,0.5) 0%, rgba(15,23,36,0) 100%)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-lg)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: 'var(--text-muted)'
                    }}>
                        [Interactive Demo Preview]
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
