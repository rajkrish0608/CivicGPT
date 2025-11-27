import React from 'react';

interface FormPreviewProps {
    data: any;
    onChange: (key: string, value: any) => void;
    onSubmit: () => void;
}

const FormPreview: React.FC<FormPreviewProps> = ({ data, onChange, onSubmit }) => {
    return (
        <div style={{ marginTop: '2rem', textAlign: 'left', border: '1px solid #444', padding: '1rem', borderRadius: '8px' }}>
            <h3>Form Preview</h3>
            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
                {Object.entries(data).map(([key, value]) => (
                    <div key={key} style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={{ marginBottom: '0.5rem', textTransform: 'capitalize' }}>{key}</label>
                        <input
                            type="text"
                            value={value as string}
                            onChange={(e) => onChange(key, e.target.value)}
                            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #555' }}
                        />
                    </div>
                ))}
            </div>
            <div style={{ marginTop: '2rem', textAlign: 'right' }}>
                <button onClick={onSubmit} style={{ backgroundColor: '#28a745' }}>Submit Application</button>
            </div>
        </div>
    );
};

export default FormPreview;
