
import type { TimerStatus } from './BigTimeDisplay';

import { PRESETS } from '../lib/presets';

interface ControlsPanelProps {
    status: TimerStatus;
    mode: 'stopwatch' | 'countdown';
    onStart: () => void;
    onPause: () => void;
    onReset: () => void;
    onPresetSelect: (ms: number) => void;
}

export const ControlsPanel: React.FC<ControlsPanelProps> = ({
    status,
    mode,
    onStart,
    onPause,
    onReset,
    onPresetSelect
}) => {
    const isRunning = status === 'running';

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            padding: '2rem',
            position: 'relative',
            zIndex: 10
        }}>
            {/* Presets Row - Only in Idle Countdown */}
            {mode === 'countdown' && status === 'idle' && (
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {PRESETS.map(preset => (
                        <button
                            key={preset.label}
                            onClick={() => onPresetSelect(preset.ms)}
                            style={{
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--muted)',
                                color: 'var(--muted)',
                                padding: '0.25rem 0.75rem',
                                borderRadius: '15px',
                                cursor: 'pointer',
                                fontSize: '0.8rem',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.borderColor = 'var(--neon-cyan)';
                                e.currentTarget.style.color = '#fff';
                                e.currentTarget.style.boxShadow = '0 0 5px var(--neon-cyan)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.borderColor = 'var(--muted)';
                                e.currentTarget.style.color = 'var(--muted)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            {preset.label}
                        </button>
                    ))}
                </div>
            )}

            {/* Main Controls */}
            <div style={{ display: 'flex', gap: '1rem' }}>
                {!isRunning ? (
                    <button
                        onClick={onStart}
                        style={{
                            background: 'transparent',
                            border: '1px solid var(--neon-cyan)',
                            color: 'var(--neon-cyan)',
                            padding: '0.5rem 2rem',
                            width: '120px',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            boxShadow: '0 0 10px var(--neon-cyan), inset 0 0 5px var(--neon-cyan)',
                            textTransform: 'uppercase',
                            transition: 'all 0.2s'
                        }}
                    >
                        {status === 'paused' ? 'Resume' : 'Start'}
                    </button>
                ) : (
                    <button
                        onClick={onPause}
                        style={{
                            background: 'transparent',
                            border: '1px solid var(--neon-magenta)',
                            color: 'var(--neon-magenta)',
                            padding: '0.5rem 2rem',
                            width: '120px',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            boxShadow: '0 0 10px var(--neon-magenta), inset 0 0 5px var(--neon-magenta)',
                            textTransform: 'uppercase',
                            transition: 'all 0.2s'
                        }}
                    >
                        Pause
                    </button>
                )}

                <button
                    onClick={onReset}
                    style={{
                        background: 'transparent',
                        border: '1px solid var(--muted)',
                        color: 'var(--muted)',
                        padding: '0.5rem 2rem',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        textTransform: 'uppercase',
                        transition: 'all 0.2s'
                    }}
                >
                    Reset
                </button>
            </div>
        </div>
    );
};
