// Shared primitives for all three Daily Fuel onboarding directions
// Phone frame, progress indicators, shared content data.

const PHONE_W = 390;
const PHONE_H = 780;

// ── Content shared across all 3 directions ──────────────────────────
// Five-stage flow: Landing → Goals → Food Preferences (Go-tos) → Dietary Needs → Celebration
// Data simplified from v1. Each direction renders differently.

const GOTOS_SIMPLE = [
  { id: 'shake',   label: 'Protein shake',    macro: 'p' },
  { id: 'eggs',    label: 'Hard-boiled eggs', macro: 'p' },
  { id: 'yogurt',  label: 'Greek yogurt',     macro: 'p' },
  { id: 'nuts',    label: 'Nuts',             macro: 'b' },
  { id: 'cheese',  label: 'String cheese',    macro: 'p' },
  { id: 'bar',     label: 'Protein bar',      macro: 'p' },
  { id: 'hummus',  label: 'Hummus',           macro: 'b' },
  { id: 'broth',   label: 'Bone broth',       macro: 'p' },
  { id: 'jerky',   label: 'Jerky',            macro: 'p' },
  { id: 'edamame', label: 'Edamame',          macro: 'b' },
  { id: 'berries', label: 'Berries',          macro: 'f' },
  { id: 'oats',    label: 'Overnight oats',   macro: 'p' },
];

const DIETARY_NEEDS = [
  { id: 'dairy',     label: 'Dairy-free' },
  { id: 'gluten',    label: 'Gluten-free' },
  { id: 'vegetarian',label: 'Vegetarian' },
  { id: 'vegan',     label: 'Vegan' },
  { id: 'nutfree',   label: 'Nut-free' },
  { id: 'lowfodmap', label: 'Low FODMAP' },
  { id: 'kosher',    label: 'Kosher' },
  { id: 'halal',     label: 'Halal' },
];

// ── Phone frame (minimal — we live inside a DCArtboard) ────────────
function PhoneFrame({ bg = '#FAF8F3', children, statusColor = '#1B2A4A' }) {
  return (
    <div style={{
      width: PHONE_W, height: PHONE_H, background: bg,
      position: 'relative', overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      color: '#1B2A4A',
    }}>
      {/* iOS-style status bar */}
      <div style={{
        height: 44, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        padding: '0 24px 6px', color: statusColor, fontSize: 14, fontWeight: 600,
        letterSpacing: 0.2, position: 'relative', zIndex: 20,
      }}>
        <span style={{ fontVariantNumeric: 'tabular-nums' }}>9:41</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          {/* signal */}
          <svg width="16" height="10" viewBox="0 0 16 10" fill="currentColor"><rect x="0" y="7" width="2.5" height="3" rx="0.5"/><rect x="3.5" y="5" width="2.5" height="5" rx="0.5"/><rect x="7" y="3" width="2.5" height="7" rx="0.5"/><rect x="10.5" y="0" width="2.5" height="10" rx="0.5"/></svg>
          {/* wifi */}
          <svg width="14" height="10" viewBox="0 0 14 10" fill="currentColor"><path d="M7 0C4.4 0 2 1 .3 2.6l1.2 1.2A7.5 7.5 0 0 1 7 1.7c2 0 3.9.8 5.5 2.1l1.2-1.2A9.8 9.8 0 0 0 7 0zm0 3.3A5.8 5.8 0 0 0 2.7 5l1.2 1.2A4.2 4.2 0 0 1 7 5c1.2 0 2.3.5 3.1 1.2L11.3 5A5.8 5.8 0 0 0 7 3.3zM7 6.5a2.5 2.5 0 0 0-1.9.9L7 9.2l1.9-1.8A2.5 2.5 0 0 0 7 6.5z"/></svg>
          {/* battery */}
          <svg width="22" height="10" viewBox="0 0 22 10" fill="none"><rect x="0.5" y="0.5" width="18" height="9" rx="2" stroke="currentColor" strokeWidth="1" opacity="0.4"/><rect x="2" y="2" width="15" height="6" rx="1" fill="currentColor"/><rect x="19" y="3" width="2" height="4" rx="0.5" fill="currentColor" opacity="0.4"/></svg>
        </div>
      </div>
      {children}
    </div>
  );
}

// ── Progress — three flavors, one per direction ─────────────────────

// 1) Golden Hour: thin gold rule + small step count
function ProgressGold({ step, total = 5, color = '#C8880A', track = 'rgba(0,0,0,0.08)' }) {
  const pct = (step / total) * 100;
  return (
    <div style={{ padding: '8px 32px 0', display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{ flex: 1, height: 1.5, background: track, position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: pct + '%', background: color, transition: 'width .35s ease' }} />
      </div>
      <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.14, textTransform: 'uppercase', color: '#9C8878', fontVariantNumeric: 'tabular-nums' }}>
        {String(step).padStart(2, '0')} <span style={{ opacity: .4 }}>/</span> {String(total).padStart(2, '0')}
      </div>
    </div>
  );
}

// 2) Soft Current: flowing dots with soft fill
function ProgressDots({ step, total = 5, activeColor = '#0F7F7F' }) {
  return (
    <div style={{ padding: '16px 32px 0', display: 'flex', gap: 6, alignItems: 'center' }}>
      {Array.from({ length: total }).map((_, i) => {
        const done = i < step;
        const cur = i === step - 1;
        return (
          <div key={i} style={{
            height: 4,
            flex: cur ? 3 : 1,
            borderRadius: 2,
            background: done ? activeColor : 'rgba(15,127,127,0.14)',
            transition: 'all .35s ease',
          }} />
        );
      })}
    </div>
  );
}

// 3) Ritual: index word + tiny dash row
function ProgressRitual({ step, total = 5, title }) {
  return (
    <div style={{ padding: '12px 28px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#D9CFB8', fontFamily: '"Fraunces", "IBM Plex Serif", Georgia, serif' }}>
      <span style={{ fontSize: 11, fontFamily: '"JetBrains Mono", ui-monospace, monospace', letterSpacing: 1.4, textTransform: 'uppercase', opacity: .6 }}>
        {String(step).padStart(2, '0')} · {title}
      </span>
      <div style={{ display: 'flex', gap: 3 }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{ width: i < step ? 14 : 8, height: 1.5, background: i < step ? '#E7C77A' : 'rgba(217,207,184,0.25)' }} />
        ))}
      </div>
    </div>
  );
}

Object.assign(window, {
  PHONE_W, PHONE_H,
  GOTOS_SIMPLE, DIETARY_NEEDS,
  PhoneFrame, ProgressGold, ProgressDots, ProgressRitual,
});
