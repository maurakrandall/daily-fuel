// Direction 1 — "Golden Hour"
// Warm editorial. Cream field, navy type, soft gold gradient blobs.
// Serif display (Fraunces) + sans body (Inter substitute → system).
// Feels like a well-made print zine. The calmest of the three.

const GH = {
  cream: '#F7F1E6',
  creamDeep: '#EFE6D3',
  navy: '#1B2A4A',
  navyInk: '#10193A',
  ink: '#2B1F12',
  muted: '#8A7E6E',
  gold: '#C28A2F',
  goldDeep: '#9B6B1E',
  goldSoft: '#F4D7A2',
  teal: '#3A7F78',
};

// ── Gold gradient organic shapes (reusable hero) ──────────────────
function GHShape({ variant = 0, size = 220, opacity = 1 }) {
  // Five seeds — each a slightly different soft blob.
  const seeds = [
    { d: 'M120,0 C180,0 240,60 240,130 C240,200 180,240 115,235 C50,230 5,180 5,115 C5,50 60,0 120,0Z', hue: 'gold' },
    { d: 'M130,10 C200,20 235,85 225,160 C215,225 150,245 85,225 C20,205 -5,140 15,75 C35,20 90,5 130,10Z', hue: 'warm' },
    { d: 'M140,5 C215,15 240,100 215,175 C195,230 115,250 55,215 C10,185 0,110 30,55 C60,10 110,0 140,5Z', hue: 'sand' },
    { d: 'M90,20 C165,5 230,45 240,120 C248,195 180,240 105,230 C40,220 0,170 5,105 C10,55 45,28 90,20Z', hue: 'gold' },
    { d: 'M105,15 C170,0 230,55 230,130 C230,200 175,245 110,230 C40,215 10,155 20,95 C30,45 65,25 105,15Z', hue: 'teal' },
  ];
  const seed = seeds[variant % seeds.length];
  const gradients = {
    gold: [GH.goldSoft, GH.gold],
    warm: ['#FBE4B9', '#D08E2F'],
    sand: ['#F4DFB0', '#B37A24'],
    teal: ['#CFE6E2', '#3A7F78'],
  }[seed.hue];
  return (
    <svg width={size} height={size} viewBox="0 0 240 240" style={{ display: 'block' }}>
      <defs>
        <radialGradient id={'gh-g-' + variant} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor={gradients[0]} stopOpacity={opacity}/>
          <stop offset="100%" stopColor={gradients[1]} stopOpacity={opacity}/>
        </radialGradient>
      </defs>
      <path d={seed.d} fill={'url(#gh-g-' + variant + ')'}/>
    </svg>
  );
}

// Small sun/dot accent
function GHSun({ size = 28, color = GH.gold }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28">
      <circle cx="14" cy="14" r="6" fill={color}/>
      {[...Array(8)].map((_, i) => {
        const a = (i * Math.PI) / 4;
        const x1 = 14 + Math.cos(a) * 9, y1 = 14 + Math.sin(a) * 9;
        const x2 = 14 + Math.cos(a) * 12, y2 = 14 + Math.sin(a) * 12;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="1.2" strokeLinecap="round"/>;
      })}
    </svg>
  );
}

// ── Shared chrome ─────────────────────────────────────────────────
function GHBody({ children, pad = '32px 32px 28px' }) {
  return <div style={{ padding: pad, display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', zIndex: 2 }}>{children}</div>;
}

function GHEyebrow({ children }) {
  return <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: GH.gold, marginBottom: 10 }}>{children}</div>;
}

function GHHeading({ children, size = 34 }) {
  return (
    <h1 style={{
      fontFamily: '"Fraunces", "Cormorant Garamond", Georgia, serif',
      fontWeight: 400, fontSize: size, lineHeight: 1.08, color: GH.navyInk,
      letterSpacing: -0.8, margin: 0,
      fontVariationSettings: '"opsz" 144, "SOFT" 100',
    }}>{children}</h1>
  );
}

function GHSub({ children }) {
  return <p style={{ fontSize: 15, lineHeight: 1.55, color: GH.muted, margin: '12px 0 0', fontFamily: 'inherit' }}>{children}</p>;
}

function GHButton({ children, variant = 'primary', onClick }) {
  const isPrimary = variant === 'primary';
  return (
    <button onClick={onClick} style={{
      width: '100%',
      padding: isPrimary ? '16px 24px' : '14px 24px',
      background: isPrimary ? GH.navyInk : 'transparent',
      color: isPrimary ? GH.cream : GH.muted,
      border: 'none', borderRadius: 999,
      fontSize: isPrimary ? 15 : 13,
      fontWeight: isPrimary ? 500 : 500,
      letterSpacing: isPrimary ? 0.1 : 0.2,
      cursor: 'pointer', textAlign: 'center',
      fontFamily: 'inherit',
      textDecoration: isPrimary ? 'none' : 'underline',
      textUnderlineOffset: 3,
      textDecorationThickness: 0.5,
    }}>{children}</button>
  );
}

// ── Screen 1: Landing ─────────────────────────────────────────────
function GH_Landing() {
  return (
    <PhoneFrame bg={GH.cream}>
      {/* Hero shape — large off-canvas gold blob */}
      <div style={{ position: 'absolute', top: -60, right: -80, pointerEvents: 'none' }}>
        <GHShape variant={1} size={360}/>
      </div>
      <div style={{ position: 'absolute', top: 180, left: -40, pointerEvents: 'none', opacity: 0.7 }}>
        <GHShape variant={4} size={140}/>
      </div>

      <GHBody pad="220px 32px 36px">
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase', color: GH.gold, marginBottom: 20 }}>Daily Fuel</div>
        <GHHeading size={42}>
          Eating can feel <em style={{ fontStyle: 'italic', fontWeight: 300 }}>good</em> again.
        </GHHeading>
        <p style={{ fontSize: 16, lineHeight: 1.6, color: GH.ink, margin: '18px 0 0', opacity: .75, maxWidth: 300 }}>
          A gentle companion for the days food feels different — not a tracker, not a diet. Just support, day by day.
        </p>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <GHButton>Let's begin</GHButton>
          <GHButton variant="link">I already have an account</GHButton>
        </div>
      </GHBody>
    </PhoneFrame>
  );
}

// ── Screen 2: Goals (reframed — no numeric pressure up front) ─────
function GH_Goals() {
  const options = [
    { id: 'gentle',   h: 'Gentle',   sub: 'Start small. Nourish without pressure.',          pg: '40–60g', fg: '20g' },
    { id: 'steady',   h: 'Steady',   sub: 'Build a consistent rhythm.',                       pg: '60–80g', fg: '25g', active: true },
    { id: 'stronger', h: 'Stronger', sub: 'I\u2019m feeling ready to push a little.',        pg: '80–100g',fg: '30g' },
  ];
  return (
    <PhoneFrame bg={GH.cream}>
      <div style={{ position: 'absolute', top: -30, right: -90, opacity: 0.55 }}><GHShape variant={0} size={260}/></div>
      <ProgressGold step={1}/>
      <GHBody pad="24px 32px 28px">
        <div style={{ marginTop: 4 }}>
          <GHEyebrow>One · of five</GHEyebrow>
          <GHHeading size={30}>What kind of day<br/>are you building toward?</GHHeading>
          <GHSub>Choose a feel — not a number. You can adjust anytime.</GHSub>
        </div>
        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {options.map((o) => (
            <div key={o.id} style={{
              border: o.active ? `1.5px solid ${GH.navyInk}` : `1px solid ${GH.creamDeep}`,
              background: o.active ? '#fff' : 'rgba(255,255,255,0.55)',
              borderRadius: 14, padding: '14px 16px',
              display: 'flex', alignItems: 'center', gap: 14,
              boxShadow: o.active ? '0 4px 18px rgba(27,42,74,0.06)' : 'none',
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: 19,
                background: o.active ? GH.goldSoft : 'transparent',
                border: o.active ? 'none' : `1px dashed ${GH.muted}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                {o.active && <div style={{ width: 14, height: 14, borderRadius: 7, background: GH.gold }}/>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: '"Fraunces", serif', fontSize: 18, fontWeight: 500, color: GH.navyInk, lineHeight: 1.1 }}>{o.h}</div>
                <div style={{ fontSize: 12, color: GH.muted, marginTop: 2, lineHeight: 1.35 }}>{o.sub}</div>
              </div>
              <div style={{ textAlign: 'right', fontSize: 10, color: GH.muted, fontVariantNumeric: 'tabular-nums', lineHeight: 1.3 }}>
                <div>P {o.pg}</div>
                <div>F {o.fg}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 'auto', paddingTop: 20 }}>
          <GHButton>Continue</GHButton>
          <div style={{ fontSize: 11, color: GH.muted, textAlign: 'center', marginTop: 12, lineHeight: 1.45, padding: '0 16px' }}>
            These are general ranges, not medical advice. Your doctor knows you best.
          </div>
        </div>
      </GHBody>
    </PhoneFrame>
  );
}

// ── Screen 3: Food preferences (Go-tos) ──────────────────────────
function GH_Foods() {
  const selected = new Set(['shake', 'yogurt', 'nuts', 'eggs']);
  return (
    <PhoneFrame bg={GH.cream}>
      <div style={{ position: 'absolute', bottom: -80, left: -60, opacity: 0.5 }}><GHShape variant={2} size={240}/></div>
      <ProgressGold step={2}/>
      <GHBody pad="24px 32px 24px">
        <GHEyebrow>Two · of five</GHEyebrow>
        <GHHeading size={28}>Your <em style={{ fontStyle: 'italic', fontWeight: 300 }}>go-tos</em>.</GHHeading>
        <GHSub>The things you reach for without thinking — even on hard days.</GHSub>

        <div style={{ marginTop: 20, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {GOTOS_SIMPLE.map((g) => {
            const on = selected.has(g.id);
            return (
              <div key={g.id} style={{
                padding: '9px 14px', borderRadius: 999,
                fontSize: 13.5,
                background: on ? GH.navyInk : 'transparent',
                color: on ? GH.cream : GH.ink,
                border: on ? `1px solid ${GH.navyInk}` : `1px solid rgba(43,31,18,0.18)`,
                fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                {on && <span style={{ fontSize: 10, opacity: .7 }}>✓</span>}
                {g.label}
              </div>
            );
          })}
        </div>

        <div style={{
          marginTop: 18, padding: '14px 16px', background: '#fff',
          borderRadius: 12, border: `1px solid ${GH.creamDeep}`,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{ width: 28, height: 28, borderRadius: 14, background: GH.goldSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <GHSun size={18} color={GH.goldDeep}/>
          </div>
          <div style={{ fontSize: 12.5, color: GH.ink, lineHeight: 1.45 }}>
            <b style={{ color: GH.navyInk }}>4 go-tos picked.</b> That's plenty to start — more is always welcome.
          </div>
        </div>

        <div style={{ marginTop: 'auto', paddingTop: 18 }}>
          <GHButton>Looks good</GHButton>
          <GHButton variant="link">Skip for now</GHButton>
        </div>
      </GHBody>
    </PhoneFrame>
  );
}

// ── Screen 4: Dietary needs ───────────────────────────────────────
function GH_Dietary() {
  const on = new Set(['dairy', 'lowfodmap']);
  return (
    <PhoneFrame bg={GH.cream}>
      <div style={{ position: 'absolute', top: 60, right: -70, opacity: 0.5 }}><GHShape variant={3} size={200}/></div>
      <ProgressGold step={3}/>
      <GHBody pad="24px 32px 28px">
        <GHEyebrow>Three · of five</GHEyebrow>
        <GHHeading size={28}>Anything we should<br/>work <em style={{ fontStyle: 'italic', fontWeight: 300 }}>around</em>?</GHHeading>
        <GHSub>Tell us what's off-limits. We'll leave it out of every suggestion, quietly.</GHSub>

        <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {DIETARY_NEEDS.map((d) => {
            const sel = on.has(d.id);
            return (
              <div key={d.id} style={{
                padding: '12px 16px', borderRadius: 10,
                background: sel ? '#fff' : 'transparent',
                border: sel ? `1.5px solid ${GH.gold}` : `1px solid ${GH.creamDeep}`,
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <div style={{
                  width: 18, height: 18, borderRadius: 4,
                  background: sel ? GH.gold : 'transparent',
                  border: sel ? `1px solid ${GH.gold}` : `1px solid ${GH.muted}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {sel && <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M2 5.5L4 7.5L8 3"/></svg>}
                </div>
                <div style={{ fontSize: 15, color: GH.navyInk, fontFamily: '"Fraunces", serif', fontWeight: 400 }}>{d.label}</div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 'auto', paddingTop: 18 }}>
          <GHButton>Continue</GHButton>
          <GHButton variant="link">Nothing to avoid</GHButton>
        </div>
      </GHBody>
    </PhoneFrame>
  );
}

// ── Screen 5: Celebration (letter-style, plants "close the gap") ─
function GH_Celebration() {
  return (
    <PhoneFrame bg={GH.cream}>
      {/* Big gold sun setting */}
      <div style={{ position: 'absolute', top: 40, left: '50%', transform: 'translateX(-50%)' }}>
        <svg width="200" height="200" viewBox="0 0 200 200">
          <defs>
            <radialGradient id="gh-sun-cel" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={GH.goldSoft}/>
              <stop offset="60%" stopColor={GH.gold}/>
              <stop offset="100%" stopColor={GH.goldDeep}/>
            </radialGradient>
          </defs>
          <circle cx="100" cy="100" r="54" fill="url(#gh-sun-cel)"/>
          <circle cx="100" cy="100" r="74" fill="none" stroke={GH.gold} strokeWidth="0.6" opacity="0.5"/>
          <circle cx="100" cy="100" r="92" fill="none" stroke={GH.gold} strokeWidth="0.5" opacity="0.3"/>
        </svg>
      </div>

      <ProgressGold step={5}/>

      <GHBody pad="240px 32px 28px">
        <GHHeading size={30}>
          Welcome in, <em style={{ fontStyle: 'italic', fontWeight: 300 }}>friend</em>.
        </GHHeading>
        <p style={{ fontSize: 15, lineHeight: 1.6, color: GH.ink, margin: '16px 0 0', opacity: 0.8 }}>
          You've got <span style={{ fontFamily: '"Fraunces", serif', fontWeight: 500 }}>Greek yogurt</span>, <span style={{ fontFamily: '"Fraunces", serif', fontWeight: 500 }}>eggs</span>, and <span style={{ fontFamily: '"Fraunces", serif', fontWeight: 500 }}>nuts</span> in your corner. That's more than enough to work with.
        </p>

        {/* Close-the-gap seed — tomorrow preview */}
        <div style={{
          marginTop: 22, padding: '18px 18px 16px',
          background: '#fff', borderRadius: 14,
          border: `1px solid ${GH.creamDeep}`,
          position: 'relative',
        }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: GH.gold, marginBottom: 10 }}>Tomorrow</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* mini progress ring */}
            <svg width="56" height="56" viewBox="0 0 56 56">
              <circle cx="28" cy="28" r="22" fill="none" stroke={GH.creamDeep} strokeWidth="4"/>
              <circle cx="28" cy="28" r="22" fill="none" stroke={GH.gold} strokeWidth="4"
                strokeDasharray={`${2 * Math.PI * 22 * 0.52} ${2 * Math.PI * 22}`}
                strokeLinecap="round" transform="rotate(-90 28 28)"/>
              <text x="28" y="32" textAnchor="middle" fontSize="13" fontWeight="600" fill={GH.navyInk} fontFamily="system-ui">52%</text>
            </svg>
            <div style={{ flex: 1, fontSize: 13, lineHeight: 1.5, color: GH.ink }}>
              We'll help you <b style={{ color: GH.navyInk }}>close the gap</b> — small nudges, no nagging.
            </div>
          </div>
        </div>

        <div style={{ marginTop: 'auto', paddingTop: 22 }}>
          <GHButton>Start my first day</GHButton>
        </div>
      </GHBody>
    </PhoneFrame>
  );
}

Object.assign(window, {
  GH_Landing, GH_Goals, GH_Foods, GH_Dietary, GH_Celebration,
});
