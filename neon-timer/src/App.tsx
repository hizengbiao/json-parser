
import './index.css';
import { BigTimeDisplay } from './components/BigTimeDisplay';
import { TimeInputHHMMSS } from './components/TimeInputHHMMSS';
import { TopBar } from './components/TopBar';
import { ControlsPanel } from './components/ControlsPanel';
import { useTimerEngine } from './hooks/useTimerEngine';

function App() {
  const {
    status,
    timeMs,
    mode,
    setMode,
    countdownInputMs,
    setCountdownInputMs,
    start,
    pause,
    reset
  } = useTimerEngine();

  const showInput = mode === 'countdown' && status === 'idle';

  return (
    <>
      <div className="bg-layer-base" />
      <div className="bg-layer-flow" />
      <div className="bg-layer-texture" />

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        justifyContent: 'space-between'
      }}>
        <TopBar mode={mode} onSetMode={setMode} />

        <div className="flex-center" style={{ flex: 1 }}>
          {showInput ? (
            <TimeInputHHMMSS
              initialMs={countdownInputMs}
              onChange={setCountdownInputMs}
            />
          ) : (
            <BigTimeDisplay timeMs={timeMs} status={status} />
          )}
        </div>

        <ControlsPanel
          status={status}
          mode={mode}
          onStart={start}
          onPause={pause}
          onReset={reset}
          onPresetSelect={setCountdownInputMs}
        />
      </div>
    </>
  );
}

export default App;
