/**
 * view-cuenta.js
 * ─────────────────────────────────────────────────────────────
 * Vista de suscripción SaaS — lee y escribe en localStorage.
 * ─────────────────────────────────────────────────────────────
 */

(function injectCuentaStyles() {
  if (document.getElementById('view-cuenta-styles')) return;
  const style = document.createElement('style');
  style.id = 'view-cuenta-styles';
  style.textContent = `
#view-cuenta {
  min-height: 100vh;
  background: var(--bg);
}

/* ── HEADER ── */
#view-cuenta .vc-header {
  background: linear-gradient(145deg, #1E1040 0%, #2D1B69 60%, #4C2A9A 100%);
  padding: 28px 20px 36px;
  position: relative; overflow: hidden;
}
#view-cuenta .vc-header::after {
  content: ''; position: absolute;
  right: -40px; top: -40px;
  width: 180px; height: 180px; border-radius: 50%;
  background: rgba(255,255,255,0.05);
}
#view-cuenta .vc-header-title {
  font-size: 22px; font-weight: 800; color: white;
  position: relative; z-index: 1;
}
#view-cuenta .vc-header-sub {
  font-size: 13px; color: rgba(255,255,255,0.6);
  margin-top: 4px; position: relative; z-index: 1;
}

/* ── CONTENIDO ── */
#view-cuenta .vc-body {
  padding: 0 16px 32px;
  margin-top: -20px;
  position: relative; z-index: 5;
  display: flex; flex-direction: column; gap: 14px;
  max-width: 520px; margin-left: auto; margin-right: auto;
}
@media (min-width: 768px) {
  #view-cuenta .vc-body { padding: 0 24px 40px; }
}

/* ── STATUS CARD ── */
#view-cuenta .vc-status-card {
  background: var(--surface);
  border-radius: var(--radius);
  padding: 20px 20px 22px;
  box-shadow: var(--shadow-md);
  display: flex; flex-direction: column; gap: 14px;
}
#view-cuenta .vc-status-top {
  display: flex; align-items: center; justify-content: space-between;
}
#view-cuenta .vc-plan-label {
  font-size: 12px; font-weight: 700; text-transform: uppercase;
  letter-spacing: .8px; color: var(--text-muted);
}
#view-cuenta .vc-plan-badge {
  font-size: 11px; font-weight: 800; padding: 4px 10px;
  border-radius: 20px; text-transform: uppercase; letter-spacing: .5px;
}
#view-cuenta .badge-pro {
  background: linear-gradient(135deg, #5B2FA8, #7C3AED);
  color: white;
}
#view-cuenta .badge-free {
  background: var(--surface2); color: var(--text-muted);
}
#view-cuenta .vc-plan-name {
  font-size: 28px; font-weight: 800; color: var(--text); line-height: 1;
}
#view-cuenta .vc-plan-name.plan-pro { color: var(--primary); }
#view-cuenta .vc-plan-name.plan-free { color: var(--text-muted); }

#view-cuenta .vc-rows {
  display: flex; flex-direction: column; gap: 10px;
  border-top: 1px solid var(--border); padding-top: 14px;
}
#view-cuenta .vc-row {
  display: flex; align-items: center; justify-content: space-between;
  font-size: 14px;
}
#view-cuenta .vc-row-label { color: var(--text-muted); font-weight: 500; }
#view-cuenta .vc-row-val { font-weight: 700; color: var(--text); }
#view-cuenta .vc-row-val.estado-activa { color: #059669; }
#view-cuenta .vc-row-val.estado-inactivo { color: var(--danger); }

/* ── FEATURES ── */
#view-cuenta .vc-features-card {
  background: var(--surface);
  border-radius: var(--radius);
  padding: 18px 20px;
  box-shadow: var(--shadow-sm);
}
#view-cuenta .vc-features-title {
  font-size: 13px; font-weight: 800; color: var(--text-muted);
  text-transform: uppercase; letter-spacing: .8px; margin-bottom: 12px;
}
#view-cuenta .vc-feature {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 0; border-bottom: 1px solid var(--border);
  font-size: 14px; font-weight: 500; color: var(--text);
}
#view-cuenta .vc-feature:last-child { border-bottom: none; }
#view-cuenta .vc-feature-icon { font-size: 18px; width: 24px; text-align: center; }

/* ── ACCIONES ── */
#view-cuenta .vc-actions {
  display: flex; flex-direction: column; gap: 10px;
  margin-top: 2px;
}
#view-cuenta .vc-btn {
  width: 100%; padding: 15px 20px; border-radius: var(--radius-sm);
  border: none; font-family: var(--font); font-size: 15px; font-weight: 700;
  cursor: pointer; transition: transform .12s, box-shadow .12s;
  display: flex; align-items: center; justify-content: center; gap: 8px;
}
#view-cuenta .vc-btn:hover { transform: translateY(-1px); box-shadow: var(--shadow-md); }
#view-cuenta .vc-btn:active { transform: translateY(0); }
#view-cuenta .vc-btn-primary {
  background: linear-gradient(135deg, #5B2FA8 0%, #7C3AED 100%);
  color: white;
}
#view-cuenta .vc-btn-secondary {
  background: var(--surface); color: var(--primary);
  border: 2px solid var(--border);
}
#view-cuenta .vc-btn-success {
  background: rgba(5,150,105,0.12); color: #059669;
  border: 2px solid rgba(5,150,105,0.2);
}
#view-cuenta .vc-note {
  text-align: center; font-size: 12px; color: var(--text-muted);
  padding: 0 4px; line-height: 1.5;
}

/* ── ACTIVA BANNER ── */
#view-cuenta .vc-activa-banner {
  background: linear-gradient(135deg, rgba(5,150,105,0.12), rgba(52,211,153,0.1));
  border: 1.5px solid rgba(5,150,105,0.25);
  border-radius: var(--radius);
  padding: 16px 18px;
  display: flex; align-items: center; gap: 14px;
}
#view-cuenta .vc-activa-icon { font-size: 28px; }
#view-cuenta .vc-activa-title { font-size: 15px; font-weight: 800; color: #059669; }
#view-cuenta .vc-activa-sub { font-size: 12px; color: var(--text-muted); margin-top: 2px; }

/* ── BOTTOM PAD ── */
#view-cuenta .vc-pad { height: 24px; }
  `;
  document.head.appendChild(style);
})();


/* ═══════════════════════════════════════
   FUNCIONES OBLIGATORIAS
   ═══════════════════════════════════════ */

function getSuscripcion() {
  try { return JSON.parse(localStorage.getItem('suscripcion')) || null; }
  catch { return null; }
}

function saveSuscripcion(data) {
  localStorage.setItem('suscripcion', JSON.stringify(data));
}

function activarSuscripcion() {
  saveSuscripcion({
    plan: 'pro',
    estado: 'activa',
    fechaInicio: new Date().toISOString()
  });
  renderCuenta();
}

function renderCuenta() {
  const container = document.getElementById('view-cuenta');
  if (!container) return;

  const suscripcion = getSuscripcion();
  const esPro      = suscripcion && suscripcion.plan === 'pro' && suscripcion.estado === 'activa';
  const linkPago   = 'https://mpago.la/TU_LINK_AQUI';

  const planNombre = esPro ? 'Pro' : 'Gratuito';
  const estadoLabel = esPro ? 'Activa' : 'Inactivo';
  const fechaLabel  = esPro && suscripcion.fechaInicio
    ? new Date(suscripcion.fechaInicio).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })
    : '—';

  container.innerHTML = `
<div class="vc-header">
  <div class="vc-header-title">👤 Mi cuenta</div>
  <div class="vc-header-sub">Gestioná tu suscripción a PsicoApp</div>
</div>

<div class="vc-body">

  ${esPro ? `
  <div class="vc-activa-banner">
    <div class="vc-activa-icon">✅</div>
    <div>
      <div class="vc-activa-title">Suscripción activa</div>
      <div class="vc-activa-sub">Tenés acceso completo a todas las funciones Pro.</div>
    </div>
  </div>
  ` : ''}

  <!-- TARJETA ESTADO -->
  <div class="vc-status-card">
    <div class="vc-status-top">
      <div class="vc-plan-label">Plan actual</div>
      <div class="vc-plan-badge ${esPro ? 'badge-pro' : 'badge-free'}">${esPro ? '⭐ Pro' : 'Free'}</div>
    </div>
    <div class="vc-plan-name ${esPro ? 'plan-pro' : 'plan-free'}">${planNombre}</div>
    <div class="vc-rows">
      <div class="vc-row">
        <span class="vc-row-label">Estado</span>
        <span class="vc-row-val ${esPro ? 'estado-activa' : 'estado-inactivo'}">${esPro ? '🟢 ' : '🔴 '}${estadoLabel}</span>
      </div>
      <div class="vc-row">
        <span class="vc-row-label">Activo desde</span>
        <span class="vc-row-val">${fechaLabel}</span>
      </div>
      <div class="vc-row">
        <span class="vc-row-label">Renovación</span>
        <span class="vc-row-val">${esPro ? 'Mensual' : '—'}</span>
      </div>
    </div>
  </div>

  <!-- FEATURES -->
  <div class="vc-features-card">
    <div class="vc-features-title">Qué incluye el plan Pro</div>
    <div class="vc-feature"><span class="vc-feature-icon">${esPro ? '✅' : '🔒'}</span> Agenda ilimitada</div>
    <div class="vc-feature"><span class="vc-feature-icon">${esPro ? '✅' : '🔒'}</span> Gestión de pacientes completa</div>
    <div class="vc-feature"><span class="vc-feature-icon">${esPro ? '✅' : '🔒'}</span> Registros de pagos y cobros</div>
    <div class="vc-feature"><span class="vc-feature-icon">${esPro ? '✅' : '🔒'}</span> Recordatorios por WhatsApp</div>
    <div class="vc-feature"><span class="vc-feature-icon">${esPro ? '✅' : '🔒'}</span> Soporte prioritario</div>
  </div>

  <!-- ACCIONES -->
  <div class="vc-actions">
    ${!esPro ? `
    <button class="vc-btn vc-btn-primary" id="vc-btn-suscribirse">
      ⭐ Suscribirme al plan Pro
    </button>
    <button class="vc-btn vc-btn-success" id="vc-btn-ya-pague">
      ✅ Ya pagué — activar acceso
    </button>
    <p class="vc-note">
      Hacé clic en "Suscribirme" para ir a MercadoPago.<br>
      Una vez completado el pago, volvé y tocá "Ya pagué".
    </p>
    ` : `
    <button class="vc-btn vc-btn-secondary" id="vc-btn-ya-pague">
      🔄 Renovar / reactivar
    </button>
    `}
  </div>

  <div class="vc-pad"></div>
</div>
  `;

  /* ── Event listeners ── */
  const btnSuscribirse = container.querySelector('#vc-btn-suscribirse');
  if (btnSuscribirse) {
    btnSuscribirse.addEventListener('click', () => {
      window.open(linkPago, '_blank');
    });
  }

  const btnYaPague = container.querySelector('#vc-btn-ya-pague');
  if (btnYaPague) {
    btnYaPague.addEventListener('click', () => {
      activarSuscripcion();
    });
  }
}


/* ═══════════════════════════════════════
   HOOK DE NAVEGACIÓN
   ═══════════════════════════════════════ */
function initCuenta() {
  const container = document.getElementById('view-cuenta');
  if (!container) return;
  renderCuenta();
}

window.onViewEnter_cuenta = initCuenta;
