/**
 * view-dashboard.js
 * ─────────────────────────────────────────────────────────────
 * Inyecta el HTML del dashboard y registra su lógica propia.
 * NO duplica: Supabase, toggleTheme, auth guard, ni fuentes.
 * ─────────────────────────────────────────────────────────────
 */

/* ── 1. CSS PROPIO DE ESTA VISTA ── */
(function injectDashboardStyles() {
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
.notif-badge {
  position: absolute; top: -3px; right: -3px;
  width: 16px; height: 16px; background: var(--accent);
  border-radius: 50%; font-size: 9px; font-weight: 800;
  color: white; display: flex; align-items: center; justify-content: center;
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

/* ── INGRESOS ── */
.income-card { background: var(--surface); border-radius: var(--radius); padding: 16px; box-shadow: var(--shadow-sm); }
.income-placeholder { text-align: center; padding: 20px; color: var(--text-muted); font-size: 13px; }

/* ── WHATSAPP ── */
.wp-pending-list { display: flex; flex-direction: column; gap: 8px; }
.wp-pending-item {
  background: var(--surface); border-radius: var(--radius-sm);
  padding: 11px 13px; display: flex; align-items: center; gap: 10px;
  border-left: 3px solid var(--accent2); box-shadow: var(--shadow-sm);
}
.wp-pi-avatar { width: 34px; height: 34px; border-radius: 50%; background: var(--primary-light); display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
.wp-pi-info { flex: 1; }
.wp-pi-name { font-size: 13px; font-weight: 700; color: var(--text); }
.wp-pi-meta { font-size: 11px; color: var(--text-muted); margin-top: 1px; }
.wp-pi-time { font-size: 11px; color: var(--text-muted); font-weight: 600; white-space: nowrap; }

/* ── ACCESOS RÁPIDOS ── */
.quick-access { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
.qa-item {
  background: var(--surface); border-radius: var(--radius-sm);
  padding: 14px 8px; display: flex; flex-direction: column;
  align-items: center; gap: 6px; box-shadow: var(--shadow-sm);
  cursor: pointer; transition: transform .12s;
}
.qa-item:hover { transform: translateY(-2px); }
.qa-icon { font-size: 22px; }
.qa-label { font-size: 10px; font-weight: 700; color: var(--text-muted); text-align: center; }
  `;
  document.head.appendChild(style);
})();


/* ── 2. HTML DE LA VISTA ── */
(function injectDashboardHTML() {
  const view = document.getElementById('view-dashboard');
  if (!view) return;

  view.innerHTML = `
<div class="header">
  <div class="header-row">
    <div class="logo">Psico<span>App</span></div>
    <div class="header-icons">
      <button class="icon-btn">💬</button>
      <button class="icon-btn">🔔</button>
    </div>
  </div>
  <div class="greeting">
    <div class="greeting-sub">Bienvenido/a</div>
    <div class="greeting-name" id="dash-user-name">Cargando…</div>
    <div class="greeting-date" id="dash-fecha"></div>
    <button class="theme-toggle" onclick="toggleTheme()" title="Cambiar tema">
      <div class="toggle-thumb" id="toggle-thumb">☀️</div>
    </button>
  </div>
</div>

<!-- QUICK STATS — se renderizan desde dashLoadStats() -->
<div class="quick-stats" id="dash-quick-stats">
  <div class="stat-card"><div class="stat-num" style="color:var(--text-muted);font-size:18px">…</div><div class="stat-label">Turnos hoy</div></div>
  <div class="stat-card"><div class="stat-num" style="color:var(--text-muted);font-size:18px">…</div><div class="stat-label">Pacientes activos</div></div>
  <div class="stat-card"><div class="stat-num" style="color:var(--text-muted);font-size:18px">…</div><div class="stat-label">Pacientes nuevos</div></div>
  <div class="stat-card"><div class="stat-num" style="color:var(--text-muted);font-size:18px">…</div><div class="stat-label">Facturado</div></div>
</div>

<!-- TURNOS DE HOY — se renderizan desde dashLoadTurnos() -->
<div class="section" style="margin-top:16px">
  <div class="section-title">
    Turnos de hoy
    <span class="section-link" onclick="navigate('agenda')">Ver agenda →</span>
  </div>
  <div class="turnos-list" id="dash-turnos-list">
    <div style="padding:12px;color:var(--text-muted);font-size:13px;text-align:center">Cargando turnos…</div>
  </div>
</div>

<!-- INGRESOS DEL MES -->
<div class="section" style="margin-top:16px">
  <div class="section-title" id="dash-ingresos-titulo">
    Ingresos
    <span class="section-link" onclick="navigate('pagos')">Ver detalle →</span>
  </div>
  <div class="income-card">
    <div class="income-placeholder">
      💰 Sin datos disponibles
    </div>
  </div>
</div>

<!-- ACCESOS RÁPIDOS -->
<div class="section" style="margin-top:16px; margin-bottom:24px">
  <div class="section-title">Acceso rápido</div>
  <div class="quick-access">
    <div class="qa-item" onclick="navigate('agenda')"><div class="qa-icon">➕</div><div class="qa-label">Nuevo turno</div></div>
    <div class="qa-item" onclick="navigate('pacientes')"><div class="qa-icon">👤</div><div class="qa-label">Nuevo paciente</div></div>
    <div class="qa-item" onclick="navigate('pagos')"><div class="qa-icon">💰</div><div class="qa-label">Registrar pago</div></div>
    <div class="qa-item" onclick="navigate('whatsapp')"><div class="qa-icon">💬</div><div class="qa-label">WhatsApp</div></div>
  </div>
</div>
  `;
})();


/* ── 3. LÓGICA PROPIA DE ESTA VISTA ── */

/** Muestra fecha y hora actuales en el header */
function dashUpdateFecha() {
  const el = document.getElementById('dash-fecha');
  const nl = document.getElementById('dash-now-label');
  if (!el) return;
  const now = new Date();
  const dias = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
  const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const hora = now.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
  el.textContent = `${dias[now.getDay()]} ${now.getDate()} de ${meses[now.getMonth()]} · ${hora}`;
  if (nl) nl.textContent = `AHORA · ${hora}`;
  const th = document.getElementById('toggle-thumb');
  const tema = document.documentElement.getAttribute('data-theme');
  if (th) th.textContent = tema === 'dark' ? '🌙' : '☀️';
}

/** Carga nombre del usuario desde Supabase (profiles) */
async function dashLoadUser() {
  try {
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return;
    const { data: profile } = await sb
      .from('profiles')
      .select('titulo, nombre_completo, foto_url')
      .eq('id', user.id)
      .single();

    if (profile) {
      const nombre = profile.nombre_completo || user.email;
      const titulo = profile.titulo ? profile.titulo + ' ' : '';
      const fullName = titulo + nombre;

      const el = document.getElementById('dash-user-name');
      if (el) el.textContent = fullName;

      const sbName = document.getElementById('sb-user-name');
      if (sbName) sbName.textContent = fullName;

      const sbAvatar = document.getElementById('sb-avatar-initials');
      if (sbAvatar) {
        const parts = nombre.split(' ');
        sbAvatar.textContent = (parts[0]?.[0] || '') + (parts[1]?.[0] || '');
      }
    }
  } catch (e) {
    console.warn('dashLoadUser:', e.message);
  }
}

/** Carga stats reales desde Supabase usando columnas fecha + hora */
async function dashLoadStats() {
  try {
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return;

    const hoy = new Date();
    const fechaHoy = hoy.toISOString().split('T')[0]; // "YYYY-MM-DD"
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1).toISOString();

    // ── Turnos de hoy ──
    const { count: turnosHoy } = await sb
      .from('turnos')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('fecha', fechaHoy);

    // ── Pacientes activos ──
    const { count: pacientesActivos } = await sb
      .from('pacientes')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    // ── Pacientes nuevos este mes ──
    const { count: pacientesNuevos } = await sb
      .from('pacientes')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', inicioMes);

    // ── Renderizar stats ──
    const container = document.getElementById('dash-quick-stats');
    if (!container) return;

    const mesNombre = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
      'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'][hoy.getMonth()];

    // Actualizar título de ingresos con mes actual
    const tituloIngresos = document.getElementById('dash-ingresos-titulo');
    if (tituloIngresos) {
      tituloIngresos.innerHTML = `
        Ingresos — ${mesNombre}
        <span class="section-link" onclick="navigate('pagos')">Ver detalle →</span>
      `;
    }

    container.innerHTML = `
      <div class="stat-card" onclick="navigate('agenda')">
        <div class="stat-card-top">
          <div class="stat-icon si-green">📅</div>
          <div class="stat-trend trend-neutral">Hoy</div>
        </div>
        <div class="stat-num">${turnosHoy ?? 0}</div>
        <div class="stat-label">Turnos hoy</div>
      </div>
      <div class="stat-card" onclick="navigate('pacientes')">
        <div class="stat-card-top">
          <div class="stat-icon si-blue">👥</div>
          <div class="stat-trend trend-neutral">Total</div>
        </div>
        <div class="stat-num" style="color:#1976D2">${pacientesActivos ?? 0}</div>
        <div class="stat-label">Pacientes activos</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-top">
          <div class="stat-icon" style="background:var(--primary-light)">🌱</div>
          <div class="stat-trend trend-up">${mesNombre}</div>
        </div>
        <div class="stat-num" style="color:#388E3C">${pacientesNuevos ?? 0}</div>
        <div class="stat-label">Pacientes nuevos</div>
      </div>
      <div class="stat-card" onclick="navigate('pagos')">
        <div class="stat-card-top">
          <div class="stat-icon si-orange">💰</div>
          <div class="stat-trend trend-neutral">${mesNombre}</div>
        </div>
        <div class="stat-num" style="font-size:18px;color:var(--text-muted)">—</div>
        <div class="stat-label">Facturado</div>
      </div>
    `;
  } catch (e) {
    console.warn('dashLoadStats:', e.message);
  }
}

/** Carga los turnos de hoy desde Supabase usando columnas fecha + hora */
async function dashLoadTurnos() {
  const listEl = document.getElementById('dash-turnos-list');
  if (!listEl) return;

  try {
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return;

    const hoy = new Date();
    const fechaHoy = hoy.toISOString().split('T')[0]; // "YYYY-MM-DD"

    // JOIN con pacientes para obtener nombre y apellido
    const { data: turnos, error } = await sb
      .from('turnos')
      .select(`
        id,
        fecha,
        hora,
        duracion,
        estado,
        paciente_id,
        pacientes (
          nombre,
          apellido
        )
      `)
      .eq('user_id', user.id)
      .eq('fecha', fechaHoy)
      .order('hora', { ascending: true });

    if (error) throw error;

    if (!turnos || turnos.length === 0) {
      listEl.innerHTML = `
        <div style="padding:20px;color:var(--text-muted);font-size:13px;text-align:center">
          📭 Sin turnos para hoy
        </div>`;
      return;
    }

    const ahoraMs = hoy.getTime();
    let nowInserted = false;
    let html = '';

    turnos.forEach((t) => {
      // Combinar fecha + hora para comparación temporal
      const dt = new Date(t.fecha + 'T' + t.hora);
      const horaFormateada = dt.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
      const duracion = t.duracion ? `${t.duracion} min` : '50 min';

      // Nombre del paciente desde el JOIN
      const paciente = t.pacientes;
      const nombre = paciente
        ? `${paciente.nombre || ''} ${paciente.apellido || ''}`.trim()
        : 'Paciente';

      // Determinar estado visual
      const esPasado = dt.getTime() < ahoraMs - 30 * 60 * 1000;
      const esAhora  = !esPasado && dt.getTime() <= ahoraMs + 60 * 60 * 1000;

      // Insertar indicador "AHORA" antes del primer turno futuro/presente
      if (!nowInserted && !esPasado) {
        const horaActual = hoy.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
        html += `
          <div class="now-indicator">
            <div class="now-dot-h"></div>
            <div class="now-label" id="dash-now-label">AHORA · ${horaActual}</div>
            <div class="now-line-h"></div>
          </div>`;
        nowInserted = true;
      }

      // Badge según estado
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

      const clases = [
        'turno-card tc-pac',
        esPasado ? 'tc-past' : '',
        esAhora   ? 'tc-now'  : ''
      ].join(' ').trim();

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

    // Si todos eran pasados, agregar indicador al final
    if (!nowInserted) {
      const horaActual = hoy.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
      html += `
        <div class="now-indicator">
          <div class="now-dot-h"></div>
          <div class="now-label" id="dash-now-label">AHORA · ${horaActual}</div>
          <div class="now-line-h"></div>
        </div>`;
    }

    listEl.innerHTML = html;

  } catch (e) {
    console.warn('dashLoadTurnos:', e.message);
    listEl.innerHTML = `
      <div style="padding:12px;color:var(--danger);font-size:13px;text-align:center">
        ⚠️ Error al cargar turnos
      </div>`;
  }
}

/** Hook llamado por navigate() cada vez que se entra a esta vista */
window.onViewEnter_dashboard = function() {
  dashUpdateFecha();
  dashLoadUser();
  dashLoadStats();
  dashLoadTurnos();
};

/* ── INIT al cargar por primera vez ── */
dashUpdateFecha();
dashLoadUser();
dashLoadStats();
dashLoadTurnos();
