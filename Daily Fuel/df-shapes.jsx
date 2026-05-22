// Daily Fuel — Golden Hour visual system
// SVG art primitives: sun, horizon, vessels, atmospheres.
// All shapes use the locked palette. Composed at runtime.

// ── ATMOSPHERE ─────────────────────────────────────────────────────
// A full-bleed gradient backdrop that varies with state + time of day.
// Cream stays constant; warmth shifts.
function Atmosphere({ tone = 'morning' }) {
  // tone: 'morning' | 'midday' | 'golden' | 'dawn' | 'overcast'
  const config = {
    morning:  { stops: [['#FDFBF7',1], ['#FBF4E2',1], ['#F5E7BD',0.7]], angle: 180 },
    midday:   { stops: [['#FDFBF7',1], ['#F8EFD8',1], ['#F0D896',0.5]], angle: 175 },
    golden:   { stops: [['#FDFBF7',1], ['#F8E9C3',1], ['#E9C778',0.8]], angle: 170 },
    overcast: { stops: [['#FDFBF7',1], ['#F4EFE5',1], ['#E8E1D2',0.8]], angle: 180 },
    dawn:     { stops: [['#F5EFE5',1], ['#EAE4D6',1], ['#D8D2C2',0.8]], angle: 175 },
  }[tone] || { stops: [['#FDFBF7',1]], angle: 180 };

  const gradId = 'atm-' + tone;
  return (
    <svg width="100%" height="100%" viewBox="0 0 390 844" preserveAspectRatio="none" style={{
      position:'absolute', inset:0, zIndex: 0, pointerEvents:'none'
    }}>
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
          {config.stops.map(([color, op], i) => (
            <stop key={i} offset={(i / (config.stops.length - 1) * 100) + '%'}
              stopColor={color} stopOpacity={op}/>
          ))}
        </linearGradient>
      </defs>
      <rect width="390" height="844" fill={`url(#${gradId})`}/>
    </svg>
  );
}

// ── SUN ────────────────────────────────────────────────────────────
// Central motif. Vitality (0..1) drives how alive the sun feels:
//   0     → faint outline waiting in the dawn
//   0..1  → smoothly grows: core warms, rays emerge, glow strengthens
//   >0.7  → gentle pulse, fully radiant
// `bloom` triggers a one-time scale/warmth bloom on mount (celebration).
function Sun({ size = 140, rays = true, glow = true, color = DF.gold, soft = DF.goldSoft, vitality = 1, bloom = false }) {
  const id = React.useMemo(() => 'sun-' + Math.random().toString(36).slice(2, 8), []);
  const v = Math.max(0, Math.min(1, vitality));

  // Bloom on mount — uses a state flip + transition (avoids opacity-from-0 anim bug)
  const [bloomed, setBloomed] = React.useState(!bloom);
  React.useEffect(() => {
    if (!bloom) return;
    const id1 = requestAnimationFrame(() => {
      const id2 = requestAnimationFrame(() => setBloomed(true));
      return () => cancelAnimationFrame(id2);
    });
    return () => cancelAnimationFrame(id1);
  }, [bloom]);

  // Derived visual params from vitality
  const coreOpacity   = 0.18 + v * 0.82;      // 0.18 → 1.0
  const coreFillStart = v < 0.15 ? 'rgba(254,246,222,0.6)' : '#FEF6DE';
  const ringOpacity   = 0.5 + v * 0.5;        // outline ring visibility (low-vit "waiting" state)
  const ringStrokeW   = 0.8 + (1 - v) * 0.7;
  const glowOpacity   = 0.05 + v * 0.55;
  const rayCount      = Math.round(2 + v * 10); // 2 → 12 rays
  const rayOpacity    = 0.15 + v * 0.55;
  const rayLength     = 12 + v * 4;
  const pulse         = v > 0.7;

  // Bloom = full radiance kick on mount
  const transform = bloomed ? 'scale(1)' : 'scale(0.55)';
  const transition = 'transform 0.95s cubic-bezier(0.2, 0.9, 0.2, 1), filter 0.95s ease';
  const filter     = bloomed ? 'brightness(1)' : 'brightness(0.85) saturate(0.8)';

  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={{
      display:'block',
      transform, transition, filter,
      transformOrigin: '50% 50%',
    }}>
      <defs>
        <radialGradient id={`${id}-core`} cx="50%" cy="50%" r="50%">
          <stop offset="0%"  stopColor={coreFillStart}/>
          <stop offset="40%" stopColor={soft} stopOpacity={Math.max(0.6, v)}/>
          <stop offset="100%" stopColor={color} stopOpacity={coreOpacity}/>
        </radialGradient>
        {glow && (
          <radialGradient id={`${id}-glow`} cx="50%" cy="50%" r="50%">
            <stop offset="0%"  stopColor={soft} stopOpacity={glowOpacity}/>
            <stop offset="60%" stopColor={soft} stopOpacity={glowOpacity * 0.3}/>
            <stop offset="100%" stopColor={soft} stopOpacity="0"/>
          </radialGradient>
        )}
      </defs>
      {/* outer glow halo */}
      {glow && <circle cx="100" cy="100" r="98" fill={`url(#${id}-glow)`}/>}
      {/* faint ring — always present, visible mostly when vitality is low */}
      <circle cx="100" cy="100" r="60" fill="none"
        stroke={color} strokeWidth={ringStrokeW} strokeOpacity={ringOpacity * (1 - v * 0.7)} strokeDasharray={v < 0.15 ? '3 5' : 'none'}/>
      {/* rays */}
      {rays && [...Array(rayCount)].map((_, i) => {
        const a = (i * 2 * Math.PI) / Math.max(rayCount, 1);
        const x1 = 100 + Math.cos(a) * (76 - v * 4), y1 = 100 + Math.sin(a) * (76 - v * 4);
        const x2 = 100 + Math.cos(a) * (76 + rayLength), y2 = 100 + Math.sin(a) * (76 + rayLength);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity={rayOpacity}
          style={pulse ? { animation: `df-ray-pulse 3.6s ease-in-out ${i * 0.12}s infinite` } : null}/>;
      })}
      {/* core */}
      <circle cx="100" cy="100" r="60" fill={`url(#${id}-core)`}/>
    </svg>
  );
}

// Vitality is computed from estimated totals. Rough/cloudy days hit
// "rewarding" earlier so a few items feel like a real win.
function computeVitality(proteinG, fiberG, state) {
  const raw = Math.min(1, (proteinG / 50) + (fiberG / 30) * 0.4);
  if (state === 'rough')  return Math.min(1, raw * 1.6);
  if (state === 'cloudy') return Math.min(1, raw * 1.3);
  return raw;
}

// ── CLOUD ─────────────────────────────────────────────────────────
// Quiet cloud for "Not hungry" — soft outline, no fill.
function Cloud({ size = 140, color = DF.navy }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200">
      <defs>
        <linearGradient id="cl-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"  stopColor="#FDFBF7" stopOpacity="0.95"/>
          <stop offset="100%" stopColor="#EDE3CC" stopOpacity="0.9"/>
        </linearGradient>
      </defs>
      <path d="M55 120 C30 120 25 95 45 88 C40 70 60 60 76 70 C82 55 110 50 122 68 C145 60 165 78 158 100 C175 105 175 125 158 130 L55 130 Z"
        fill="url(#cl-grad)" stroke={color} strokeWidth="1.2" strokeOpacity="0.35"/>
      <line x1="40" y1="148" x2="160" y2="148" stroke={color} strokeWidth="0.6" strokeOpacity="0.2"/>
    </svg>
  );
}

// ── RAIN / SOFT WEATHER ────────────────────────────────────────────
// Rough day. Quiet, soft. No literal rain — a gentle moon + soft droplets,
// suggesting "it's okay to rest."
function SoftRest({ size = 140, color = DF.navy }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200">
      <defs>
        <radialGradient id="moon-g" cx="50%" cy="50%" r="50%">
          <stop offset="0%"  stopColor="#F4EFE5"/>
          <stop offset="100%" stopColor="#E5DCC8"/>
        </radialGradient>
      </defs>
      {/* gentle crescent moon — represents night/rest */}
      <circle cx="100" cy="92" r="48" fill="url(#moon-g)" opacity="0.95"/>
      <circle cx="115" cy="84" r="44" fill="#FDFBF7"/>
      {/* tiny stars */}
      <circle cx="60" cy="50" r="1.2" fill={color} opacity="0.5"/>
      <circle cx="148" cy="58" r="1.5" fill={color} opacity="0.5"/>
      <circle cx="50" cy="100" r="1" fill={color} opacity="0.4"/>
    </svg>
  );
}

// ── HORIZON BAR ────────────────────────────────────────────────────
// THE signature "closing the gap" element.
// A horizon line with a sun rising across it. No percentage, no target.
// Selection count drives sun height and sky warmth.
// Selections 0..N where N ~ comfortable max (we use ~6 selections = full golden).
function Horizon({ selections = 0, max = 6, vitality = null, height = 88, width = 326, label = null }) {
  // `t` is the fullness driver — sun height, sun warmth, sky.
  // If vitality (0..1) is provided, use it directly (totals-driven).
  // Otherwise fall back to selections/max (count-driven).
  const t = vitality != null
    ? Math.max(0, Math.min(1, vitality))
    : Math.min(selections / max, 1);
  const sunY = 64 - t * 50;                  // 64 → 14 (rises)
  const sunX = 60 + t * (width - 120);       // travels right
  const sunR = 13 + t * 5;                   // 13 → 18, grows slightly
  const skyOpacity  = 0.18 + t * 0.82;       // sky warms up
  const haloOpacity = 0.10 + t * 0.55;       // halo intensifies
  const sunOpacity  = 0.35 + t * 0.65;       // faint outline → fully present

  return (
    <div style={{ width, position:'relative' }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display:'block', overflow:'visible' }}>
        <defs>
          {/* sky gradient — gets warmer with selections */}
          <linearGradient id="hz-sky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"  stopColor={DF.goldSoft} stopOpacity={skyOpacity * 0.5}/>
            <stop offset="60%" stopColor={DF.goldGlow} stopOpacity={skyOpacity * 0.9}/>
            <stop offset="100%" stopColor="#FBE9B3" stopOpacity={skyOpacity}/>
          </linearGradient>
          <radialGradient id="hz-sun" cx="50%" cy="50%" r="50%">
            <stop offset="0%"  stopColor="#FEF6DE"/>
            <stop offset="60%" stopColor={DF.goldSoft}/>
            <stop offset="100%" stopColor={DF.gold}/>
          </radialGradient>
          <radialGradient id="hz-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%"  stopColor={DF.goldSoft} stopOpacity={haloOpacity}/>
            <stop offset="100%" stopColor={DF.goldSoft} stopOpacity="0"/>
          </radialGradient>
          <clipPath id="hz-clip">
            <rect x="0" y="0" width={width} height={64}/>
          </clipPath>
        </defs>

        {/* sky band (clipped above horizon) */}
        <g clipPath="url(#hz-clip)">
          <rect x="0" y="0" width={width} height={64} fill="url(#hz-sky)"/>
          {/* sun halo */}
          <circle cx={sunX} cy={sunY} r="38" fill="url(#hz-halo)"/>
          {/* sun core — opacity tracks vitality so an empty plan reads as "waiting" */}
          <circle cx={sunX} cy={sunY} r={sunR} fill="url(#hz-sun)" opacity={sunOpacity} style={{ transition: 'all 0.6s cubic-bezier(0.34, 1.2, 0.64, 1)' }}/>
          {/* faint outline when sun is very low (early-dawn waiting state) */}
          {t < 0.15 && (
            <circle cx={sunX} cy={sunY} r={sunR} fill="none"
              stroke={DF.gold} strokeWidth="0.8" strokeOpacity="0.45" strokeDasharray="2 3"/>
          )}
        </g>

        {/* horizon line */}
        <line x1="0" y1="64" x2={width} y2="64"
          stroke={DF.gold} strokeWidth="1.2" strokeOpacity="0.7"/>

        {/* ground hint — very subtle */}
        <rect x="0" y="64" width={width} height={height - 64} fill={DF.creamWarm} opacity="0.5"/>
      </svg>
      {label && <div style={{
        position:'absolute', bottom: 4, left: 0, right: 0,
        textAlign:'center', fontSize: 11, color: DF.muted,
        fontFamily: DF_FONT.body, letterSpacing: 0.3,
      }}>{label}</div>}
    </div>
  );
}

// ── VESSEL ─────────────────────────────────────────────────────────
// Bowl-style mark — for "what's in your corner" / supplements / kitchen feel.
function Vessel({ size = 56, color = DF.gold, accent = DF.goldDeep }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      <defs>
        <linearGradient id="v-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color}/>
          <stop offset="100%" stopColor={accent}/>
        </linearGradient>
      </defs>
      <path d="M14 40 Q40 72 66 40" fill="url(#v-grad)"/>
      <line x1="10" y1="40" x2="70" y2="40" stroke={accent} strokeWidth="1.3" strokeLinecap="round"/>
      <ellipse cx="40" cy="40" rx="30" ry="3" fill={color} opacity="0.4"/>
    </svg>
  );
}

// ── SMALL ICONS for state cards ────────────────────────────────────
function MiniSun({ size = 28, color = DF.gold }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="6" fill={color}/>
      {[...Array(8)].map((_, i) => {
        const a = (i * Math.PI) / 4;
        return <line key={i}
          x1={16 + Math.cos(a) * 10} y1={16 + Math.sin(a) * 10}
          x2={16 + Math.cos(a) * 14} y2={16 + Math.sin(a) * 14}
          stroke={color} strokeWidth="1.5" strokeLinecap="round"/>;
      })}
    </svg>
  );
}
function MiniCloud({ size = 28, color = DF.navyMute }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32">
      <path d="M9 20 C5 20 4 14 9 13 C8 9 14 8 17 11 C19 8 25 10 24 14 C28 14 28 20 24 20 Z"
        fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  );
}
function MiniMoon({ size = 28, color = DF.navy }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32">
      <path d="M22 17 A 9 9 0 1 1 14 8 A 7 7 0 0 0 22 17 Z" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  );
}

// ── PAINTERLY BLOB — for landing hero and onboarding accents ──────
// Soft watercolor-bleed blob in cream/gold.
function PainterlyBlob({ size = 280, variant = 0, opacity = 1 }) {
  const seeds = [
    'M120,10 C195,5 250,75 240,150 C230,225 145,255 75,225 C15,200 -5,125 25,65 C50,25 90,12 120,10Z',
    'M140,15 C215,30 250,105 220,180 C195,240 110,250 50,210 C5,180 0,105 30,55 C55,20 110,8 140,15Z',
    'M100,5 C175,0 245,60 240,135 C235,210 165,255 95,235 C25,215 -5,140 15,75 C30,35 70,8 100,5Z',
    'M130,5 C200,15 240,90 230,165 C220,235 155,255 85,235 C25,215 0,140 20,70 C40,20 90,0 130,5Z',
  ];
  const id = 'pb-' + variant + '-' + Math.random().toString(36).slice(2,6);
  return (
    <svg width={size} height={size} viewBox="0 0 250 250" style={{ display:'block' }}>
      <defs>
        <radialGradient id={id} cx="35%" cy="30%" r="80%">
          <stop offset="0%"  stopColor="#FEF6DE" stopOpacity={opacity}/>
          <stop offset="50%" stopColor={DF.goldSoft} stopOpacity={opacity * 0.9}/>
          <stop offset="100%" stopColor={DF.gold} stopOpacity={opacity * 0.7}/>
        </radialGradient>
      </defs>
      <path d={seeds[variant % seeds.length]} fill={`url(#${id})`}/>
    </svg>
  );
}

// ── TIME-OF-DAY CLOCK ─────────────────────────────────────────────
// Tiny corner glyph for the saved plan view. Sun position reflects
// the user's current local time of day.
function TimeOfDayMark({ size = 28, color = DF.gold }) {
  const hour = new Date().getHours() + new Date().getMinutes() / 60;
  // 6am → start of arc (left), 6pm → end of arc (right). 12 noon = top.
  // We'll just place the sun along a horizon arc, day or night.
  const isDay = hour >= 6 && hour <= 19;
  const dayT = Math.max(0, Math.min(1, (hour - 6) / 13)); // 0..1 across the day
  const angle = Math.PI + dayT * Math.PI; // 180 → 360 (left → right, going over top)
  const cx = 14 + Math.cos(angle) * 10;
  const cy = 16 + Math.sin(angle) * 10;
  return (
    <svg width={size} height={size} viewBox="0 0 28 32">
      <line x1="2" y1="24" x2="26" y2="24" stroke={color} strokeWidth="0.8" opacity="0.5"/>
      <circle cx={cx} cy={cy + 8} r="3.5" fill={isDay ? color : DF.navyMid}/>
    </svg>
  );
}

Object.assign(window, {
  Atmosphere, Sun, Cloud, SoftRest,
  Horizon, Vessel, PainterlyBlob,
  MiniSun, MiniCloud, MiniMoon, TimeOfDayMark,
  computeVitality,
});
