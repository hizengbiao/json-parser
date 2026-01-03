import { useState, useEffect } from 'react';

interface TimeInputHHMMSSProps {
    initialMs: number;
    onChange: (ms: number) => void;
}

export const TimeInputHHMMSS: React.FC<TimeInputHHMMSSProps> = ({ initialMs, onChange }) => {
    // Parse initialMs to H, M, S
    const parse = (ms: number) => {
        const totalSec = Math.ceil(ms / 1000);
        const h = Math.floor(totalSec / 3600);
        const m = Math.floor((totalSec % 3600) / 60);
        const s = totalSec % 60;
        return { h, m, s };
    };

    const [values, setValues] = useState(parse(initialMs));

    useEffect(() => {
        // Determine new ms
        const totalSec = (values.h * 3600) + (values.m * 60) + values.s;
        onChange(totalSec * 1000);
    }, [values, onChange]);

    const handleChange = (field: 'h' | 'm' | 's', valStr: string) => {
        let val = parseInt(valStr, 10);
        if (isNaN(val)) val = 0;

        if (field === 's' || field === 'm') {
            if (val > 59) val = 59; // Cap at 59 for typing simple logic
        }
        if (field === 'h') {
            if (val > 99) val = 99; // Cap hours
        }

        setValues(prev => ({ ...prev, [field]: val }));
    };

    // Helper for input styling
    const inputStyle: React.CSSProperties = {
        background: 'transparent',
        border: 'none',
        borderBottom: '2px solid var(--neon-cyan)',
        color: '#fff',
        fontSize: '15vw',
        fontFamily: 'var(--font-mono)',
        width: '1.5ch',
        textAlign: 'center',
        outline: 'none',
        lineHeight: 1,
        padding: 0,
        margin: 0
    };

    return (
        <div className="time-input-container">
            <input
                type="number"
                value={values.h.toString().padStart(2, '0')}
                onChange={(e) => handleChange('h', e.target.value)}
                style={inputStyle}
                aria-label="Hours"
            />
            <span style={{ fontSize: '15vw', lineHeight: 1, color: 'var(--muted)' }}>:</span>
            <input
                type="number"
                value={values.m.toString().padStart(2, '0')}
                onChange={(e) => handleChange('m', e.target.value)}
                style={inputStyle}
                aria-label="Minutes"
            />
            <span style={{ fontSize: '15vw', lineHeight: 1, color: 'var(--muted)' }}>:</span>
            <input
                type="number"
                value={values.s.toString().padStart(2, '0')}
                onChange={(e) => handleChange('s', e.target.value)}
                style={inputStyle}
                aria-label="Seconds"
            />
        </div>
    );
};
