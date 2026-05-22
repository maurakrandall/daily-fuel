// Daily Fuel — Main router + sidebar + state
// Renders the phone in the viewport with a sidebar for jumping screens
// during usability testing. Persists profile/session in React state only.

const SCREEN_GROUPS = [
  { label: 'Auth', screens: [
    { id:'landing',  name:'Landing' },
    { id:'create',   name:'Create account' },
  ]},
  { label: 'Onboarding', screens: [
    { id:'onb-1',  name:'1 · Medical' },
    { id:'onb-1a', name:'1a · Privacy', isNew: true },
    { id:'onb-1b', name:'1b · Goals · Targets', isNew: true },
    { id:'onb-2',  name:'2 · Go-Tos' },
    { id:'onb-3',  name:'3 · Will / Won\u2019t Eat', isUpdated: true },
    { id:'onb-4',  name:'4 · Weight' },
    { id:'onb-5',  name:'5 · Shot day' },
    { id:'onb-6',  name:'6 · Supplements' },
    { id:'onb-7',  name:'7 · Check-in time' },
    { id:'onb-8',  name:'8 · You\u2019re set' },
  ]},
  { label: 'Daily app', screens: [
    { id:'state-selector', name:'A · State selector', star: true },
    { id:'state-a2',       name:'A2 · Go-Tos so far?', star: true, isNew: true },
    { id:'plan',           name:'B · Daily plan', star: true, isUpdated: true },
    { id:'celebration',    name:'C · Celebration', star: true },
    { id:'saved-plan',     name:'C2 · Saved plan', star: true },
    { id:'close-gap',      name:'D · Close the gap', isUpdated: true },
    { id:'end-of-day',       name:'G · End of day' },
    { id:'end-of-day-close', name:'H · Closing' },
  ]},
  { label: 'Secondary', screens: [
    { id:'my-foods', name:'E · My Foods', isUpdated: true },
    { id:'my-goals', name:'F · My Goals', isUpdated: true },
  ]},
];

const SCREEN_RENDERERS = {
  'landing':        (ctx) => <ScreenLanding {...ctx}/>,
  'create':         (ctx) => <ScreenCreate {...ctx}/>,
  'onb-1':          (ctx) => <ScreenMedical {...ctx}/>,
  'onb-1a':         (ctx) => <ScreenPrivacy {...ctx}/>,
  'onb-1b':         (ctx) => <ScreenTargets {...ctx}/>,
  'onb-2':          (ctx) => <ScreenGoTos {...ctx}/>,
  'onb-3':          (ctx) => <ScreenWillEat {...ctx}/>,
  'onb-4':          (ctx) => <ScreenWeight {...ctx}/>,
  'onb-5':          (ctx) => <ScreenShotDay {...ctx}/>,
  'onb-6':          (ctx) => <ScreenSupps {...ctx}/>,
  'onb-7':          (ctx) => <ScreenNotifTime {...ctx}/>,
  'onb-8':          (ctx) => <ScreenOnbCelebrate {...ctx}/>,
  'state-selector': (ctx) => <ScreenStateSelector {...ctx}/>,
  'state-a2':       (ctx) => <ScreenAnyGoTos {...ctx}/>,
  'plan':           (ctx) => <ScreenPlan {...ctx}/>,
  'celebration':    (ctx) => <ScreenCelebration {...ctx}/>,
  'saved-plan':     (ctx) => <ScreenSavedPlan {...ctx}/>,
  'close-gap':      (ctx) => <ScreenCloseGap {...ctx}/>,
  'end-of-day':       (ctx) => <ScreenEndOfDay {...ctx}/>,
  'end-of-day-close': (ctx) => <ScreenEndOfDayClose {...ctx}/>,
  'my-foods':       (ctx) => <ScreenMyFoods {...ctx}/>,
  'my-goals':       (ctx) => <ScreenMyGoals {...ctx}/>,
};

// Default state for a quick demo experience — pre-fills with a believable profile
const DEFAULT_PROFILE = {
  firstName: 'Maya',
  email: '',
  password: '',
  medicalAck: true,
  goTos: ['shake','eggsb','nuts','cheese','broth'],
  wontEat: ['lbeef','shrimp','wfish'],
  supps: ['Magnesium glycinate','Fiber gummies','B12'],
  shotDay: 'Wed',
  notifTime: '09:00',
  currentWeight: '184',
  goalWeight: '160',
  proteinTarget: 100,
  fiberTarget: 30,
};

// Today as YYYY-MM-DD in the user's local TZ — for midnight-reset logic.
function localDateKey(d = new Date()) {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function makeSession(state = 'good', profile = DEFAULT_PROFILE) {
  const plan = generatePlan({ state, profile, alreadyEaten: [] });
  return {
    state, plan, selected: [], saved: false, extraSelected: [],
    alreadyEaten: [], a2Skipped: false,
    planDate: localDateKey(),
    dayCompleted: false, dayMood: null, dayCompletedAt: null,
  };
}

function App() {
  const [screen, setScreen]   = React.useState('landing');
  const [profile, setProfile] = React.useState(DEFAULT_PROFILE);
  const [session, setSession] = React.useState(() => makeSession('good', DEFAULT_PROFILE));
  // Offset added to "today" for the prototype's Simulate-next-day affordance.
  // Real product reads from new Date() directly; this is test-only.
  const [dayOffset, setDayOffset] = React.useState(0);
  const [transitionKey, setTransitionKey] = React.useState(0);
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  // Midnight reset: if today's local date is different from the plan's date,
  // clear the session and route to the state selector. Date-based, not timer.
  const today = localDateKey(new Date(Date.now() + dayOffset * 86400000));
  React.useEffect(() => {
    if (session.planDate && session.planDate !== today) {
      setSession({ ...makeSession('good', profile), planDate: today });
      // Only route to state-selector if user is on a daily-app screen.
      // (Don't yank them out of onboarding / landing.)
      if (['state-a2','plan','celebration','saved-plan','close-gap','end-of-day','end-of-day-close'].includes(screen)) {
        setScreen('state-selector');
        setTransitionKey(k => k + 1);
      }
    }
  }, [today]);

  // Persist a tiny bit so refresh keeps you where you were during usability testing
  React.useEffect(() => {
    const saved = (() => {
      try { return JSON.parse(localStorage.getItem('df-state') || 'null'); }
      catch { return null; }
    })();
    if (saved && saved.screen && SCREEN_RENDERERS[saved.screen]) {
      setScreen(saved.screen);
    }
  }, []);
  React.useEffect(() => {
    try { localStorage.setItem('df-state', JSON.stringify({ screen })); } catch {}
  }, [screen]);

  const nav = {
    go: (id) => {
      if (!SCREEN_RENDERERS[id]) return;
      setScreen(id);
      setTransitionKey(k => k + 1);
    },
  };

  const ctx = { profile, setProfile, session, setSession, nav };

  // Reset everything (handy for fresh demo)
  const reset = () => {
    const p = { ...DEFAULT_PROFILE };
    setProfile(p);
    setSession(makeSession('good', p));
    setDayOffset(0);
    setScreen('landing');
  };

  return (
    <div style={{
      height:'100vh', width:'100vw', display:'flex',
      background:'#1a1815', overflow:'hidden',
      fontFamily: DF_FONT.body, color: DF.cream,
    }}>
      {/* SIDEBAR — for usability testing nav */}
      {sidebarOpen && (
        <aside style={{
          width: 280, flexShrink: 0,
          background:'#15130F', borderRight:'1px solid #2a2724',
          padding:'24px 16px', overflowY:'auto',
          display:'flex', flexDirection:'column', gap: 4,
        }}>
          {/* logo */}
          <div style={{ padding: '0 8px 22px', display:'flex', alignItems:'center', gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 14, background: `radial-gradient(circle at 30% 30%, ${DF.goldGlow}, ${DF.gold} 60%, ${DF.goldDeep})` }}/>
            <div>
              <div style={{ fontFamily: DF_FONT.display, fontWeight: 400, fontSize: 19, letterSpacing: -0.3, color: DF.cream }}>Daily Fuel</div>
              <div style={{ fontSize: 10, letterSpacing: 1.8, textTransform:'uppercase', color: DF.mutedSoft, opacity: 0.7, marginTop: 2 }}>v3 · Close the Gap</div>
            </div>
          </div>

          {SCREEN_GROUPS.map(group => (
            <div key={group.label} style={{ marginBottom: 14 }}>
              <div style={{
                fontSize: 10, letterSpacing: 2, textTransform:'uppercase',
                color: DF.mutedSoft, fontWeight: 700, padding:'0 10px 6px',
                opacity: 0.55,
              }}>{group.label}</div>
              {group.screens.map(s => {
                const active = screen === s.id;
                return (
                  <button key={s.id} onClick={() => nav.go(s.id)} style={{
                    width:'100%', padding:'9px 12px', borderRadius: 8,
                    background: active ? 'rgba(212,175,55,0.14)' : 'transparent',
                    color: active ? DF.goldGlow : DF.mutedSoft,
                    border:'none', cursor:'pointer',
                    fontFamily: DF_FONT.body, fontSize: 13.5,
                    textAlign:'left', display:'flex', alignItems:'center', gap: 8,
                    transition:'all 0.15s ease',
                    fontWeight: active ? 600 : 400,
                  }}
                  onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                  onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                  >
                    {s.star && <span style={{ width: 4, height: 4, borderRadius: 2, background: DF.gold, flexShrink: 0 }}/>}
                    {!s.star && <span style={{ width: 4 }}/>}
                    <span style={{ flex:1 }}>{s.name}</span>
                    {s.isNew && (
                      <span style={{
                        fontSize: 8.5, letterSpacing: 0.6, fontWeight: 700,
                        padding:'2px 6px', borderRadius: 999,
                        background: 'rgba(212,175,55,0.18)', color: DF.goldGlow,
                        border: `1px solid rgba(212,175,55,0.5)`, flexShrink: 0,
                      }}>NEW</span>
                    )}
                    {!s.isNew && s.isUpdated && (
                      <span style={{
                        fontSize: 8.5, letterSpacing: 0.6, fontWeight: 700,
                        padding:'2px 6px', borderRadius: 999,
                        background: 'transparent', color: DF.mutedSoft,
                        border: `1px solid rgba(183,171,151,0.4)`, flexShrink: 0,
                      }}>v3</span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}

          <div style={{ marginTop: 'auto', padding: '14px 8px 0', borderTop: '1px solid #2a2724', display:'flex', flexDirection:'column', gap: 8 }}>
            <button onClick={() => setDayOffset(o => o + 1)} style={{
              width:'100%', padding:'8px 10px', background:'transparent',
              border:`1px solid ${DF.goldDeep}`, borderRadius: 8, cursor:'pointer',
              color: DF.goldGlow, fontFamily: DF_FONT.body, fontSize: 12,
              display:'flex', alignItems:'center', justifyContent:'center', gap: 6,
            }}>
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M2 5.5h7M6 2.5l3 3-3 3"/></svg>
              Simulate next day{dayOffset > 0 ? ' (+' + dayOffset + ')' : ''}
            </button>
            <button onClick={reset} style={{
              width:'100%', padding:'8px 10px', background:'transparent',
              border:'1px solid #2a2724', borderRadius: 8, cursor:'pointer',
              color: DF.mutedSoft, fontFamily: DF_FONT.body, fontSize: 12,
            }}>Reset prototype</button>
            <div style={{ fontSize: 10, color: DF.mutedSoft, opacity: 0.5, marginTop: 4, lineHeight: 1.5, padding: '0 4px' }}>
              <span style={{ width: 4, height: 4, borderRadius: 2, background: DF.gold, display:'inline-block', marginRight: 6, marginBottom: 1 }}/>
              Priority screens per the brief
            </div>
          </div>
        </aside>
      )}

      {/* STAGE */}
      <main style={{
        flex:1, display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center',
        position:'relative', overflow:'hidden',
        padding: '20px',
        background: 'radial-gradient(circle at 40% 30%, #2a2520, #1a1815 70%)',
      }}>
        {/* sidebar toggle */}
        <button onClick={() => setSidebarOpen(o => !o)} style={{
          position:'absolute', top: 20, left: 20, zIndex: 100,
          width: 36, height: 36, borderRadius: 8,
          background:'rgba(20,18,15,0.7)', border:'1px solid #2a2724',
          cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
          color: DF.mutedSoft,
        }}>
          <svg width="14" height="12" viewBox="0 0 14 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M1 1h12M1 6h12M1 11h12"/></svg>
        </button>

        {/* breadcrumb */}
        <div style={{
          position:'absolute', top: 26, left: '50%', transform:'translateX(-50%)',
          fontSize: 11, color: DF.mutedSoft, opacity: 0.6, letterSpacing: 1.4,
          textTransform:'uppercase', fontWeight: 600,
        }}>
          {(() => {
            for (const g of SCREEN_GROUPS) {
              const s = g.screens.find(x => x.id === screen);
              if (s) return <>{g.label} <span style={{ opacity: 0.4, margin: '0 6px' }}>·</span> {s.name}</>;
            }
            return screen;
          })()}
        </div>

        {/* phone stage */}
        <div style={{
          width: DF_PHONE_W,
          height: DF_PHONE_H,
          position:'relative',
          borderRadius: 44,
          boxShadow: '0 30px 80px rgba(0,0,0,0.4), 0 0 0 14px #0a0907, 0 0 0 15px #38322a',
        }}>
          <div key={transitionKey} style={{
            width:'100%', height:'100%', borderRadius: 44, overflow:'hidden',
          }}>
            {SCREEN_RENDERERS[screen] ? SCREEN_RENDERERS[screen](ctx) : <div>404: {screen}</div>}
          </div>
        </div>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
