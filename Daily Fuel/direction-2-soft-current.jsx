// Direction 2 — "Soft Current"
// Teal-led, fluid. Modern geometric sans. Watercolor-bleed organic shapes
// in teal + navy with gold accents. Progress as a flowing ribbon.
// The most contemporary of the three — feels like a breathing app.

const SC = {
  bg: '#FBFAF7',          // near-cream, cooler
  surface: '#FFFFFF',
  ink: '#142532',
  navy: '#1B2A4A',
  muted: '#7B8691',
  line: '#E8E4DC',
  teal: '#0F7F7F',
  tealDeep: '#065757',
  tealSoft: '#D5E9E7',
  gold: '#D29A3A',
  goldSoft: '#FBEACB',
};

// Fluid SVG shapes — large, blurred, watercolor-like
function SCFluidBackdrop({ variant = 0 }) {
  // Full-bleed backdrop: overlapping soft blobs, suggesting current/water
  const cfgs = [
    { // teal + navy flowing right
      blobs: [
        { cx: 380, cy: 100, r: 200, from: SC.tealSoft, to: SC.teal, op: 0.55 },
        { cx: 120, cy: -40, r: 180, from: '#E8E9F5', to: SC.navy, op: 0.25 },
        { cx: 320, cy: 320, r: 150, from: SC.goldSoft, to: SC.gold, op: 0.35 },
      ],
    },
    { // teal ribbon across middle
      blobs: [
        { cx: -30, cy: 180, r: 180, from: SC.tealSoft, to: SC.teal, op: 0.5 },
        { cx: 420, cy: 220, r: 180, from: SC.tealSoft, to: SC.tealDeep, op: 0.4 },
        { cx: 200, cy: -60, r: 140, from: SC.goldSoft, to: SC.gold, op: 0.3 },
      ],
    },
    { // bottom-heavy teal
      blobs: [
        { cx: 180, cy: 640, r: 240, from: SC.tealSoft, to: SC.teal, op: 0.45 },
        { cx: 380, cy: 500, r: 150, from: '#E8E9F5', to: SC.navy, op: 0.2 },
        { cx: 60, cy: 420, r: 120, from: SC.goldSoft, to: SC.gold, op: 0.35 },
      ],
    },
    { // right-side teal wash
      blobs: [
        { cx: 360, cy: 380, r: 220, from: SC.tealSoft, to: SC.tealDeep, op: 0.5 },
        { cx: 60, cy: 120, r: 140, from: SC.goldSoft, to: SC.gold, op: 0.3 },
      ],
    },
    { // celebration — radiant
      blobs: [
        { cx: 200, cy: 240, r: 260, from: SC.tealSoft, to: SC.teal, op: 0.6 },
        { cx: 200, cy: 240, r: 120, from: '#FFF9E8', to: SC.gold, op: 0.5 },
        { cx: 60, cy: 540, r: 160, from: '#E8E9F5', to: SC.navy, op: 0.18 },
      ],
    },
  ];
  const cfg = cfgs[variant % cfgs.length];
  return (
    <svg width="100%" height="100%" viewBox="0 0 400 780" style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }} preserveAspectRatio="xMidYMid slice">
      <defs>
        <filter id={'sc-blur-' + variant} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="28"/>
        </filter>
        {cfg.blobs.map((b, i) => (
          <radialGradient key={i} id={`sc-g-${variant}-${i}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={b.from} stopOpacity={b.op}/>
            <stop offset="80%" stopColor={b.to} stopOpacity={b.op * 0.9}/>
            <stop offset="100%" stopColor={b.to} stopOpacity="0"/>
          </radialGradient>
        ))}
      </defs>
      <g filter={`url(#sc-blur-${variant})`}>
        {cfg.blobs.map((b, i) => (
          <circle key={i} cx={b.cx} cy={b.cy} r={b.r} fill={`url(#sc-g-${variant}-${i})`}/>
        ))}
      </g>
    </svg>
  );
}

function SCBody({ children, pad = '24px 28px 28px' }) {
  return <div style={{ padding: pad, display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', zIndex: 2 }}>{children}</div>;
}

function SCStep({ n, total = 5 }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: '5px 11px', background: 'rgba(15,127,127,0.09)',
      borderRadius: 999, color: SC.tealDeep,
      fontSize: 11, fontWeight: 600, letterSpacing: 0.3,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: 3, background: SC.teal }}/>
      Step {n} of {total}
    </div>
  );
}

function SCHeading({ children, size = 32 }) {
  return (
    <h1 style={{
      fontFamily: '"Manrope", "Inter", -apple-system, BlinkMacSystemFont, sans-serif',
      fontWeight: 600, fontSize: size, lineHeight: 1.1, color: SC.ink,
      letterSpacing: -1, margin: 0,
    }}>{children}</h1>
  );
}

function SCSub({ children }) {
  return <p style={{ fontSize: 15, lineHeight: 1.55, color: SC.muted, margin: '12px 0 0', fontFamily: 'inherit' }}>{children}</p>;
}

function SCButton({ children, variant = 'primary', onClick }) {
  const styles = {
    primary: { background: SC.teal, color: '#fff', border: 'none', fontSize: 15, padding: '16px 24px', fontWeight: 600 },
    secondary: { background: 'transparent', color: SC.muted, border: 'none', fontSize: 13, padding: '10px 24px', fontWeight: 500, textDecoration: 'underline', textUnderlineOffset: 3 },
  };
  return (
    <button onClick={onClick} style={{
      width: '100%', borderRadius: 16,
      cursor: 'pointer', fontFamily: '"Manrope", sans-serif',
      letterSpacing: -0.1, ...styles[variant],
      boxShadow: variant === 'primary' ? '0 6px 20px rgba(15,127,127,0.25)' : 'none',
    }}>{children}</button>
  );
}

// ── Landing ──────────────────────────────────────────────────────
function SC_Landing() {
  return (
    <PhoneFrame bg={SC.bg} statusColor={SC.ink}>
      <SCFluidBackdrop variant={0}/>
      <SCBody pad="40px 28px 32px">
        <div style={{ marginTop: 180 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 14,
            padding: '6px 12px', background: 'rgba(255,255,255,0.7)',
            borderRadius: 999, backdropFilter: 'blur(8px)',
          }}>
            <div style={{ width: 7, height: 7, borderRadius: 4, background: SC.teal }}/>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: SC.tealDeep }}>Daily Fuel</span>
          </div>
          <SCHeading size={38}>
            Meet food<br/>where you are today.
          </SCHeading>
          <p style={{ fontSize: 16, lineHeight: 1.55, color: SC.ink, margin: '18px 0 0', opacity: 0.72, maxWidth: 290 }}>
            Built for the GLP-1 journey — gentle nudges toward protein and fiber, no calorie counting.
          </p>
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <SCButton>Get started — it's free</SCButton>
          <SCButton variant="secondary">I already have an account</SCButton>
        </div>
      </SCBody>
    </PhoneFrame>
  );
}

// ── Goals ─────────────────────────────────────────────────────────
function SC_Goals() {
  const presets = [
    { id: 'a', label: 'Gentle',   p: 50,  f: 20, sub: 'Ease in', active: false },
    { id: 'b', label: 'Steady',   p: 70,  f: 25, sub: 'Most people start here', active: true },
    { id: 'c', label: 'Stronger', p: 90,  f: 30, sub: 'Push a little' },
  ];
  return (
    <PhoneFrame bg={SC.bg} statusColor={SC.ink}>
      <SCFluidBackdrop variant={1}/>
      <ProgressDots step={1}/>
      <SCBody pad="24px 28px 24px">
        <div style={{ marginTop: 8 }}>
          <SCStep n={1}/>
          <div style={{ marginTop: 14 }}>
            <SCHeading size={28}>What feels right<br/>for you, right now?</SCHeading>
            <SCSub>Your targets for protein and fiber. Change them anytime.</SCSub>
          </div>
        </div>

        <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {presets.map((p) => (
            <div key={p.id} style={{
              padding: '16px 18px', borderRadius: 14,
              background: p.active ? SC.surface : 'rgba(255,255,255,0.55)',
              border: p.active ? `1.5px solid ${SC.teal}` : `1px solid ${SC.line}`,
              boxShadow: p.active ? '0 6px 20px rgba(15,127,127,0.10)' : 'none',
              display: 'flex', alignItems: 'center',
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: SC.ink, letterSpacing: -0.2 }}>{p.label}</div>
                <div style={{ fontSize: 12, color: SC.muted, marginTop: 2 }}>{p.sub}</div>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: SC.teal, fontVariantNumeric: 'tabular-nums' }}>{p.p}g</div>
                  <div style={{ fontSize: 9, color: SC.muted, letterSpacing: 1, textTransform: 'uppercase' }}>protein</div>
                </div>
                <div style={{ width: 1, height: 28, background: SC.line }}/>
                <div style={{ textAlign: 'right', minWidth: 36 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: SC.gold, fontVariantNumeric: 'tabular-nums' }}>{p.f}g</div>
                  <div style={{ fontSize: 9, color: SC.muted, letterSpacing: 1, textTransform: 'uppercase' }}>fiber</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 16, padding: '12px 14px',
          background: 'rgba(255,255,255,0.55)', borderRadius: 12,
          fontSize: 12, color: SC.muted, lineHeight: 1.45,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke={SC.teal} strokeWidth="1.3"/><path d="M8 4v4.5L11 10" stroke={SC.teal} strokeWidth="1.3" strokeLinecap="round"/></svg>
          <span>Guidelines only. Your doctor knows you best.</span>
        </div>

        <div style={{ marginTop: 'auto', paddingTop: 18 }}>
          <SCButton>Continue</SCButton>
          <SCButton variant="secondary">Set my own numbers</SCButton>
        </div>
      </SCBody>
    </PhoneFrame>
  );
}

// ── Foods ─────────────────────────────────────────────────────────
function SC_Foods() {
  const selected = new Set(['shake', 'yogurt', 'nuts', 'eggs', 'berries']);
  const macroColor = { p: SC.teal, f: SC.gold, b: '#7B5ABF' };
  return (
    <PhoneFrame bg={SC.bg} statusColor={SC.ink}>
      <SCFluidBackdrop variant={2}/>
      <ProgressDots step={2}/>
      <SCBody pad="24px 28px 20px">
        <SCStep n={2}/>
        <div style={{ marginTop: 14 }}>
          <SCHeading size={26}>What do you reach for<br/>on good days?</SCHeading>
          <SCSub>Your go-tos. We'll build around them.</SCSub>
        </div>

        {/* legend */}
        <div style={{ marginTop: 18, display: 'flex', gap: 12, fontSize: 10, color: SC.muted, fontWeight: 600, letterSpacing: 0.3, textTransform: 'uppercase' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 7, height: 7, borderRadius: 4, background: SC.teal }}/>Protein</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 7, height: 7, borderRadius: 4, background: SC.gold }}/>Fiber</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 7, height: 7, borderRadius: 4, background: '#7B5ABF' }}/>Both</span>
        </div>

        <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {GOTOS_SIMPLE.map((g) => {
            const on = selected.has(g.id);
            const dot = macroColor[g.macro];
            return (
              <div key={g.id} style={{
                padding: '8px 12px 8px 10px', borderRadius: 999,
                fontSize: 13, fontWeight: 500,
                background: on ? SC.tealDeep : SC.surface,
                color: on ? '#fff' : SC.ink,
                border: on ? 'none' : `1px solid ${SC.line}`,
                display: 'flex', alignItems: 'center', gap: 6,
                boxShadow: on ? '0 3px 10px rgba(6,87,87,0.15)' : 'none',
              }}>
                <span style={{ width: 6, height: 6, borderRadius: 4, background: on ? '#fff' : dot, opacity: on ? 0.7 : 1 }}/>
                {g.label}
              </div>
            );
          })}
        </div>

        {/* progress summary */}
        <div style={{
          marginTop: 18, padding: '14px 16px',
          background: SC.surface, borderRadius: 14,
          border: `1px solid ${SC.line}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.3, textTransform: 'uppercase', color: SC.muted }}>Your kit</div>
            <div style={{ fontSize: 12, fontVariantNumeric: 'tabular-nums', color: SC.ink, fontWeight: 600 }}>5 picked</div>
          </div>
          <div style={{ display: 'flex', gap: 3 }}>
            {[...Array(12)].map((_, i) => (
              <div key={i} style={{ flex: 1, height: 6, borderRadius: 3, background: i < 5 ? SC.teal : SC.tealSoft }}/>
            ))}
          </div>
          <div style={{ fontSize: 12, color: SC.muted, marginTop: 10, lineHeight: 1.4 }}>A handful is plenty. Add more anytime.</div>
        </div>

        <div style={{ marginTop: 'auto', paddingTop: 14 }}>
          <SCButton>Continue</SCButton>
        </div>
      </SCBody>
    </PhoneFrame>
  );
}

// ── Dietary ───────────────────────────────────────────────────────
function SC_Dietary() {
  const on = new Set(['gluten', 'lowfodmap']);
  return (
    <PhoneFrame bg={SC.bg} statusColor={SC.ink}>
      <SCFluidBackdrop variant={3}/>
      <ProgressDots step={3}/>
      <SCBody pad="24px 28px 26px">
        <SCStep n={3}/>
        <div style={{ marginTop: 14 }}>
          <SCHeading size={28}>Anything to<br/>leave out?</SCHeading>
          <SCSub>We'll quietly skip these in every suggestion — no reminders, no flags.</SCSub>
        </div>

        <div style={{ marginTop: 22, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {DIETARY_NEEDS.map((d) => {
            const sel = on.has(d.id);
            return (
              <div key={d.id} style={{
                padding: '14px 14px', borderRadius: 12,
                background: sel ? SC.tealSoft : SC.surface,
                border: sel ? `1.5px solid ${SC.teal}` : `1px solid ${SC.line}`,
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <div style={{
                  width: 18, height: 18, borderRadius: 10,
                  background: sel ? SC.teal : 'transparent',
                  border: sel ? 'none' : `1.5px solid ${SC.line}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {sel && <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"><path d="M2 5.5L4 7.5L8 3"/></svg>}
                </div>
                <div style={{ fontSize: 13.5, color: SC.ink, fontWeight: 500, lineHeight: 1.2 }}>{d.label}</div>
              </div>
            );
          })}
        </div>

        <div style={{
          marginTop: 18, padding: '12px 14px',
          background: SC.tealSoft, borderRadius: 12,
          fontSize: 12.5, color: SC.tealDeep, lineHeight: 1.45,
        }}>
          Nothing here? That's fine — tap continue.
        </div>

        <div style={{ marginTop: 'auto', paddingTop: 14 }}>
          <SCButton>Continue</SCButton>
        </div>
      </SCBody>
    </PhoneFrame>
  );
}

// ── Celebration ──────────────────────────────────────────────────
function SC_Celebration() {
  return (
    <PhoneFrame bg={SC.bg} statusColor={SC.ink}>
      <SCFluidBackdrop variant={4}/>
      <SCBody pad="40px 28px 28px">
        <div style={{ marginTop: 60, textAlign: 'center' }}>
          {/* glowing circle mark */}
          <div style={{ display: 'inline-flex', marginBottom: 24 }}>
            <svg width="88" height="88" viewBox="0 0 88 88">
              <defs>
                <radialGradient id="sc-cel-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#fff"/>
                  <stop offset="50%" stopColor={SC.tealSoft}/>
                  <stop offset="100%" stopColor={SC.teal} stopOpacity="0"/>
                </radialGradient>
              </defs>
              <circle cx="44" cy="44" r="44" fill="url(#sc-cel-glow)"/>
              <circle cx="44" cy="44" r="22" fill={SC.teal}/>
              <path d="M36 44l6 6 12-12" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </div>
          <SCHeading size={32}>You're all set.</SCHeading>
          <p style={{ fontSize: 15, lineHeight: 1.55, color: SC.muted, margin: '12px auto 0', maxWidth: 280 }}>
            We've got what we need. Your Daily Fuel is ready whenever you are.
          </p>
        </div>

        {/* Tomorrow preview — closes the gap */}
        <div style={{
          marginTop: 28, padding: '18px 18px 16px',
          background: SC.surface, borderRadius: 18,
          border: `1px solid ${SC.line}`,
          boxShadow: '0 10px 30px rgba(15,127,127,0.08)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', color: SC.muted }}>Tomorrow · a preview</div>
            <div style={{ fontSize: 11, color: SC.teal, fontWeight: 600 }}>6:00 PM</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* ring */}
            <svg width="64" height="64" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="26" fill="none" stroke={SC.line} strokeWidth="5"/>
              <circle cx="32" cy="32" r="26" fill="none" stroke={SC.teal} strokeWidth="5"
                strokeDasharray={`${2 * Math.PI * 26 * 0.58} ${2 * Math.PI * 26}`}
                strokeLinecap="round" transform="rotate(-90 32 32)"/>
              <text x="32" y="37" textAnchor="middle" fontSize="14" fontWeight="700" fill={SC.ink} fontFamily="Manrope, system-ui">58%</text>
            </svg>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, color: SC.ink, fontWeight: 600, marginBottom: 4 }}>Let's close the gap.</div>
              <div style={{ fontSize: 12.5, color: SC.muted, lineHeight: 1.4 }}>
                18g of protein to go. Your string cheese + a shake gets you there.
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 'auto', paddingTop: 22 }}>
          <SCButton>Open Daily Fuel</SCButton>
        </div>
      </SCBody>
    </PhoneFrame>
  );
}

Object.assign(window, {
  SC_Landing, SC_Goals, SC_Foods, SC_Dietary, SC_Celebration,
});
