import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import client from '../api/client';
import FormPreview from '../components/FormPreview';
import ConsentModal from '../components/ConsentModal';

const FormAutofill: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [schemeId, setSchemeId] = useState('');
    const [userData, setUserData] = useState('');
    const [filledData, setFilledData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [showConsent, setShowConsent] = useState(false);
    const [schemes, setSchemes] = useState<{ id: string; name: string }[]>([]);

    useEffect(() => {
        const fetchSchemes = async () => {
            try {
                const res = await client.get('/schemes');
                setSchemes(res.data);
            } catch (error) {
                console.error('Error fetching schemes:', error);
            }
        };
        fetchSchemes();
    }, []);

    const handleAutofill = async () => {
        if (!schemeId || !userData) return;
        setLoading(true);
        try {
            const res = await client.post('/autofill', {
                schemeId,
                userData,
                language: i18n.language,
            });
            setFilledData(res.data);
        } catch (error) {
            console.error('Autofill Error:', error);
            alert('Failed to autofill. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = () => {
        setShowConsent(true);
    };

    const confirmSubmit = async () => {
        setShowConsent(false);
        try {
            const selectedScheme = schemes.find(s => s.id === schemeId);
            await client.post('/cases', {
                schemeId,
                formData: filledData,
                schemeName: selectedScheme?.name || 'Unknown Scheme',
            });
            alert('Application Submitted! Check "My Cases".');
            setFilledData(null);
            setUserData('');
        } catch (error) {
            console.error('Submit Error:', error);
            alert('Failed to submit application.');
        }
    };

    return (
        <div className="container" style={{ padding: '4rem 1rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1>{t('autofill.generate')}</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Instantly draft applications using AI.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {/* Left Column: Input */}
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>1. Enter Details</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Select Scheme</label>
                            <select
                                value={schemeId}
                                onChange={(e) => setSchemeId(e.target.value)}
                            >
                                <option value="">{t('autofill.select_scheme')}</option>
                                {schemes.map((scheme) => (
                                    <option key={scheme.id} value={scheme.id}>
                                        {scheme.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Your Information</label>
                            <textarea
                                value={userData}
                                onChange={(e) => setUserData(e.target.value)}
                                placeholder="E.g., My name is Rahul, I live in Delhi, looking for ration card..."
                                rows={8}
                                style={{ resize: 'vertical' }}
                            />
                        </div>

                        <button
                            className="btn-primary"
                            onClick={handleAutofill}
                            disabled={loading || !schemeId}
                            style={{ width: '100%' }}
                        >
                            {loading ? 'Processing...' : 'Generate Draft'}
                        </button>
                    </div>
                </div>

                {/* Right Column: Preview */}
                <div className="glass-panel" style={{ padding: '2rem', opacity: filledData ? 1 : 0.5 }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>2. Review & Submit</h3>
                    {filledData ? (
                        <FormPreview
                            data={filledData}
                            onChange={(key, val) => setFilledData({ ...filledData, [key]: val })}
                            onSubmit={handleSubmit}
                        />
                    ) : (
                        <div style={{
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--text-muted)',
                            border: '2px dashed var(--border-subtle)',
                            borderRadius: 'var(--radius-md)'
                        }}>
                            Form preview will appear here
                        </div>
                    )}
                </div>
            </div>

            <ConsentModal
                isOpen={showConsent}
                onAccept={confirmSubmit}
                onDecline={() => setShowConsent(false)}
            />
        </div>
    );
};

export default FormAutofill;
