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

function getPerfil() {
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

function activarSuscripcion() {
  saveSuscripcion({ plan: 'pro', estado: 'activa', fechaInicio: new Date().toISOString() });
  renderCuenta();
  vcToast('✅ ¡Suscripción activada! Bienvenido al plan Pro.');
}

function vcToast(msg) {
  const t = document.getElementById('vc-toast-global');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3500);
}

function renderCuenta() {
  const container = document.getElementById('view-cuenta');
  if (!container) return;

  const perfil      = getPerfil();
  const suscripcion = getSuscripcion();
  const esPro       = suscripcion?.plan === 'pro' && suscripcion?.estado === 'activa';
  const linkPago    = 'https://mpago.la/TU_LINK_AQUI';

  const nombre    = perfil.nombre  || 'Profesional';
  const email     = perfil.email   || '';
  const iniciales = nombre.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).toUpperCase().join('');

  const fechaLabel = esPro && suscripcion.fechaInicio
    ? new Date(suscripcion.fechaInicio).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })
    : null;

  container.innerHTML = `
<div id="vc-toast-global" class="vc-toast"></div>

<!-- HERO -->
<div class="vc-hero">
  <div class="vc-hero-inner">
    <div class="vc-avatar" id="vc-avatar">${iniciales || '👤'}</div>
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

  <!-- PLANES GRID -->
  <div class="vc-planes-grid">

    <!-- FREE -->
    <div class="vc-plan-card plan-free-card ${!esPro ? 'plan-actual' : ''}">
      <div class="vc-plan-badge-wrap">
        ${!esPro ? '<span class="vc-badge badge-actual">✓ Actual</span>' : '<span class="vc-badge badge-free-tag">Free</span>'}
      </div>
      <div>
        <div class="vc-plan-name">Free</div>
        <div class="vc-plan-price">Sin costo</div>
      </div>
      <div class="vc-plan-features">
        <div class="vc-pf"><span class="vc-pf-icon">✅</span>Hasta 5 pacientes</div>
        <div class="vc-pf"><span class="vc-pf-icon">✅</span>Agenda básica</div>
        <div class="vc-pf pf-lock"><span class="vc-pf-icon">🔒</span>Pagos y cobros</div>
        <div class="vc-pf pf-lock"><span class="vc-pf-icon">🔒</span>WhatsApp</div>
        <div class="vc-pf pf-lock"><span class="vc-pf-icon">🔒</span>Soporte prioritario</div>
      </div>
      <button class="vc-plan-btn ${!esPro ? 'btn-plan-actual' : 'btn-free-actual'}" disabled>
        ${!esPro ? '✓ Plan actual' : 'Plan básico'}
      </button>
    </div>

    <!-- PRO -->
    <div class="vc-plan-card plan-pro-card ${esPro ? 'plan-actual' : ''}">
      <div class="vc-plan-badge-wrap">
        <span class="vc-badge badge-recomendado">⭐ Recomendado</span>
        ${esPro ? '<span class="vc-badge badge-actual">✓ Actual</span>' : ''}
      </div>
      <div>
        <div class="vc-plan-name">Pro</div>
        <div class="vc-plan-price">Mensual</div>
      </div>
      <div class="vc-plan-features">
        <div class="vc-pf"><span class="vc-pf-icon">✅</span>Pacientes ilimitados</div>
        <div class="vc-pf"><span class="vc-pf-icon">✅</span>Agenda ilimitada</div>
        <div class="vc-pf"><span class="vc-pf-icon">✅</span>Pagos y cobros</div>
        <div class="vc-pf"><span class="vc-pf-icon">✅</span>Recordatorios WhatsApp</div>
        <div class="vc-pf"><span class="vc-pf-icon">✅</span>Soporte prioritario</div>
      </div>
      ${!esPro
        ? `<button class="vc-plan-btn btn-upgrade" id="vc-btn-upgrade">🚀 Actualizar a Pro</button>`
        : `<button class="vc-plan-btn btn-plan-actual" disabled>✓ Plan actual</button>`
      }
    </div>

  </div>

  <!-- YA PAGUÉ (solo si no es pro) -->
  ${!esPro ? `
  <div class="vc-yapague-card">
    <div class="vc-yapague-title">¿Ya realizaste el pago?</div>
    <div class="vc-yapague-sub">
      Hacé clic en "Actualizar a Pro" para ir a MercadoPago.<br>
      Una vez abonado, tocá el botón de abajo para activar tu acceso.
    </div>
    <button class="vc-btn-yapague" id="vc-btn-yapague">✅ Ya pagué — activar acceso Pro</button>
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
  const btnUpgrade = container.querySelector('#vc-btn-upgrade');
  if (btnUpgrade) {
    btnUpgrade.addEventListener('click', () => window.open(linkPago, '_blank'));
  }

  const btnYaPague = container.querySelector('#vc-btn-yapague');
  if (btnYaPague) {
    btnYaPague.addEventListener('click', activarSuscripcion);
  }

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
