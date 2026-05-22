// Direction 3 — "Ritual"
// Deep navy field, cream/gold type. Small precise geometric glyphs instead
// of blobs — concentric circles, crescents, thin rings. Serif display
// (Fraunces) + JetBrains Mono accents. The most distinct — feels like
// a quiet morning practice, not an app.

const RT = {
  bg: '#0F1A33',
  surface: '#15233F',
  surfaceLift: '#1B2A4A',
  cream: '#F4ECD8',
  creamDim: '#D9CFB8',
  ink: '#F4ECD8',
  muted: '#8A96AE',
  gold: '#E7C77A',
  goldDeep: '#B98F3A',
  teal: '#6FB4A8',
  tealSoft: '#3E6E69',
  line: 'rgba(231,199,122,0.18)',
};

// Precise geometric glyph system — the "ritual" marks
function RTMark({ kind = 'sun', size = 80, color = RT.gold }) {
  const common = { fill: 'none', stroke: color, strokeWidth: 1, strokeLinecap: 'round' };
  switch (kind) {
    case 'sun': return (
      <svg width={size} height={size} viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="12" fill={color}/>
        <circle cx="40" cy="40" r="20" {...common}/>
        <circle cx="40" cy="40" r="30" {...common} opacity="0.5"/>
        <circle cx="40" cy="40" r="39" {...common} opacity="0.25"/>
      </svg>
    );
    case 'crescent': return (
      <svg width={size} height={size} viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="28" fill={color} opacity="0.95"/>
        <circle cx="50" cy="36" r="26" fill={RT.bg}/>
      </svg>
    );
    case 'seed': return (
      <svg width={size} height={size} viewBox="0 0 80 80">
        <ellipse cx="40" cy="40" rx="10" ry="28" fill={color}/>
        <ellipse cx="40" cy="40" rx="22" ry="38" {...common} opacity="0.5"/>
      </svg>
    );
    case 'horizon': return (
      <svg width={size} height={size} viewBox="0 0 80 80">
        <circle cx="40" cy="50" r="22" fill={color}/>
        <rect x="2" y="50" width="76" height="1" fill={color}/>
        <rect x="8" y="58" width="64" height="0.6" fill={color} opacity="0.6"/>
      </svg>
    );
    case 'bowl': return (
      <svg width={size} height={size} viewBox="0 0 80 80">
        <path d="M12 38 Q40 75 68 38" fill={color} opacity="0.85"/>
        <path d="M6 38 L74 38" stroke={color} strokeWidth="1"/>
        <circle cx="40" cy="26" r="3" fill={RT.teal}/>
      </svg>
    );
    case 'vessel': return (
      <svg width={size} height={size} viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="26" {...common}/>
        <circle cx="40" cy="40" r="14" fill={color}/>
        <line x1="40" y1="8" x2="40" y2="72" stroke={color} strokeWidth="0.4" opacity="0.4"/>
        <line x1="8" y1="40" x2="72" y2="40" stroke={color} strokeWidth="0.4" opacity="0.4"/>
      </svg>
    );
    default: return null;
  }
}

function RTBody({ children, pad = '20px 28px 28px' }) {
  return <div style={{ padding: pad, display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', zIndex: 2, color: RT.cream }}>{children}</div>;
}

function RTHeading({ children, size = 34 }) {
  return (
    <h1 style={{
      fontFamily: '"Fraunces", "Cormorant Garamond", Georgia, serif',
      fontWeight: 300, fontSize: size, lineHeight: 1.1, color: RT.cream,
      letterSpacing: -0.5, margin: 0,
      fontVariationSettings: '"opsz" 144, "SOFT" 100',
    }}>{children}</h1>
  );
}

function RTSub({ children }) {
  return <p style={{ fontSize: 14, lineHeight: 1.6, color: RT.muted, margin: '14px 0 0', fontFamily: 'Georgia, serif', fontStyle: 'italic', opacity: 0.9 }}>{children}</p>;
}

function RTMono({ children }) {
  return <span style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace', fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: RT.gold }}>{children}</span>;
}

function RTButton({ children, variant = 'primary', onClick }) {
  if (variant === 'primary') {
    return (
      <button onClick={onClick} style={{
        width: '100%', padding: '16px 24px',
        background: RT.gold, color: RT.bg,
        border: 'none', borderRadius: 2,
        fontSize: 13, fontWeight: 600,
        letterSpacing: 2, textTransform: 'uppercase',
        cursor: 'pointer',
        fontFamily: '"JetBrains Mono", ui-monospace, monospace',
      }}>{children}</button>
    );
  }
  return (
    <button onClick={onClick} style={{
      width: '100%', padding: '12px', background: 'transparent',
      border: 'none', color: RT.muted,
      fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase',
      fontFamily: '"JetBrains Mono", ui-monospace, monospace',
      cursor: 'pointer',
    }}>{children}</button>
  );
}

// ── Landing ──────────────────────────────────────────────────────
function RT_Landing() {
  return (
    <PhoneFrame bg={RT.bg} statusColor={RT.cream}>
      <RTBody pad="40px 28px 28px">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10 }}>
          <div style={{ width: 14, height: 1, background: RT.gold }}/>
          <RTMono>Daily Fuel</RTMono>
        </div>

        {/* Hero mark — big sun */}
        <div style={{ marginTop: 50, display: 'flex', justifyContent: 'center' }}>
          <RTMark kind="sun" size={140} color={RT.gold}/>
        </div>

        <div style={{ marginTop: 44 }}>
          <RTHeading size={38}>A small ritual, <em style={{ fontFamily: 'inherit', fontStyle: 'italic', color: RT.gold, fontWeight: 300 }}>daily</em>.</RTHeading>
          <p style={{ fontSize: 15, lineHeight: 1.65, color: RT.creamDim, margin: '20px 0 0', maxWidth: 300, fontFamily: 'Georgia, serif' }}>
            For the days food feels different. A companion for your GLP-1 journey — no tracking, no scores.
          </p>
        </div>

        {/* small footer marks */}
        <div style={{ marginTop: 22, display: 'flex', gap: 18, fontSize: 10, color: RT.muted, fontFamily: '"JetBrains Mono", monospace', letterSpacing: 1.2, textTransform: 'uppercase' }}>
          <span>· gentle</span>
          <span>· honest</span>
          <span>· yours</span>
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <RTButton>Begin</RTButton>
          <RTButton variant="ghost">Sign in</RTButton>
        </div>
      </RTBody>
    </PhoneFrame>
  );
}

// ── Goals ────────────────────────────────────────────────────────
function RT_Goals() {
  const options = [
    { id: 'gentle',   h: 'Gentle',   note: 'ease in',              g: '40g · 20g', active: false },
    { id: 'steady',   h: 'Steady',   note: 'a dependable rhythm',  g: '70g · 25g', active: true },
    { id: 'stronger', h: 'Stronger', note: 'when ready',           g: '90g · 30g', active: false },
  ];
  return (
    <PhoneFrame bg={RT.bg} statusColor={RT.cream}>
      <ProgressRitual step={1} title="intention"/>
      <RTBody pad="22px 28px 26px">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18, marginTop: 4 }}>
          <RTMark kind="horizon" size={42} color={RT.gold}/>
          <div style={{ flex: 1 }}>
            <RTHeading size={26}>Name your <em style={{ fontStyle: 'italic', color: RT.gold, fontWeight: 300 }}>intention</em>.</RTHeading>
          </div>
        </div>
        <RTSub>Not a target. A direction. Change your mind whenever.</RTSub>

        <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {options.map((o) => (
            <div key={o.id} style={{
              padding: '16px 18px',
              background: o.active ? RT.surfaceLift : RT.surface,
              border: o.active ? `1px solid ${RT.gold}` : `1px solid transparent`,
              display: 'flex', alignItems: 'center', gap: 14,
              position: 'relative',
            }}>
              {o.active && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, background: RT.gold }}/>}
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: '"Fraunces", serif', fontSize: 20, fontWeight: 300, color: o.active ? RT.gold : RT.cream, letterSpacing: -0.3, lineHeight: 1 }}>{o.h}</div>
                <div style={{ fontSize: 12, color: RT.muted, marginTop: 4, fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>{o.note}</div>
              </div>
              <div style={{ fontSize: 10, color: RT.muted, fontFamily: '"JetBrains Mono", monospace', letterSpacing: 1, textAlign: 'right' }}>
                {o.g}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 18, fontSize: 11, color: RT.muted, lineHeight: 1.6, fontFamily: 'Georgia, serif', fontStyle: 'italic', borderLeft: `1px solid ${RT.line}`, paddingLeft: 12 }}>
          Guidance, not prescription. Check with your clinician for what's right for you.
        </div>

        <div style={{ marginTop: 'auto', paddingTop: 18, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <RTButton>Continue</RTButton>
          <RTButton variant="ghost">Set exact numbers</RTButton>
        </div>
      </RTBody>
    </PhoneFrame>
  );
}

// ── Foods ────────────────────────────────────────────────────────
function RT_Foods() {
  const selected = new Set(['shake', 'yogurt', 'nuts', 'eggs', 'berries', 'hummus']);
  return (
    <PhoneFrame bg={RT.bg} statusColor={RT.cream}>
      <ProgressRitual step={2} title="go-tos"/>
      <RTBody pad="22px 28px 24px">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18, marginTop: 4 }}>
          <RTMark kind="bowl" size={42} color={RT.gold}/>
          <div style={{ flex: 1 }}>
            <RTHeading size={26}>What's always <em style={{ fontStyle: 'italic', color: RT.gold, fontWeight: 300 }}>in your corner</em>?</RTHeading>
          </div>
        </div>
        <RTSub>The things you reach for — even when nothing sounds good.</RTSub>

        <div style={{ marginTop: 22, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {GOTOS_SIMPLE.map((g) => {
            const on = selected.has(g.id);
            return (
              <div key={g.id} style={{
                padding: '8px 14px',
                fontSize: 13, fontFamily: 'Georgia, serif',
                background: on ? RT.gold : 'transparent',
                color: on ? RT.bg : RT.cream,
                border: on ? 'none' : `1px solid ${RT.line}`,
                letterSpacing: 0.2,
                fontWeight: on ? 500 : 400,
              }}>
                {g.label}
              </div>
            );
          })}
        </div>

        {/* poetic count */}
        <div style={{ marginTop: 22, padding: '14px 16px', background: RT.surface, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ fontFamily: '"Fraunces", serif', fontSize: 28, fontWeight: 300, color: RT.gold, lineHeight: 1, minWidth: 32 }}>6</div>
          <div style={{ fontSize: 12, color: RT.creamDim, lineHeight: 1.45, fontFamily: 'Georgia, serif' }}>
            in your corner. <i>A good beginning.</i>
          </div>
        </div>

        <div style={{ marginTop: 'auto', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <RTButton>Continue</RTButton>
          <RTButton variant="ghost">Skip for now</RTButton>
        </div>
      </RTBody>
    </PhoneFrame>
  );
}

// ── Dietary ──────────────────────────────────────────────────────
function RT_Dietary() {
  const on = new Set(['dairy', 'gluten']);
  return (
    <PhoneFrame bg={RT.bg} statusColor={RT.cream}>
      <ProgressRitual step={3} title="boundaries"/>
      <RTBody pad="22px 28px 24px">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18, marginTop: 4 }}>
          <RTMark kind="vessel" size={42} color={RT.gold}/>
          <div style={{ flex: 1 }}>
            <RTHeading size={26}>Your <em style={{ fontStyle: 'italic', color: RT.gold, fontWeight: 300 }}>boundaries</em>.</RTHeading>
          </div>
        </div>
        <RTSub>What to leave out. We'll never suggest these — quietly, without a fuss.</RTSub>

        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column' }}>
          {DIETARY_NEEDS.map((d, i) => {
            const sel = on.has(d.id);
            return (
              <div key={d.id} style={{
                padding: '14px 0',
                display: 'flex', alignItems: 'center', gap: 14,
                borderBottom: i === DIETARY_NEEDS.length - 1 ? 'none' : `1px solid ${RT.line}`,
              }}>
                <div style={{
                  width: 22, height: 22,
                  background: sel ? RT.gold : 'transparent',
                  border: sel ? 'none' : `1px solid ${RT.line}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {sel && <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke={RT.bg} strokeWidth="2.3" strokeLinecap="round"><path d="M2.5 6.5L5 9L9.5 3.5"/></svg>}
                </div>
                <div style={{ fontSize: 16, color: sel ? RT.gold : RT.cream, fontFamily: '"Fraunces", serif', fontWeight: 300, letterSpacing: -0.2, flex: 1 }}>{d.label}</div>
                <RTMono>{sel ? 'off' : ''}</RTMono>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 'auto', paddingTop: 18, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <RTButton>Continue</RTButton>
          <RTButton variant="ghost">None of these</RTButton>
        </div>
      </RTBody>
    </PhoneFrame>
  );
}

// ── Celebration ──────────────────────────────────────────────────
function RT_Celebration() {
  return (
    <PhoneFrame bg={RT.bg} statusColor={RT.cream}>
      <RTBody pad="30px 28px 28px">
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <RTMono>Day zero · 04.21.26</RTMono>
          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center' }}>
            <RTMark kind="sun" size={110} color={RT.gold}/>
          </div>
        </div>

        <div style={{ marginTop: 26, textAlign: 'center' }}>
          <RTHeading size={32}>Your ritual<br/>is <em style={{ fontStyle: 'italic', color: RT.gold, fontWeight: 300 }}>ready</em>.</RTHeading>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: RT.creamDim, margin: '18px auto 0', maxWidth: 280, fontFamily: 'Georgia, serif' }}>
            Greek yogurt, eggs, and a shake are in your corner. That's plenty to begin.
          </p>
        </div>

        {/* Tomorrow — close the gap seed */}
        <div style={{
          marginTop: 24, padding: '18px 20px',
          border: `1px solid ${RT.line}`,
          background: 'rgba(231,199,122,0.04)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
            <RTMono>Tomorrow</RTMono>
            <span style={{ fontSize: 10, color: RT.muted, fontFamily: '"JetBrains Mono", monospace', letterSpacing: 1 }}>preview</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <svg width="58" height="58" viewBox="0 0 58 58">
              <circle cx="29" cy="29" r="24" fill="none" stroke={RT.line} strokeWidth="2"/>
              <circle cx="29" cy="29" r="24" fill="none" stroke={RT.gold} strokeWidth="2"
                strokeDasharray={`${2 * Math.PI * 24 * 0.55} ${2 * Math.PI * 24}`}
                strokeLinecap="round" transform="rotate(-90 29 29)"/>
              <text x="29" y="33" textAnchor="middle" fontSize="12" fontWeight="400" fill={RT.gold} fontFamily="Fraunces, serif">55%</text>
            </svg>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: RT.cream, fontFamily: '"Fraunces", serif', fontWeight: 400, letterSpacing: -0.1 }}>Closing the gap.</div>
              <div style={{ fontSize: 11.5, color: RT.muted, marginTop: 4, lineHeight: 1.5, fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                A gentle nudge when you need one.
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 'auto', paddingTop: 24 }}>
          <RTButton>Begin the first day</RTButton>
        </div>
      </RTBody>
    </PhoneFrame>
  );
}

Object.assign(window, {
  RT_Landing, RT_Goals, RT_Foods, RT_Dietary, RT_Celebration,
});
