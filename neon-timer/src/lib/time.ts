export function formatTimeHHMMSS(ms: number): string {
    if (ms < 0) ms = 0;

    const totalSeconds = Math.ceil(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    const pad = (n: number) => n.toString().padStart(2, '0');

    // Always show HH:MM:SS for big display consistency
    // Or we could hide hours if 0? Product req says "BigTimeDisplay: 00:00:00"
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
}
