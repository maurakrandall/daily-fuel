// Daily Fuel — deck mounts
// Renders real React phone screens + card demos into deck slides.

const DECK_DEFAULT_PROFILE = {
  firstName: 'Maya',
  email: '', password: '',
  medicalAck: true,
  goTos: ['shake','eggsb','nuts','cheese','broth','bar'],
  wontEat: ['lbeef','shrimp','wfish'],
  supps: ['Magnesium glycinate','Fiber gummies','B12'],
  shotDay: 'Wed',
  notifTime: '09:00',
  currentWeight: '184',
  goalWeight: '160',
  proteinTarget: 100,
  fiberTarget: 30,
};

// One isolated phone with its own state.
function DeckPhone({ screen, state = 'good', eaten = [], selected = [], extra = [], search = '', yes = null }) {
  const [profile, setProfile] = React.useState({ ...DECK_DEFAULT_PROFILE });
  const [session, setSession] = React.useState(() => ({
    state, plan: [], selected: [...selected], extraSelected: [...extra],
    alreadyEaten: [...eaten], a2Skipped: false,
    planDate: '2026-05-21',
    dayCompleted: false, dayMood: null, dayCompletedAt: null,
  }));

  // For Plan screen, generate the plan from the chosen state, excluding eaten
  React.useEffect(() => {
    if (screen === 'plan') {
      const plan = generatePlan({ state, profile, alreadyEaten: eaten });
      setSession(s => ({ ...s, plan }));
    } else if (screen === 'close-gap') {
      // Pretend there's a saved plan so totals + horizon look real
      setSession(s => ({ ...s, selected: ['edamame','shake'] }));
    }
  }, []);

  // No-op nav — links go nowhere in the deck
  const nav = { go: () => {} };
  const ctx = { profile, setProfile, session, setSession, nav };

  if (screen === 'onb-1a')         return <ScreenPrivacy {...ctx}/>;
  if (screen === 'onb-1b')         return <ScreenTargets {...ctx} initialYes={yes}/>;
  if (screen === 'state-a2')       return <ScreenAnyGoTos {...ctx}/>;
  if (screen === 'plan')           return <ScreenPlan {...ctx}/>;
  if (screen === 'close-gap')      return <DeckCloseGap {...ctx} initialSearch={search}/>;
  if (screen === 'my-foods')       return <ScreenMyFoods {...ctx}/>;
  if (screen === 'my-goals')       return <ScreenMyGoals {...ctx}/>;
  if (screen === 'state-selector') return <ScreenStateSelector {...ctx}/>;

  return <div style={{padding:30, fontFamily: DF_FONT.body, color: DF.muted}}>Unknown screen: {screen}</div>;
}

// Pre-fills search after mount so the empty-state branch becomes a results branch
function DeckCloseGap({ initialSearch, ...props }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!initialSearch) return;
    const tick = setTimeout(() => {
      const root = ref.current;
      if (!root) return;
      const input = root.querySelector('input[type="text"]');
      if (!input) return;
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setter.call(input, initialSearch);
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }, 200);
    return () => clearTimeout(tick);
  }, [initialSearch]);
  return <div ref={ref} style={{ width:'100%', height:'100%' }}>
    <ScreenCloseGap {...props}/>
  </div>;
}

// A single food card demo, for the redesign comparison slide.
// kind = 'v2' | 'v3-default' | 'v3-inline'
function CardDemo({ kind = 'v3-default' }) {
  const food = { id:'eggsb', name:'Hard-boiled eggs', p:6, f:0, role:'protein', serving:'1 egg' };
  const tag = roleTag(food.role);

  if (kind === 'v2') {
    // Original single-benefit-line look (no serving context, values appear on select)
    return (
      <div style={{
        padding:'15px 18px', borderRadius: 16,
        background:'rgba(255,255,255,0.7)', border:`1px solid ${DF.line}`,
        fontFamily: DF_FONT.body,
      }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap: 12 }}>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily: DF_FONT.display, fontSize: 19, color: DF.navy, letterSpacing: -0.2, lineHeight: 1.15 }}>
              {food.name}
            </div>
            <div style={{ marginTop: 4, fontSize: 12.5, color: DF.navyMute, lineHeight: 1.4 }}>
              Grab-and-go protein
            </div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap: 6 }}>
            <span style={{
              fontSize: 10, padding:'3px 8px', borderRadius: 999,
              background: tag.bg, color: tag.fg, fontWeight: 600, letterSpacing: 0.4, textTransform:'uppercase',
            }}>Protein</span>
            <div style={{ width:22, height:22, borderRadius:11, border:`1.5px solid ${DF.line}` }}/>
          </div>
        </div>
      </div>
    );
  }

  if (kind === 'v3-inline') {
    // Inline data variant (rejected)
    return (
      <div style={{
        padding:'15px 18px', borderRadius: 16,
        background:'rgba(255,255,255,0.7)', border:`1px solid ${DF.line}`,
        fontFamily: DF_FONT.body,
      }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap: 12 }}>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily: DF_FONT.display, fontSize: 19, color: DF.navy, letterSpacing: -0.2, lineHeight: 1.15 }}>
              {food.name}
            </div>
            <div style={{ marginTop: 5, fontSize: 13, color: DF.navyMute, lineHeight: 1.35 }}>
              Quick protein, zero decisions <span style={{ color: DF.goldDeep, opacity: 0.78 }}>· ~6g · 1 egg</span>
            </div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap: 8 }}>
            <span style={{
              fontSize: 9.5, padding:'3px 8px', borderRadius: 999,
              background: tag.bg, color: tag.fg, fontWeight: 700, letterSpacing: 0.6,
            }}>PROTEIN</span>
            <div style={{ width:22, height:22, borderRadius:11, border:`1.5px solid ${DF.line}` }}/>
          </div>
        </div>
      </div>
    );
  }

  // default: v3 chosen
  return <FoodCard food={food} selected={false} onToggle={() => {}}/>;
}

Object.assign(window, { DeckPhone, CardDemo });

// ── Mount everything once the React DOM is ready ──────────────────
(function mountDeck() {
  function parseList(v) { return v ? v.split(',').map(s => s.trim()).filter(Boolean) : []; }

  const phones = document.querySelectorAll('.phone-mount');
  phones.forEach(el => {
    const screen = el.dataset.screen;
    if (!screen) return;
    const props = {
      screen,
      state:  el.dataset.state || 'good',
      eaten:    parseList(el.dataset.eaten),
      selected: parseList(el.dataset.selected),
      extra:    parseList(el.dataset.extra),
      search:   el.dataset.search || '',
      yes:      el.dataset.yes === 'true' ? true : (el.dataset.yes === 'false' ? false : null),
    };
    ReactDOM.createRoot(el).render(<DeckPhone {...props}/>);
  });

  const cards = document.querySelectorAll('[data-card-demo]');
  cards.forEach(el => {
    const kind = el.dataset.cardDemo;
    ReactDOM.createRoot(el).render(<CardDemo kind={kind}/>);
  });
})();
