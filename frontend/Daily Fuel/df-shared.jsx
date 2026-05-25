// Daily Fuel v2 — shared foundation
// Palette, fonts, food data, phone frame, primitives.

// ── PALETTE ────────────────────────────────────────────────────────
// Locked: cream, navy, gold. No red, orange, warning colors.
// Time-of-day variants for state-responsive atmosphere.
const DF = {
  // Canvas
  cream:      '#FDFBF7',
  creamWarm:  '#F8F0DE',  // morning light bleed
  creamDeep:  '#F0E6CF',  // golden hour bleed
  creamDawn:  '#EDE6DB',  // pre-dawn quiet
  creamHush:  '#F4EFE5',  // not hungry, soft overcast

  // Ink
  navy:       '#0A192F',  // grounding, primary action
  navyMid:    '#1B2A4A',
  navyMute:   '#46506A',  // body type
  navyDawn:   '#2D3A55',  // rough-day text — softer contrast

  ink:        '#2A2517',  // warm dark, alternative ink for editorial body

  // Gold — for celebration, positive moments only
  gold:       '#D4AF37',
  goldDeep:   '#A8841C',
  goldSoft:   '#F0D896',
  goldGlow:   '#FBE9B3',

  // Muted
  muted:      '#8A7E6E',
  mutedSoft:  '#B7AB97',
  line:       'rgba(10,25,47,0.10)',
  lineSoft:   'rgba(10,25,47,0.06)',
};

// ── TYPOGRAPHY ─────────────────────────────────────────────────────
const DF_FONT = {
  display: '"Fraunces", "Cormorant Garamond", Georgia, serif',
  body:    '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  mono:    '"JetBrains Mono", ui-monospace, monospace',
};

// ── PHONE GEOMETRY ─────────────────────────────────────────────────
const DF_PHONE_W = 390;
const DF_PHONE_H = 844;

// ── FOOD DATA ─────────────────────────────────────────────────────
// Approximate USDA values. All numbers are ~ in UI. Per spec.

const FOOD_GOTOS = [
  { id:'shake',    name:'Protein shake',     p:30, f:0,  role:'protein', effort:'grab',    serving:'1 bottle' },
  { id:'bar',      name:'Protein bar',       p:20, f:3,  role:'both',    effort:'grab',    serving:'1 bar' },
  { id:'powder',   name:'Protein powder',    p:25, f:0,  role:'protein', effort:'minimal', serving:'1 scoop' },
  { id:'eggsb',    name:'Hard-boiled eggs',  p:6,  f:0,  role:'protein', effort:'grab',    serving:'1 egg' },
  { id:'nuts',     name:'Mixed nuts',        p:6,  f:3,  role:'both',    effort:'grab',    serving:'\u00bc cup' },
  { id:'jerky',    name:'Beef or turkey jerky', p:11, f:0, role:'protein', effort:'grab',  serving:'1 oz' },
  { id:'broth',    name:'Bone broth',        p:10, f:0,  role:'protein', effort:'grab',    serving:'1 cup' },
  { id:'cheese',   name:'String cheese',     p:7,  f:0,  role:'protein', effort:'grab',    serving:'1 stick' },
];

const FOOD_PRIMARY = [
  { id:'chicken',  name:'Chicken',           p:26, f:0,  role:'protein', effort:'cook',    serving:'3 oz' },
  { id:'turkey',   name:'Turkey',            p:25, f:0,  role:'protein', effort:'cook',    serving:'3 oz' },
  { id:'lbeef',    name:'Lean beef',         p:22, f:0,  role:'protein', effort:'cook',    serving:'3 oz' },
  { id:'salmon',   name:'Salmon',            p:22, f:0,  role:'protein', effort:'cook',    serving:'3 oz' },
  { id:'tuna',     name:'Canned tuna',       p:20, f:0,  role:'protein', effort:'grab',    serving:'1 can' },
  { id:'shrimp',   name:'Shrimp',            p:20, f:0,  role:'protein', effort:'minimal', serving:'3 oz' },
  { id:'wfish',    name:'White fish',        p:21, f:0,  role:'protein', effort:'cook',    serving:'3 oz' },
  { id:'eggs',     name:'Eggs',              p:6,  f:0,  role:'protein', effort:'minimal', serving:'1 egg' },
  { id:'gyogurt',  name:'Greek yogurt',      p:15, f:0,  role:'protein', effort:'grab',    serving:'\u00be cup' },
  { id:'cottage',  name:'Cottage cheese',    p:14, f:0,  role:'protein', effort:'grab',    serving:'\u00bd cup' },
  { id:'cheeses',  name:'Cheese snacks',     p:7,  f:0,  role:'protein', effort:'grab',    serving:'1 oz' },
  { id:'smoothie', name:'Protein smoothie',  p:22, f:3,  role:'both',    effort:'minimal', serving:'1 glass' },
  { id:'oats',     name:'Protein overnight oats', p:18, f:4, role:'both', effort:'minimal', serving:'1 jar' },
];

const FOOD_DOUBLES = [
  { id:'edamame',  name:'Edamame',           p:9,  f:4,  role:'both',    effort:'minimal', serving:'\u00bd cup' },
  { id:'beans',    name:'Beans',             p:7,  f:6,  role:'both',    effort:'minimal', serving:'\u00bd cup' },
  { id:'lentils',  name:'Lentils',           p:9,  f:8,  role:'both',    effort:'cook',    serving:'\u00bd cup' },
  { id:'tofu',     name:'Tofu',              p:10, f:2,  role:'both',    effort:'cook',    serving:'\u00bd block' },
  { id:'hummus',   name:'Hummus',            p:5,  f:4,  role:'both',    effort:'grab',    serving:'\u00bc cup' },
];

const FOOD_NUTS_SEEDS = [
  { id:'almonds',   name:'Almonds',          p:6, f:3, role:'both',  effort:'grab', serving:'\u00bc cup' },
  { id:'pistachios',name:'Pistachios',       p:6, f:3, role:'both',  effort:'grab', serving:'\u00bc cup' },
  { id:'peanuts',   name:'Peanuts',          p:7, f:2, role:'both',  effort:'grab', serving:'\u00bc cup' },
  { id:'cashews',   name:'Cashews',          p:5, f:1, role:'protein',effort:'grab', serving:'\u00bc cup' },
  { id:'hazelnuts', name:'Hazelnuts',        p:4, f:3, role:'fiber', effort:'grab', serving:'\u00bc cup' },
  { id:'macadamia', name:'Macadamia nuts',   p:2, f:2, role:'fiber', effort:'grab', serving:'\u00bc cup' },
  { id:'hemp',      name:'Hemp seeds',       p:9, f:1, role:'protein',effort:'grab', serving:'3 Tbsp' },
  { id:'pumpkin',   name:'Pumpkin seeds',    p:8, f:1, role:'both',  effort:'grab', serving:'\u00bc cup' },
  { id:'chia',      name:'Chia seeds',       p:4, f:10,role:'both',  effort:'grab', serving:'2 Tbsp' },
  { id:'flax',      name:'Flaxseeds',        p:2, f:3, role:'fiber', effort:'grab', serving:'1 Tbsp' },
  { id:'sunflower', name:'Sunflower seeds',  p:6, f:2, role:'both',  effort:'grab', serving:'\u00bc cup' },
  { id:'walnuts',   name:'Walnuts',          p:4, f:2, role:'both',  effort:'grab', serving:'\u00bc cup' },
];

const FOOD_VEG_FRUIT = [
  { id:'broccoli', name:'Broccoli',          p:2, f:3, role:'fiber', effort:'minimal', serving:'1 cup' },
  { id:'brussels', name:'Brussels sprouts',  p:3, f:4, role:'fiber', effort:'cook',    serving:'1 cup' },
  { id:'greens',   name:'Leafy greens',      p:1, f:2, role:'fiber', effort:'grab',    serving:'2 cups' },
  { id:'carrots',  name:'Carrots',           p:1, f:3, role:'fiber', effort:'grab',    serving:'1 cup' },
  { id:'sweetpotato', name:'Sweet potato',   p:2, f:4, role:'fiber', effort:'cook',    serving:'1 medium' },
  { id:'avocado',  name:'Avocado',           p:2, f:5, role:'fiber', effort:'grab',    serving:'\u00bd avocado' },
  { id:'berries',  name:'Berries',           p:1, f:4, role:'fiber', effort:'grab',    serving:'1 cup' },
  { id:'apples',   name:'Apples',            p:0, f:4, role:'fiber', effort:'grab',    serving:'1 medium' },
  { id:'pears',    name:'Pears',             p:1, f:5, role:'fiber', effort:'grab',    serving:'1 medium' },
  { id:'guava',    name:'Guava',             p:3, f:7, role:'both',  effort:'grab',    serving:'1 cup' },
  { id:'prunes',   name:'Prunes',            p:1, f:3, role:'fiber', effort:'grab',    serving:'5 prunes' },
  { id:'banana',   name:'Banana',            p:1, f:3, role:'fiber', effort:'grab',    serving:'1 medium' },
  { id:'orange',   name:'Orange',            p:1, f:3, role:'fiber', effort:'grab',    serving:'1 medium' },
];

const FOOD_SUPPORT = [
  { id:'toast',    name:'Toast',             p:3, f:2, role:'none', effort:'minimal', serving:'1 slice' },
  { id:'crackers', name:'Crackers',          p:2, f:1, role:'none', effort:'grab',    serving:'5 crackers' },
  { id:'soup',     name:'Soup',              p:5, f:2, role:'none', effort:'grab',    serving:'1 cup' },
];

// Category labels — renamed in v3 (CP copy pass): warmer, more inviting.
const FOOD_GROUPS = [
  { id:'gotos',   label:'Go-Tos',           note:'Grab-and-go staples', items: FOOD_GOTOS },
  { id:'primary', label:'Protein Boosters', note:null, items: FOOD_PRIMARY },
  { id:'doubles', label:'Double Wins',      note:'Protein + fiber, together', items: FOOD_DOUBLES },
  { id:'nuts',    label:'Crunchy Staples',  note:null, items: FOOD_NUTS_SEEDS },
  { id:'vegfruit',label:'Fresh Add-Ons',    note:null, items: FOOD_VEG_FRUIT },
  { id:'support', label:'Gentle Helpers',   note:null, items: FOOD_SUPPORT },
];

const ALL_FOODS_BY_ID = {};
[...FOOD_GOTOS, ...FOOD_PRIMARY, ...FOOD_DOUBLES, ...FOOD_NUTS_SEEDS, ...FOOD_VEG_FRUIT, ...FOOD_SUPPORT]
  .forEach(f => { ALL_FOODS_BY_ID[f.id] = f; });

// Benefit labels — used on plan cards (CP v3 copy pass, locked)
// Line 1 on the new two-line card. Warm, human, never clinical.
const BENEFIT_LABELS = {
  shake:    'Reliable protein, easy to sip',
  bar:      'Pocket-friendly protein + fiber',
  powder:   'Stir into anything',
  eggsb:    'Quick protein, zero decisions',
  nuts:     'Small handful, steady fuel',
  jerky:    'No-fuss protein anywhere',
  broth:    'Warm, easy protein support',
  cheese:   'Five-second protein',
  chicken:  'Versatile, satisfying protein',
  turkey:   'Lean and easy on the stomach',
  lbeef:    'Iron-rich, deeply satisfying',
  salmon:   'Protein with omega-3',
  tuna:     'Pantry-shelf protein',
  shrimp:   'Quick-cook, easy protein',
  wfish:    'Light, gentle protein',
  eggs:     'Always doable',
  gyogurt:  'Easy protein that actually feels like food',
  cottage:  'Quiet, dense protein',
  cheeses:  'Bite-sized protein',
  smoothie: 'Liquid wins',
  oats:     'Set-and-forget breakfast',
  edamame:  'Protein + fiber in one move',
  beans:    'Hearty doubles in one bowl',
  lentils:  'Comfort food, doubled up',
  tofu:     'Mild, versatile doubles',
  hummus:   'Dip-and-go doubles',
  almonds:  'Crunch with a fiber bonus',
  pistachios:'Slow snack, easy fiber',
  peanuts:  'Familiar, satisfying',
  cashews:  'Buttery, easy protein',
  hazelnuts:'Quiet fiber boost',
  macadamia:'Indulgent and gentle',
  hemp:     'Sprinkle anywhere protein',
  pumpkin:  'Tiny seeds, real protein',
  chia:     'Fiber powerhouse',
  flax:     'Stir-in fiber',
  sunflower:'Crunchy and steady',
  walnuts:  'Brain-friendly fats',
  broccoli: 'Reliable fiber',
  brussels: 'Roasted and satisfying',
  greens:   'Easy fiber base',
  carrots:  'Sweet, crunchy fiber',
  sweetpotato:'Warm, filling fiber',
  avocado:  'Creamy fiber, ready to go',
  berries:  'Bright fiber, naturally sweet',
  apples:   'Pocket-sized fiber',
  pears:    'Soft, gentle fiber',
  guava:    'Hidden fiber star',
  prunes:   'Gut-friendly classic',
  banana:   'Quick energy stabilizer',
  orange:   'Bright, easy fiber',
  toast:    'Settling and familiar',
  crackers: 'Easy on a tough day',
  soup:     'Warm comfort, sippable',
};
const benefitLabel = (id) => BENEFIT_LABELS[id] || 'Easy win';

// Serving context — line 2 on the new card. Quieter than benefit.
const servingContext = (food) => {
  if (!food) return '';
  const parts = [];
  if (food.p > 0) parts.push(`~${food.p}g protein`);
  if (food.f > 0) parts.push(`~${food.f}g fiber`);
  if (food.serving) parts.push(food.serving);
  return parts.join(' \u00b7 ');
};

// ── SUPPLEMENTS ────────────────────────────────────────────────────
const SUPPS_T1 = ['Fiber supplement','Fiber gummies','Magnesium glycinate','Magnesium citrate','Probiotics','B12'];
const SUPPS_T2 = ['Omega-3 / fish oil','Vitamin D + Calcium','Multivitamin','Ginger (for nausea)'];

// ── STATE COPY ─────────────────────────────────────────────────────
// CP v3 copy pass — all daily-plan headers now use closing-the-gap language.
const STATE_META = {
  good:   { label:'Feeling good',  icon:'sun',   header:"Good day to close the gap.",          body:"Here's what could work." },
  cloudy: { label:'Not hungry',    icon:'cloud', header:"Even a little can help close the gap.", body:"Here's what could work." },
  rough:  { label:'Rough day',     icon:'rain',  header:"Rough day or not, small wins still count.", body:"Here are a few easy wins." },
};

// A2 · check-in copy — three state versions per brief.
const A2_COPY = {
  good:   { header:'Any go-tos so far today?',                 sub:'Even something small counts toward today.' },
  cloudy: { header:'Even a shake or coffee counts. Anything so far?', sub:"Sometimes autopilot does more than we think." },
  rough:  { header:'Anything today? Even the small stuff counts.', sub:"We'll build from wherever today started." },
};

// ── PRIMITIVES ─────────────────────────────────────────────────────

// Phone frame — iOS-style status bar + body
function PhoneShell({ bg = DF.cream, children, statusColor = DF.navy, home = true }) {
  return (
    <div style={{
      width: DF_PHONE_W, height: DF_PHONE_H,
      background: bg,
      position: 'relative', overflow: 'hidden',
      fontFamily: DF_FONT.body,
      color: DF.navy,
      borderRadius: 44,
    }}>
      {/* status bar */}
      <div style={{
        position:'absolute', top:0, left:0, right:0,
        height: 52, padding: '14px 32px 0',
        display:'flex', alignItems:'center', justifyContent:'space-between',
        color: statusColor, fontSize: 15, fontWeight: 600,
        letterSpacing: 0.2, zIndex: 50,
      }}>
        <span style={{ fontVariantNumeric: 'tabular-nums', fontFamily: DF_FONT.body }}>9:41</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor"><rect x="0" y="7.5" width="3" height="3.5" rx="0.5"/><rect x="4.5" y="5" width="3" height="6" rx="0.5"/><rect x="9" y="2.5" width="3" height="8.5" rx="0.5"/><rect x="13.5" y="0" width="3" height="11" rx="0.5"/></svg>
          <svg width="15" height="11" viewBox="0 0 15 11" fill="currentColor"><path d="M7.5 0C4.9 0 2.4 1 .4 2.7l1.3 1.3A8.8 8.8 0 0 1 7.5 1.8c2.2 0 4.2.9 5.8 2.2l1.3-1.3A11.1 11.1 0 0 0 7.5 0zm0 3.5A6.7 6.7 0 0 0 2.9 5.4l1.3 1.3A4.8 4.8 0 0 1 7.5 5.4c1.3 0 2.5.5 3.3 1.3l1.3-1.3A6.7 6.7 0 0 0 7.5 3.5zm0 3.3a3 3 0 0 0-2.1 1l2.1 2.1 2.1-2.1a3 3 0 0 0-2.1-1z"/></svg>
          <svg width="25" height="11" viewBox="0 0 25 11" fill="none"><rect x="0.5" y="0.5" width="20" height="10" rx="2.5" stroke="currentColor" strokeWidth="1" opacity="0.4"/><rect x="2" y="2" width="17" height="7" rx="1.5" fill="currentColor"/><rect x="21.5" y="3.5" width="2" height="4" rx="0.5" fill="currentColor" opacity="0.4"/></svg>
        </div>
      </div>

      {/* body */}
      <div style={{ position:'absolute', inset:0, paddingTop: 52, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        {children}
      </div>

      {/* home indicator */}
      {home && <div style={{
        position:'absolute', bottom: 8, left:'50%', transform:'translateX(-50%)',
        width: 134, height: 5, borderRadius: 3, background: statusColor === DF.cream ? 'rgba(253,251,247,0.7)' : 'rgba(10,25,47,0.4)',
        zIndex: 50,
      }}/>}
    </div>
  );
}

// Editorial heading — Fraunces, fluid size, optional italicized word
function H({ children, size = 32, color = DF.navy, weight = 300, italic = false, align = 'left' }) {
  return (
    <h1 style={{
      fontFamily: DF_FONT.display,
      fontSize: size, lineHeight: 1.06,
      fontWeight: weight, fontStyle: italic ? 'italic' : 'normal',
      color, letterSpacing: -0.5,
      margin: 0, textAlign: align,
      fontVariationSettings: '"opsz" 144, "SOFT" 60',
      textWrap: 'pretty',
    }}>{children}</h1>
  );
}

// Body paragraph
function P({ children, size = 15, color = DF.navyMute, lineHeight = 1.55, align = 'left' }) {
  return (
    <p style={{
      fontFamily: DF_FONT.body,
      fontSize: size, lineHeight, color,
      margin: 0, textAlign: align,
      letterSpacing: -0.05,
    }}>{children}</p>
  );
}

// Primary action button — navy
function Btn({ children, onClick, disabled, variant = 'primary', size = 'lg' }) {
  const sizes = {
    lg: { p: '18px 28px', fs: 15 },
    md: { p: '14px 22px', fs: 14 },
  }[size];
  const variants = {
    primary: { background: DF.navy, color: DF.cream, border: 'none' },
    ghost:   { background: 'transparent', color: DF.navyMute, border: 'none', textDecoration: 'underline', textDecorationThickness: 0.5, textUnderlineOffset: 4 },
    outline: { background: 'transparent', color: DF.navy, border: '1px solid ' + DF.navy },
    gold:    { background: DF.gold, color: DF.navy, border: 'none' },
  }[variant];
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: '100%', padding: sizes.p, fontSize: sizes.fs,
      borderRadius: 999, cursor: disabled ? 'not-allowed' : 'pointer',
      fontFamily: DF_FONT.body, fontWeight: 500, letterSpacing: 0.05,
      opacity: disabled ? 0.4 : 1,
      transition: 'transform 0.12s ease, opacity 0.2s ease',
      ...variants,
    }}
    onMouseDown={(e) => { if (!disabled) e.currentTarget.style.transform = 'scale(0.98)'; }}
    onMouseUp={(e) => { e.currentTarget.style.transform = ''; }}
    onMouseLeave={(e) => { e.currentTarget.style.transform = ''; }}
    >{children}</button>
  );
}

// Small eyebrow label
function Eyebrow({ children, color = DF.gold, mb = 12 }) {
  return <div style={{
    fontSize: 10, letterSpacing: 2.5, textTransform: 'uppercase',
    fontWeight: 700, color, marginBottom: mb,
    fontFamily: DF_FONT.body,
  }}>{children}</div>;
}

// Step indicator — line + index, used in onboarding
// v3: now 10 steps total (added Privacy at 1a + Goals targets at 1b → indices 2 + 3)
function Step({ n, total = 10 }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap: 10, marginBottom: 20 }}>
      <div style={{ display:'flex', gap: 3, flex: 1 }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 2, borderRadius: 1,
            background: i < n ? DF.gold : DF.lineSoft,
            transition: 'background 0.3s ease',
          }}/>
        ))}
      </div>
      <span style={{
        fontFamily: DF_FONT.body, fontSize: 11, color: DF.muted,
        fontVariantNumeric: 'tabular-nums', letterSpacing: 0.5,
      }}>{String(n).padStart(2,'0')} <span style={{opacity:.4}}>/</span> {String(total).padStart(2,'0')}</span>
    </div>
  );
}

Object.assign(window, {
  DF, DF_FONT, DF_PHONE_W, DF_PHONE_H,
  FOOD_GOTOS, FOOD_PRIMARY, FOOD_DOUBLES, FOOD_NUTS_SEEDS, FOOD_VEG_FRUIT, FOOD_SUPPORT,
  FOOD_GROUPS, ALL_FOODS_BY_ID, benefitLabel, servingContext,
  SUPPS_T1, SUPPS_T2, STATE_META, A2_COPY,
  PhoneShell, H, P, Btn, Eyebrow, Step,
});
