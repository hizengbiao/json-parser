
import type { TimerMode } from '../hooks/useTimerEngine';


interface TopBarProps {
    mode?: TimerMode;
    onSetMode?: (mode: TimerMode) => void;
}

export const TopBar: React.FC<TopBarProps> = ({ mode = 'stopwatch', onSetMode }) => {
    const linkStyle = (targetMode: TimerMode) => ({
        cursor: 'pointer',
        color: mode === targetMode ? '#fff' : 'var(--muted)',
        textShadow: mode === targetMode ? '0 0 10px var(--neon-cyan)' : 'none',
        fontWeight: mode === targetMode ? 'bold' : 'normal',
        margin: '0 1rem',
        transition: 'all 0.3s ease'
    });

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 2rem',
            fontSize: '0.9rem',
            position: 'relative',
            zIndex: 10
        }}>
            <div style={{ fontWeight: 800, letterSpacing: '1px' }}>NEON TIMER</div>

            <div style={{ display: 'flex' }}>
                <div
                    onClick={() => onSetMode?.('stopwatch')}
                    style={linkStyle('stopwatch')}
                >
                    STOPWATCH
                </div>
                <div
                    onClick={() => onSetMode?.('countdown')}
                    style={linkStyle('countdown')}
                >
                    COUNTDOWN
                </div>
            </div>

            <div style={{ opacity: 0.5, cursor: 'not-allowed' }}>SETTINGS</div>
        </div>
    );
};
