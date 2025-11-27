import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import client from '../api/client';

interface Message {
    role: 'user' | 'bot';
    content: string;
    intent?: string;
    slots?: any;
}

const ChatBox: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [query, setQuery] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        const userMsg: Message = { role: 'user', content: query };
        setMessages((prev) => [...prev, userMsg]);
        setLoading(true);
        setQuery('');

        try {
            const res = await client.post('/qa/ask', {
                query: userMsg.content,
                language: i18n.language,
            });

            const botMsg: Message = {
                role: 'bot',
                content: res.data.answer,
                intent: res.data.intent,
                slots: res.data.slots,
            };
            setMessages((prev) => [...prev, botMsg]);
        } catch (error) {
            console.error('QA Error:', error);
            setMessages((prev) => [...prev, { role: 'bot', content: 'Error processing request.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-panel" style={{
            maxWidth: '800px',
            margin: '0 auto',
            height: '600px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        }}>
            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem'
            }}>
                {messages.length === 0 && (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem' }}>
                        <h3>{t('ask.placeholder')}</h3>
                        <p>Try asking about "Ration Card" or "PM Kisan"</p>
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <div key={idx} style={{
                        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '80%',
                        animation: 'fadeIn 0.3s ease-out'
                    }}>
                        <div style={{
                            padding: '1rem 1.5rem',
                            borderRadius: msg.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                            backgroundColor: msg.role === 'user' ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                            color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                            boxShadow: 'var(--shadow-sm)',
                            lineHeight: '1.6'
                        }}>
                            {msg.content}
                        </div>
                        {msg.intent && (
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', marginLeft: '0.5rem' }}>
                                Detected Intent: {msg.intent}
                            </div>
                        )}
                    </div>
                ))}
                {loading && (
                    <div style={{ alignSelf: 'flex-start', color: 'var(--text-muted)', paddingLeft: '1rem' }}>
                        Typing...
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} style={{
                padding: '1.5rem',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                gap: '1rem',
                background: 'rgba(0,0,0,0.2)'
            }}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t('ask.placeholder')}
                    style={{
                        flex: 1,
                        padding: '1rem',
                        borderRadius: 'var(--radius-full)',
                        border: '1px solid var(--border-subtle)',
                        background: 'var(--bg-primary)'
                    }}
                />
                <button type="submit" disabled={loading} className="btn-primary" style={{ borderRadius: 'var(--radius-full)', padding: '0 2rem' }}>
                    {t('ask.submit')}
                </button>
            </form>
        </div>
    );
};

export default ChatBox;
