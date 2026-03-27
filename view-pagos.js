function initPagos() {
  const container = document.getElementById('view-pagos');
  if (!container) return;

  const MOCK_PACIENTES = [
    'Juan Pérez', 'María López', 'Carlos García', 'Ana Martínez',
    'Luis Rodríguez', 'Laura Sánchez', 'Diego Fernández', 'Sofía Torres'
  ];
  const METODO_ICON  = { efectivo: '💵', transferencia: '🏦', mercado_pago: '📲' };
  const METODO_LABEL = { efectivo: 'Efectivo', transferencia: 'Transferencia', mercado_pago: 'Mercado Pago' };
  const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

  let mesActual    = new Date().getMonth();
  let anioActual   = new Date().getFullYear();
  let filtroActual = 'todos';
  let pagoSeleccionado = null;

  // ─────────────────────────────────────────
  //  STORAGE
  // ─────────────────────────────────────────
  function getPagos() {
    try { return JSON.parse(localStorage.getItem('pagos')) || []; }
    catch { return []; }
  }
  function savePagos(pagos) {
    localStorage.setItem('pagos', JSON.stringify(pagos));
  }

  // ─────────────────────────────────────────
  //  TOAST
  // ─────────────────────────────────────────
  function toast(msg) {
    const t = container.querySelector('#pv-toast');
    if (!t) return;
    t.textContent = msg;
    t.style.display = 'block';
    setTimeout(() => { t.style.display = 'none'; }, 3000);
  }

  // ─────────────────────────────────────────
  //  RENDER RESUMEN
  // ─────────────────────────────────────────
  function renderResumen() {
    const pagos = getPagos();
    const mes = pagos.filter(p => {
      if (!p.fecha) return false;
      const d = new Date(p.fecha + 'T12:00:00');
      return d.getMonth() === mesActual && d.getFullYear() === anioActual;
    });
    const cobrado   = mes.filter(p => p.estado === 'pagado').reduce((s, p) => s + (Number(p.monto) || 0), 0);
    const pendiente = mes.filter(p => p.estado === 'pendiente').reduce((s, p) => s + (Number(p.monto) || 0), 0);
    const efectivo  = mes.filter(p => p.estado === 'pagado' && p.metodo === 'efectivo').reduce((s, p) => s + (Number(p.monto) || 0), 0);
    const transf    = mes.filter(p => p.estado === 'pagado' && p.metodo === 'transferencia').reduce((s, p) => s + (Number(p.monto) || 0), 0);
    const mp        = mes.filter(p => p.estado === 'pagado' && p.metodo === 'mercado_pago').reduce((s, p) => s + (Number(p.monto) || 0), 0);
    const fmt = v => '$' + v.toLocaleString('es-AR');
    const nCob = mes.filter(p => p.estado === 'pagado').length;
    const el = container.querySelector('#pagos-balance');
    if (!el) return;
    el.innerHTML = `
      <div class="pv-balance-label">Total cobrado</div>
      <div class="pv-balance-amount">${fmt(cobrado)}</div>
      <div class="pv-balance-sub">${nCob} pago${nCob !== 1 ? 's' : ''} · ${MESES[mesActual]} ${anioActual}</div>
      <div class="pv-chips">
        <div class="pv-chip"><div class="pv-chip-label">Pendiente</div><div class="pv-chip-val pv-orange">${fmt(pendiente)}</div></div>
        <div class="pv-chip"><div class="pv-chip-label">Efectivo</div><div class="pv-chip-val pv-green">${fmt(efectivo)}</div></div>
        <div class="pv-chip"><div class="pv-chip-label">Transf.</div><div class="pv-chip-val pv-green">${fmt(transf)}</div></div>
        <div class="pv-chip"><div class="pv-chip-label">MP</div><div class="pv-chip-val pv-green">${fmt(mp)}</div></div>
      </div>`;
  }

  // ─────────────────────────────────────────
  //  RENDER LISTA
  // ─────────────────────────────────────────
  function renderPagos() {
    const el = container.querySelector('#pagos-list');
    if (!el) return;
    const pagos = getPagos();
    let lista = pagos.filter(p => {
      if (!p.fecha) return false;
      const d = new Date(p.fecha + 'T12:00:00');
      return d.getMonth() === mesActual && d.getFullYear() === anioActual;
    });
    if (filtroActual === 'pendiente') lista = lista.filter(p => p.estado === 'pendiente');
    else if (filtroActual === 'pagado') lista = lista.filter(p => p.estado === 'pagado');
    else if (filtroActual !== 'todos') lista = lista.filter(p => p.metodo === filtroActual);
    lista.sort((a, b) => b.fecha.localeCompare(a.fecha));

    if (!lista.length) {
      el.innerHTML = `<div class="pv-empty"><div class="pv-empty-icon">💰</div><p>Sin pagos registrados</p></div>`;
      return;
    }
    const grupos = {};
    lista.forEach(p => { if (!grupos[p.fecha]) grupos[p.fecha] = []; grupos[p.fecha].push(p); });

    el.innerHTML = Object.entries(grupos).map(([fecha, items]) => {
      const fLabel = new Date(fecha + 'T12:00:00').toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' });
      return `
        <div class="pv-date-group">${fLabel}</div>
        ${items.map(p => `
          <div class="pv-card pv-met-${p.metodo} ${p.estado === 'pendiente' ? 'pv-pendiente' : ''}" data-id="${p.id}">
            <div class="pv-card-icon pv-icon-${p.metodo}">${METODO_ICON[p.metodo] || '💰'}</div>
            <div class="pv-card-info">
              <div class="pv-card-nombre">${p.paciente}</div>
              <div class="pv-card-meta">${METODO_LABEL[p.metodo] || p.metodo}${p.estado === 'pendiente' ? ' · ⏳ Pendiente' : ''}</div>
            </div>
            <div class="pv-card-monto ${p.estado === 'pendiente' ? 'pv-monto-pend' : ''}">$${Number(p.monto).toLocaleString('es-AR')}</div>
          </div>`).join('')}`;
    }).join('');

    el.querySelectorAll('.pv-card').forEach(card => {
      card.addEventListener('click', () => abrirDetalle(Number(card.dataset.id)));
    });
  }

  // ─────────────────────────────────────────
  //  HANDLE SUBMIT
  // ─────────────────────────────────────────
  function handleSubmit() {
    const err      = container.querySelector('#pv-msg-error');
    const paciente = container.querySelector('#pv-f-paciente').value;
    const monto    = container.querySelector('#pv-f-monto').value;
    const metodo   = container.querySelector('#pv-f-metodo').value;
    const fecha    = container.querySelector('#pv-f-fecha').value;
    const estado   = container.querySelector('#pv-f-estado').value;

    err.style.display = 'none';
    if (!paciente) { err.textContent = 'Seleccioná un paciente'; err.style.display = 'block'; return; }
    if (!monto || Number(monto) <= 0) { err.textContent = 'Ingresá un monto válido'; err.style.display = 'block'; return; }
    if (!fecha) { err.textContent = 'Seleccioná una fecha'; err.style.display = 'block'; return; }

    const pagos = getPagos();
    pagos.push({ id: Date.now(), paciente, monto: Number(monto), metodo, fecha, estado });
    savePagos(pagos);

    container.querySelector('#pv-f-paciente').value = '';
    container.querySelector('#pv-f-monto').value = '';
    container.querySelector('#pv-f-fecha').value = new Date().toISOString().split('T')[0];
    container.querySelector('#pv-f-metodo').value = 'efectivo';
    container.querySelector('#pv-f-estado').value = 'pagado';
    container.querySelector('#pv-overlay').classList.remove('open');

    toast('✓ Pago registrado');
    renderPagos();
    renderResumen();
  }

  // ─────────────────────────────────────────
  //  DELETE
  // ─────────────────────────────────────────
  function deletePago(id) {
    savePagos(getPagos().filter(p => p.id !== id));
    cerrarDetalle();
    toast('🗑 Pago eliminado');
    renderPagos();
    renderResumen();
  }

  // ─────────────────────────────────────────
  //  DETALLE
  // ─────────────────────────────────────────
  function abrirDetalle(id) {
    const pagos = getPagos();
    pagoSeleccionado = pagos.find(p => p.id === id);
    if (!pagoSeleccionado) return;
    const p = pagoSeleccionado;
    const fecha = new Date(p.fecha + 'T12:00:00').toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' });
    const fmt = v => '$' + Number(v).toLocaleString('es-AR');
    container.querySelector('#pv-det-content').innerHTML = `
      <div class="pv-det-monto">${fmt(p.monto)}</div>
      <div class="pv-det-pac">${p.paciente} · ${fecha}</div>
      <div class="pv-det-rows">
        <div class="pv-det-row"><span>Método</span><span>${METODO_ICON[p.metodo] || ''} ${METODO_LABEL[p.metodo] || p.metodo}</span></div>
        <div class="pv-det-row"><span>Estado</span><span>${p.estado === 'pendiente' ? '⏳ Pendiente' : '✅ Pagado'}</span></div>
        <div class="pv-det-row"><span>Fecha</span><span>${fecha}</span></div>
      </div>`;
    container.querySelector('#pv-overlay-det').classList.add('open');
  }

  function cerrarDetalle() {
    container.querySelector('#pv-overlay-det').classList.remove('open');
    pagoSeleccionado = null;
  }

  // ─────────────────────────────────────────
  //  HTML
  // ─────────────────────────────────────────
  container.innerHTML = `
<style>
#view-pagos{font-family:var(--font);}
#view-pagos .pv-header{background:var(--surface);border-bottom:1px solid var(--border);position:sticky;top:0;z-index:50;box-shadow:var(--shadow-sm);}
#view-pagos .pv-header-top{display:flex;align-items:center;padding:14px 18px 10px;gap:10px;}
#view-pagos .pv-header-title{flex:1;text-align:center;font-size:16px;font-weight:800;}
#view-pagos .pv-month-nav-row{display:flex;align-items:center;justify-content:space-between;padding:10px 18px;background:var(--surface);border-bottom:1px solid var(--border);}
#view-pagos .pv-month-btn{width:32px;height:32px;border-radius:10px;background:var(--bg);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:18px;cursor:pointer;color:var(--text);}
#view-pagos .pv-month-label{font-size:16px;font-weight:800;}
#view-pagos .pv-balance-card{margin:14px 16px 0;background:linear-gradient(135deg,#2E1065,#5B2FA8);border-radius:20px;padding:20px 22px;color:white;position:relative;overflow:hidden;}
#view-pagos .pv-balance-card::after{content:'$';position:absolute;right:-8px;top:-20px;font-size:110px;font-weight:900;opacity:.06;}
#view-pagos .pv-balance-label{font-size:11px;opacity:.65;font-weight:700;text-transform:uppercase;letter-spacing:1px;}
#view-pagos .pv-balance-amount{font-size:34px;font-weight:800;margin:6px 0 2px;letter-spacing:-1px;}
#view-pagos .pv-balance-sub{font-size:12px;opacity:.6;margin-bottom:14px;}
#view-pagos .pv-chips{display:flex;gap:8px;}
#view-pagos .pv-chip{flex:1;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);border-radius:12px;padding:9px 10px;}
#view-pagos .pv-chip-label{font-size:10px;opacity:.65;font-weight:700;text-transform:uppercase;letter-spacing:.5px;}
#view-pagos .pv-chip-val{font-size:16px;font-weight:800;margin-top:2px;}
#view-pagos .pv-green{color:#DDD6FE;}
#view-pagos .pv-orange{color:#FED7AA;}
#view-pagos .pv-filter-bar{display:flex;gap:8px;padding:12px 16px;overflow-x:auto;scrollbar-width:none;}
#view-pagos .pv-filter-bar::-webkit-scrollbar{display:none;}
#view-pagos .pv-fchip{padding:6px 14px;border-radius:20px;font-size:12px;font-weight:700;border:1.5px solid var(--border);background:var(--surface);color:var(--text-muted);cursor:pointer;white-space:nowrap;transition:all .2s;flex-shrink:0;}
#view-pagos .pv-fchip.on{background:var(--primary);color:white;border-color:var(--primary);}
#view-pagos .pv-list-wrap{padding:0 16px 100px;}
#view-pagos .pv-date-group{font-size:11px;font-weight:800;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;padding:10px 0 6px;}
#view-pagos .pv-card{background:var(--surface);border-radius:14px;padding:13px 14px;display:flex;align-items:center;gap:12px;box-shadow:var(--shadow-sm);margin-bottom:8px;position:relative;overflow:hidden;cursor:pointer;transition:transform .15s;}
#view-pagos .pv-card:active{transform:scale(.98);}
#view-pagos .pv-card::before{content:'';position:absolute;left:0;top:0;bottom:0;width:4px;}
#view-pagos .pv-met-efectivo::before{background:var(--primary);}
#view-pagos .pv-met-transferencia::before{background:#1976D2;}
#view-pagos .pv-met-mercado_pago::before{background:#00b1ea;}
#view-pagos .pv-pendiente{border-left:3px solid #F59E0B!important;}
#view-pagos .pv-card-icon{width:38px;height:38px;border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;}
#view-pagos .pv-icon-efectivo{background:var(--primary-light);}
#view-pagos .pv-icon-transferencia{background:#E3F2FD;}
#view-pagos .pv-icon-mercado_pago{background:#E0F7FF;}
#view-pagos .pv-card-info{flex:1;min-width:0;}
#view-pagos .pv-card-nombre{font-size:14px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
#view-pagos .pv-card-meta{font-size:11px;color:var(--text-muted);margin-top:2px;}
#view-pagos .pv-card-monto{font-size:16px;font-weight:800;color:var(--primary);flex-shrink:0;}
#view-pagos .pv-monto-pend{color:#F59E0B;}
#view-pagos .pv-empty{text-align:center;padding:40px 20px;color:var(--text-muted);background:var(--surface);border-radius:var(--radius);}
#view-pagos .pv-empty-icon{font-size:40px;margin-bottom:8px;}
#view-pagos .pv-fab{position:fixed;bottom:80px;right:20px;width:52px;height:52px;background:var(--primary);border-radius:16px;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 24px rgba(91,47,168,.4);cursor:pointer;font-size:26px;color:white;border:none;z-index:40;font-family:var(--font);}
#view-pagos .pv-toast{position:fixed;top:80px;left:50%;transform:translateX(-50%);background:#1A1A2E;color:white;padding:12px 22px;border-radius:12px;font-size:14px;font-weight:600;z-index:9999;display:none;white-space:nowrap;}
#view-pagos .pv-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:60;display:none;align-items:flex-end;justify-content:center;}
#view-pagos .pv-overlay.open{display:flex;}
#view-pagos .pv-modal{background:var(--surface);border-radius:28px 28px 0 0;padding:20px 20px 40px;width:100%;max-width:430px;max-height:92vh;overflow-y:auto;animation:pvSlideUp .25s ease;}
@keyframes pvSlideUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}
#view-pagos .pv-modal-handle{width:40px;height:4px;background:var(--border);border-radius:2px;margin:0 auto 20px;}
#view-pagos .pv-modal-title{font-size:20px;font-weight:800;margin-bottom:4px;}
#view-pagos .pv-modal-sub{font-size:13px;color:var(--text-muted);margin-bottom:20px;}
#view-pagos .pv-field{margin-bottom:14px;}
#view-pagos .pv-field-label{font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;}
#view-pagos .pv-req{color:var(--primary);}
#view-pagos .pv-input{width:100%;border:1.5px solid var(--border);border-radius:14px;padding:13px 16px;font-size:15px;font-family:var(--font);color:var(--text);background:var(--bg);outline:none;}
#view-pagos .pv-input:focus{border-color:var(--primary);background:var(--surface);}
#view-pagos .pv-two-col{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
#view-pagos .pv-btn-guardar{width:100%;background:var(--primary);color:white;border:none;border-radius:14px;padding:16px;font-size:16px;font-weight:700;font-family:var(--font);cursor:pointer;margin-top:8px;}
#view-pagos .pv-btn-cancel{width:100%;background:none;border:none;padding:14px;font-size:14px;color:var(--text-muted);font-family:var(--font);cursor:pointer;margin-top:4px;}
#view-pagos .pv-msg-error{background:#fdf0ef;color:#B94A48;border:1px solid #f0c8c7;border-radius:10px;padding:10px 14px;font-size:13px;margin-bottom:12px;display:none;}
#view-pagos .pv-det-monto{font-size:28px;font-weight:800;margin-bottom:4px;}
#view-pagos .pv-det-pac{font-size:13px;color:var(--text-muted);margin-bottom:16px;}
#view-pagos .pv-det-rows{display:flex;flex-direction:column;gap:10px;}
#view-pagos .pv-det-row{display:flex;justify-content:space-between;font-size:14px;}
#view-pagos .pv-det-row span:first-child{color:var(--text-muted);}
#view-pagos .pv-det-row span:last-child{font-weight:700;}
#view-pagos .pv-det-actions{display:flex;gap:10px;margin-top:20px;}
#view-pagos .pv-btn-det{flex:1;padding:13px;border-radius:12px;border:none;font-family:var(--font);font-size:13px;font-weight:700;cursor:pointer;}
#view-pagos .pv-btn-del{background:#fdf0ef;color:#B94A48;}
#view-pagos .pv-btn-pagar{background:var(--primary-light);color:var(--primary);}
</style>

<div class="pv-header">
  <div class="pv-header-top">
    <div class="pv-header-title">💰 Pagos</div>
  </div>
  <div class="pv-month-nav-row">
    <button class="pv-month-btn" id="pv-mes-prev">‹</button>
    <div class="pv-month-label" id="pv-month-label">${MESES[mesActual]} ${anioActual}</div>
    <button class="pv-month-btn" id="pv-mes-next">›</button>
  </div>
</div>

<div class="pv-balance-card">
  <div id="pagos-balance">
    <div class="pv-balance-label">Total cobrado</div>
    <div class="pv-balance-amount">$0</div>
    <div class="pv-balance-sub">0 pagos · ${MESES[mesActual]} ${anioActual}</div>
  </div>
</div>

<div class="pv-filter-bar">
  <div class="pv-fchip on"  data-filtro="todos">Todos</div>
  <div class="pv-fchip" data-filtro="pendiente">⏳ Pendientes</div>
  <div class="pv-fchip" data-filtro="pagado">✅ Cobrados</div>
  <div class="pv-fchip" data-filtro="efectivo">💵 Efectivo</div>
  <div class="pv-fchip" data-filtro="transferencia">🏦 Transferencia</div>
  <div class="pv-fchip" data-filtro="mercado_pago">📲 Mercado Pago</div>
</div>

<div class="pv-list-wrap">
  <div id="pagos-list"><div class="pv-empty"><div class="pv-empty-icon">💰</div><p>Sin pagos registrados</p></div></div>
</div>

<button class="pv-fab" id="pv-fab-btn">＋</button>
<div class="pv-toast" id="pv-toast"></div>

<!-- MODAL NUEVO PAGO -->
<div class="pv-overlay" id="pv-overlay">
  <div class="pv-modal">
    <div class="pv-modal-handle"></div>
    <div class="pv-modal-title">💰 Registrar pago</div>
    <div class="pv-modal-sub">Registrá el cobro de una sesión.</div>
    <div class="pv-msg-error" id="pv-msg-error"></div>
    <div class="pv-field">
      <div class="pv-field-label">Paciente <span class="pv-req">*</span></div>
      <select class="pv-input" id="pv-f-paciente">
        <option value="">— Seleccioná un paciente —</option>
        ${MOCK_PACIENTES.map(p => `<option value="${p}">${p}</option>`).join('')}
      </select>
    </div>
    <div class="pv-two-col">
      <div class="pv-field">
        <div class="pv-field-label">Monto <span class="pv-req">*</span></div>
        <input class="pv-input" id="pv-f-monto" type="number" placeholder="0" min="0">
      </div>
      <div class="pv-field">
        <div class="pv-field-label">Fecha <span class="pv-req">*</span></div>
        <input class="pv-input" id="pv-f-fecha" type="date" value="${new Date().toISOString().split('T')[0]}">
      </div>
    </div>
    <div class="pv-field">
      <div class="pv-field-label">Método de pago</div>
      <select class="pv-input" id="pv-f-metodo">
        <option value="efectivo">💵 Efectivo</option>
        <option value="transferencia">🏦 Transferencia</option>
        <option value="mercado_pago">📲 Mercado Pago</option>
      </select>
    </div>
    <div class="pv-field">
      <div class="pv-field-label">Estado</div>
      <select class="pv-input" id="pv-f-estado">
        <option value="pagado">✅ Pagado</option>
        <option value="pendiente">⏳ Pendiente</option>
      </select>
    </div>
    <button class="pv-btn-guardar" id="pv-btn-guardar">✓ Guardar pago</button>
    <button class="pv-btn-cancel" id="pv-btn-cancel-modal">Cancelar</button>
  </div>
</div>

<!-- MODAL DETALLE -->
<div class="pv-overlay" id="pv-overlay-det">
  <div class="pv-modal">
    <div class="pv-modal-handle"></div>
    <div id="pv-det-content"></div>
    <div class="pv-det-actions">
      <button class="pv-btn-det pv-btn-pagar" id="pv-btn-marcar-pagado">✅ Marcar cobrado</button>
      <button class="pv-btn-det pv-btn-del"   id="pv-btn-eliminar">🗑 Eliminar</button>
    </div>
    <button class="pv-btn-cancel" id="pv-btn-cancel-det">Cerrar</button>
  </div>
</div>`;

  // ─────────────────────────────────────────
  //  EVENT LISTENERS (después de inyectar HTML)
  // ─────────────────────────────────────────

  container.querySelector('#pv-mes-prev').addEventListener('click', () => {
    mesActual--;
    if (mesActual < 0) { mesActual = 11; anioActual--; }
    container.querySelector('#pv-month-label').textContent = `${MESES[mesActual]} ${anioActual}`;
    renderPagos(); renderResumen();
  });

  container.querySelector('#pv-mes-next').addEventListener('click', () => {
    mesActual++;
    if (mesActual > 11) { mesActual = 0; anioActual++; }
    container.querySelector('#pv-month-label').textContent = `${MESES[mesActual]} ${anioActual}`;
    renderPagos(); renderResumen();
  });

  container.querySelectorAll('.pv-fchip').forEach(chip => {
    chip.addEventListener('click', () => {
      filtroActual = chip.dataset.filtro;
      container.querySelectorAll('.pv-fchip').forEach(c => c.classList.remove('on'));
      chip.classList.add('on');
      renderPagos();
    });
  });

  container.querySelector('#pv-fab-btn').addEventListener('click', () => {
    container.querySelector('#pv-overlay').classList.add('open');
  });

  container.querySelector('#pv-btn-cancel-modal').addEventListener('click', () => {
    container.querySelector('#pv-overlay').classList.remove('open');
  });

  container.querySelector('#pv-btn-guardar').addEventListener('click', handleSubmit);

  container.querySelector('#pv-btn-cancel-det').addEventListener('click', cerrarDetalle);

  container.querySelector('#pv-btn-marcar-pagado').addEventListener('click', () => {
    if (!pagoSeleccionado) return;
    const pagos = getPagos();
    const idx = pagos.findIndex(p => p.id === pagoSeleccionado.id);
    if (idx === -1) return;
    pagos[idx].estado = 'pagado';
    savePagos(pagos);
    cerrarDetalle();
    toast('✅ Marcado como pagado');
    renderPagos(); renderResumen();
  });

  container.querySelector('#pv-btn-eliminar').addEventListener('click', () => {
    if (!pagoSeleccionado) return;
    if (!confirm('¿Eliminar este pago?')) return;
    deletePago(pagoSeleccionado.id);
  });

  container.querySelector('#pv-overlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) container.querySelector('#pv-overlay').classList.remove('open');
  });
  container.querySelector('#pv-overlay-det').addEventListener('click', e => {
    if (e.target === e.currentTarget) cerrarDetalle();
  });

  // ─────────────────────────────────────────
  //  INIT
  // ─────────────────────────────────────────
  renderPagos();
  renderResumen();
}

window.onViewEnter_pagos = initPagos;
