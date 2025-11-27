import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Navbar: React.FC = () => {
    const { t, i18n } = useTranslation();
    const location = useLocation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav style={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            backdropFilter: 'blur(16px)',
            backgroundColor: 'rgba(15, 23, 36, 0.8)',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '1rem 0'
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <Link to="/" style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
                        Civic<span className="text-gradient">GPT</span>
                    </Link>

                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        {['/ask', '/autofill', '/cases'].map((path) => (
                            <Link
                                key={path}
                                to={path}
                                style={{
                                    color: isActive(path) ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                    fontWeight: 500,
                                    fontSize: '0.95rem'
                                }}
                            >
                                {t(`nav.${path.replace('/', '')}`)}
                            </Link>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <select
                        onChange={(e) => changeLanguage(e.target.value)}
                        value={i18n.language}
                        style={{
                            width: 'auto',
                            padding: '0.4rem 0.8rem',
                            fontSize: '0.9rem',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid var(--border-subtle)'
                        }}
                    >
                        <option value="en">🇺🇸 English</option>
                        <option value="hi">🇮🇳 हिंदी</option>
                        <option value="pa">🇮🇳 ਪੰਜਾਬੀ</option>
                    </select>

                    <Link to="/admin" style={{
                        fontSize: '0.9rem',
                        color: 'var(--text-muted)',
                        border: '1px solid var(--border-subtle)',
                        padding: '0.4rem 0.8rem',
                        borderRadius: 'var(--radius-md)'
                    }}>
                        {t('nav.admin')}
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
