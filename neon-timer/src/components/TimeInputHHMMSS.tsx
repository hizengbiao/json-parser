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

    // Sync with initialMs changes (from presets)
    useEffect(() => {
        setValues(parse(initialMs));
    }, [initialMs]);

    // DERIVE current total MS from current values for the change handler
    const calculateMs = (h: number, m: number, s: number) => {
        return ((h * 3600) + (m * 60) + s) * 1000;
    };

    const handleChange = (field: 'h' | 'm' | 's', valStr: string) => {
        let val = parseInt(valStr, 10);
        if (isNaN(val)) val = 0;

        if (field === 's' || field === 'm') {
            if (val > 59) val = 59;
        }
        if (field === 'h') {
            if (val > 99) val = 99;
        }

        const newValues = { ...values, [field]: val };
        setValues(newValues);

        // Call onChange immediately to update parent, but parent update of initialMs
        // will trigger useEffect above. Since values match, it's a no-op re-render or safe update.
        onChange(calculateMs(newValues.h, newValues.m, newValues.s));
    };

    // Helper for input styling
    const inputStyle: React.CSSProperties = {
        background: 'transparent',
        border: 'none',
        // borderBottom: '2px solid var(--neon-cyan)',
        // borderBottom is handled by container or focus? 
        // Original had it on input.
        borderBottom: '2px solid var(--neon-cyan)',
        color: '#fff',
        fontSize: '12vw',
        fontFamily: 'var(--font-mono)',
        width: '26vw', // Fixed width in VW to ensure container fit (26*3 = 78vw + colons)
        textAlign: 'center',
        outline: 'none',
        lineHeight: 1,
        padding: '0',
        margin: '0',
        MozAppearance: 'textfield' // help hide spinners
    };

    const colonStyle: React.CSSProperties = {
        fontSize: '12vw',
        lineHeight: 1,
        color: 'var(--muted)',
        margin: '0 1vw',
        position: 'relative',
        top: '-1vw' // slight visual adjustment for alignment
    };

    return (
        <div className="time-input-container" style={{ width: '100vw', justifyContent: 'center' }}>
            <input
                type="number"
                value={values.h.toString().padStart(2, '0')}
                onChange={(e) => handleChange('h', e.target.value)}
                style={inputStyle}
                aria-label="Hours"
            />
            <span style={colonStyle}>:</span>
            <input
                type="number"
                value={values.m.toString().padStart(2, '0')}
                onChange={(e) => handleChange('m', e.target.value)}
                style={inputStyle}
                aria-label="Minutes"
            />
            <span style={colonStyle}>:</span>
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
