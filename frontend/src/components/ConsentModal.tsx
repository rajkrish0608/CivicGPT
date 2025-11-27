import React from 'react';

interface ConsentModalProps {
    isOpen: boolean;
    onAccept: () => void;
    onDecline: () => void;
}

const ConsentModal: React.FC<ConsentModalProps> = ({ isOpen, onAccept, onDecline }) => {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
            <div style={{ backgroundColor: '#222', padding: '2rem', borderRadius: '8px', maxWidth: '500px' }}>
                <h2>Privacy Consent</h2>
                <p>
                    We collect your data solely for the purpose of filling this application form.
                    Your data is processed securely and is not shared with third parties without your consent.
                    This is a demonstration system; no real government submission occurs.
                </p>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'flex-end' }}>
                    <button onClick={onDecline} style={{ backgroundColor: '#555' }}>Cancel</button>
                    <button onClick={onAccept} style={{ backgroundColor: '#007bff' }}>I Agree</button>
                </div>
            </div>
        </div>
    );
};

export default ConsentModal;
