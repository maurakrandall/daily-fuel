// Daily Fuel — Onboarding (8 screens + landing + create account)
// Each screen accepts: profile (state) + setProfile + nav (onNext, onBack)
// Visual system: morning gradient atmosphere; gold sun; soft warm pills.

// ── 0a · LANDING ───────────────────────────────────────────────────
function ScreenLanding({ nav }) {
  return (
    <PhoneShell bg={DF.cream}>
      <Atmosphere tone="golden"/>

      {/* hero — sun rising over horizon */}
      <div style={{ position:'absolute', top: 100, left:0, right:0, display:'flex', justifyContent:'center', zIndex: 2 }}>
        <Sun size={260} rays={true} glow={true} color={DF.gold} soft={DF.goldSoft}/>
      </div>

      <div style={{ flex:1, padding:'380px 32px 36px', display:'flex', flexDirection:'column', position:'relative', zIndex: 3 }}>
        <Eyebrow color={DF.goldDeep} mb={18}>Daily Fuel</Eyebrow>
        <H size={44}>
          Eating can feel <em style={{ fontFamily:'inherit', fontStyle:'italic', fontWeight:300 }}>good</em> again.
        </H>
        <div style={{ marginTop: 20, maxWidth: 320 }}>
          <P size={16} color={DF.ink} lineHeight={1.6}>
            A gentle companion for the days food feels different — not a tracker, not a diet. Just support, day by day.
          </P>
        </div>

        <div style={{ marginTop:'auto', display:'flex', flexDirection:'column', gap: 8 }}>
          <Btn onClick={() => nav.go('create')}>Create account</Btn>
          <Btn variant="ghost" onClick={() => nav.go('signin')}>I already have an account</Btn>
        </div>
      </div>
    </PhoneShell>
  );
}

// ── 0b · CREATE ACCOUNT ────────────────────────────────────────────
function ScreenCreate({ profile, setProfile, nav }) {
  const [show, setShow] = React.useState(false);
  return (
    <PhoneShell bg={DF.cream}>
      <Atmosphere tone="morning"/>
      <div style={{ flex:1, padding:'32px 32px 36px', position:'relative', zIndex: 2, display:'flex', flexDirection:'column' }}>
        <button onClick={() => nav.go('landing')} style={{
          background:'none', border:'none', padding: '6px 0', color: DF.muted,
          cursor:'pointer', fontFamily: DF_FONT.body, fontSize: 14, marginBottom: 24, alignSelf:'flex-start',
        }}>← Back</button>
        <H size={32}>Let's <em style={{ fontStyle:'italic', fontWeight:300 }}>begin</em>.</H>
        <div style={{ marginTop: 10 }}><P>A few details to get you started. We keep this simple — and private.</P></div>

        <div style={{ marginTop: 32, display:'flex', flexDirection:'column', gap: 16 }}>
          {[
            { id:'firstName', label:'First name',  type:'text',     placeholder:'What should we call you?' },
            { id:'email',     label:'Email',       type:'email',    placeholder:'you@something.com' },
            { id:'password',  label:'Password',    type: show ? 'text' : 'password', placeholder:'At least 8 characters' },
          ].map(f => (
            <label key={f.id} style={{ display:'block' }}>
              <div style={{ fontSize: 11, letterSpacing: 1.6, textTransform:'uppercase', color: DF.muted, marginBottom: 6, fontWeight: 600 }}>{f.label}</div>
              <div style={{ position:'relative' }}>
                <input
                  type={f.type}
                  placeholder={f.placeholder}
                  value={profile[f.id] || ''}
                  onChange={(e) => setProfile({ ...profile, [f.id]: e.target.value })}
                  style={{
                    width:'100%', padding:'14px 16px', fontSize: 15,
                    border:`1px solid ${DF.line}`, borderRadius: 12,
                    background:'rgba(255,255,255,0.6)', color: DF.navy,
                    fontFamily: DF_FONT.body, outline:'none',
                  }}/>
                {f.id === 'password' && (
                  <button onClick={(e) => { e.preventDefault(); setShow(s=>!s); }} style={{
                    position:'absolute', right: 12, top:'50%', transform:'translateY(-50%)',
                    background:'none', border:'none', cursor:'pointer',
                    fontSize: 12, color: DF.muted, fontWeight: 600, letterSpacing: 0.4,
                  }}>{show ? 'Hide' : 'Show'}</button>
                )}
              </div>
            </label>
          ))}
        </div>

        <div style={{ marginTop:'auto', display:'flex', flexDirection:'column', gap: 8 }}>
          <Btn onClick={() => nav.go('onb-1')}>Create account</Btn>
          <Btn variant="ghost" onClick={() => nav.go('signin')}>Sign in instead</Btn>
        </div>
      </div>
    </PhoneShell>
  );
}

// ── 1 · MEDICAL OVERSIGHT (locked copy) ────────────────────────────
function ScreenMedical({ profile, setProfile, nav }) {
  const checked = profile.medicalAck;
  return (
    <PhoneShell bg={DF.cream}>
      <Atmosphere tone="morning"/>
      <div style={{ flex:1, padding:'24px 32px 32px', position:'relative', zIndex:2, display:'flex', flexDirection:'column' }}>
        <Step n={1}/>

        <div style={{ marginTop: 12, marginBottom: 18, display:'flex', justifyContent:'center' }}>
          <Vessel size={64}/>
        </div>

        <H size={32} align="center">
          Welcome to <em style={{ fontStyle:'italic', fontWeight:300 }}>Daily Fuel</em>.
        </H>

        <div style={{ marginTop: 18, padding: '0 12px' }}>
          <P size={15} color={DF.ink} lineHeight={1.65} align="center">
            Daily Fuel is designed to support — not replace — your medical care. By continuing, you confirm you're using this medication with medical guidance.
          </P>
        </div>

        {/* checkbox */}
        <button onClick={() => setProfile({...profile, medicalAck: !checked })} style={{
          marginTop: 36, padding: '16px 20px',
          background: checked ? 'rgba(212,175,55,0.10)' : 'rgba(255,255,255,0.5)',
          border: `1px solid ${checked ? DF.gold : DF.line}`,
          borderRadius: 14, cursor:'pointer',
          display:'flex', alignItems:'center', gap: 14,
          textAlign:'left', fontFamily: DF_FONT.body,
        }}>
          <div style={{
            width: 22, height: 22, borderRadius: 6,
            background: checked ? DF.gold : 'transparent',
            border: checked ? 'none' : `1.5px solid ${DF.muted}`,
            display:'flex', alignItems:'center', justifyContent:'center',
            flexShrink: 0, transition:'all 0.2s ease',
          }}>
            {checked && <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke={DF.navy} strokeWidth="2.5" strokeLinecap="round"><path d="M2 6L5 9L10 3"/></svg>}
          </div>
          <span style={{ fontSize: 14, color: DF.navy, lineHeight: 1.4 }}>
            I confirm I am under medical care.
          </span>
        </button>

        <div style={{ marginTop:'auto', display:'flex', flexDirection:'column', gap: 8 }}>
          <Btn disabled={!checked} onClick={() => nav.go('onb-1a')}>Let's get started</Btn>
        </div>
      </div>
    </PhoneShell>
  );
}

// ── 1a · PRIVACY COMMITMENT (NEW in v3) ────────────────────────────
// A quiet, protective handshake before any personal info is shared.
// Sun is small/settled — present, not performative.
function ScreenPrivacy({ nav }) {
  return (
    <PhoneShell bg={DF.cream}>
      <Atmosphere tone="morning"/>
      <div style={{ flex:1, padding:'24px 32px 32px', position:'relative', zIndex:2, display:'flex', flexDirection:'column' }}>
        <Step n={2}/>

        {/* small, settled sun — sits low like a quiet pilot light */}
        <div style={{ marginTop: 32, marginBottom: 26, display:'flex', justifyContent:'center' }}>
          <Sun size={88} rays={true} glow={true} vitality={0.45}/>
        </div>

        <H size={32} align="center">
          Your data stays <em style={{ fontStyle:'italic', fontWeight:300 }}>yours</em>.
        </H>

        <div style={{ marginTop: 20, padding:'0 8px' }}>
          <P size={15} color={DF.ink} lineHeight={1.7} align="center">
            We don't sell your data, share it with insurers, or use it for advertising. Daily Fuel exists to help you eat — that's it.
          </P>
        </div>

        {/* protective list of "what we never do" */}
        <div style={{
          marginTop: 28, padding:'18px 20px',
          background:'rgba(255,255,255,0.55)', border:`1px solid ${DF.line}`, borderRadius: 16,
          display:'flex', flexDirection:'column', gap: 12,
        }}>
          {[
            'No sale of your information',
            'No sharing with insurers or employers',
            'No advertising profile, ever',
          ].map(t => (
            <div key={t} style={{ display:'flex', alignItems:'center', gap: 10 }}>
              <div style={{
                width: 18, height: 18, borderRadius: 9,
                background:'rgba(212,175,55,0.16)', border:`1px solid ${DF.gold}`,
                display:'flex', alignItems:'center', justifyContent:'center', flexShrink: 0,
              }}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke={DF.goldDeep} strokeWidth="1.8" strokeLinecap="round"><path d="M1.5 5 L4 7.5 L8.5 2.5"/></svg>
              </div>
              <span style={{ fontSize: 13.5, color: DF.navy }}>{t}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 18, textAlign:'center' }}>
          <button onClick={(e) => e.preventDefault()} style={{
            background:'none', border:'none', padding:'6px 10px',
            color: DF.goldDeep, fontFamily: DF_FONT.body, fontSize: 13,
            cursor:'pointer', textDecoration:'underline', textDecorationThickness: 0.5, textUnderlineOffset: 4,
          }}>Read our full privacy policy</button>
        </div>

        <div style={{ marginTop:'auto', display:'flex', flexDirection:'column', gap: 8 }}>
          <Btn onClick={() => nav.go('onb-1b')}>Next</Btn>
        </div>
      </div>
    </PhoneShell>
  );
}

// ── 1b · MY GOALS · TARGETS (NEW in v3) ───────────────────────────
// Provider-shared protein + fiber targets. "Not yet" is equally valid.
function ScreenTargets({ profile, setProfile, nav, initialYes = null }) {
  const [yes, setYes] = React.useState(initialYes !== null ? initialYes : (profile.proteinTarget || profile.fiberTarget ? true : null));
  const proteinPresets = [60, 80, 100, 120];
  const fiberPresets   = [25, 30, 35];

  const setProtein = (v) => setProfile({ ...profile, proteinTarget: v });
  const setFiber   = (v) => setProfile({ ...profile, fiberTarget: v });

  const hasAny = profile.proteinTarget || profile.fiberTarget;

  return (
    <PhoneShell bg={DF.cream}>
      <Atmosphere tone="morning"/>
      <div style={{ flex:1, padding:'24px 32px 32px', position:'relative', zIndex:2, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <Step n={3}/>
        <Eyebrow>About you</Eyebrow>
        <H size={26}>
          Did your <em style={{ fontStyle:'italic', fontWeight:300 }}>provider</em> share daily protein or fiber targets with you?
        </H>
        <div style={{ marginTop: 10 }}>
          <P size={14}>If they did, we'll use them to personalize your Daily Fuel.</P>
        </div>

        {/* yes / not-yet selector — equal weight on both */}
        <div style={{ marginTop: 22, display:'flex', gap: 8 }}>
          {[
            { id:true,  label:'Yes, I have targets' },
            { id:false, label:'Not yet' },
          ].map(opt => {
            const on = yes === opt.id;
            return (
              <button key={String(opt.id)} onClick={() => setYes(opt.id)} style={{
                flex:1, padding:'12px 14px', borderRadius: 999, cursor:'pointer',
                background: on ? DF.navy : 'rgba(255,255,255,0.7)',
                color: on ? DF.cream : DF.navy,
                border: on ? '1px solid ' + DF.navy : '1px solid ' + DF.line,
                fontFamily: DF_FONT.body, fontSize: 13.5, fontWeight: 500,
                transition:'all 0.18s ease',
              }}>{opt.label}</button>
            );
          })}
        </div>

        {/* yes path — pill presets, like Go-Tos */}
        {yes === true && (
          <div style={{
            marginTop: 22, flex:1, overflowY:'auto',
            animation:'df-fadeup 0.32s cubic-bezier(0.34, 1.2, 0.64, 1)',
          }}>
            <div style={{ marginBottom: 22 }}>
              <div style={{ fontSize: 10, letterSpacing: 2, textTransform:'uppercase', color: DF.muted, marginBottom: 10, fontWeight: 700 }}>Protein target · grams/day</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap: 8 }}>
                {proteinPresets.map(v => {
                  const on = String(profile.proteinTarget) === String(v);
                  return (
                    <button key={v} onClick={() => setProtein(on ? '' : v)} style={{
                      padding:'10px 18px', borderRadius: 999, cursor:'pointer',
                      background: on ? DF.navy : 'rgba(255,255,255,0.7)',
                      color: on ? DF.cream : DF.navy,
                      border: on ? '1px solid ' + DF.navy : '1px solid ' + DF.line,
                      fontFamily: DF_FONT.body, fontSize: 14, fontWeight: 600,
                      letterSpacing: -0.1, fontVariantNumeric:'tabular-nums',
                      transition:'all 0.18s ease',
                    }}>{v}g</button>
                  );
                })}
                <input
                  type="number" inputMode="numeric" placeholder="Custom"
                  value={proteinPresets.includes(Number(profile.proteinTarget)) ? '' : (profile.proteinTarget || '')}
                  onChange={(e) => setProtein(e.target.value)}
                  style={{
                    width: 88, padding:'10px 14px', borderRadius: 999,
                    background:'rgba(255,255,255,0.7)', border:`1px dashed ${DF.muted}`,
                    color: DF.navy, fontFamily: DF_FONT.body, fontSize: 14,
                    outline:'none', textAlign:'center',
                  }}/>
              </div>
            </div>

            <div>
              <div style={{ fontSize: 10, letterSpacing: 2, textTransform:'uppercase', color: DF.muted, marginBottom: 10, fontWeight: 700 }}>Fiber target · grams/day</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap: 8 }}>
                {fiberPresets.map(v => {
                  const on = String(profile.fiberTarget) === String(v);
                  return (
                    <button key={v} onClick={() => setFiber(on ? '' : v)} style={{
                      padding:'10px 18px', borderRadius: 999, cursor:'pointer',
                      background: on ? DF.navy : 'rgba(255,255,255,0.7)',
                      color: on ? DF.cream : DF.navy,
                      border: on ? '1px solid ' + DF.navy : '1px solid ' + DF.line,
                      fontFamily: DF_FONT.body, fontSize: 14, fontWeight: 600,
                      letterSpacing: -0.1, fontVariantNumeric:'tabular-nums',
                      transition:'all 0.18s ease',
                    }}>{v}g</button>
                  );
                })}
                <input
                  type="number" inputMode="numeric" placeholder="Custom"
                  value={fiberPresets.includes(Number(profile.fiberTarget)) ? '' : (profile.fiberTarget || '')}
                  onChange={(e) => setFiber(e.target.value)}
                  style={{
                    width: 88, padding:'10px 14px', borderRadius: 999,
                    background:'rgba(255,255,255,0.7)', border:`1px dashed ${DF.muted}`,
                    color: DF.navy, fontFamily: DF_FONT.body, fontSize: 14,
                    outline:'none', textAlign:'center',
                  }}/>
              </div>
            </div>

            {hasAny && (
              <div style={{
                marginTop: 18, padding:'12px 16px', borderRadius: 12,
                background:'rgba(212,175,55,0.10)', border:`1px solid rgba(212,175,55,0.3)`,
                display:'flex', alignItems:'center', gap: 10,
              }}>
                <MiniSun size={18}/>
                <div style={{ fontSize: 13, color: DF.ink, lineHeight: 1.4, fontFamily: DF_FONT.display, fontStyle:'italic' }}>
                  Perfect — we'll use those to help you close the gap.
                </div>
              </div>
            )}
          </div>
        )}

        {/* not yet path — equally valid */}
        {yes === false && (
          <div style={{
            marginTop: 22,
            padding:'18px 20px', borderRadius: 16,
            background:'rgba(255,255,255,0.6)', border:`1px solid ${DF.line}`,
            animation:'df-fadeup 0.32s cubic-bezier(0.34, 1.2, 0.64, 1)',
          }}>
            <P size={14.5} color={DF.ink} lineHeight={1.65}>
              That's okay. Your provider can help set targets based on your medication and body's needs. You can add them anytime in <span style={{ color: DF.goldDeep, fontFamily: DF_FONT.display, fontStyle:'italic' }}>My Goals</span>.
            </P>
          </div>
        )}

        <div style={{ marginTop:'auto', display:'flex', flexDirection:'column', gap: 8, paddingTop: 12 }}>
          <Btn disabled={yes === null} onClick={() => nav.go('onb-2')}>Next</Btn>
        </div>
      </div>
    </PhoneShell>
  );
}

// ── 2 · MY GO-TOS ──────────────────────────────────────────────────
// Reusable component for tag-style food selection — used here + in My Foods.
function PillTagList({ items, selected, onToggle, kind = 'gold' }) {
  return (
    <div style={{ display:'flex', flexWrap:'wrap', gap: 8 }}>
      {items.map(it => {
        const on = selected.has(it.id);
        return (
          <button key={it.id} onClick={() => onToggle(it.id)} style={{
            padding:'10px 16px', borderRadius: 999, cursor:'pointer',
            fontFamily: DF_FONT.body, fontSize: 13.5, fontWeight: 500,
            background: on ? DF.navy : 'rgba(255,255,255,0.7)',
            color: on ? DF.cream : DF.navy,
            border: on ? '1px solid ' + DF.navy : '1px solid ' + DF.line,
            display:'inline-flex', alignItems:'center', gap: 7,
            transition: 'all 0.18s ease',
            boxShadow: on ? `0 2px 12px rgba(212,175,55,0.25)` : 'none',
          }}>
            {on && <span style={{
              width: 5, height: 5, borderRadius: 3,
              background: kind === 'gold' ? DF.gold : DF.cream,
              boxShadow: kind === 'gold' ? `0 0 6px ${DF.gold}` : 'none',
            }}/>}
            {it.name || it}
          </button>
        );
      })}
    </div>
  );
}

function ScreenGoTos({ profile, setProfile, nav }) {
  const selected = new Set(profile.goTos || []);
  const toggle = (id) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setProfile({ ...profile, goTos: [...next] });
  };
  return (
    <PhoneShell bg={DF.cream}>
      <Atmosphere tone="morning"/>
      <div style={{ flex:1, padding:'24px 32px 32px', position:'relative', zIndex:2, display:'flex', flexDirection:'column' }}>
        <Step n={4}/>
        <Eyebrow>Your kit</Eyebrow>
        <H size={30}>My <em style={{ fontStyle:'italic', fontWeight:300 }}>Go-Tos</em>.</H>
        <div style={{ marginTop: 12 }}>
          <P>These are your grab-and-go staples — the foods you reach for without thinking. Tap the ones you already eat.</P>
        </div>

        <div style={{ marginTop: 26, marginBottom: 24 }}>
          <PillTagList items={FOOD_GOTOS} selected={selected} onToggle={toggle}/>
        </div>

        {selected.size > 0 && (
          <div style={{
            padding: '12px 16px', borderRadius: 12,
            background: 'rgba(212,175,55,0.10)', border:`1px solid rgba(212,175,55,0.3)`,
            display:'flex', alignItems:'center', gap: 10,
            marginBottom: 16,
          }}>
            <MiniSun size={18}/>
            <div style={{ fontSize: 12.5, color: DF.ink, lineHeight: 1.4 }}>
              <b style={{ color: DF.navy }}>{selected.size}</b> in your corner. Add more anytime.
            </div>
          </div>
        )}

        <div style={{ marginTop:'auto', display:'flex', flexDirection:'column', gap: 8 }}>
          <Btn onClick={() => nav.go('onb-3')}>Next</Btn>
        </div>
      </div>
    </PhoneShell>
  );
}

// ── 3 · WILL EAT / WON'T EAT ───────────────────────────────────────
function ScreenWillEat({ profile, setProfile, nav }) {
  const wontEat = new Set(profile.wontEat || []);
  const groups = FOOD_GROUPS.filter(g => g.id !== 'gotos');

  const toggle = (id) => {
    const next = new Set(wontEat);
    next.has(id) ? next.delete(id) : next.add(id);
    setProfile({ ...profile, wontEat: [...next] });
  };

  return (
    <PhoneShell bg={DF.cream}>
      <Atmosphere tone="morning"/>
      <div style={{ flex:1, padding:'24px 0 0 0', position:'relative', zIndex:2, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <div style={{ padding:'0 32px' }}>
          <Step n={5}/>
          <Eyebrow>Your kit</Eyebrow>
          <H size={28}>Will eat. <em style={{ fontStyle:'italic', fontWeight:300, color: DF.muted }}>Won't eat.</em></H>
          <div style={{ marginTop: 10 }}>
            <P>Tap the foods that don't work for you. Skip the rest. Nothing is permanent — change anytime.</P>
          </div>
        </div>

        {/* scroll body */}
        <div style={{ flex:1, overflowY:'auto', padding:'18px 32px 16px', marginTop: 16 }}>
          {groups.map(g => (
            <div key={g.id} style={{ marginBottom: 18 }}>
              <div style={{
                fontSize: 10, letterSpacing: 2, textTransform:'uppercase',
                color: DF.muted, marginBottom: 10, fontWeight: 700,
              }}>{g.label}</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap: 6 }}>
                {g.items.map(it => {
                  const off = wontEat.has(it.id);
                  return (
                    <button key={it.id} onClick={() => toggle(it.id)} style={{
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
        </div>

        <div style={{ padding:'14px 32px 28px', borderTop: `1px solid ${DF.lineSoft}`, background: 'rgba(253,251,247,0.92)' }}>
          <Btn onClick={() => nav.go('onb-4')}>Next</Btn>
        </div>
      </div>
    </PhoneShell>
  );
}

// ── 4 · WEIGHT ─────────────────────────────────────────────────────
function ScreenWeight({ profile, setProfile, nav }) {
  return (
    <PhoneShell bg={DF.cream}>
      <Atmosphere tone="morning"/>
      <div style={{ flex:1, padding:'24px 32px 32px', position:'relative', zIndex:2, display:'flex', flexDirection:'column' }}>
        <Step n={6}/>
        <Eyebrow>About you</Eyebrow>
        <H size={28}>A little context.</H>

        <div style={{ marginTop: 28, display:'flex', flexDirection:'column', gap: 22 }}>
          {[
            { key:'currentWeight', title:'Current weight', sub:'Helps us personalize your protein target. Add it now or anytime later.' },
            { key:'goalWeight',    title:'Goal weight',    sub:'Helps us celebrate progress with you. Add it whenever you\u2019re ready.' },
          ].map(f => (
            <div key={f.key}>
              <H size={20}>{f.title}</H>
              <div style={{ marginTop: 6, marginBottom: 12 }}><P size={13.5}>{f.sub}</P></div>
              <div style={{
                display:'flex', alignItems:'center', gap: 8,
                padding:'14px 18px', background:'rgba(255,255,255,0.7)',
                border:`1px solid ${DF.line}`, borderRadius: 14,
              }}>
                <input
                  type="number" inputMode="numeric"
                  placeholder="—"
                  value={profile[f.key] || ''}
                  onChange={(e) => setProfile({ ...profile, [f.key]: e.target.value })}
                  style={{
                    flex:1, border:'none', background:'transparent',
                    fontFamily: DF_FONT.display, fontSize: 28, fontWeight: 400,
                    color: DF.navy, outline:'none',
                  }}/>
                <span style={{ fontSize: 12, color: DF.muted, letterSpacing: 2, textTransform:'uppercase', fontWeight: 600 }}>lbs</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop:'auto', display:'flex', flexDirection:'column', gap: 8 }}>
          <Btn onClick={() => nav.go('onb-5')}>Next</Btn>
          <Btn variant="ghost" onClick={() => nav.go('onb-5')}>Skip for now</Btn>
        </div>
      </div>
    </PhoneShell>
  );
}

// ── 5 · SHOT DAY ───────────────────────────────────────────────────
function ScreenShotDay({ profile, setProfile, nav }) {
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const sel = profile.shotDay;
  return (
    <PhoneShell bg={DF.cream}>
      <Atmosphere tone="morning"/>
      <div style={{ flex:1, padding:'24px 32px 32px', position:'relative', zIndex:2, display:'flex', flexDirection:'column' }}>
        <Step n={7}/>
        <Eyebrow>Your rhythm</Eyebrow>
        <H size={28}>What day do you<br/>take your <em style={{ fontStyle:'italic', fontWeight:300 }}>shot</em>?</H>
        <div style={{ marginTop: 10 }}>
          <P>We use this to time gentle check-ins around how your week tends to feel.</P>
        </div>

        <div style={{ marginTop: 28, display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap: 6 }}>
          {days.map(d => {
            const on = sel === d;
            return (
              <button key={d} onClick={() => setProfile({ ...profile, shotDay: d })} style={{
                aspectRatio: '1', display:'flex', flexDirection:'column',
                alignItems:'center', justifyContent:'center', gap: 4,
                borderRadius: 14, cursor:'pointer',
                background: on ? DF.navy : 'rgba(255,255,255,0.6)',
                color: on ? DF.cream : DF.navy,
                border: on ? 'none' : `1px solid ${DF.line}`,
                fontFamily: DF_FONT.body, fontSize: 12.5, fontWeight: 600,
                transition: 'all 0.18s ease',
                position:'relative',
              }}>
                {on && <div style={{ position:'absolute', top: 6, right: 6 }}><MiniSun size={12} color={DF.gold}/></div>}
                <span>{d}</span>
              </button>
            );
          })}
        </div>

        <div style={{ marginTop:'auto', display:'flex', flexDirection:'column', gap: 8 }}>
          <Btn disabled={!sel} onClick={() => nav.go('onb-6')}>Next</Btn>
          <Btn variant="ghost" onClick={() => nav.go('onb-6')}>Skip — I'd rather not share</Btn>
        </div>
      </div>
    </PhoneShell>
  );
}

// ── 6 · SUPPLEMENTS ────────────────────────────────────────────────
function ScreenSupps({ profile, setProfile, nav }) {
  const sel = new Set(profile.supps || []);
  const toggle = (s) => {
    const next = new Set(sel);
    next.has(s) ? next.delete(s) : next.add(s);
    setProfile({ ...profile, supps: [...next] });
  };
  const PillRow = ({ items }) => (
    <div style={{ display:'flex', flexWrap:'wrap', gap: 8 }}>
      {items.map(s => {
        const on = sel.has(s);
        return (
          <button key={s} onClick={() => toggle(s)} style={{
            padding:'9px 14px', borderRadius: 999, cursor:'pointer',
            fontFamily: DF_FONT.body, fontSize: 13, fontWeight: 500,
            background: on ? DF.navy : 'rgba(255,255,255,0.7)',
            color: on ? DF.cream : DF.navy,
            border: on ? 'none' : `1px solid ${DF.line}`,
            transition: 'all 0.18s ease',
          }}>{s}</button>
        );
      })}
    </div>
  );
  return (
    <PhoneShell bg={DF.cream}>
      <Atmosphere tone="morning"/>
      <div style={{ flex:1, padding:'24px 32px 32px', position:'relative', zIndex:2, display:'flex', flexDirection:'column' }}>
        <Step n={8}/>
        <Eyebrow>Your kit</Eyebrow>
        <H size={28}>Your <em style={{ fontStyle:'italic', fontWeight:300 }}>supplements</em>.</H>
        <div style={{ marginTop: 10 }}>
          <P>If you take any of these, tap to select. We'll include a gentle reminder in your daily plan.</P>
        </div>

        <div style={{ marginTop: 24, marginBottom: 18 }}>
          <div style={{ fontSize: 10, letterSpacing: 2, textTransform:'uppercase', color: DF.muted, marginBottom: 10, fontWeight: 700 }}>Common</div>
          <PillRow items={SUPPS_T1}/>
        </div>
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 10, letterSpacing: 2, textTransform:'uppercase', color: DF.muted, marginBottom: 10, fontWeight: 700 }}>Also common</div>
          <PillRow items={SUPPS_T2}/>
        </div>

        <div style={{ marginTop:'auto', display:'flex', flexDirection:'column', gap: 8 }}>
          <Btn onClick={() => nav.go('onb-7')}>Next</Btn>
          <Btn variant="ghost" onClick={() => nav.go('onb-7')}>I don't take any</Btn>
        </div>
      </div>
    </PhoneShell>
  );
}

// ── 7 · NOTIFICATION TIME ──────────────────────────────────────────
function ScreenNotifTime({ profile, setProfile, nav }) {
  const time = profile.notifTime || '09:00';
  const [h, m] = time.split(':').map(Number);
  // sun position on a clock arc — 6am at left, 6pm at right
  const hourFloat = h + m / 60;
  const dayT = Math.max(0, Math.min(1, (hourFloat - 5) / 14));
  const angle = Math.PI + dayT * Math.PI;
  const cx = 100 + Math.cos(angle) * 75;
  const cy = 110 + Math.sin(angle) * 65;
  const hh12 = ((h + 11) % 12) + 1;
  const ampm = h < 12 ? 'AM' : 'PM';

  return (
    <PhoneShell bg={DF.cream}>
      <Atmosphere tone="morning"/>
      <div style={{ flex:1, padding:'24px 32px 32px', position:'relative', zIndex:2, display:'flex', flexDirection:'column' }}>
        <Step n={9}/>
        <Eyebrow>Your rhythm</Eyebrow>
        <H size={28}>When should we<br/><em style={{ fontStyle:'italic', fontWeight:300 }}>check in</em>?</H>
        <div style={{ marginTop: 10 }}>
          <P>A daily nudge at a time that fits your life.</P>
        </div>

        {/* clock with sun */}
        <div style={{ marginTop: 22, display:'flex', justifyContent:'center' }}>
          <svg width="200" height="120" viewBox="0 0 200 120" style={{ overflow:'visible' }}>
            <defs>
              <linearGradient id="nt-sky" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%"  stopColor={DF.goldGlow} stopOpacity="0.5"/>
                <stop offset="100%" stopColor={DF.creamWarm} stopOpacity="0"/>
              </linearGradient>
              <radialGradient id="nt-sun">
                <stop offset="0%" stopColor="#FEF6DE"/>
                <stop offset="60%" stopColor={DF.goldSoft}/>
                <stop offset="100%" stopColor={DF.gold}/>
              </radialGradient>
            </defs>
            {/* sky tint */}
            <path d="M 25 110 A 75 75 0 0 1 175 110" fill="url(#nt-sky)" opacity="0.6"/>
            {/* arc */}
            <path d="M 25 110 A 75 75 0 0 1 175 110" fill="none" stroke={DF.gold} strokeWidth="1" strokeOpacity="0.5" strokeDasharray="3 4"/>
            {/* horizon */}
            <line x1="10" y1="110" x2="190" y2="110" stroke={DF.gold} strokeWidth="1.2"/>
            {/* tick marks for 6/12/6 */}
            <text x="25" y="125" fontSize="9" fill={DF.muted} textAnchor="middle" fontFamily={DF_FONT.body}>6 AM</text>
            <text x="100" y="125" fontSize="9" fill={DF.muted} textAnchor="middle" fontFamily={DF_FONT.body}>NOON</text>
            <text x="175" y="125" fontSize="9" fill={DF.muted} textAnchor="middle" fontFamily={DF_FONT.body}>8 PM</text>
            {/* sun */}
            <circle cx={cx} cy={cy} r="22" fill={DF.goldSoft} opacity="0.4"/>
            <circle cx={cx} cy={cy} r="12" fill="url(#nt-sun)" style={{ transition:'all 0.4s ease' }}/>
          </svg>
        </div>

        {/* selected time display */}
        <div style={{ textAlign:'center', marginTop: 12 }}>
          <H size={42}>{hh12}:{String(m).padStart(2,'0')} <span style={{ fontSize: 20, color: DF.muted }}>{ampm}</span></H>
        </div>

        {/* native time picker */}
        <div style={{ marginTop: 18, display:'flex', justifyContent:'center' }}>
          <input type="time" value={time} onChange={(e) => setProfile({ ...profile, notifTime: e.target.value })}
            style={{
              padding:'10px 16px', borderRadius: 12, fontFamily: DF_FONT.body, fontSize: 14,
              border:`1px solid ${DF.line}`, background:'rgba(255,255,255,0.7)', color: DF.navy,
              fontVariantNumeric:'tabular-nums',
            }}/>
        </div>

        <div style={{ marginTop:'auto', display:'flex', flexDirection:'column', gap: 8 }}>
          <Btn onClick={() => nav.go('onb-8')}>I'm ready</Btn>
        </div>
      </div>
    </PhoneShell>
  );
}

// ── 8 · CELEBRATION ────────────────────────────────────────────────
function ScreenOnbCelebrate({ profile, nav }) {
  // Echo 2-3 selections
  const picks = [];
  (profile.goTos || []).slice(0, 3).forEach(id => {
    const f = ALL_FOODS_BY_ID[id];
    if (f) picks.push(f.name);
  });
  const echo = picks.length >= 2
    ? `You've got ${picks.slice(0,-1).join(', ')} and ${picks[picks.length-1]} in your corner.`
    : (picks.length === 1
      ? `You've got ${picks[0]} in your corner.`
      : "Your daily plan is ready to begin.");

  return (
    <PhoneShell bg={DF.cream}>
      <Atmosphere tone="golden"/>

      {/* hero sun, slightly off-center */}
      <div style={{ position:'absolute', top: 80, left:'50%', transform:'translateX(-50%)', zIndex: 2 }}>
        <Sun size={220} glow={true} rays={true}/>
      </div>

      <div style={{ flex:1, padding:'330px 32px 36px', position:'relative', zIndex: 3, display:'flex', flexDirection:'column' }}>
        <Eyebrow color={DF.goldDeep}>You're set</Eyebrow>
        <H size={34}>
          Welcome in, <em style={{ fontStyle:'italic', fontWeight:300 }}>{profile.firstName || 'friend'}</em>.
        </H>

        <div style={{ marginTop: 16, padding: '18px 20px', background:'rgba(255,255,255,0.55)', borderRadius: 16, border: `1px solid ${DF.line}` }}>
          <P size={15} color={DF.ink} lineHeight={1.6}>{echo}</P>
          <div style={{ height: 1, background: DF.line, margin: '14px 0' }}/>
          <P size={14} color={DF.navyMute} lineHeight={1.55}>
            Every day, tell us how eating feels — and we'll build your Daily Fuel from there.
          </P>
        </div>

        <div style={{ marginTop:'auto', display:'flex', flexDirection:'column', gap: 8 }}>
          <Btn onClick={() => nav.go('state-selector')}>Start my day</Btn>
        </div>
      </div>
    </PhoneShell>
  );
}

Object.assign(window, {
  ScreenLanding, ScreenCreate, ScreenMedical,
  ScreenPrivacy, ScreenTargets,
  ScreenGoTos, ScreenWillEat,
  ScreenWeight, ScreenShotDay, ScreenSupps, ScreenNotifTime, ScreenOnbCelebrate,
  PillTagList,
});
