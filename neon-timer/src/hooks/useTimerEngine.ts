import { useState, useEffect, useRef, useCallback } from 'react';

export type TimerMode = 'stopwatch' | 'countdown';
export type TimerStatus = 'idle' | 'running' | 'paused' | 'ended';

interface UseTimerEngineProps {
    initialMode?: TimerMode;
    defaultCountdownMs?: number; // default 5 minutes
    onTick?: (ms: number) => void;
    onEnd?: () => void;
}

export function useTimerEngine({
    initialMode = 'stopwatch',
    defaultCountdownMs = 300000,
    onTick,
    onEnd
}: UseTimerEngineProps = {}) {
    const [mode, setMode] = useState<TimerMode>(initialMode);
    const [status, setStatus] = useState<TimerStatus>('idle');
    const [timeMs, setTimeMs] = useState<number>(initialMode === 'stopwatch' ? 0 : defaultCountdownMs);
    const [countdownInputMs, setCountdownInputMs] = useState<number>(defaultCountdownMs);

    // Refs for animation loop

    const animationFrameRef = useRef<number | null>(null);

    // Reset when mode changes (or manually called)
    const reset = useCallback(() => {
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        setStatus('idle');


        if (mode === 'stopwatch') {
            setTimeMs(0);
        } else {
            setTimeMs(countdownInputMs);
        }
    }, [mode, countdownInputMs]);

    // Handle mode switch safely
    const switchMode = useCallback((newMode: TimerMode) => {
        // If running, we might want to ask confirmation, but for MVP we just reset
        setMode(newMode);
        // The effect below will handle reset, but we can do it explicitly needed
        // Actually simpler to let effect dependency handle it or do it here.
        // Let's do it in effect or here. 
        // Since setMode is async, we can't depend on 'mode' immediately.
        // We'll rely on a useEffect that watches 'mode' to reset? 
        // Or just manually reset state.
        // Let's manual reset to avoid effects firing late.
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        setStatus('idle');


        if (newMode === 'stopwatch') {
            setTimeMs(0);
        } else {
            // If switching to countdown, use existing input or default
            setTimeMs(countdownInputMs);
        }
    }, [countdownInputMs]);

    // Sync timeMs with countdownInputMs when idle in countdown mode
    useEffect(() => {
        if (mode === 'countdown' && status === 'idle') {
            setTimeMs(countdownInputMs);
        }
    }, [countdownInputMs, mode, status]);


    // startTimeRef and pausedTimeRef are removed as we use anchorTimeRef/durationAtStartRef


    // Re-implementing start/pause logic cleaner:
    // We need to track `baseTime` (offset).
    // Stopwatch: time = (now - anchor)
    // Countdown: time = initial - (now - anchor)

    const anchorTimeRef = useRef<number>(0);
    const durationAtStartRef = useRef<number>(0);

    const loop = useCallback(() => {
        const now = performance.now();
        const elapsed = now - anchorTimeRef.current; // how long since we (re)started

        if (mode === 'stopwatch') {
            const total = durationAtStartRef.current + elapsed;
            setTimeMs(total);
            onTick?.(total);
            animationFrameRef.current = requestAnimationFrame(loop);
        } else {
            const remaining = durationAtStartRef.current - elapsed;
            if (remaining <= 0) {
                setTimeMs(0);
                onTick?.(0);
                setStatus('ended');
                onEnd?.();
            } else {
                setTimeMs(remaining);
                onTick?.(remaining);
                animationFrameRef.current = requestAnimationFrame(loop);
            }
        }
    }, [mode, onEnd, onTick]);


    const start = useCallback(() => {
        if (status === 'running') return;

        // If ended, decide logic. Usually reset then start? Or if countdown 0, can't start.
        if (status === 'ended' && mode === 'countdown' && timeMs <= 0) {
            // Can't start a 0 countdown
            return;
        }

        setStatus('running');
        anchorTimeRef.current = performance.now();
        durationAtStartRef.current = timeMs; // current displayed time is our base

        animationFrameRef.current = requestAnimationFrame(loop);
    }, [status, mode, timeMs, loop]);

    const pause = useCallback(() => {
        if (status !== 'running') return;

        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        setStatus('paused');
        // timeMs is already updated by latest tick
    }, [status]);

    // Clean up
    useEffect(() => {
        return () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };
    }, []);

    return {
        mode,
        setMode: switchMode,
        status,
        timeMs,
        countdownInputMs,
        setCountdownInputMs, // User typing new duration
        start,
        pause,
        reset
    };
}
