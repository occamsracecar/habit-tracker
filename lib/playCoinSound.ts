type BrowserWindowWithWebkitAudio = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };

let audioContext: AudioContext | null = null;

function getAudioContext() {
  if (typeof window === "undefined") {
    return null;
  }

  const browserWindow = window as BrowserWindowWithWebkitAudio;
  const AudioContextConstructor =
    browserWindow.AudioContext ?? browserWindow.webkitAudioContext;

  if (!AudioContextConstructor) {
    return null;
  }

  audioContext ??= new AudioContextConstructor();

  return audioContext;
}

function scheduleCoinNote(
  audioContext: AudioContext,
  frequency: number,
  startTime: number,
  duration: number,
) {
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = "square";
  oscillator.frequency.setValueAtTime(frequency, startTime);

  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(0.18, startTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  oscillator.connect(gain);
  gain.connect(audioContext.destination);

  oscillator.start(startTime);
  oscillator.stop(startTime + duration);

  window.setTimeout(
    () => {
      oscillator.disconnect();
      gain.disconnect();
    },
    (duration + 0.1) * 1000,
  );
}

export async function playCoinSound() {
  const currentAudioContext = getAudioContext();

  if (!currentAudioContext) {
    return;
  }

  if (currentAudioContext.state === "suspended") {
    await currentAudioContext.resume();
  }

  const now = currentAudioContext.currentTime;

  scheduleCoinNote(currentAudioContext, 988, now, 0.08);
  scheduleCoinNote(currentAudioContext, 1568, now + 0.07, 0.12);
}
