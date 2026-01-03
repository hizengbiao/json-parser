
import { formatTimeHHMMSS } from '../lib/time';

export type TimerStatus = 'idle' | 'running' | 'paused' | 'ended';

interface BigTimeDisplayProps {
    timeMs: number;
    status: TimerStatus;
}

export const BigTimeDisplay: React.FC<BigTimeDisplayProps> = ({ timeMs, status }) => {
    const timeStr = formatTimeHHMMSS(timeMs);

    return (
        <div className={`
      big-time-display 
      status-${status}
    `}>
            {status === 'ended' && (
                <div className="time-up-label">TIME UP</div>
            )}
            <div className="digits">
                {timeStr}
            </div>
        </div>
    );
};
