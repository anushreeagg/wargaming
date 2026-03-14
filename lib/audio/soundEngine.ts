'use client';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private loops: Map<string, { source: AudioBufferSourceNode | OscillatorNode; gain: GainNode }> = new Map();
  private enabled = true;

  private getCtx(): AudioContext {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.6;
      this.masterGain.connect(this.ctx.destination);
    }
    return this.ctx;
  }

  setEnabled(val: boolean) {
    this.enabled = val;
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(val ? 0.6 : 0, this.getCtx().currentTime, 0.3);
    }
  }

  // ── WHITE NOISE buffer ──────────────────────────────────────────────────────
  private makeNoise(ctx: AudioContext): AudioBuffer {
    const bufferSize = ctx.sampleRate * 3;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    return buffer;
  }

  // ── RAIN ────────────────────────────────────────────────────────────────────
  startRain(intensity: 'light' | 'heavy' = 'light') {
    if (this.loops.has('rain')) return;
    const ctx = this.getCtx();
    const noise = this.makeNoise(ctx);

    const src = ctx.createBufferSource();
    src.buffer = noise;
    src.loop = true;

    // Bandpass to make it sound like rain
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = intensity === 'heavy' ? 1200 : 800;
    filter.Q.value = 0.4;

    const filter2 = ctx.createBiquadFilter();
    filter2.type = 'highpass';
    filter2.frequency.value = 300;

    const gainNode = ctx.createGain();
    gainNode.gain.value = 0;

    src.connect(filter);
    filter.connect(filter2);
    filter2.connect(gainNode);
    gainNode.connect(this.masterGain!);
    src.start();

    gainNode.gain.setTargetAtTime(intensity === 'heavy' ? 0.4 : 0.18, ctx.currentTime, 1.5);
    this.loops.set('rain', { source: src, gain: gainNode });
  }

  // ── CLOCK TICK ──────────────────────────────────────────────────────────────
  startClock() {
    if (this.loops.has('clock')) return;
    const ctx = this.getCtx();

    const scheduleNextTick = () => {
      if (!this.loops.has('clock') && this.loops.get('clock') !== undefined) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 1800;
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.07, ctx.currentTime + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.08);
    };

    const intervalId = setInterval(scheduleNextTick, 1000);
    scheduleNextTick();

    // Store interval ref in a compatible way
    const dummyGain = ctx.createGain();
    this.loops.set('clock', { source: dummyGain as unknown as OscillatorNode, gain: dummyGain });
    (this.loops.get('clock') as unknown as { intervalId: ReturnType<typeof setInterval> }).intervalId = intervalId;
  }

  stopClock() {
    const entry = this.loops.get('clock') as unknown as { intervalId: ReturnType<typeof setInterval> } | undefined;
    if (entry?.intervalId) clearInterval(entry.intervalId);
    this.loops.delete('clock');
  }

  // ── FIREPLACE ──────────────────────────────────────────────────────────────
  startFire() {
    if (this.loops.has('fire')) return;
    const ctx = this.getCtx();
    const noise = this.makeNoise(ctx);

    const src = ctx.createBufferSource();
    src.buffer = noise;
    src.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 500;
    filter.Q.value = 0.8;

    const gainNode = ctx.createGain();
    gainNode.gain.value = 0;

    src.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.masterGain!);
    src.start();

    gainNode.gain.setTargetAtTime(0.15, ctx.currentTime, 2);
    this.loops.set('fire', { source: src, gain: gainNode });
  }

  // ── PAPER RUSTLE (one-shot) ─────────────────────────────────────────────────
  playPaper() {
    if (!this.enabled) return;
    const ctx = this.getCtx();
    const noise = this.makeNoise(ctx);

    const src = ctx.createBufferSource();
    src.buffer = noise;

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 2000;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain!);
    src.start();
    src.stop(ctx.currentTime + 0.35);
  }

  // ── TELEGRAM ARRIVAL ────────────────────────────────────────────────────────
  playTelegram() {
    if (!this.enabled) return;
    const ctx = this.getCtx();
    const times = [0, 0.12, 0.24, 0.45, 0.57];
    times.forEach(t => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.value = 800;
      gain.gain.setValueAtTime(0, ctx.currentTime + t);
      gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.1);
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(ctx.currentTime + t);
      osc.stop(ctx.currentTime + t + 0.1);
    });
  }

  // ── CHOICE HOVER ────────────────────────────────────────────────────────────
  playHover() {
    if (!this.enabled) return;
    const ctx = this.getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 440;
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(this.masterGain!);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  }

  // ── DECISION COMMITTED ──────────────────────────────────────────────────────
  playDecision() {
    if (!this.enabled) return;
    const ctx = this.getCtx();
    const notes = [261.63, 329.63, 392.0, 523.25]; // C major chord
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.07;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.08, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(t);
      osc.stop(t + 1.2);
    });
  }

  // ── DRAMATIC STING (McKinley scene) ─────────────────────────────────────────
  playDramaticSting() {
    if (!this.enabled) return;
    const ctx = this.getCtx();
    const notes = [130.81, 155.56, 196.0]; // C minor
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      const filt = ctx.createBiquadFilter();
      filt.type = 'lowpass';
      filt.frequency.value = 600;
      osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.15;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.1, t + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 2.5);
      osc.connect(filt);
      filt.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(t);
      osc.stop(t + 2.5);
    });
  }

  // ── STOP A LOOP ─────────────────────────────────────────────────────────────
  fadeOut(key: string) {
    const entry = this.loops.get(key);
    if (!entry) return;
    const ctx = this.getCtx();
    entry.gain.gain.setTargetAtTime(0, ctx.currentTime, 0.8);
    setTimeout(() => {
      try { (entry.source as AudioBufferSourceNode).stop(); } catch {}
      this.loops.delete(key);
    }, 3000);
  }

  // ── SWITCH AMBIENCE ─────────────────────────────────────────────────────────
  setAmbience(key: 'rain_light' | 'rain_heavy' | 'clock_tick' | 'silence' | 'fire') {
    if (key === 'rain_light' || key === 'rain_heavy') {
      this.fadeOut('clock');
      this.stopClock();
      this.fadeOut('fire');
      this.startRain(key === 'rain_heavy' ? 'heavy' : 'light');
    } else if (key === 'clock_tick') {
      this.fadeOut('rain');
      this.fadeOut('fire');
      this.startClock();
    } else if (key === 'fire') {
      this.fadeOut('rain');
      this.stopClock();
      this.startFire();
    } else {
      this.fadeOut('rain');
      this.stopClock();
      this.fadeOut('fire');
    }
  }
}

export const soundEngine = typeof window !== 'undefined' ? new SoundEngine() : null;
