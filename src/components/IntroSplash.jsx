import { useState, useEffect, useCallback } from 'react';

/* ------------------------------------------------------------------ */
/* Animated geometric emblem (rotating layers, Islamic star motif)      */
/* ------------------------------------------------------------------ */
function IntroEmblem() {
  return (
    <div className="relative flex items-center justify-center w-36 h-36">
      {/* Outermost ring – slow clockwise */}
      <div className="absolute inset-0 intro-geo-outer">
        <svg viewBox="0 0 144 144" className="w-full h-full" aria-hidden="true">
          {/* 8-pointed star border */}
          <polygon
            points="72,4 85,54 136,54 94,84 110,136 72,106 34,136 50,84 8,54 59,54"
            fill="none"
            stroke="#B59449"
            strokeWidth="1.2"
            strokeOpacity="0.5"
          />
          {/* Dashed outer circle */}
          <circle
            cx="72" cy="72" r="68"
            fill="none"
            stroke="#B59449"
            strokeWidth="0.7"
            strokeDasharray="4 6"
            strokeOpacity="0.4"
          />
        </svg>
      </div>

      {/* Middle ring – slow counter-clockwise */}
      <div className="absolute inset-5 intro-geo-inner">
        <svg viewBox="0 0 96 96" className="w-full h-full" aria-hidden="true">
          {/* Inner rotated square (Rub el Hizb) */}
          <rect x="12" y="12" width="72" height="72" fill="none" stroke="#1B4332" strokeWidth="1.5" strokeOpacity="0.6" />
          <rect
            x="12" y="12" width="72" height="72"
            fill="none" stroke="#1B4332" strokeWidth="1.5" strokeOpacity="0.4"
            transform="rotate(45 48 48)"
          />
          <circle cx="48" cy="48" r="8" fill="none" stroke="#B59449" strokeWidth="1.2" strokeOpacity="0.5" />
        </svg>
      </div>

      {/* Core gold dot */}
      <div className="relative z-10 w-10 h-10 rounded-full bg-forest flex items-center justify-center shadow-lg">
        <svg viewBox="0 0 40 40" className="w-6 h-6" aria-hidden="true">
          <rect x="6" y="6" width="28" height="28" fill="none" stroke="#B59449" strokeWidth="1.4" />
          <rect x="6" y="6" width="28" height="28" fill="none" stroke="#FAF8F3" strokeWidth="0.8" transform="rotate(45 20 20)" />
          <circle cx="20" cy="20" r="3" fill="#B59449" />
        </svg>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Three animated loading dots                                          */
/* ------------------------------------------------------------------ */
function LoadingDots() {
  return (
    <div className="flex items-center gap-2 mt-2" aria-hidden="true">
      <span className="w-1.5 h-1.5 rounded-full bg-gold intro-dot-1 inline-block" />
      <span className="w-1.5 h-1.5 rounded-full bg-gold intro-dot-2 inline-block" />
      <span className="w-1.5 h-1.5 rounded-full bg-gold intro-dot-3 inline-block" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Full-screen intro splash                                             */
/* ------------------------------------------------------------------ */
export default function IntroSplash({ onDone }) {
  const [phase, setPhase] = useState('in'); // 'in' | 'idle' | 'out'

  /* Auto-advance to idle after entrance animations finish */
  useEffect(() => {
    const t = setTimeout(() => setPhase('idle'), 2200);
    return () => clearTimeout(t);
  }, []);

  const handleEnter = useCallback(() => {
    setPhase('out');
    setTimeout(onDone, 680);
  }, [onDone]);

  /* Skip on any key press once idle */
  useEffect(() => {
    if (phase !== 'idle') return;
    const handler = (e) => {
      if (e.key === 'Enter' || e.key === ' ') handleEnter();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [phase, handleEnter]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center select-none
        ${phase === 'out' ? 'intro-bg-exit' : 'intro-bg'}`}
      style={{ background: 'linear-gradient(160deg, #1B4332 0%, #133023 55%, #0D2318 100%)' }}
      aria-modal="true"
      role="dialog"
      aria-label="شاشة الترحيب"
    >
      {/* Subtle paper-texture grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, #FAF8F3 0px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #FAF8F3 0px, transparent 1px, transparent 40px)',
        }}
        aria-hidden="true"
      />

      {/* Large faint background calligraphic ب — purely decorative */}
      <div
        className="absolute inset-0 flex items-center justify-center opacity-[0.035] pointer-events-none"
        aria-hidden="true"
      >
        <span
          className="text-gold select-none"
          style={{ fontFamily: 'Amiri, serif', fontSize: 'clamp(280px, 50vw, 520px)', lineHeight: 1, color: '#B59449' }}
        >
          ✦
        </span>
      </div>

      {/* Top border rule */}
      <div className="absolute top-0 inset-x-0 h-[3px] bg-gold opacity-70" aria-hidden="true" />

      {/* Main content card */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center max-w-lg">
        {/* Rotating emblem */}
        <div className="intro-title">
          <IntroEmblem />
        </div>

        {/* Title */}
        <div className="intro-title space-y-2">
          <h1
            className="font-religious text-6xl sm:text-7xl font-bold leading-none intro-shimmer-text"
            dir="rtl"
          >
            مُعِدّ
          </h1>
          <p className="text-ivory/70 text-sm sm:text-base font-medium tracking-wide">
            مولّد اختبارات التربية الإسلامية
          </p>
        </div>

        {/* Animated gold rule */}
        <div className="intro-rule mx-auto h-px bg-gradient-to-r from-transparent via-gold to-transparent" style={{ width: '70%' }} aria-hidden="true" />

        {/* "made for" byline */}
        <div className="intro-byline space-y-1">
          <p className="text-ivory/40 text-[11px] font-mono uppercase tracking-[0.2em]">
            crafted for
          </p>
          <p className="text-gold font-mono text-2xl sm:text-3xl font-bold tracking-tight" style={{ letterSpacing: '-0.01em' }}>
            AYOUCHiii
          </p>
        </div>

        {/* Loading dots or enter button */}
        <div className="intro-enter-btn h-12 flex items-center justify-center">
          {phase === 'idle' ? (
            <button
              type="button"
              onClick={handleEnter}
              className="group relative overflow-hidden border border-gold/60 text-gold/90 hover:text-ivory px-7 py-2.5 text-sm font-semibold tracking-wide transition-all duration-300 cursor-pointer"
              style={{ background: 'transparent' }}
            >
              {/* Hover fill sweep */}
              <span
                className="absolute inset-0 bg-forest opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                aria-hidden="true"
              />
              <span className="relative z-10 inline-flex items-center gap-2">
                <span>ابدأ</span>
                <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </span>
            </button>
          ) : (
            <LoadingDots />
          )}
        </div>
      </div>

      {/* Bottom credit */}
      <p className="absolute bottom-5 left-0 right-0 text-center text-[11px] font-mono text-ivory/25 tracking-widest uppercase">
        Islamic Exam Generator · مُعِدّ
      </p>

      {/* Bottom border rule */}
      <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gold opacity-40" aria-hidden="true" />
    </div>
  );
}

