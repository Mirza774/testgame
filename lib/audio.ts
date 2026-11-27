type Ambient = { stop: () => void };

class AudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private ambient: Ambient | null = null;
  private muted = false;
  private volume = 0.55;

  init(): AudioContext | null {
    if (typeof window === "undefined") return null;

    if (!this.ctx) {
      const Ctor =
        window.AudioContext ??
        (
          window as unknown as {
            webkitAudioContext?: typeof AudioContext;
          }
        ).webkitAudioContext;
      if (!Ctor) return null;

      this.ctx = new Ctor();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : this.volume;
      this.master.connect(this.ctx.destination);
    }

    if (this.ctx.state === "suspended") void this.ctx.resume();
    return this.ctx;
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    if (this.ctx && this.master) {
      this.master.gain.setTargetAtTime(
        muted ? 0 : this.volume,
        this.ctx.currentTime,
        0.05,
      );
    }
  }

  isMuted() {
    return this.muted;
  }

  private tone(
    frequency: number,
    duration: number,
    type: OscillatorType,
    gain: number,
    delay = 0,
    endFrequency?: number,
  ) {
    const ctx = this.init();
    if (!ctx || !this.master) return;

    const start = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const amp = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, start);
    if (endFrequency) {
      osc.frequency.exponentialRampToValueAtTime(
        Math.max(20, endFrequency),
        start + duration,
      );
    }

    amp.gain.setValueAtTime(0.0001, start);
    amp.gain.linearRampToValueAtTime(gain, start + 0.012);
    amp.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    osc.connect(amp);
    amp.connect(this.master);
    osc.start(start);
    osc.stop(start + duration + 0.05);
  }

  private noise(duration: number, gain: number, cutoff: number, delay = 0) {
    const ctx = this.init();
    if (!ctx || !this.master) return;

    const frames = Math.max(1, Math.floor(ctx.sampleRate * duration));
    const buffer = ctx.createBuffer(1, frames, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < frames; i += 1) {
      data[i] = Math.random() * 2 - 1;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = cutoff;

    const amp = ctx.createGain();
    const start = ctx.currentTime + delay;
    amp.gain.setValueAtTime(0.0001, start);
    amp.gain.linearRampToValueAtTime(gain, start + 0.02);
    amp.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    source.connect(filter);
    filter.connect(amp);
    amp.connect(this.master);
    source.start(start);
    source.stop(start + duration + 0.05);
  }

  startAmbient() {
    const ctx = this.init();
    if (!ctx || !this.master || this.ambient) return;

    const droneA = ctx.createOscillator();
    const droneB = ctx.createOscillator();
    const gainA = ctx.createGain();
    const gainB = ctx.createGain();

    droneA.type = "sine";
    droneA.frequency.value = 55;
    droneB.type = "sine";
    droneB.frequency.value = 82.41;
    gainA.gain.value = 0.018;
    gainB.gain.value = 0.009;

    droneA.connect(gainA);
    gainA.connect(this.master);
    droneB.connect(gainB);
    gainB.connect(this.master);

    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseData.length; i += 1) {
      noiseData[i] = (Math.random() * 2 - 1) * 0.5;
    }
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "lowpass";
    noiseFilter.frequency.value = 220;
    noiseFilter.Q.value = 0.7;

    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.02;

    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.06;
    lfoGain.gain.value = 90;
    lfo.connect(lfoGain);
    lfoGain.connect(noiseFilter.frequency);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.master);

    droneA.start();
    droneB.start();
    noiseSource.start();
    lfo.start();

    this.ambient = {
      stop: () => {
        try {
          droneA.stop();
          droneB.stop();
          noiseSource.stop();
          lfo.stop();
        } catch {
          /* already stopped */
        }
        droneA.disconnect();
        droneB.disconnect();
        noiseSource.disconnect();
        lfo.disconnect();
        gainA.disconnect();
        gainB.disconnect();
        noiseFilter.disconnect();
        noiseGain.disconnect();
        lfoGain.disconnect();
        this.ambient = null;
      },
    };
  }

  click() {
    this.tone(340, 0.07, "triangle", 0.05);
  }

  tick() {
    this.noise(0.04, 0.04, 1800);
  }

  wrong() {
    this.tone(130, 0.28, "sawtooth", 0.045, 0, 70);
    this.tone(98, 0.34, "sine", 0.05, 0.05, 60);
    this.noise(0.22, 0.03, 900, 0.03);
  }

  chime() {
    [523.25, 659.25, 783.99].forEach((frequency, index) => {
      this.tone(frequency, 1.7, "sine", 0.045, index * 0.18);
    });
  }

  knock() {
    this.noise(0.09, 0.12, 420);
    this.noise(0.09, 0.1, 380, 0.14);
  }

  open() {
    this.tone(110, 0.9, "sine", 0.06, 0, 55);
    this.noise(0.7, 0.05, 300);
  }

  /** Radio static: short bursts that feel like a voice trying to form. */
  static(duration = 0.5) {
    this.noise(duration, 0.06, 2400);
    this.noise(duration * 0.6, 0.035, 700, 0.08);
  }

  /** Backwards, wordless near-whisper. */
  whisper() {
    this.tone(210, 0.6, "sine", 0.022, 0, 460);
    this.noise(0.7, 0.035, 1200, 0.06);
  }

  heartbeat(times = 2) {
    for (let i = 0; i < times; i += 1) {
      this.tone(62, 0.16, "sine", 0.08, i * 0.42, 40);
      this.tone(54, 0.13, "sine", 0.05, i * 0.42 + 0.19, 36);
    }
  }

  /** A wrong answer in one reality tears slightly in the other. */
  crack() {
    this.noise(0.5, 0.07, 1600);
    this.tone(920, 0.22, "sawtooth", 0.022, 0, 280);
  }

  /** The imitation using someone's voice. */
  mimic() {
    this.tone(240, 0.5, "triangle", 0.03, 0, 232);
    this.tone(244, 0.5, "triangle", 0.025, 0.06, 226);
    this.noise(0.6, 0.03, 1400, 0.1);
  }

  /** Chapter transition: a low breath and one unresolved note. */
  shift() {
    this.tone(82.41, 1.4, "sine", 0.05, 0, 61.74);
    this.noise(1.1, 0.035, 340, 0.15);
    this.tone(392, 1.1, "sine", 0.018, 0.4, 370);
  }

  reveal() {
    [261.63, 311.13, 392].forEach((frequency, index) => {
      this.tone(frequency, 2.2, "sine", 0.03, index * 0.24);
    });
    this.noise(1.4, 0.025, 260, 0.2);
  }
}

export const audio = new AudioEngine();
