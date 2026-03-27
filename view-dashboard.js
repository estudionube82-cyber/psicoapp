/**
 * view-dashboard.js
 * ─────────────────────────────────────────────────────────────
 * Dashboard conectado a pagos (localStorage).
 * No duplica: Supabase, toggleTheme, auth guard, ni fuentes.
 * ─────────────────────────────────────────────────────────────
 */

/* ── 1. CSS PROPIO DE ESTA VISTA ── */
(function injectDashboardStyles() {
  if (document.getElementById('view-dashboard-styles')) return;
  const style = document.createElement('style');
  style.id = 'view-dashboard-styles';
  style.textContent = `
/* ── HEADER ── */
#view-dashboard .header {
  background: linear-gradient(145deg, #1E1040 0%, #2D1B69 60%, #4C2A9A 100%);
  padding: 20px 20px 28px;
  position: relative; overflow: hidden;
}
#view-dashboard .header::after {
  content: ''; position: absolute;
  right: -40px; top: -40px;
  width: 180px; height: 180px; border-radius: 50%;
  background: rgba(255,255,255,0.05);
}
#view-dashboard .header::before {
  content: ''; position: absolute;
  left: -30px; bottom: -60px;
  width: 160px; height: 160px; border-radius: 50%;
  background: rgba(255,255,255,0.04);
}
@media (min-width: 768px) {
  #view-dashboard .header { padding: 24px 32px 32px; }
}
.header-row {
  display: flex; align-items: center; justify-content: space-between;
  position: relative; z-index: 1;
}
.logo { font-family: var(--font-display); font-size: 22px; color: white; }
.logo span { color: var(--accent); }
.header-icons { display: flex; gap: 8px; }
.icon-btn {
  width: 36px; height: 36px; border-radius: 11px;
  background: rgba(255,255,255,0.15); border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  font-size: 17px; position: relative;
}
.greeting { margin-top: 16px; position: relative; z-index: 1; }
.greeting-sub { font-size: 12px; color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 1px; font-weight: 600; }
.greeting-name { font-size: 24px; font-weight: 800; color: white; margin-top: 2px; line-height: 1.1; }
.greeting-date { font-size: 13px; color: rgba(255,255,255,0.65); margin-top: 4px; }
.theme-toggle {
  margin-top: 10px; background: rgba(255,255,255,0.12);
  border: none; border-radius: 20px; padding: 4px 12px;
  cursor: pointer; font-size: 16px;
}
.toggle-thumb { display: inline-block; }

/* ── QUICK STATS ── */
.quick-stats {
  display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
  padding: 16px 16px 0; margin-top: -20px; position: relative; z-index: 5;
}
@media (min-width: 768px) {
  .quick-stats { grid-template-columns: repeat(4, 1fr) !important; padding: 20px 24px !important; }
}
.stat-card {
  background: var(--surface); border-radius: var(--radius);
  padding: 14px 16px; box-shadow: var(--shadow-md);
  cursor: pointer; transition: transform 0.15s;
}
.stat-card:hover { transform: translateY(-2px); }
.stat-card-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
.stat-icon { width: 34px; height: 34px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 17px; }
.si-green { background: var(--primary-light); }
.si-orange { background: var(--accent-light); }
.si-red { background: var(--danger-light); }
.si-blue { background: #E3F2FD; }
.stat-trend { font-size: 10px; font-weight: 700; padding: 3px 7px; border-radius: 20px; }
.trend-up { background: var(--primary-light); color: var(--primary); }
.trend-down { background: var(--danger-light); color: var(--danger); }
.trend-neutral { background: var(--bg); color: var(--text-muted); }
.stat-num { font-size: 26px; font-weight: 800; line-height: 1; color: var(--text); }
.stat-label { font-size: 11px; color: var(--text-muted); font-weight: 600; margin-top: 3px; }

/* ── SECTION ── */
.section { padding: 16px 16px 0; }
@media (min-width: 768px) { .section { padding: 16px 24px 0; } }
.section-title {
  font-size: 13px; font-weight: 800; color: var(--text-muted);
  text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;
  display: flex; align-items: center; justify-content: space-between;
}
.section-link { font-size: 12px; font-weight: 600; color: var(--primary); cursor: pointer; text-transform: none; letter-spacing: 0; }

/* ── TURNOS ── */
.turnos-list { display: flex; flex-direction: column; gap: 8px; }
.turno-card {
  background: var(--surface); border-radius: var(--radius-sm);
  padding: 12px 14px; display: flex; align-items: center; gap: 12px;
  box-shadow: var(--shadow-sm); border-left: 3px solid transparent;
  cursor: pointer; transition: transform .12s;
}
.turno-card:hover { transform: translateX(2px); }
.tc-pac { border-left-color: var(--primary-mid); }
.tc-past { opacity: 0.6; }
.tc-now { border-left-color: var(--accent2); box-shadow: 0 0 0 2px rgba(52,211,153,0.2); }
.turno-time { font-size: 15px; font-weight: 800; color: var(--text); min-width: 40px; }
.turno-time.now { color: var(--accent2); }
.turno-info { flex: 1; }
.turno-name { font-size: 14px; font-weight: 700; color: var(--text); }
.turno-meta { font-size: 11px; color: var(--text-muted); margin-top: 1px; }
.turno-badge { font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 20px; }
.tb-done { background: var(--surface2); color: var(--text-muted); }
.tb-ok { background: rgba(52,211,153,0.15); color: #059669; }
.tb-wait { background: var(--primary-light); color: var(--primary); }
.now-indicator { display: flex; align-items: center; gap: 8px; margin: 4px 0; }
.now-dot-h { width: 10px; height: 10px; border-radius: 50%; background: var(--accent2); flex-shrink: 0; }
.now-label { font-size: 10px; font-weight: 800; color: var(--accent2); letter-spacing: .5px; white-space: nowrap; }
.now-line-h { flex: 1; height: 1px; background: var(--accent2); opacity: 0.4; }

/* ── PAGOS RESUMEN ── */
.pagos-resumen-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
}
@media (min-width: 768px) {
  .pagos-resumen-grid { grid-template-columns: repeat(4, 1fr); }
}
.pr-card {
  background: var(--surface); border-radius: var(--radius);
  padding: 14px 16px; box-shadow: var(--shadow-sm);
  cursor: pointer; transition: transform .12s;
}
.pr-card:hover { transform: translateY(-2px); }
.pr-card-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
.pr-icon { width: 34px; height: 34px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 17px; }
.pr-num { font-size: 20px; font-weight: 800; line-height: 1; }
.pr-label { font-size: 11px; color: var(--text-muted); font-weight: 600; margin-top: 3px; }

/* ── DEUDORES ── */
.deudores-table {
  background: var(--surface); border-radius: var(--radius);
  box-shadow: var(--shadow-sm); overflow: hidden;
}
.dt-header {
  display: grid; grid-template-columns: 1fr auto;
  padding: 10px 16px;
  background: var(--surface2);
  font-size: 11px; font-weight: 800; color: var(--text-muted);
  text-transform: uppercase; letter-spacing: .6px;
}
.dt-row {
  display: grid; grid-template-columns: 1fr auto;
  padding: 11px 16px; align-items: center;
  border-top: 1px solid var(--border);
  transition: background .12s;
}
.dt-row:hover { background: var(--surface2); }
.dt-pac { font-size: 14px; font-weight: 600; color: var(--text); }
.dt-deuda { font-size: 15px; font-weight: 800; color: var(--danger); }
.dt-empty {
  padding: 24px; text-align: center;
  color: var(--text-muted); font-size: 13px;
}

/* ── ACCESOS RÁPIDOS ── */
.quick-access { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
.qa-item {
  background: var(--surface); border-radius: var(--radius-sm);
  padding: 14px 8px; display: flex; flex-direction: column;
  align-items: center; gap: 6px; box-shadow: var(--shadow-sm);
  cursor: pointer; transition: transform .12s; border: none;
}
.qa-item:hover { transform: translateY(-2px); }
.qa-icon { font-size: 22px; }
.qa-label { font-size: 10px; font-weight: 700; color: var(--text-muted); text-align: center; }

/* ── PADDING BOTTOM ── */
#view-dashboard .dash-bottom-pad { height: 24px; }
  `;
  document.head.appendChild(style);
})();


/* ── 2. LÓGICA DE PAGOS ── */

function getPagos() {
  try { return JSON.parse(localStorage.getItem('pagos')) || []; }
  catch { return []; }
}

function calcularResumen() {
  const pagos = getPagos();
  const totalCobrado    = pagos.filter(p => p.estado === 'pagado').reduce((s, p) => s + (Number(p.monto) || 0), 0);
  const totalPendiente  = pagos.filter(p => p.estado === 'pendiente').reduce((s, p) => s + (Number(p.monto) || 0), 0);
  const cantidadPagos   = pagos.length;
  const pacientesUnicos = new Set(pagos.map(p => p.paciente).filter(Boolean)).size;
  return { totalCobrado, totalPendiente, cantidadPagos, pacientesUnicos };
}

function obtenerDeudores() {
  const pagos = getPagos();
  const pendientes = pagos.filter(p => p.estado === 'pendiente');
  const mapa = {};
  pendientes.forEach(p => {
    const nombre = p.paciente || 'Desconocido';
    mapa[nombre] = (mapa[nombre] || 0) + (Number(p.monto) || 0);
  });
  return Object.entries(mapa)
    .map(([paciente, deuda]) => ({ paciente, deuda }))
    .sort((a, b) => b.deuda - a.deuda);
}

function renderDashboard() {
  const fmt = v => '$' + Number(v).toLocaleString('es-AR');
  const { totalCobrado, totalPendiente, cantidadPagos, pacientesUnicos } = calcularResumen();
  const deudores = obtenerDeudores();

  /* ── Tarjetas de pagos ── */
  const statsEl = document.getElementById('dash-pagos-stats');
  if (statsEl) {
    statsEl.innerHTML = `
      <div class="pr-card" onclick="navigate('pagos')">
        <div class="pr-card-top">
          <div class="pr-icon si-green">✅</div>
          <div class="stat-trend trend-up">Cobrado</div>
        </div>
        <div class="pr-num" style="color:#388E3C">${fmt(totalCobrado)}</div>
        <div class="pr-label">Total cobrado</div>
      </div>
      <div class="pr-card" onclick="navigate('pagos')">
        <div class="pr-card-top">
          <div class="pr-icon si-orange">⏳</div>
          <div class="stat-trend trend-down">Pendiente</div>
        </div>
        <div class="pr-num" style="color:var(--danger)">${fmt(totalPendiente)}</div>
        <div class="pr-label">Total pendiente</div>
      </div>
      <div class="pr-card" onclick="navigate('pagos')">
        <div class="pr-card-top">
          <div class="pr-icon si-blue">🧾</div>
          <div class="stat-trend trend-neutral">Registros</div>
        </div>
        <div class="pr-num">${cantidadPagos}</div>
        <div class="pr-label">Cantidad de pagos</div>
      </div>
      <div class="pr-card" onclick="navigate('pacientes')">
        <div class="pr-card-top">
          <div class="pr-icon si-green">👥</div>
          <div class="stat-trend trend-neutral">Distintos</div>
        </div>
        <div class="pr-num">${pacientesUnicos}</div>
        <div class="pr-label">Pacientes únicos</div>
      </div>
    `;
  }

  /* ── Tabla de deudores ── */
  const deudEl = document.getElementById('dash-deudores-table');
  if (deudEl) {
    if (!deudores.length) {
      deudEl.innerHTML = `
        <div class="dt-header"><span>Paciente</span><span>Deuda total</span></div>
        <div class="dt-empty">🎉 Sin deudores pendientes</div>
      `;
    } else {
      deudEl.innerHTML = `
        <div class="dt-header"><span>Paciente</span><span>Deuda total</span></div>
        ${deudores.map(d => `
          <div class="dt-row">
            <div class="dt-pac">${d.paciente}</div>
            <div class="dt-deuda">${fmt(d.deuda)}</div>
          </div>
        `).join('')}
      `;
    }
  }
}


/* ── 3. HTML DE LA VISTA ── */
function initDashboard() {
  const container = document.getElementById('view-dashboard');
  if (!container) return;

  /* ── Fecha ── */
  const hoy = new Date();
  const fechaStr = hoy.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
  const mesNombre = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
    'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'][hoy.getMonth()];
  const temaActual = document.documentElement.getAttribute('data-theme') || 'light';

  container.innerHTML = `
<div class="header">
  <div class="header-row">
    <div class="logo">Psico<span>App</span></div>
    <div class="header-icons">
      <button class="icon-btn" onclick="navigate('whatsapp')">💬</button>
    </div>
  </div>
  <div class="greeting">
    <div class="greeting-sub">Bienvenido/a</div>
    <div class="greeting-name" id="dash-user-name">Cargando…</div>
    <div class="greeting-date">${fechaStr.charAt(0).toUpperCase() + fechaStr.slice(1)}</div>
    <button class="theme-toggle" onclick="toggleTheme()" title="Cambiar tema">
      <span class="toggle-thumb" id="toggle-thumb">${temaActual === 'dark' ? '🌙' : '☀️'}</span>
    </button>
  </div>
</div>

<!-- ACCESOS RÁPIDOS -->
<div class="section" style="margin-top:12px">
  <div class="quick-access">
    <button class="qa-item" onclick="navigate('agenda')">
      <div class="qa-icon">📅</div><div class="qa-label">Agenda</div>
    </button>
    <button class="qa-item" onclick="navigate('pacientes')">
      <div class="qa-icon">👥</div><div class="qa-label">Pacientes</div>
    </button>
    <button class="qa-item" onclick="navigate('pagos')">
      <div class="qa-icon">💰</div><div class="qa-label">Pagos</div>
    </button>
    <button class="qa-item" onclick="navigate('whatsapp')">
      <div class="qa-icon">💬</div><div class="qa-label">WhatsApp</div>
    </button>
  </div>
</div>

<!-- TURNOS DE HOY -->
<div class="section" style="margin-top:16px">
  <div class="section-title">
    Turnos de hoy
    <span class="section-link" onclick="navigate('agenda')">Ver agenda →</span>
  </div>
  <div class="turnos-list" id="dash-turnos-list">
    <div style="padding:20px;color:var(--text-muted);font-size:13px;text-align:center">⏳ Cargando…</div>
  </div>
</div>

<!-- RESUMEN FINANCIERO (desde localStorage) -->
<div class="section" style="margin-top:20px">
  <div class="section-title">
    Resumen financiero
    <span class="section-link" onclick="navigate('pagos')">Ver pagos →</span>
  </div>
  <div class="pagos-resumen-grid" id="dash-pagos-stats">
    <div class="pr-card"><div class="pr-num" style="color:var(--text-muted);font-size:18px">…</div><div class="pr-label">Total cobrado</div></div>
    <div class="pr-card"><div class="pr-num" style="color:var(--text-muted);font-size:18px">…</div><div class="pr-label">Total pendiente</div></div>
    <div class="pr-card"><div class="pr-num" style="color:var(--text-muted);font-size:18px">…</div><div class="pr-label">Cantidad de pagos</div></div>
    <div class="pr-card"><div class="pr-num" style="color:var(--text-muted);font-size:18px">…</div><div class="pr-label">Pacientes únicos</div></div>
  </div>
</div>

<!-- TABLA DE DEUDORES -->
<div class="section" style="margin-top:20px">
  <div class="section-title">
    Deudores pendientes
    <span class="section-link" onclick="navigate('pagos')">Ver todos →</span>
  </div>
  <div class="deudores-table" id="dash-deudores-table">
    <div class="dt-header"><span>Paciente</span><span>Deuda total</span></div>
    <div class="dt-empty" style="color:var(--text-muted);font-size:13px">⏳ Cargando…</div>
  </div>
</div>

<div class="dash-bottom-pad"></div>
  `;

  /* ── Cargar usuario ── */
  sb.auth.getUser().then(({ data }) => {
    const nameEl = document.getElementById('dash-user-name');
    if (!nameEl) return;
    if (data?.user?.user_metadata?.nombre) {
      nameEl.textContent = data.user.user_metadata.nombre;
    } else if (data?.user?.email) {
      nameEl.textContent = data.user.email.split('@')[0];
    } else {
      nameEl.textContent = 'Psicólogo/a';
    }
    // Sidebar también
    const sbName = document.getElementById('sb-user-name');
    if (sbName) sbName.textContent = nameEl.textContent;
    const sbAvatar = document.getElementById('sb-avatar-initials');
    if (sbAvatar) sbAvatar.textContent = nameEl.textContent.slice(0, 2).toUpperCase();
  });

  /* ── Cargar turnos de hoy ── */
  dashLoadTurnos();

  /* ── Renderizar datos de pagos ── */
  renderDashboard();
}


/* ── 4. TURNOS DE HOY (Supabase) ── */
async function dashLoadTurnos() {
  const listEl = document.getElementById('dash-turnos-list');
  if (!listEl) return;

  try {
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return;

    const hoy = new Date();
    const fechaHoy = hoy.toISOString().split('T')[0];

    const { data: turnos, error } = await sb
      .from('turnos')
      .select(`id, fecha, hora, duracion, estado, paciente_id, pacientes(nombre, apellido)`)
      .eq('user_id', user.id)
      .eq('fecha', fechaHoy)
      .order('hora', { ascending: true });

    if (error) throw error;

    if (!turnos || turnos.length === 0) {
      listEl.innerHTML = `<div style="padding:20px;color:var(--text-muted);font-size:13px;text-align:center">📭 Sin turnos para hoy</div>`;
      return;
    }

    const ahoraMs = hoy.getTime();
    let nowInserted = false;
    let html = '';

    turnos.forEach(t => {
      const dt = new Date(t.fecha + 'T' + t.hora);
      const horaFormateada = dt.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
      const duracion = t.duracion ? `${t.duracion} min` : '50 min';
      const paciente = t.pacientes;
      const nombre = paciente ? `${paciente.nombre || ''} ${paciente.apellido || ''}`.trim() : 'Paciente';
      const esPasado = dt.getTime() < ahoraMs - 30 * 60 * 1000;
      const esAhora  = !esPasado && dt.getTime() <= ahoraMs + 60 * 60 * 1000;

      if (!nowInserted && !esPasado) {
        const horaActual = hoy.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
        html += `<div class="now-indicator"><div class="now-dot-h"></div><div class="now-label">AHORA · ${horaActual}</div><div class="now-line-h"></div></div>`;
        nowInserted = true;
      }

      let badge = '';
      const est = (t.estado || '').toLowerCase();
      if (est === 'realizado' || est === 'completado') {
        badge = `<div class="turno-badge tb-done">Realizada</div>`;
      } else if (est === 'confirmado') {
        badge = `<div class="turno-badge tb-ok">✓ Confirmó</div>`;
      } else if (est === 'cancelado') {
        badge = `<div class="turno-badge tb-done" style="background:var(--danger-light);color:var(--danger)">Cancelado</div>`;
      } else {
        badge = `<div class="turno-badge tb-wait">⏳ Sin confirmar</div>`;
      }

      const clases = ['turno-card tc-pac', esPasado ? 'tc-past' : '', esAhora ? 'tc-now' : ''].join(' ').trim();

      html += `
        <div class="${clases}" onclick="navigate('agenda')">
          <div class="turno-time${esAhora ? ' now' : ''}">${horaFormateada}</div>
          <div class="turno-info">
            <div class="turno-name">${nombre}</div>
            <div class="turno-meta">Sesión · ${duracion}</div>
          </div>
          ${badge}
        </div>`;
    });

    if (!nowInserted) {
      const horaActual = hoy.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
      html += `<div class="now-indicator"><div class="now-dot-h"></div><div class="now-label">AHORA · ${horaActual}</div><div class="now-line-h"></div></div>`;
    }

    listEl.innerHTML = html;

  } catch (e) {
    console.warn('dashLoadTurnos:', e.message);
    const listEl = document.getElementById('dash-turnos-list');
    if (listEl) listEl.innerHTML = `<div style="padding:12px;color:var(--danger);font-size:13px;text-align:center">⚠️ Error al cargar turnos</div>`;
  }
}


/* ── 5. HOOK DE NAVEGACIÓN ── */
window.onViewEnter_dashboard = initDashboard;

/* ── INIT al cargar por primera vez ── */
initDashboard();
