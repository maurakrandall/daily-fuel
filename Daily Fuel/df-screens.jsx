// Daily Fuel — Main app screens
// State selector, daily plan, celebration, saved plan, close the gap, my foods/goals.
// The plan screen is the core product experience — tap-to-celebrate food cards.

// ── PLAN GENERATION ────────────────────────────────────────────────
// Rule-based per spec. Excludes won't-eat. Prioritizes doubles → protein → fiber.
function generatePlan({ state, profile, alreadyEaten = [] }) {
  const wontEat = new Set(profile.wontEat || []);
  const eaten   = new Set(alreadyEaten || []);
  const goTos = new Set(profile.goTos || []);

  const eligible = (group) => group.filter(f => !wontEat.has(f.id) && !eaten.has(f.id));

  // Pools
  const goTosFoods = eligible(FOOD_GOTOS).filter(f => goTos.has(f.id));
  const goTosFallback = eligible(FOOD_GOTOS); // if user picked none
  const doubles = eligible(FOOD_DOUBLES);
  const primary = eligible(FOOD_PRIMARY);
  const fiber = eligible(FOOD_VEG_FRUIT);
  const nutsSeeds = eligible(FOOD_NUTS_SEEDS);
  const support = eligible(FOOD_SUPPORT);

  let plan = [];

  if (state === 'rough') {
    // 3-4 items max, lowest effort, Go-Tos first, support eligible
    const goTosUsed = goTosFoods.length ? goTosFoods : goTosFallback;
    plan = [
      ...goTosUsed.filter(f => f.effort === 'grab').slice(0, 2),
      ...support.slice(0, 1),
      ...nutsSeeds.filter(f => f.effort === 'grab').slice(0, 1),
    ].slice(0, 4);
  } else if (state === 'cloudy') {
    // 4-5 items, easy/no-prep, lean doubles
    plan = [
      ...goTosFoods.slice(0, 2),
      ...doubles.filter(f => f.effort !== 'cook').slice(0, 1),
      ...nutsSeeds.filter(f => f.effort === 'grab').slice(0, 1),
      ...primary.filter(f => f.effort !== 'cook').slice(0, 1),
    ].slice(0, 5);
  } else {
    // 'good' — full pool, variety, 5-6 items
    plan = [
      ...doubles.slice(0, 2),
      ...goTosFoods.slice(0, 1),
      ...primary.slice(0, 1),
      ...fiber.slice(0, 1),
      ...nutsSeeds.slice(0, 1),
    ].slice(0, 6);
  }

  // de-dup
  const seen = new Set();
  return plan.filter(f => f && !seen.has(f.id) && seen.add(f.id));
}

// Hardcoded "close the gap" round-2 suggestions (per spec)
const GAP_ITEMS = ['gyogurt','eggsb','edamame','nuts','cheese','hummus','berries','avocado','banana','oats']
  .map(id => ALL_FOODS_BY_ID[id]).filter(Boolean);

// Role tag for a food — v3: uppercase, PROTEIN / FIBER / PROTEIN + FIBER
function roleTag(role) {
  const map = {
    protein: { label: 'PROTEIN',         bg: 'rgba(10,25,47,0.08)',  fg: DF.navy },
    fiber:   { label: 'FIBER',           bg: 'rgba(212,175,55,0.18)',fg: DF.goldDeep },
    both:    { label: 'PROTEIN + FIBER', bg: 'rgba(212,175,55,0.10)',fg: DF.goldDeep },
    none:    { label: 'EASY SUPPORT',    bg: 'rgba(10,25,47,0.05)',  fg: DF.muted },
  };
  return map[role] || map.none;
}

// ── A · STATE SELECTOR ─────────────────────────────────────────────
function ScreenStateSelector({ profile, session, setSession, nav }) {
  const choose = (state) => {
    // Plan is regenerated later (after A2) so it can exclude items already eaten.
    // Reset session for the new day.
    setSession({
      state, plan: [], selected: [], saved: false, extraSelected: [],
      alreadyEaten: [], a2Skipped: false,
    });
    setTimeout(() => nav.go('state-a2'), 280);
  };
  const states = [
    { id:'good',   label:'Feeling good', sub:'Food feels doable.',         icon:<MiniSun size={22}/>,    bg: DF.creamWarm,  ring: DF.gold },
    { id:'cloudy', label:'Not hungry',   sub:"I'm not eating much, but I'm okay.", icon:<MiniCloud size={22}/>, bg: DF.creamHush, ring: DF.mutedSoft },
    { id:'rough',  label:'Rough day',    sub:'Keep it simple.',            icon:<MiniMoon size={22}/>,   bg: DF.creamDawn, ring: DF.navyDawn },
  ];

  const firstName = profile.firstName || 'friend';

  return (
    <PhoneShell bg={DF.cream}>
      <Atmosphere tone="morning"/>
      <div style={{ flex:1, padding:'28px 32px 32px', position:'relative', zIndex:2, display:'flex', flexDirection:'column' }}>
        {/* gentle greeting */}
        <Eyebrow color={DF.goldDeep} mb={10}>Morning, {firstName}</Eyebrow>
        <H size={32}>How's food <em style={{ fontStyle:'italic', fontWeight:300 }}>feeling</em><br/>today?</H>

        <div style={{ marginTop: 28, display:'flex', flexDirection:'column', gap: 12 }}>
          {states.map((s) => (
            <button key={s.id} onClick={() => choose(s.id)} style={{
              padding: '22px 22px', borderRadius: 18, cursor:'pointer',
              background: s.bg, border: `1px solid ${DF.line}`,
              display:'flex', alignItems:'center', gap: 16,
              textAlign:'left', fontFamily: DF_FONT.body,
              transition: 'all 0.22s ease',
              position: 'relative', overflow: 'hidden',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = ''}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 24,
                background:'rgba(255,255,255,0.7)', border:`1px solid ${s.ring}`,
                display:'flex', alignItems:'center', justifyContent:'center',
                flexShrink: 0,
              }}>{s.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily: DF_FONT.display, fontWeight: 400, fontSize: 22, color: DF.navy, letterSpacing: -0.3, lineHeight: 1 }}>{s.label}</div>
                <div style={{ marginTop: 4, fontSize: 13, color: DF.navyMute }}>{s.sub}</div>
              </div>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={DF.muted} strokeWidth="1.5" strokeLinecap="round"><path d="M5 3l5 5-5 5"/></svg>
            </button>
          ))}
        </div>

        <div style={{ marginTop:'auto', textAlign:'center' }}>
          <P size={12} color={DF.muted}>No wrong answer. Whatever's true today.</P>
        </div>
      </div>
    </PhoneShell>
  );
}

// ── FOOD CARD — v3 two-line structure ──────────────────────────────
function FoodCard({ food, selected, onToggle, dim = false, variant = 'default' }) {
  const tag = roleTag(food.role);

  // variant lets us show a couple of layout options in the design canvas / deck.
  // 'default' is what the prototype uses; 'compact' and 'stacked' are explored
  // in the deck for the design system audit.
  return (
    <button onClick={onToggle} style={{
      width: '100%', textAlign:'left',
      padding: '15px 18px 16px',
      borderRadius: 16,
      background: selected ? '#FFFFFF' : 'rgba(255,255,255,0.7)',
      border: selected ? `1.5px solid ${DF.gold}` : `1px solid ${DF.line}`,
      cursor:'pointer', fontFamily: DF_FONT.body,
      transition: 'all 0.25s cubic-bezier(0.34, 1.2, 0.64, 1)',
      transform: selected ? 'translateY(-1px)' : 'translateY(0)',
      boxShadow: selected
        ? '0 8px 24px rgba(212,175,55,0.18), 0 2px 6px rgba(212,175,55,0.10)'
        : '0 1px 2px rgba(10,25,47,0.04)',
      opacity: dim ? 0.55 : 1,
      position:'relative', overflow:'hidden',
    }}>
      {/* gold halo on selection */}
      {selected && (
        <div style={{
          position:'absolute', top:-30, right:-30, width: 110, height: 110,
          background: `radial-gradient(circle, ${DF.goldSoft} 0%, transparent 70%)`,
          opacity: 0.55, pointerEvents:'none',
        }}/>
      )}

      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap: 12, position:'relative' }}>
        <div style={{ flex:1, minWidth: 0 }}>
          {/* food name — Fraunces display */}
          <div style={{
            fontFamily: DF_FONT.display, fontWeight: 400, fontSize: 19,
            color: DF.navy, letterSpacing: -0.2, lineHeight: 1.15,
          }}>
            {food.name}
          </div>

          {/* Line 1 — benefit label, warm + readable */}
          <div style={{
            marginTop: 5, fontSize: 13, color: DF.navyMute,
            lineHeight: 1.35, fontWeight: 400,
          }}>
            {benefitLabel(food.id)}
          </div>

          {/* Line 2 — serving context, quieter, muted gold */}
          <div style={{
            marginTop: 4, fontSize: 11.5, color: DF.goldDeep,
            lineHeight: 1.4, fontVariantNumeric:'tabular-nums',
            letterSpacing: 0.05, opacity: 0.78,
          }}>
            {servingContext(food)}
          </div>

          {/* On selection — celebratory echo, italicized display */}
          {selected && (
            <div style={{
              marginTop: 8, fontFamily: DF_FONT.display, fontStyle:'italic',
              fontSize: 13.5, color: DF.goldDeep, letterSpacing: -0.2,
              animation: 'df-fadeup 0.32s cubic-bezier(0.34, 1.2, 0.64, 1)',
            }}>
              In your corner.
            </div>
          )}
        </div>

        <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap: 8, flexShrink: 0 }}>
          <span style={{
            fontSize: 9.5, padding: '3px 8px', borderRadius: 999,
            background: tag.bg, color: tag.fg, fontWeight: 700, letterSpacing: 0.6,
            whiteSpace:'nowrap',
          }}>{tag.label}</span>
          {/* selection mark */}
          <div style={{
            width: 22, height: 22, borderRadius: 11,
            background: selected ? DF.gold : 'transparent',
            border: selected ? 'none' : `1.5px solid ${DF.line}`,
            display:'flex', alignItems:'center', justifyContent:'center',
            transition: 'all 0.2s ease',
          }}>
            {selected && <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke={DF.navy} strokeWidth="2.5" strokeLinecap="round"><path d="M2 6L5 9L10 3"/></svg>}
          </div>
        </div>
      </div>
    </button>
  );
}

// ── INLINE SEARCH BAR — pill-style, warm, low-chrome ──────────────
// Used in Close the Gap + My Foods. Matches the language of the food pills.
function SearchBar({ value, onChange, placeholder = 'Search...', onClear }) {
  return (
    <div style={{
      position:'relative',
      display:'flex', alignItems:'center', gap: 10,
      padding:'12px 18px',
      background:'rgba(255,255,255,0.7)',
      border:`1px solid ${DF.line}`,
      borderRadius: 999,
      transition:'all 0.18s ease',
    }}>
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke={DF.goldDeep} strokeWidth="1.6" strokeLinecap="round" style={{ flexShrink: 0, opacity: 0.7 }}>
        <circle cx="7" cy="7" r="5"/><path d="M11 11l3 3"/>
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          flex:1, border:'none', background:'transparent', outline:'none',
          fontFamily: DF_FONT.body, fontSize: 14, color: DF.navy,
          letterSpacing: -0.05,
        }}/>
      {value && (
        <button onClick={(e) => { e.preventDefault(); onClear ? onClear() : onChange(''); }} style={{
          background:'none', border:'none', padding: 2, cursor:'pointer',
          color: DF.muted, flexShrink: 0, lineHeight: 0,
        }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M3 3l6 6M9 3l-6 6"/>
          </svg>
        </button>
      )}
    </div>
  );
}

// Searches all foods by name (case-insensitive substring match)
function searchFoods(query, { excludeWontEat = null, excludeIds = null } = {}) {
  const q = (query || '').trim().toLowerCase();
  if (!q) return [];
  const exclude = excludeIds ? new Set(excludeIds) : new Set();
  const wont    = excludeWontEat ? new Set(excludeWontEat) : new Set();
  return Object.values(ALL_FOODS_BY_ID)
    .filter(f => !exclude.has(f.id) && !wont.has(f.id))
    .filter(f => f.name.toLowerCase().includes(q))
    .slice(0, 8);
}

// Total estimate from a list of selected food ids
function calcTotals(ids) {
  let p = 0, f = 0;
  ids.forEach(id => { const x = ALL_FOODS_BY_ID[id]; if (x) { p += x.p; f += x.f; }});
  return { p, f };
}

// ── A2 · ANY GO-TOS SO FAR? (NEW in v3) ────────────────────────────
// Bridges the state selector and the daily plan. The horizon begins here
// and carries forward through B → D as one visual system.
// A2 taps = "already eaten" — they boost totals but NOT the plan suggestions.
function ScreenAnyGoTos({ profile, session, setSession, nav }) {
  const goToIds = (profile.goTos || []);
  // If user has no Go-Tos, fall back to the first 4 grab foods so the screen still works
  const goToList = goToIds.length
    ? goToIds.map(id => ALL_FOODS_BY_ID[id]).filter(Boolean)
    : FOOD_GOTOS.filter(f => f.effort === 'grab').slice(0, 4);

  const eatenSet = new Set(session.alreadyEaten || []);
  const toggle = (id) => {
    const next = new Set(eatenSet);
    next.has(id) ? next.delete(id) : next.add(id);
    setSession({ ...session, alreadyEaten: [...next] });
  };

  const totals = calcTotals(session.alreadyEaten || []);
  const copy = A2_COPY[session.state] || A2_COPY.good;

  // Atmosphere from state selector carries through
  const atmosphere = session.state === 'rough' ? 'dawn'
                    : session.state === 'cloudy' ? 'overcast'
                    : 'golden';

  const continueToPlan = () => {
    // Build plan now, excluding what's already eaten
    const plan = generatePlan({
      state: session.state,
      profile,
      alreadyEaten: session.alreadyEaten || [],
    });
    setSession({ ...session, plan });
    nav.go('plan');
  };

  const skip = () => {
    const plan = generatePlan({ state: session.state, profile, alreadyEaten: [] });
    setSession({ ...session, alreadyEaten: [], a2Skipped: true, plan });
    nav.go('plan');
  };

  return (
    <PhoneShell bg={DF.cream}>
      <Atmosphere tone={atmosphere}/>
      <div style={{ flex:1, position:'relative', zIndex:2, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        {/* header */}
        <div style={{ padding:'18px 28px 10px' }}>
          <button onClick={() => nav.go('state-selector')} style={{
            background:'none', border:'none', padding:'4px 0', color: DF.muted,
            cursor:'pointer', fontFamily: DF_FONT.body, fontSize: 13, marginBottom: 10,
            display:'flex', alignItems:'center', gap: 4,
          }}>← Back</button>

          <Eyebrow color={DF.goldDeep} mb={8}>Checking in</Eyebrow>
          <H size={26} color={session.state === 'rough' ? DF.navyDawn : DF.navy}>
            {copy.header.split(' ').map((word, i, arr) => {
              // italicize "go-tos" / "today" naturally if present
              if (/^go-tos$/i.test(word.replace(/[?,.]/g, ''))) {
                return <em key={i} style={{ fontStyle:'italic', fontWeight:300 }}>{word}{i < arr.length - 1 ? ' ' : ''}</em>;
              }
              return <React.Fragment key={i}>{word}{i < arr.length - 1 ? ' ' : ''}</React.Fragment>;
            })}
          </H>
          <div style={{ marginTop: 8 }}>
            <P size={13.5}>{copy.sub}</P>
          </div>

          {/* horizon + running total — INTRODUCED HERE */}
          <div style={{ marginTop: 18 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 6 }}>
              <span style={{ fontSize: 10, letterSpacing: 1.8, textTransform:'uppercase', color: DF.muted, fontWeight: 700 }}>
                So far today
              </span>
              <span style={{
                fontFamily: DF_FONT.display, fontStyle:'italic', fontSize: 14.5,
                color: totals.p + totals.f > 0 ? DF.navy : DF.muted,
                transition:'color 0.4s ease',
              }}>
                ~{totals.p}g protein · ~{totals.f}g fiber
              </span>
            </div>
            <Horizon vitality={computeVitality(totals.p, totals.f, session.state)} width={326} height={60}/>
          </div>
        </div>

        {/* go-to cards */}
        <div style={{ flex:1, overflowY:'auto', padding:'8px 28px 8px' }}>
          <div style={{ display:'flex', flexDirection:'column', gap: 9 }}>
            {goToList.map(food => (
              <FoodCard
                key={food.id}
                food={food}
                selected={eatenSet.has(food.id)}
                onToggle={() => toggle(food.id)}
              />
            ))}
          </div>

          <div style={{ marginTop: 12, textAlign:'center' }}>
            <P size={11.5} color={DF.muted}>
              Tap anything you've already had — even a sip counts.
            </P>
          </div>
        </div>

        {/* sticky CTA */}
        <div style={{
          padding:'12px 28px 28px',
          borderTop:`1px solid ${DF.lineSoft}`,
          background:'rgba(253,251,247,0.92)', backdropFilter:'blur(8px)',
          display:'flex', flexDirection:'column', gap: 6,
        }}>
          <Btn onClick={continueToPlan}>Let's close the gap</Btn>
          <button onClick={skip} style={{
            background:'none', border:'none', padding:'10px',
            color: DF.muted, fontFamily: DF_FONT.body, fontSize: 13, cursor:'pointer',
            textDecoration:'underline', textDecorationThickness: 0.5, textUnderlineOffset: 4,
          }}>Skip — start fresh</button>
        </div>
      </div>
    </PhoneShell>
  );
}

// ── B · DAILY PLAN ─────────────────────────────────────────────────
function ScreenPlan({ profile, session, setSession, nav }) {
  const sel = new Set(session.selected || []);
  const toggle = (id) => {
    const next = new Set(sel);
    next.has(id) ? next.delete(id) : next.add(id);
    setSession({ ...session, selected: [...next] });
  };
  const alreadyEaten = session.alreadyEaten || [];
  // Totals carry forward A2 + current plan selections — one continuous gap bar
  const totals = calcTotals([...alreadyEaten, ...(session.selected || [])]);
  const meta = STATE_META[session.state];
  const earlyTotals = calcTotals(alreadyEaten);

  return (
    <PhoneShell bg={DF.cream}>
      <Atmosphere tone={session.state === 'rough' ? 'dawn' : session.state === 'cloudy' ? 'overcast' : 'morning'}/>
      <div style={{ flex:1, position:'relative', zIndex:2, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        {/* header */}
        <div style={{ padding:'18px 28px 14px' }}>
          <button onClick={() => nav.go('state-a2')} style={{
            background:'none', border:'none', padding: '4px 0',
            color: DF.muted, cursor:'pointer', fontFamily: DF_FONT.body,
            fontSize: 13, marginBottom: 14, display:'flex', alignItems:'center', gap: 4,
          }}>← Back</button>

          <H size={26} color={session.state === 'rough' ? DF.navyDawn : DF.navy}>
            {meta.header}
          </H>
          <div style={{ marginTop: 6 }}>
            <P size={14}>{meta.body}</P>
          </div>

          {/* horizon — continuous gap bar from A2; always visible */}
          <div style={{ marginTop: 18 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 6 }}>
              <span style={{ fontSize: 10, letterSpacing: 1.8, textTransform:'uppercase', color: DF.muted, fontWeight: 700 }}>
                {alreadyEaten.length > 0 ? 'Carrying forward' : 'So far today'}
              </span>
              <span style={{ fontFamily: DF_FONT.display, fontStyle:'italic', fontSize: 15, color: DF.navy }}>
                ~{totals.p}g protein · ~{totals.f}g fiber
              </span>
            </div>
            <Horizon vitality={computeVitality(totals.p, totals.f, session.state)} width={326} height={70}/>
            {sel.size > 0 && (
              <div style={{
                marginTop: 6, fontFamily: DF_FONT.display, fontStyle:'italic',
                fontSize: 14, color: DF.goldDeep, textAlign:'center', letterSpacing: -0.2,
              }}>You're closing the gap.</div>
            )}
          </div>

          {/* "from earlier" — chips of what's already been eaten */}
          {alreadyEaten.length > 0 && (
            <div style={{
              marginTop: 14, padding:'10px 14px',
              background:'rgba(212,175,55,0.07)', borderRadius: 12,
              border:`1px dashed rgba(212,175,55,0.4)`,
            }}>
              <div style={{
                fontSize: 10, letterSpacing: 1.6, textTransform:'uppercase',
                color: DF.goldDeep, fontWeight: 700, marginBottom: 6, opacity: 0.85,
              }}>From earlier · {earlyTotals.p}g · {earlyTotals.f}g</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap: 6 }}>
                {alreadyEaten.map(id => {
                  const f = ALL_FOODS_BY_ID[id];
                  if (!f) return null;
                  return (
                    <span key={id} style={{
                      fontSize: 11.5, padding:'4px 10px', borderRadius: 999,
                      background:'rgba(255,255,255,0.7)', color: DF.navy,
                      border:`1px solid rgba(212,175,55,0.35)`,
                      display:'inline-flex', alignItems:'center', gap: 5,
                    }}>
                      <span style={{ width: 5, height: 5, borderRadius: 3, background: DF.gold }}/>
                      {f.name}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* scrollable cards */}
        <div style={{ flex:1, overflowY:'auto', padding: '8px 28px 12px' }}>
          <div style={{ display:'flex', flexDirection:'column', gap: 10 }}>
            {session.plan.map(food => (
              <FoodCard key={food.id} food={food} selected={sel.has(food.id)} onToggle={() => toggle(food.id)}/>
            ))}
          </div>

          {/* supplements reminder */}
          {(profile.supps && profile.supps.length > 0) && (
            <div style={{ marginTop: 18, padding: '14px 16px', background:'rgba(255,255,255,0.55)', borderRadius: 14, border:`1px solid ${DF.line}` }}>
              <div style={{ display:'flex', alignItems:'center', gap: 8, marginBottom: 6 }}>
                <Vessel size={20}/>
                <div style={{ fontSize: 10, letterSpacing: 1.6, textTransform:'uppercase', color: DF.muted, fontWeight: 700 }}>Your supplements</div>
              </div>
              <div style={{ fontSize: 12.5, color: DF.navyMute, marginBottom: 8 }}>Don't forget your supplements today.</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap: 4 }}>
                {profile.supps.map(s => (
                  <span key={s} style={{
                    fontSize: 11, padding:'4px 9px', borderRadius: 999,
                    background:'rgba(212,175,55,0.10)', color: DF.goldDeep, fontWeight: 500,
                  }}>{s}</span>
                ))}
              </div>
            </div>
          )}

          {sel.size === 0 && (
            <div style={{ marginTop: 14, textAlign:'center' }}>
              <button onClick={() => {
                setSession({ ...session, saved: true, savedNoFoods: true });
                nav.go('saved-plan');
              }} style={{
                background:'none', border:'none', padding: '10px',
                color: DF.muted, textDecoration:'underline', textDecorationThickness: 0.5, textUnderlineOffset: 4,
                fontFamily: DF_FONT.body, fontSize: 13, cursor:'pointer',
              }}>Not feeling it right now</button>
            </div>
          )}
        </div>

        {/* sticky CTA */}
        {sel.size > 0 && (
          <div style={{ padding:'12px 28px 28px', borderTop:`1px solid ${DF.lineSoft}`, background:'rgba(253,251,247,0.92)', backdropFilter:'blur(8px)' }}>
            <div style={{ fontFamily: DF_FONT.display, fontStyle:'italic', fontSize: 14, color: DF.navy, textAlign:'center', marginBottom: 10 }}>
              Looks like a solid plan. You got this.
            </div>
            <Btn onClick={() => nav.go('celebration')}>Save my plan</Btn>
          </div>
        )}
      </div>
    </PhoneShell>
  );
}

// ── C · CELEBRATION ────────────────────────────────────────────────
function ScreenCelebration({ profile, session, nav }) {
  const allSel = [...(session.alreadyEaten || []), ...(session.selected || []), ...(session.extraSelected || [])];
  const totals = calcTotals(allSel);

  // ── Headline copy: driven by TOTALS only (never state) ──
  let winStatement;
  if (totals.p > 0 && totals.f > 0) {
    winStatement = (
      <>You just lined up <em style={{ fontStyle:'italic', color: DF.goldDeep }}>~{totals.p}g of protein</em> and <em style={{ fontStyle:'italic', color: DF.goldDeep }}>~{totals.f}g of fiber</em>. That's a real win.</>
    );
  } else if (totals.p > 0) {
    winStatement = <>You just lined up <em style={{ fontStyle:'italic', color: DF.goldDeep }}>~{totals.p}g of protein</em>. Good start — closing the fiber gap is one tap away.</>;
  } else if (totals.f > 0) {
    winStatement = <>You just lined up <em style={{ fontStyle:'italic', color: DF.goldDeep }}>~{totals.f}g of fiber</em>. Good start — closing the protein gap is one tap away.</>;
  } else {
    winStatement = <>You showed up today. That counts. Want to add something to close the gap?</>;
  }

  // ── Secondary message: driven by STATE only (never totals) ──
  const stateMsg = {
    rough:  "On a rough day, showing up is the win. You did more than that.",
    cloudy: "Low appetite, still fueled. That's how it's done.",
    good:   "Good days like this are where the gap really closes. Nice work.",
  }[session.state];

  // Sun reaches full radiance on celebration as the payoff moment,
  // but partially-warm if the user only showed up — honest to the copy.
  const baseVitality = computeVitality(totals.p, totals.f, session.state);
  const celebrationVitality = Math.max(baseVitality, totals.p + totals.f > 0 ? 0.95 : 0.25);
  // Both = 0 CTA returns to Close the Gap; otherwise continue to saved plan
  const bothZero = totals.p === 0 && totals.f === 0;
  const ctaLabel = bothZero ? 'Add something to close the gap' : 'See my plan';
  const ctaTarget = bothZero ? 'close-gap' : 'saved-plan';

  return (
    <PhoneShell bg={DF.cream}>
      <Atmosphere tone="golden"/>

      {/* hero sun — vitality + bloom */}
      <div style={{ position:'absolute', top: 70, left:'50%', transform:'translateX(-50%)', zIndex: 2 }}>
        <Sun size={240} glow={true} rays={true} vitality={celebrationVitality} bloom={true}/>
      </div>

      <div style={{ flex:1, padding:'320px 32px 32px', position:'relative', zIndex: 3, display:'flex', flexDirection:'column' }}>
        <div>
          <H size={28}>{winStatement}</H>
        </div>

        <div style={{ marginTop: 18, padding:'16px 18px', background:'rgba(255,255,255,0.6)', borderRadius: 16, border:`1px solid ${DF.line}` }}>
          <P size={14} color={DF.ink} lineHeight={1.55}>{stateMsg}</P>
          <div style={{ height: 1, background: DF.line, margin:'12px 0' }}/>
          <P size={13} color={DF.navyMute} lineHeight={1.5}>
            We'll check in tomorrow. Same time, same place — your Go-Tos will be ready.
          </P>
        </div>

        <div style={{ marginTop:'auto', display:'flex', flexDirection:'column', gap: 8 }}>
          <Btn onClick={() => nav.go(ctaTarget)}>{ctaLabel}</Btn>
        </div>
      </div>
    </PhoneShell>
  );
}

// ── C2 · SAVED PLAN VIEW ───────────────────────────────────────────
function ScreenSavedPlan({ profile, session, setSession, nav }) {
  const planSel    = [...(session.selected || []), ...(session.extraSelected || [])];
  const allSel     = [...(session.alreadyEaten || []), ...planSel];
  const allFoods   = planSel.map(id => ALL_FOODS_BY_ID[id]).filter(Boolean);
  const earlyFoods = (session.alreadyEaten || []).map(id => ALL_FOODS_BY_ID[id]).filter(Boolean);
  const totals     = calcTotals(allSel);
  const meta = STATE_META[session.state];

  return (
    <PhoneShell bg={DF.cream}>
      <Atmosphere tone={session.state === 'rough' ? 'dawn' : session.state === 'cloudy' ? 'overcast' : 'morning'}/>
      <div style={{ flex:1, position:'relative', zIndex:2, display:'flex', flexDirection:'column', overflow:'hidden' }}>

        {/* header — with time-of-day mark */}
        <div style={{ padding:'18px 28px 0' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
            <div>
              <Eyebrow color={DF.goldDeep} mb={6}>Today's plan</Eyebrow>
              <div style={{ display:'flex', alignItems:'baseline', gap: 10, flexWrap:'wrap' }}>
                <H size={28}>You've got <em style={{ fontStyle:'italic', fontWeight:300 }}>this</em>.</H>
                {session.dayCompleted && (
                  <span style={{
                    fontSize: 10, letterSpacing: 1.6, textTransform:'uppercase', fontWeight: 700,
                    color: DF.goldDeep, padding:'4px 10px', borderRadius: 999,
                    background:'rgba(212,175,55,0.14)', border:`1px solid ${DF.gold}`,
                  }}>Completed</span>
                )}
              </div>
            </div>
            <div style={{ marginTop: 6 }}>
              <TimeOfDayMark/>
            </div>
          </div>

          <div style={{ marginTop: 14 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 6 }}>
              <span style={{ fontSize: 10, letterSpacing: 1.8, textTransform:'uppercase', color: DF.muted, fontWeight: 700 }}>Where you are</span>
              <span style={{ fontFamily: DF_FONT.display, fontStyle:'italic', fontSize: 15, color: DF.navy }}>
                ~{totals.p}g protein · ~{totals.f}g fiber
              </span>
            </div>
            <Horizon vitality={computeVitality(totals.p, totals.f, session.state)} width={326} height={64}/>
          </div>
        </div>

        {/* foods */}
        <div style={{ flex:1, overflowY:'auto', padding:'18px 28px 8px' }}>
          {/* from-earlier strip (carries forward from A2) */}
          {earlyFoods.length > 0 && (
            <div style={{
              marginBottom: 14, padding:'12px 14px',
              background:'rgba(212,175,55,0.07)', borderRadius: 12,
              border:`1px dashed rgba(212,175,55,0.35)`,
            }}>
              <div style={{
                fontSize: 10, letterSpacing: 1.6, textTransform:'uppercase',
                color: DF.goldDeep, fontWeight: 700, marginBottom: 6, opacity: 0.85,
              }}>From earlier today</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap: 6 }}>
                {earlyFoods.map(f => (
                  <span key={f.id} style={{
                    fontSize: 11.5, padding:'4px 10px', borderRadius: 999,
                    background:'rgba(255,255,255,0.7)', color: DF.navy,
                    border:`1px solid rgba(212,175,55,0.35)`,
                    display:'inline-flex', alignItems:'center', gap: 5,
                  }}>
                    <span style={{ width: 5, height: 5, borderRadius: 3, background: DF.gold }}/>
                    {f.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {session.savedNoFoods || allFoods.length === 0 ? (
            <div style={{
              padding:'28px 22px', textAlign:'center',
              background:'rgba(255,255,255,0.55)', borderRadius: 16, border:`1px solid ${DF.line}`,
            }}>
              <H size={20}>No foods selected yet.</H>
              <div style={{ marginTop: 8, marginBottom: 16 }}>
                <P size={13.5}>Your Go-Tos are here whenever you're ready.</P>
              </div>
              <Btn size="md" onClick={() => nav.go('plan')}>Add foods</Btn>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap: 8 }}>
              {allFoods.map(f => (
                <div key={f.id} style={{
                  padding:'14px 16px', background:'rgba(255,255,255,0.7)',
                  border:`1px solid ${DF.line}`, borderRadius: 14,
                  display:'flex', alignItems:'center', gap: 12,
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: 3, background: DF.gold, flexShrink: 0 }}/>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily: DF_FONT.display, fontWeight: 400, fontSize: 17, color: DF.navy, letterSpacing: -0.2 }}>{f.name}</div>
                    <div style={{ fontSize: 11.5, color: DF.muted, marginTop: 2 }}>
                      ~{f.p}g protein{f.f > 0 ? ` + ~${f.f}g fiber` : ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* supplements reminder */}
          {(profile.supps && profile.supps.length > 0) && (
            <div style={{ marginTop: 14, padding:'14px 16px', background:'rgba(255,255,255,0.55)', borderRadius: 14, border:`1px solid ${DF.line}` }}>
              <div style={{ display:'flex', alignItems:'center', gap: 8, marginBottom: 6 }}>
                <Vessel size={18}/>
                <div style={{ fontSize: 10, letterSpacing: 1.6, textTransform:'uppercase', color: DF.muted, fontWeight: 700 }}>Your supplements</div>
              </div>
              <div style={{ display:'flex', flexWrap:'wrap', gap: 4 }}>
                {profile.supps.map(s => (
                  <span key={s} style={{
                    fontSize: 11, padding:'4px 9px', borderRadius: 999,
                    background:'rgba(212,175,55,0.10)', color: DF.goldDeep, fontWeight: 500,
                  }}>{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* close the gap CTA + done-for-today link — hidden in completed mode */}
          {!session.dayCompleted && (
            <>
              <div style={{ marginTop: 16 }}>
                <button onClick={() => nav.go('close-gap')} style={{
                  width:'100%', padding:'14px 18px',
                  background: 'rgba(212,175,55,0.10)', border: `1px solid ${DF.gold}`,
                  borderRadius: 14, cursor:'pointer', fontFamily: DF_FONT.body,
                  display:'flex', alignItems:'center', justifyContent:'space-between', gap: 12,
                }}>
                  <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
                    <MiniSun size={20}/>
                    <span style={{ fontFamily: DF_FONT.display, fontWeight: 400, fontSize: 17, color: DF.navy, letterSpacing: -0.2 }}>Close the gap</span>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={DF.gold} strokeWidth="1.8" strokeLinecap="round"><path d="M5 3l5 5-5 5"/></svg>
                </button>
              </div>

              {/* Done for today? — low-weight, optional sunset cue */}
              <div style={{ marginTop: 10, textAlign:'center' }}>
                <button onClick={() => nav.go('end-of-day')} style={{
                  background:'none', border:'none', padding:'10px 14px',
                  color: DF.goldDeep, opacity: 0.7, cursor:'pointer',
                  fontFamily: DF_FONT.body, fontSize: 13, letterSpacing: 0.1,
                  textDecoration:'underline', textDecorationThickness: 0.5, textUnderlineOffset: 4,
                }}>Done for today?</button>
              </div>
            </>
          )}
        </div>

        {/* bottom nav */}
        <BottomNav nav={nav} active="daily"/>
      </div>
    </PhoneShell>
  );
}

// ── D · CLOSE THE GAP (round 2) ────────────────────────────────────
function ScreenCloseGap({ profile, session, setSession, setProfile, nav }) {
  // Round 2 uses hardcoded universal suggestions, excluding round-1 + already-eaten
  const round1 = new Set(session.selected || []);
  const alreadyEaten = new Set(session.alreadyEaten || []);
  const wontEat = new Set(profile.wontEat || []);
  const sel = new Set(session.extraSelected || []);

  // Search state
  const [query, setQuery] = React.useState('');
  const [confirmed, setConfirmed] = React.useState(null); // foodId just added via search
  const searchResults = searchFoods(query, {
    excludeWontEat: [...wontEat],
    excludeIds: [...round1, ...alreadyEaten],
  });

  const items = GAP_ITEMS.filter(f => !round1.has(f.id) && !alreadyEaten.has(f.id) && !wontEat.has(f.id));

  const toggle = (id) => {
    const next = new Set(sel);
    next.has(id) ? next.delete(id) : next.add(id);
    setSession({ ...session, extraSelected: [...next] });
  };

  const addFromSearch = (food) => {
    // Toggle selection AND remember it as a new "My Foods" entry
    const nextSel = new Set(sel); nextSel.add(food.id);
    setSession({ ...session, extraSelected: [...nextSel] });
    // Auto-add to user's Go-Tos so it lives on past today
    const nextGoTos = new Set(profile.goTos || []); nextGoTos.add(food.id);
    setProfile({ ...profile, goTos: [...nextGoTos] });
    setConfirmed(food.id);
    setQuery('');
    setTimeout(() => setConfirmed(null), 2200);
  };

  const round1Totals = calcTotals(session.selected || []);
  const extraTotals  = calcTotals([...sel]);
  const earlyTotals  = calcTotals([...alreadyEaten]);
  const totalP = round1Totals.p + extraTotals.p + earlyTotals.p;
  const totalF = round1Totals.f + extraTotals.f + earlyTotals.f;
  const totalSelections = (session.selected || []).length + sel.size;

  return (
    <PhoneShell bg={DF.cream}>
      <Atmosphere tone="golden"/>
      <div style={{ flex:1, position:'relative', zIndex:2, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <div style={{ padding:'18px 28px 12px' }}>
          <button onClick={() => nav.go('saved-plan')} style={{
            background:'none', border:'none', padding: '4px 0', color: DF.muted, cursor:'pointer',
            fontFamily: DF_FONT.body, fontSize: 13, marginBottom: 14,
          }}>← Back to my plan</button>
          <Eyebrow color={DF.goldDeep} mb={8}>Round 2</Eyebrow>
          <H size={26}>Here are some popular options for <em style={{ fontStyle:'italic', fontWeight:300 }}>closing the gap</em>.</H>

          <div style={{ marginTop: 16 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 6 }}>
              <span style={{ fontSize: 10, letterSpacing: 1.8, textTransform:'uppercase', color: DF.muted, fontWeight: 700 }}>Combined so far</span>
              <span style={{ fontFamily: DF_FONT.display, fontStyle:'italic', fontSize: 15, color: DF.navy }}>
                ~{totalP}g protein · ~{totalF}g fiber
              </span>
            </div>
            <Horizon vitality={computeVitality(totalP, totalF, session.state)} width={326} height={64}/>
          </div>
        </div>

        <div style={{ flex:1, overflowY:'auto', padding:'4px 28px 12px' }}>
          {/* Search bar — inline pill, warm low-chrome (v3) */}
          <div style={{ marginBottom: 12 }}>
            <SearchBar
              value={query}
              onChange={setQuery}
              placeholder="Search for something that sounds good"
            />
          </div>

          {/* Search results — small confirmation OR no-match empty state */}
          {query && (
            <div style={{
              marginBottom: 14, padding: '12px 14px',
              background:'rgba(255,255,255,0.6)', borderRadius: 14,
              border:`1px solid ${DF.line}`,
              animation:'df-fadeup 0.24s ease',
            }}>
              {searchResults.length === 0 ? (
                <div style={{ padding:'6px 4px' }}>
                  <P size={13} color={DF.muted}>Nothing close yet. Try another search.</P>
                </div>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap: 6 }}>
                  {searchResults.map(f => {
                    const tag = roleTag(f.role);
                    return (
                      <button key={f.id} onClick={() => addFromSearch(f)} style={{
                        display:'flex', alignItems:'center', gap: 10,
                        padding:'10px 12px', borderRadius: 12,
                        background:'rgba(255,255,255,0.85)',
                        border:`1px solid ${DF.line}`,
                        cursor:'pointer', textAlign:'left',
                        fontFamily: DF_FONT.body,
                      }}>
                        <div style={{ flex:1 }}>
                          <div style={{ fontFamily: DF_FONT.display, fontSize: 16, color: DF.navy, letterSpacing: -0.15 }}>{f.name}</div>
                          <div style={{ fontSize: 11.5, color: DF.goldDeep, marginTop: 2, opacity: 0.85 }}>
                            {servingContext(f)}
                          </div>
                        </div>
                        <span style={{
                          fontSize: 9, padding:'3px 7px', borderRadius: 999,
                          background: tag.bg, color: tag.fg, fontWeight: 700, letterSpacing: 0.5,
                        }}>{tag.label}</span>
                        <span style={{
                          width: 22, height: 22, borderRadius: 11,
                          background: DF.gold, color: DF.navy,
                          display:'flex', alignItems:'center', justifyContent:'center',
                          fontWeight: 700, fontSize: 14, flexShrink: 0,
                        }}>+</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* "added!" toast */}
          {confirmed && ALL_FOODS_BY_ID[confirmed] && (
            <div style={{
              marginBottom: 14, padding:'12px 14px',
              background:'rgba(212,175,55,0.14)', borderRadius: 12,
              border:`1px solid ${DF.gold}`,
              display:'flex', alignItems:'center', gap: 10,
              animation:'df-fadeup 0.32s cubic-bezier(0.34, 1.2, 0.64, 1)',
            }}>
              <MiniSun size={18}/>
              <div style={{
                fontFamily: DF_FONT.display, fontStyle:'italic', fontSize: 14,
                color: DF.navy, letterSpacing: -0.15, lineHeight: 1.3,
              }}>
                Added to today's plan — and saved to My Foods.
              </div>
            </div>
          )}

          <div style={{ display:'flex', flexDirection:'column', gap: 10 }}>
            {items.map(food => (
              <FoodCard key={food.id} food={food} selected={sel.has(food.id)} onToggle={() => toggle(food.id)}/>
            ))}
          </div>

          <div style={{ marginTop: 14, padding:'10px 14px', background:'rgba(212,175,55,0.06)', borderRadius: 12, border:`1px dashed ${DF.gold}` }}>
            <P size={12} color={DF.goldDeep} lineHeight={1.45}>
              Like something new? Search above — we'll add it to My Foods so it's ready next time.
            </P>
          </div>
        </div>

        {sel.size > 0 && (
          <div style={{ padding:'12px 28px 28px', borderTop:`1px solid ${DF.lineSoft}`, background:'rgba(253,251,247,0.92)' }}>
            <Btn onClick={() => nav.go('celebration')}>Save to my plan</Btn>
          </div>
        )}
      </div>
    </PhoneShell>
  );
}

// ── E · MY FOODS ───────────────────────────────────────────────────
function ScreenMyFoods({ profile, setProfile, nav }) {
  const goTos = new Set(profile.goTos || []);
  const wontEat = new Set(profile.wontEat || []);
  const supps = new Set(profile.supps || []);
  const toggleGoTo = (id) => {
    const next = new Set(goTos);
    next.has(id) ? next.delete(id) : next.add(id);
    setProfile({ ...profile, goTos: [...next] });
  };
  const toggleWont = (id) => {
    const next = new Set(wontEat);
    next.has(id) ? next.delete(id) : next.add(id);
    setProfile({ ...profile, wontEat: [...next] });
  };

  // Search state (v3)
  const [query, setQuery] = React.useState('');
  const [confirmed, setConfirmed] = React.useState(null);
  const searchResults = searchFoods(query, {
    excludeWontEat: [...wontEat],
    excludeIds: [...goTos],
  });
  const addFromSearch = (food) => {
    const next = new Set(goTos); next.add(food.id);
    setProfile({ ...profile, goTos: [...next] });
    setConfirmed(food.id);
    setQuery('');
    setTimeout(() => setConfirmed(null), 2200);
  };

  return (
    <PhoneShell bg={DF.cream}>
      <Atmosphere tone="morning"/>
      <div style={{ flex:1, position:'relative', zIndex:2, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <div style={{ padding:'18px 28px 14px' }}>
          <button onClick={() => nav.go('saved-plan')} style={{
            background:'none', border:'none', padding: '4px 0',
            color: DF.muted, cursor:'pointer', fontFamily: DF_FONT.body,
            fontSize: 13, marginBottom: 10,
          }}>← Back to today's plan</button>
          <H size={26}>My <em style={{ fontStyle:'italic', fontWeight:300 }}>Foods</em>.</H>
          <div style={{ marginTop: 6 }}>
            <P size={13.5}>Manage your staples and preferences. Your plan updates immediately.</P>
          </div>
        </div>

        <div style={{ flex:1, overflowY:'auto', padding:'8px 28px 12px' }}>
          {/* Search — discovery, not data entry */}
          <div style={{ marginBottom: 16 }}>
            <SearchBar
              value={query}
              onChange={setQuery}
              placeholder="Search for foods you already love"
            />
          </div>

          {query && (
            <div style={{
              marginBottom: 16, padding:'12px 14px',
              background:'rgba(255,255,255,0.6)', borderRadius: 14,
              border:`1px solid ${DF.line}`,
              animation:'df-fadeup 0.24s ease',
            }}>
              {searchResults.length === 0 ? (
                <P size={13} color={DF.muted}>No exact match yet — try a different name or ingredient.</P>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap: 6 }}>
                  {searchResults.map(f => {
                    const tag = roleTag(f.role);
                    return (
                      <button key={f.id} onClick={() => addFromSearch(f)} style={{
                        display:'flex', alignItems:'center', gap: 10,
                        padding:'10px 12px', borderRadius: 12,
                        background:'rgba(255,255,255,0.85)',
                        border:`1px solid ${DF.line}`,
                        cursor:'pointer', textAlign:'left',
                        fontFamily: DF_FONT.body,
                      }}>
                        <div style={{ flex:1 }}>
                          <div style={{ fontFamily: DF_FONT.display, fontSize: 16, color: DF.navy, letterSpacing: -0.15 }}>{f.name}</div>
                          <div style={{ fontSize: 11.5, color: DF.goldDeep, marginTop: 2, opacity: 0.85 }}>
                            {servingContext(f)}
                          </div>
                        </div>
                        <span style={{
                          fontSize: 9, padding:'3px 7px', borderRadius: 999,
                          background: tag.bg, color: tag.fg, fontWeight: 700, letterSpacing: 0.5,
                        }}>{tag.label}</span>
                        <span style={{
                          width: 22, height: 22, borderRadius: 11,
                          background: DF.gold, color: DF.navy,
                          display:'flex', alignItems:'center', justifyContent:'center',
                          fontWeight: 700, fontSize: 14, flexShrink: 0,
                        }}>+</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {confirmed && ALL_FOODS_BY_ID[confirmed] && (
            <div style={{
              marginBottom: 14, padding:'12px 14px',
              background:'rgba(212,175,55,0.14)', borderRadius: 12,
              border:`1px solid ${DF.gold}`,
              display:'flex', alignItems:'center', gap: 10,
              animation:'df-fadeup 0.32s cubic-bezier(0.34, 1.2, 0.64, 1)',
            }}>
              <MiniSun size={18}/>
              <div style={{
                fontFamily: DF_FONT.display, fontStyle:'italic', fontSize: 14,
                color: DF.navy, letterSpacing: -0.15, lineHeight: 1.3,
              }}>
                That's in your rotation now.
              </div>
            </div>
          )}

          {/* Go-Tos */}
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 11, letterSpacing: 2, textTransform:'uppercase', color: DF.muted, marginBottom: 10, fontWeight: 700 }}>My Go-Tos</div>
            <PillTagList items={FOOD_GOTOS} selected={goTos} onToggle={toggleGoTo}/>
          </div>

          {/* Will / Won't */}
          {FOOD_GROUPS.filter(g => g.id !== 'gotos').map(g => (
            <div key={g.id} style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 10, letterSpacing: 2, textTransform:'uppercase', color: DF.muted, marginBottom: 10, fontWeight: 700 }}>{g.label}</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap: 6 }}>
                {g.items.map(it => {
                  const off = wontEat.has(it.id);
                  return (
                    <button key={it.id} onClick={() => toggleWont(it.id)} style={{
                      padding:'7px 12px', borderRadius: 999, cursor:'pointer',
                      fontFamily: DF_FONT.body, fontSize: 12.5, fontWeight: 500,
                      background: off ? 'transparent' : 'rgba(255,255,255,0.7)',
                      color: off ? DF.muted : DF.navy,
                      border: off ? `1px dashed ${DF.muted}` : `1px solid ${DF.line}`,
                      textDecoration: off ? 'line-through' : 'none',
                      transition:'all 0.18s ease',
                    }}>{it.name}</button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Supplements */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 11, letterSpacing: 2, textTransform:'uppercase', color: DF.muted, marginBottom: 10, fontWeight: 700 }}>Your Supplements</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap: 8 }}>
              {[...SUPPS_T1, ...SUPPS_T2].map(s => {
                const on = supps.has(s);
                return (
                  <button key={s} onClick={() => {
                    const next = new Set(supps);
                    next.has(s) ? next.delete(s) : next.add(s);
                    setProfile({ ...profile, supps: [...next] });
                  }} style={{
                    padding:'7px 12px', borderRadius: 999, cursor:'pointer',
                    fontFamily: DF_FONT.body, fontSize: 12.5, fontWeight: 500,
                    background: on ? DF.navy : 'rgba(255,255,255,0.7)',
                    color: on ? DF.cream : DF.navy,
                    border: on ? 'none' : `1px solid ${DF.line}`,
                  }}>{s}</button>
                );
              })}
            </div>
          </div>

          <div style={{ padding:'12px 14px', background:'rgba(212,175,55,0.06)', borderRadius: 12 }}>
            <P size={12} color={DF.muted}>Your plan updates immediately when you make changes here.</P>
          </div>
        </div>

        <BottomNav nav={nav} active="foods"/>
      </div>
    </PhoneShell>
  );
}

// ── F · MY GOALS ───────────────────────────────────────────────────
function ScreenMyGoals({ profile, setProfile, nav }) {
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  return (
    <PhoneShell bg={DF.cream}>
      <Atmosphere tone="morning"/>
      <div style={{ flex:1, position:'relative', zIndex:2, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <div style={{ padding:'18px 28px 14px' }}>
          <button onClick={() => nav.go('saved-plan')} style={{
            background:'none', border:'none', padding: '4px 0',
            color: DF.muted, cursor:'pointer', fontFamily: DF_FONT.body,
            fontSize: 13, marginBottom: 10,
          }}>← Back to today's plan</button>
          <H size={26}>My <em style={{ fontStyle:'italic', fontWeight:300 }}>Goals</em>.</H>
        </div>

        <div style={{ flex:1, overflowY:'auto', padding:'4px 28px 12px' }}>
          {/* Daily targets — surfaced at top (v3) */}
          <div style={{ marginBottom: 22 }}>
            <div style={{
              fontSize: 11, letterSpacing: 1.6, textTransform:'uppercase',
              color: DF.muted, marginBottom: 4, fontWeight: 600,
            }}>Daily targets</div>
            <div style={{ fontSize: 12, color: DF.muted, marginBottom: 12, fontStyle:'italic' }}>
              Ask your provider for the right numbers for you.
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap: 10 }}>
              {[
                { key:'proteinTarget', label:'Protein target', suffix:'g/day', presets:[60,80,100,120] },
                { key:'fiberTarget',   label:'Fiber target',   suffix:'g/day', presets:[25,30,35] },
              ].map(f => (
                <div key={f.key} style={{
                  padding:'14px 16px', background:'rgba(255,255,255,0.7)',
                  border:`1px solid ${DF.line}`, borderRadius: 14,
                }}>
                  <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom: 8 }}>
                    <span style={{ fontFamily: DF_FONT.display, fontSize: 16, color: DF.navy, letterSpacing: -0.15 }}>
                      {f.label}
                    </span>
                    {!profile[f.key] && (
                      <span style={{
                        fontSize: 10, padding:'2px 8px', borderRadius: 999,
                        background:'rgba(212,175,55,0.10)', color: DF.goldDeep,
                        fontWeight: 600, letterSpacing: 0.4, textTransform:'uppercase',
                      }}>Ask your provider</span>
                    )}
                  </div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap: 6, alignItems:'center' }}>
                    {f.presets.map(v => {
                      const on = String(profile[f.key]) === String(v);
                      return (
                        <button key={v} onClick={() => setProfile({ ...profile, [f.key]: on ? '' : v })} style={{
                          padding:'7px 14px', borderRadius: 999, cursor:'pointer',
                          background: on ? DF.navy : 'rgba(255,255,255,0.85)',
                          color: on ? DF.cream : DF.navy,
                          border: on ? '1px solid ' + DF.navy : '1px solid ' + DF.line,
                          fontFamily: DF_FONT.body, fontSize: 13, fontWeight: 600,
                          fontVariantNumeric:'tabular-nums', letterSpacing: -0.1,
                          transition:'all 0.18s ease',
                        }}>{v}{f.suffix.startsWith('g/') ? 'g' : ''}</button>
                      );
                    })}
                    <input
                      type="number" inputMode="numeric" placeholder="Custom"
                      value={f.presets.includes(Number(profile[f.key])) ? '' : (profile[f.key] || '')}
                      onChange={(e) => setProfile({ ...profile, [f.key]: e.target.value })}
                      style={{
                        width: 84, padding:'7px 12px', borderRadius: 999,
                        background:'rgba(255,255,255,0.85)', border:`1px dashed ${DF.muted}`,
                        color: DF.navy, fontFamily: DF_FONT.body, fontSize: 13,
                        outline:'none', textAlign:'center',
                      }}/>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap: 20 }}>
            {[
              { key:'currentWeight', label:'Current weight', suffix:'lbs' },
              { key:'goalWeight',    label:'Goal weight',    suffix:'lbs' },
            ].map(f => (
              <div key={f.key}>
                <div style={{ fontSize: 11, letterSpacing: 1.6, textTransform:'uppercase', color: DF.muted, marginBottom: 6, fontWeight: 600 }}>{f.label}</div>
                <div style={{
                  display:'flex', alignItems:'center', gap: 8,
                  padding:'12px 16px', background:'rgba(255,255,255,0.7)',
                  border:`1px solid ${DF.line}`, borderRadius: 12,
                }}>
                  <input
                    type="number"
                    value={profile[f.key] || ''}
                    onChange={(e) => setProfile({ ...profile, [f.key]: e.target.value })}
                    placeholder="—"
                    style={{
                      flex:1, border:'none', background:'transparent',
                      fontFamily: DF_FONT.display, fontSize: 22, color: DF.navy, outline:'none',
                    }}/>
                  <span style={{ fontSize: 11, color: DF.muted, letterSpacing: 1.5, textTransform:'uppercase', fontWeight: 600 }}>{f.suffix}</span>
                </div>
              </div>
            ))}

            <div>
              <div style={{ fontSize: 11, letterSpacing: 1.6, textTransform:'uppercase', color: DF.muted, marginBottom: 8, fontWeight: 600 }}>Shot day</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap: 4 }}>
                {days.map(d => {
                  const on = profile.shotDay === d;
                  return (
                    <button key={d} onClick={() => setProfile({ ...profile, shotDay: d })} style={{
                      padding:'10px 0', borderRadius: 10, cursor:'pointer',
                      background: on ? DF.navy : 'rgba(255,255,255,0.7)',
                      color: on ? DF.cream : DF.navy,
                      border: on ? 'none' : `1px solid ${DF.line}`,
                      fontFamily: DF_FONT.body, fontSize: 12, fontWeight: 600,
                    }}>{d}</button>
                  );
                })}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11, letterSpacing: 1.6, textTransform:'uppercase', color: DF.muted, marginBottom: 8, fontWeight: 600 }}>Daily check-in time</div>
              <input type="time"
                value={profile.notifTime || '09:00'}
                onChange={(e) => setProfile({ ...profile, notifTime: e.target.value })}
                style={{
                  padding:'12px 16px', borderRadius: 12,
                  fontFamily: DF_FONT.body, fontSize: 14,
                  border:`1px solid ${DF.line}`, background:'rgba(255,255,255,0.7)', color: DF.navy,
                  width: '100%', fontVariantNumeric:'tabular-nums',
                }}/>
            </div>
          </div>

          <div style={{ marginTop: 20, padding:'10px 14px', background:'rgba(212,175,55,0.06)', borderRadius: 12, borderLeft:`2px solid ${DF.gold}` }}>
            <P size={11} color={DF.muted} lineHeight={1.5}>
              Daily Fuel is a practical support tool, not medical advice. Check with your doctor for what's right for you.
            </P>
          </div>
        </div>

        <BottomNav nav={nav} active="goals"/>
      </div>
    </PhoneShell>
  );
}

// ── Bottom navigation ──────────────────────────────────────────────
function BottomNav({ nav, active }) {
  const tabs = [
    { id:'daily',  label:'Daily Fuel', target:'saved-plan', icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5"/><circle cx="9" cy="9" r="2.5" fill="currentColor"/></svg>
    )},
    { id:'foods',  label:'My Foods',   target:'my-foods', icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 6 Q9 14 15 6" stroke="currentColor" strokeWidth="1.5" fill="none"/><line x1="2" y1="6" x2="16" y2="6" stroke="currentColor" strokeWidth="1.5"/></svg>
    )},
    { id:'goals',  label:'My Goals',   target:'my-goals', icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><line x1="2" y1="14" x2="16" y2="14" stroke="currentColor" strokeWidth="1.2"/><circle cx="13" cy="6" r="3" fill="currentColor" opacity="0.85"/></svg>
    )},
  ];
  return (
    <nav style={{
      display:'flex', borderTop:`1px solid ${DF.line}`,
      background:'rgba(253,251,247,0.92)', backdropFilter:'blur(10px)',
      padding:'10px 12px 22px',
    }}>
      {tabs.map(t => {
        const on = active === t.id;
        return (
          <button key={t.id} onClick={() => nav.go(t.target)} style={{
            flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap: 4,
            padding:'6px 4px', background:'none', border:'none', cursor:'pointer',
            color: on ? DF.navy : DF.muted, fontFamily: DF_FONT.body,
            fontSize: 10, letterSpacing: 0.5, fontWeight: 600,
          }}>
            {t.icon}
            <span>{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

// ── G · END OF DAY · PICKER ────────────────────────────────────────
// Sunset moment. "How'd today go?" — three warm cards.
// Sun shows the day's actual vitality (totals-driven, not boosted).
function ScreenEndOfDay({ profile, session, setSession, nav }) {
  const allSel = [...(session.alreadyEaten || []), ...(session.selected || []), ...(session.extraSelected || [])];
  const totals = calcTotals(allSel);
  const vitality = computeVitality(totals.p, totals.f, session.state);

  const choose = (mood) => {
    setSession({ ...session, dayCompleted: true, dayMood: mood, dayCompletedAt: Date.now() });
    nav.go('end-of-day-close');
  };

  const moods = [
    { id:'nailed',   label:'Nailed it',   sub:'Good day. Took care of you.',
      bg: 'linear-gradient(140deg, #F8E9C3 0%, #F0D896 100%)', border: DF.gold, color: DF.navy },
    { id:'survived', label:'Survived it', sub:'Made it through. That counts.',
      bg: 'rgba(255,255,255,0.7)',  border: DF.line, color: DF.navy },
    { id:'skipped',  label:'Skipped it',  sub:'Not your day. We\u2019ll start fresh.',
      bg: 'transparent', border: DF.line, color: DF.navyMute },
  ];

  return (
    <PhoneShell bg={DF.cream}>
      {/* sunset atmosphere — warmer than morning */}
      <Atmosphere tone="golden"/>

      {/* hero sun lower on screen, like setting */}
      <div style={{ position:'absolute', top: 90, left:'50%', transform:'translateX(-50%)', zIndex: 2 }}>
        <Sun size={180} glow={true} rays={true} vitality={Math.max(vitality, 0.35)}/>
      </div>

      <div style={{ flex:1, padding:'250px 32px 32px', position:'relative', zIndex: 3, display:'flex', flexDirection:'column' }}>
        <Eyebrow color={DF.goldDeep}>Closing the day</Eyebrow>
        <H size={32}>How'd today <em style={{ fontStyle:'italic', fontWeight:300 }}>go</em>?</H>

        <div style={{ marginTop: 22, display:'flex', flexDirection:'column', gap: 10 }}>
          {moods.map(m => (
            <button key={m.id} onClick={() => choose(m.id)} style={{
              padding:'18px 20px', borderRadius: 16, cursor:'pointer',
              background: m.bg, border:`1px solid ${m.border}`,
              display:'flex', alignItems:'center', gap: 14,
              textAlign:'left', fontFamily: DF_FONT.body,
              transition: 'transform 0.18s ease',
              boxShadow: m.id === 'nailed' ? '0 6px 18px rgba(212,175,55,0.18)' : 'none',
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.99)'}
            onMouseUp={(e) => e.currentTarget.style.transform = ''}
            onMouseLeave={(e) => e.currentTarget.style.transform = ''}
            >
              <div style={{ flex:1 }}>
                <div style={{ fontFamily: DF_FONT.display, fontWeight: 400, fontSize: 22, color: m.color, letterSpacing: -0.3, lineHeight: 1 }}>{m.label}</div>
                <div style={{ marginTop: 4, fontSize: 13, color: m.id === 'skipped' ? DF.muted : DF.navyMute }}>{m.sub}</div>
              </div>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={m.id === 'skipped' ? DF.muted : DF.navy} strokeWidth="1.5" strokeLinecap="round" style={{ opacity: 0.5 }}><path d="M5 3l5 5-5 5"/></svg>
            </button>
          ))}
        </div>

        <div style={{ marginTop:'auto', textAlign:'center' }}>
          <button onClick={() => nav.go('saved-plan')} style={{
            background:'none', border:'none', padding:'8px',
            color: DF.muted, fontFamily: DF_FONT.body, fontSize: 12.5, cursor:'pointer',
          }}>Not yet — back to my plan</button>
        </div>
      </div>
    </PhoneShell>
  );
}

// ── H · END OF DAY · CLOSING MESSAGE ───────────────────────────────
// "Nice work today. We'll check in tomorrow." — no CTA, the user closes the app.
// In our prototype, tap anywhere returns to the (now-completed) saved plan.
function ScreenEndOfDayClose({ profile, session, nav }) {
  const allSel = [...(session.alreadyEaten || []), ...(session.selected || []), ...(session.extraSelected || [])];
  const totals = calcTotals(allSel);
  const vitality = computeVitality(totals.p, totals.f, session.state);

  return (
    <div onClick={() => nav.go('saved-plan')} style={{ width:'100%', height:'100%', cursor:'pointer' }}>
      <PhoneShell bg={DF.cream}>
        <Atmosphere tone="golden"/>

        {/* sun, settled — uses bloom so it greets the user one more time */}
        <div style={{ position:'absolute', top: 120, left:'50%', transform:'translateX(-50%)', zIndex: 2 }}>
          <Sun size={200} glow={true} rays={true} vitality={Math.max(vitality, 0.45)} bloom={true}/>
        </div>

        <div style={{ flex:1, padding:'330px 32px 36px', position:'relative', zIndex: 3, display:'flex', flexDirection:'column' }}>
          <H size={30}>
            Nice work <em style={{ fontStyle:'italic', fontWeight:300 }}>today</em>.<br/>
            We'll check in tomorrow.
          </H>

          <div style={{ marginTop: 18 }}>
            <P size={15} color={DF.ink} lineHeight={1.6}>
              Same time, same place — your Go-Tos will be ready.
            </P>
          </div>

          <div style={{ marginTop:'auto', textAlign:'center' }}>
            <P size={11} color={DF.muted}>Tap anywhere when you're ready to close.</P>
          </div>
        </div>
      </PhoneShell>
    </div>
  );
}

Object.assign(window, {
  ScreenStateSelector, ScreenAnyGoTos, ScreenPlan, ScreenCelebration,
  ScreenSavedPlan, ScreenCloseGap, ScreenMyFoods, ScreenMyGoals,
  ScreenEndOfDay, ScreenEndOfDayClose,
  FoodCard, SearchBar, BottomNav, generatePlan, roleTag, searchFoods,
});
