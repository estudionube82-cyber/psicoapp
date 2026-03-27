/**
 * view-cuenta.js
 * ─────────────────────────────────────────────────────────────
 * Vista de suscripción SaaS PRO — tarjetas de planes, estado
 * desde localStorage, evento global perfilActualizado.
 * ─────────────────────────────────────────────────────────────
 */

(function injectCuentaStyles() {
  if (document.getElementById('view-cuenta-styles')) return;
  const style = document.createElement('style');
  style.id = 'view-cuenta-styles';
  style.textContent = `
#view-cuenta { min-height: 100vh; background: var(--bg); }

/* ── HERO HEADER ── */
#view-cuenta .vc-hero {
  background: linear-gradient(145deg, #1E1040 0%, #2D1B69 55%, #4C2A9A 100%);
  padding: 28px 20px 56px;
  position: relative; overflow: hidden;
}
#view-cuenta .vc-hero::before {
  content: ''; position: absolute;
  width: 260px; height: 260px; border-radius: 50%;
  background: rgba(255,255,255,0.04);
  right: -60px; top: -60px;
}
#view-cuenta .vc-hero::after {
  content: ''; position: absolute;
  width: 180px; height: 180px; border-radius: 50%;
  background: rgba(167,139,250,0.1);
  left: -40px; bottom: -40px;
}
#view-cuenta .vc-hero-inner {
  position: relative; z-index: 1;
  display: flex; align-items: center; gap: 16px;
}
#view-cuenta .vc-avatar {
  width: 64px; height: 64px; border-radius: 20px;
  background: linear-gradient(135deg, #5B2FA8, #A78BFA);
  display: flex; align-items: center; justify-content: center;
  font-size: 24px; font-weight: 800; color: white;
  flex-shrink: 0;
  border: 2px solid rgba(255,255,255,0.18);
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  overflow: hidden;
}
#view-cuenta .vc-avatar img { width: 100%; height: 100%; object-fit: cover; border-radius: 18px; }
#view-cuenta .vc-hero-name {
  font-size: 20px; font-weight: 800; color: white; line-height: 1.1;
}
#view-cuenta .vc-hero-email {
  font-size: 13px; color: rgba(255,255,255,0.55); margin-top: 3px;
}
#view-cuenta .vc-hero-badge {
  display: inline-flex; align-items: center; gap: 5px;
  margin-top: 7px; padding: 3px 10px; border-radius: 20px;
  font-size: 11px; font-weight: 800; letter-spacing: .3px;
}
#view-cuenta .hb-pro {
  background: linear-gradient(135deg, rgba(124,58,237,0.6), rgba(167,139,250,0.4));
  border: 1px solid rgba(167,139,250,0.4);
  color: #DDD6FE;
}
#view-cuenta .hb-free {
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.15);
  color: rgba(255,255,255,0.6);
}

/* ── BODY ── */
#view-cuenta .vc-body {
  padding: 0 16px 40px;
  margin-top: -28px;
  position: relative; z-index: 5;
  display: flex; flex-direction: column; gap: 16px;
  max-width: 560px; margin-left: auto; margin-right: auto;
}
@media (min-width: 768px) {
  #view-cuenta .vc-body { padding: 0 28px 40px; }
}

/* ── STATUS STRIP ── */
#view-cuenta .vc-status-strip {
  background: var(--surface);
  border-radius: var(--radius);
  padding: 14px 18px;
  display: flex; align-items: center; justify-content: space-between;
  box-shadow: var(--shadow-md);
}
#view-cuenta .vc-strip-left { display: flex; align-items: center; gap: 10px; }
#view-cuenta .vc-strip-dot {
  width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0;
}
#view-cuenta .dot-activa { background: #10B981; box-shadow: 0 0 8px rgba(16,185,129,0.5); }
#view-cuenta .dot-inactiva { background: #9CA3AF; }
#view-cuenta .vc-strip-label { font-size: 13px; font-weight: 600; color: var(--text-muted); }
#view-cuenta .vc-strip-val { font-size: 14px; font-weight: 800; color: var(--text); }
#view-cuenta .vc-strip-fecha { font-size: 11px; color: var(--text-muted); font-weight: 500; }

/* ── PLANES GRID ── */
#view-cuenta .vc-planes-title {
  font-size: 13px; font-weight: 800; color: var(--text-muted);
  text-transform: uppercase; letter-spacing: .8px;
}
#view-cuenta .vc-planes-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
}
@media (max-width: 380px) {
  #view-cuenta .vc-planes-grid { grid-template-columns: 1fr; }
}

/* ── PLAN CARD ── */
#view-cuenta .vc-plan-card {
  background: var(--surface);
  border-radius: var(--radius);
  padding: 18px 16px 16px;
  border: 2px solid var(--border);
  position: relative;
  display: flex; flex-direction: column; gap: 12px;
  transition: border-color .15s, box-shadow .15s;
  box-shadow: var(--shadow-sm);
}
#view-cuenta .vc-plan-card.plan-actual {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-light), var(--shadow-md);
}
#view-cuenta .vc-plan-card.plan-pro-card {
  background: linear-gradient(160deg, #1E1040 0%, #2D1B69 100%);
  border-color: rgba(167,139,250,0.4);
}

/* badges */
#view-cuenta .vc-plan-badge-wrap {
  display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
}
#view-cuenta .vc-badge {
  font-size: 10px; font-weight: 800; padding: 3px 9px;
  border-radius: 20px; letter-spacing: .3px;
}
#view-cuenta .badge-actual {
  background: rgba(16,185,129,0.15); color: #10B981;
  border: 1px solid rgba(16,185,129,0.3);
}
#view-cuenta .badge-recomendado {
  background: linear-gradient(135deg, #5B2FA8, #7C3AED);
  color: white;
}
#view-cuenta .badge-free-tag {
  background: var(--surface2); color: var(--text-muted);
}

/* nombre del plan */
#view-cuenta .vc-plan-name {
  font-size: 22px; font-weight: 800; line-height: 1;
}
#view-cuenta .plan-pro-card .vc-plan-name { color: white; }
#view-cuenta .plan-free-card .vc-plan-name { color: var(--text); }

#view-cuenta .vc-plan-price {
  font-size: 13px; font-weight: 600;
}
#view-cuenta .plan-pro-card .vc-plan-price { color: rgba(255,255,255,0.55); }
#view-cuenta .plan-free-card .vc-plan-price { color: var(--text-muted); }

/* features list */
#view-cuenta .vc-plan-features {
  display: flex; flex-direction: column; gap: 7px;
  flex: 1;
}
#view-cuenta .vc-pf {
  display: flex; align-items: flex-start; gap: 7px;
  font-size: 12px; font-weight: 500; line-height: 1.3;
}
#view-cuenta .plan-pro-card .vc-pf { color: rgba(255,255,255,0.75); }
#view-cuenta .plan-free-card .vc-pf { color: var(--text-muted); }
#view-cuenta .vc-pf-icon { font-size: 13px; flex-shrink: 0; margin-top: 1px; }
#view-cuenta .pf-lock { opacity: .45; }

/* plan buttons */
#view-cuenta .vc-plan-btn {
  width: 100%; padding: 11px;
  border-radius: var(--radius-sm);
  border: none; font-family: var(--font);
  font-size: 13px; font-weight: 800;
  cursor: pointer; transition: transform .12s, opacity .12s;
  display: flex; align-items: center; justify-content: center; gap: 6px;
}
#view-cuenta .vc-plan-btn:hover { transform: translateY(-1px); opacity: .9; }
#view-cuenta .vc-plan-btn:active { transform: translateY(0); }
#view-cuenta .btn-plan-actual {
  background: var(--surface2); color: var(--text-muted);
  cursor: default;
}
#view-cuenta .btn-plan-actual:hover { transform: none; opacity: 1; }
#view-cuenta .btn-upgrade {
  background: linear-gradient(135deg, #5B2FA8, #7C3AED);
  color: white; box-shadow: 0 4px 16px rgba(92,47,168,0.4);
}
#view-cuenta .btn-free-actual {
  background: var(--primary-light); color: var(--primary);
}

/* ── YA PAGUÉ ── */
#view-cuenta .vc-yapague-card {
  background: var(--surface);
  border-radius: var(--radius);
  padding: 18px 18px;
  box-shadow: var(--shadow-sm);
  display: flex; flex-direction: column; gap: 10px;
}
#view-cuenta .vc-yapague-title {
  font-size: 14px; font-weight: 700; color: var(--text);
}
#view-cuenta .vc-yapague-sub {
  font-size: 12px; color: var(--text-muted); line-height: 1.5;
}
#view-cuenta .vc-btn-yapague {
  width: 100%; padding: 13px;
  border-radius: var(--radius-sm);
  background: rgba(16,185,129,0.1);
  color: #059669;
  border: 1.5px solid rgba(16,185,129,0.25);
  font-family: var(--font); font-size: 14px; font-weight: 800;
  cursor: pointer; transition: transform .12s;
}
#view-cuenta .vc-btn-yapague:hover { transform: translateY(-1px); }

/* ── LOGOUT ── */
#view-cuenta .vc-logout-wrap {
  display: flex; flex-direction: column; gap: 8px;
}
#view-cuenta .vc-btn-logout {
  width: 100%; padding: 13px;
  border-radius: var(--radius-sm);
  background: var(--danger-light); color: var(--danger);
  border: 1.5px solid rgba(229,62,62,0.2);
  font-family: var(--font); font-size: 14px; font-weight: 700;
  cursor: pointer; transition: transform .12s;
}
#view-cuenta .vc-btn-logout:hover { transform: translateY(-1px); }

/* ── TOAST ── */
#view-cuenta .vc-toast {
  position: fixed; top: 80px; left: 50%; transform: translateX(-50%);
  background: #1A1530; color: white;
  padding: 12px 22px; border-radius: 12px;
  font-size: 14px; font-weight: 700;
  z-index: 9999; display: none;
  white-space: nowrap;
  box-shadow: 0 8px 32px rgba(0,0,0,0.35);
}
#view-cuenta .vc-toast.show { display: block; animation: vcFadeUp .25s ease; }
@keyframes vcFadeUp { from{opacity:0;transform:translate(-50%,8px)} to{opacity:1;transform:translate(-50%,0)} }

#view-cuenta .vc-pad { height: 24px; }
  `;
  document.head.appendChild(style);
})();


/* ═══════════════════════════════════════
   FUNCIONES
   ═══════════════════════════════════════ */

function vc_getPerfil() {
  try { return JSON.parse(localStorage.getItem('perfil')) || {}; }
  catch { return {}; }
}

function getSuscripcion() {
  try { return JSON.parse(localStorage.getItem('suscripcion')) || null; }
  catch { return null; }
}

function saveSuscripcion(data) {
  localStorage.setItem('suscripcion', JSON.stringify(data));
}

function activarSuscripcion(planElegido) {
  const planFinal = planElegido || 'pro';
  const s = getSuscripcion();
  saveSuscripcion({
    plan: planFinal,
    estado: 'activa',
    fechaInicio: s?.fechaInicio || new Date().toISOString(),
    usos:  s?.usos  || { whatsapp: 0, informesIA: 0 },
    extra: s?.extra || { whatsapp: 0 },
  });
  renderCuenta();
  vcToast(`✅ ¡Suscripción ${planFinal.toUpperCase()} activada!`);
}

function vcToast(msg) {
  const t = document.getElementById('vc-toast-global');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3500);
}

/* ═══════════════════════════════════════
   SISTEMA SAAS — LÍMITES POR PLAN
   ═══════════════════════════════════════ */

function getPlanLimits(plan) {
  const limits = {
    free: { dias: 15,  whatsapp: 20,  informesIA: 1  },
    pro:  { dias: null, whatsapp: 100, informesIA: 3  },
    max:  { dias: null, whatsapp: 250, informesIA: 25 },
  };
  return limits[plan] || limits.free;
}

function diasDesdeInicio(fecha) {
  if (!fecha) return 0;
  const inicio = new Date(fecha);
  const ahora  = new Date();
  return Math.floor((ahora - inicio) / (1000 * 60 * 60 * 24));
}

function puedeUsar(feature) {
  const s      = getSuscripcion();
  const plan   = s?.plan   || 'free';
  const estado = s?.estado || 'inactiva';
  if (estado !== 'activa') return false;

  const limits = getPlanLimits(plan);
  const usos   = s?.usos   || { whatsapp: 0, informesIA: 0 };
  const extra  = s?.extra  || { whatsapp: 0 };

  /* Control de 15 días para plan free */
  if (plan === 'free' && limits.dias !== null) {
    const dias = diasDesdeInicio(s?.fechaInicio);
    if (dias >= limits.dias) return false;
  }

  if (feature === 'whatsapp') {
    const tope = limits.whatsapp + (extra.whatsapp || 0);
    return (usos.whatsapp || 0) < tope;
  }
  if (feature === 'informesIA') {
    return (usos.informesIA || 0) < limits.informesIA;
  }
  return true;
}

function registrarUso(feature) {
  const s = getSuscripcion();
  if (!s) return false;
  if (!puedeUsar(feature)) return false;

  if (!s.usos) s.usos = { whatsapp: 0, informesIA: 0 };
  if (feature === 'whatsapp')   s.usos.whatsapp   = (s.usos.whatsapp   || 0) + 1;
  if (feature === 'informesIA') s.usos.informesIA = (s.usos.informesIA || 0) + 1;

  saveSuscripcion(s);
  return true;
}

function avisoLimite(feature) {
  const s      = getSuscripcion();
  const plan   = s?.plan   || 'free';
  const limits = getPlanLimits(plan);
  const usos   = s?.usos   || { whatsapp: 0, informesIA: 0 };
  const extra  = s?.extra  || { whatsapp: 0 };

  if (feature === 'whatsapp') {
    const tope  = limits.whatsapp + (extra.whatsapp || 0);
    const usado = usos.whatsapp || 0;
    const resta = tope - usado;
    if (resta <= 0)  return '🚫 Sin mensajes WhatsApp disponibles';
    if (resta === 1) return '⚠️ Te queda 1 mensaje WhatsApp disponible';
    if (resta <= 5)  return `⚠️ Te quedan ${resta} mensajes WhatsApp disponibles`;
    return null;
  }
  if (feature === 'informesIA') {
    const tope  = limits.informesIA;
    const usado = usos.informesIA || 0;
    const resta = tope - usado;
    if (resta <= 0)  return '🚫 Sin informes IA disponibles';
    if (resta === 1) return '⚠️ Te queda 1 informe IA disponible';
    return null;
  }
  return null;
}

function comprarExtraWhatsapp() {
  const s = getSuscripcion();
  if (!s) return;
  if (!s.extra) s.extra = { whatsapp: 0 };
  s.extra.whatsapp = (s.extra.whatsapp || 0) + 100;
  saveSuscripcion(s);
  renderCuenta();
  vcToast('✅ 100 mensajes WhatsApp extra agregados');
}

/* Barra de progreso de uso */
function _usageBarHTML(usado, tope, label, colorClass) {
  const pct     = tope > 0 ? Math.min(100, Math.round((usado / tope) * 100)) : 0;
  const alerta  = pct >= 80;
  const barColor = alerta ? '#EF4444' : (colorClass || '#7C3AED');
  return `
<div style="display:flex;flex-direction:column;gap:6px;">
  <div style="display:flex;justify-content:space-between;align-items:center;">
    <span style="font-size:12px;font-weight:700;color:var(--text-muted);">${label}</span>
    <span style="font-size:13px;font-weight:800;color:${alerta ? '#EF4444' : 'var(--text)'};">${usado} / ${tope}</span>
  </div>
  <div style="height:7px;border-radius:99px;background:var(--border);overflow:hidden;">
    <div style="height:100%;width:${pct}%;border-radius:99px;background:${barColor};transition:width .4s;"></div>
  </div>
</div>`;
}

function renderCuenta() {
  const container = document.getElementById('view-cuenta');
  if (!container) return;

  const perfil      = vc_getPerfil();
  const suscripcion = getSuscripcion();
  const esPro       = suscripcion?.plan === 'pro' && suscripcion?.estado === 'activa';
  const linkPago    = 'https://mpago.la/TU_LINK_AQUI';

  const plan   = suscripcion?.plan   || 'free';
  const limits = getPlanLimits(plan);
  const usos   = suscripcion?.usos  || { whatsapp: 0, informesIA: 0 };
  const extra  = suscripcion?.extra || { whatsapp: 0 };

  /* Cálculo días restantes free */
  const diasUsados    = diasDesdeInicio(suscripcion?.fechaInicio);
  const diasRestantes = limits.dias !== null ? Math.max(0, limits.dias - diasUsados) : null;

  /* Topes reales (con extras) */
  const topeWA = limits.whatsapp + (extra.whatsapp || 0);
  const topeIA = limits.informesIA;

  /* Bloque de uso */
  const usageHTML = esPro || plan === 'max' || plan === 'free' ? `
  <div style="background:var(--surface);border-radius:var(--radius);padding:20px;box-shadow:var(--shadow-sm);display:flex;flex-direction:column;gap:14px;">
    <div style="font-size:13px;font-weight:800;color:var(--text-muted);text-transform:uppercase;letter-spacing:.8px;">Uso del plan</div>
    ${plan === 'free' && diasRestantes !== null ? `
    <div style="display:flex;align-items:center;gap:10px;background:${diasRestantes <= 3 ? 'rgba(239,68,68,0.08)' : 'var(--surface2)'};border-radius:10px;padding:11px 14px;">
      <span style="font-size:20px;">${diasRestantes <= 3 ? '🔴' : '📅'}</span>
      <div>
        <div style="font-size:13px;font-weight:800;color:${diasRestantes <= 3 ? '#EF4444' : 'var(--text)'};">${diasRestantes} días restantes del período Free</div>
        <div style="font-size:11px;color:var(--text-muted);">15 días de prueba desde el inicio</div>
      </div>
    </div>` : ''}
    ${_usageBarHTML(usos.whatsapp || 0, topeWA, '💬 Mensajes WhatsApp', '#7C3AED')}
    ${_usageBarHTML(usos.informesIA || 0, topeIA, '🤖 Informes IA', '#A78BFA')}
    ${plan === 'pro' ? `
    <button onclick="comprarExtraWhatsapp()" style="
      width:100%;padding:12px;border-radius:var(--radius-sm);
      background:linear-gradient(135deg,rgba(92,47,168,0.1),rgba(124,58,237,0.08));
      border:1.5px dashed rgba(124,58,237,0.35);
      color:var(--primary);font-family:var(--font);font-size:13px;font-weight:800;
      cursor:pointer;transition:transform .12s;">
      ➕ Comprar 100 mensajes WhatsApp extra ($5.000)
    </button>` : ''}
  </div>` : '';

  const nombre    = perfil.nombre  || 'Profesional';
  const email     = perfil.email   || '';
  const iniciales = nombre.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).toUpperCase().join('');
  const avatarHTML = perfil.foto
    ? `<img src="${perfil.foto}" style="width:100%;height:100%;object-fit:cover;border-radius:18px;">`
    : (iniciales || '👤');

  const fechaLabel = esPro && suscripcion.fechaInicio
    ? new Date(suscripcion.fechaInicio).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })
    : null;

  container.innerHTML = `
<div id="vc-toast-global" class="vc-toast"></div>

<!-- HERO -->
<div class="vc-hero">
  <div class="vc-hero-inner">
    <div class="vc-avatar" id="vc-avatar">${avatarHTML}</div>
    <div>
      <div class="vc-hero-name">${nombre}</div>
      ${email ? `<div class="vc-hero-email">${email}</div>` : ''}
      <div class="vc-hero-badge ${esPro ? 'hb-pro' : 'hb-free'}">
        ${esPro ? '⭐ Plan Pro activo' : '🔒 Plan Free'}
      </div>
    </div>
  </div>
</div>

<div class="vc-body">

  <!-- STATUS STRIP -->
  <div class="vc-status-strip">
    <div class="vc-strip-left">
      <div class="vc-strip-dot ${esPro ? 'dot-activa' : 'dot-inactiva'}"></div>
      <div>
        <div class="vc-strip-label">Estado de suscripción</div>
        <div class="vc-strip-val">${esPro ? 'Activa' : 'Inactiva'}</div>
      </div>
    </div>
    <div style="text-align:right">
      <div class="vc-strip-label">Plan</div>
      <div class="vc-strip-val">${esPro ? 'Pro' : 'Gratuito'}</div>
      ${fechaLabel ? `<div class="vc-strip-fecha">Desde ${fechaLabel}</div>` : ''}
    </div>
  </div>

  <!-- TÍTULO PLANES -->
  <div class="vc-planes-title">Elegí tu plan</div>

  ${usageHTML}

  <!-- PLANES GRID (3 columnas en desktop) -->
  <div class="vc-planes-grid" style="grid-template-columns:repeat(auto-fit,minmax(140px,1fr));">

    <!-- FREE -->
    <div class="vc-plan-card plan-free-card ${plan === 'free' ? 'plan-actual' : ''}">
      <div class="vc-plan-badge-wrap">
        ${plan === 'free' ? '<span class="vc-badge badge-actual">✓ Actual</span>' : '<span class="vc-badge badge-free-tag">Free</span>'}
      </div>
      <div>
        <div class="vc-plan-name">Free</div>
        <div class="vc-plan-price">15 días de prueba</div>
      </div>
      <div class="vc-plan-features">
        <div class="vc-pf"><span class="vc-pf-icon">✅</span>20 mensajes WhatsApp</div>
        <div class="vc-pf"><span class="vc-pf-icon">✅</span>1 informe IA</div>
        <div class="vc-pf pf-lock"><span class="vc-pf-icon">🔒</span>Pacientes ilimitados</div>
        <div class="vc-pf pf-lock"><span class="vc-pf-icon">🔒</span>Soporte prioritario</div>
      </div>
      <button class="vc-plan-btn btn-plan-actual" disabled>
        ${plan === 'free' ? '✓ Plan actual' : 'Plan básico'}
      </button>
    </div>

    <!-- PRO -->
    <div class="vc-plan-card plan-pro-card ${plan === 'pro' ? 'plan-actual' : ''}">
      <div class="vc-plan-badge-wrap">
        <span class="vc-badge badge-recomendado">⭐ Recomendado</span>
        ${plan === 'pro' ? '<span class="vc-badge badge-actual">✓ Actual</span>' : ''}
      </div>
      <div>
        <div class="vc-plan-name">Pro</div>
        <div class="vc-plan-price">Mensual</div>
      </div>
      <div class="vc-plan-features">
        <div class="vc-pf"><span class="vc-pf-icon">✅</span>100 mensajes WhatsApp</div>
        <div class="vc-pf"><span class="vc-pf-icon">✅</span>3 informes IA</div>
        <div class="vc-pf"><span class="vc-pf-icon">✅</span>Pacientes ilimitados</div>
        <div class="vc-pf"><span class="vc-pf-icon">✅</span>Extras disponibles</div>
      </div>
      ${plan !== 'pro'
        ? `<button class="vc-plan-btn btn-upgrade" id="vc-btn-upgrade-pro">🚀 Activar Pro</button>`
        : `<button class="vc-plan-btn btn-plan-actual" disabled>✓ Plan actual</button>`
      }
    </div>

    <!-- MAX -->
    <div class="vc-plan-card plan-pro-card ${plan === 'max' ? 'plan-actual' : ''}" style="${plan === 'max' ? '' : 'background:linear-gradient(160deg,#0F0B1E 0%,#1E0A3C 100%);border-color:rgba(244,114,182,0.4);'}">
      <div class="vc-plan-badge-wrap">
        <span class="vc-badge" style="background:linear-gradient(135deg,#BE185D,#F472B6);color:white;">💎 Max</span>
        ${plan === 'max' ? '<span class="vc-badge badge-actual">✓ Actual</span>' : ''}
      </div>
      <div>
        <div class="vc-plan-name" style="color:white;">Max</div>
        <div class="vc-plan-price" style="color:rgba(255,255,255,0.5);">Mensual</div>
      </div>
      <div class="vc-plan-features">
        <div class="vc-pf" style="color:rgba(255,255,255,0.8);"><span class="vc-pf-icon">✅</span>250 mensajes WhatsApp</div>
        <div class="vc-pf" style="color:rgba(255,255,255,0.8);"><span class="vc-pf-icon">✅</span>25 informes IA</div>
        <div class="vc-pf" style="color:rgba(255,255,255,0.8);"><span class="vc-pf-icon">✅</span>Pacientes ilimitados</div>
        <div class="vc-pf" style="color:rgba(255,255,255,0.8);"><span class="vc-pf-icon">✅</span>Soporte prioritario</div>
      </div>
      ${plan !== 'max'
        ? `<button class="vc-plan-btn btn-upgrade" id="vc-btn-upgrade-max" style="background:linear-gradient(135deg,#BE185D,#F472B6);box-shadow:0 4px 16px rgba(244,114,182,0.4);">💎 Activar Max</button>`
        : `<button class="vc-plan-btn btn-plan-actual" disabled>✓ Plan actual</button>`
      }
    </div>

  </div>

  <!-- YA PAGUÉ (solo si no es pro ni max) -->
  ${plan === 'free' ? `
  <div class="vc-yapague-card">
    <div class="vc-yapague-title">¿Ya realizaste el pago?</div>
    <div class="vc-yapague-sub">
      Una vez abonado, activá tu plan desde aquí.
    </div>
    <div style="display:flex;gap:10px;">
      <button class="vc-btn-yapague" id="vc-btn-yapague-pro" style="flex:1;">✅ Activar Pro</button>
      <button class="vc-btn-yapague" id="vc-btn-yapague-max" style="flex:1;background:rgba(244,114,182,0.1);color:#BE185D;border-color:rgba(244,114,182,0.25);">💎 Activar Max</button>
    </div>
  </div>
  ` : ''}

  <!-- LOGOUT -->
  <div class="vc-logout-wrap">
    <button class="vc-btn-logout" id="vc-btn-logout">🚪 Cerrar sesión</button>
  </div>

  <div class="vc-pad"></div>
</div>
  `;

  /* ── Event listeners ── */
  const btnUpgradePro = container.querySelector('#vc-btn-upgrade-pro');
  if (btnUpgradePro) btnUpgradePro.addEventListener('click', () => window.open(linkPago, '_blank'));

  const btnUpgradeMax = container.querySelector('#vc-btn-upgrade-max');
  if (btnUpgradeMax) btnUpgradeMax.addEventListener('click', () => window.open(linkPago, '_blank'));

  const btnYaPaguePro = container.querySelector('#vc-btn-yapague-pro');
  if (btnYaPaguePro) btnYaPaguePro.addEventListener('click', () => activarSuscripcion('pro'));

  const btnYaPagueMax = container.querySelector('#vc-btn-yapague-max');
  if (btnYaPagueMax) btnYaPagueMax.addEventListener('click', () => activarSuscripcion('max'));

  const btnLogout = container.querySelector('#vc-btn-logout');
  if (btnLogout) {
    btnLogout.addEventListener('click', async () => {
      await sb.auth.signOut();
      window.location.href = 'login.html';
    });
  }
}


/* ═══════════════════════════════════════
   SINCRONIZACIÓN GLOBAL
   Escucha cambios de perfil (desde view-perfil.js)
   ═══════════════════════════════════════ */
window.addEventListener('perfilActualizado', () => {
  const container = document.getElementById('view-cuenta');
  if (container && container.classList.contains('view-active')) {
    renderCuenta();
  }
});


/* ═══════════════════════════════════════
   HOOK DE NAVEGACIÓN
   ═══════════════════════════════════════ */
function initCuenta() {
  const container = document.getElementById('view-cuenta');
  if (!container) return;
  renderCuenta();
}

window.onViewEnter_cuenta = initCuenta;
