/**
 * suscripcion-control.js
 * Control global de acceso por suscripción — PsicoApp
 */

function getPlanLimits(plan) {
  const limits = {
    free: { dias: 15, whatsapp: 20,  informesIA: 1  },
    pro:  { dias: null, whatsapp: 100, informesIA: 3  },
    max:  { dias: null, whatsapp: 250, informesIA: 25 },
  };
  return limits[plan] || limits.free;
}

function diasDesdeInicio(fecha) {
  if (!fecha) return 0;
  return Math.floor((Date.now() - new Date(fecha).getTime()) / 86400000);
}

function _getSus() {
  try { return JSON.parse(localStorage.getItem('suscripcion')) || null; }
  catch { return null; }
}

function _saveSus(s) {
  localStorage.setItem('suscripcion', JSON.stringify(s));
}

function puedeUsar(feature) {
  const s = _getSus();
  if (!s || s.estado !== 'activa') return false;
  const plan  = s.plan  || 'free';
  const lim   = getPlanLimits(plan);
  const usos  = s.usos  || { whatsapp: 0, informesIA: 0 };
  const extra = s.extra || { whatsapp: 0 };

  if (plan === 'free' && lim.dias !== null) {
    if (diasDesdeInicio(s.fechaInicio) >= lim.dias) return false;
  }

  if (feature === 'whatsapp')
    return (usos.whatsapp || 0) < (lim.whatsapp + (extra.whatsapp || 0));

  if (feature === 'informesIA')
    return (usos.informesIA || 0) < lim.informesIA;

  return true;
}

function registrarUso(feature) {
  const s = _getSus();
  if (!s) return false;
  if (!puedeUsar(feature)) return false;
  if (!s.usos) s.usos = { whatsapp: 0, informesIA: 0 };

  if (feature === 'whatsapp')   s.usos.whatsapp   = (s.usos.whatsapp   || 0) + 1;
  if (feature === 'informesIA') s.usos.informesIA = (s.usos.informesIA || 0) + 1;

  _saveSus(s);
  return true;
}

function getUsoActual(feature) {
  const s     = _getSus();
  const plan  = s?.plan  || 'free';
  const lim   = getPlanLimits(plan);
  const usos  = s?.usos  || { whatsapp: 0, informesIA: 0 };
  const extra = s?.extra || { whatsapp: 0 };

  if (feature === 'whatsapp') {
    const max = lim.whatsapp + (extra.whatsapp || 0);
    return { usado: usos.whatsapp || 0, max, restante: Math.max(0, max - (usos.whatsapp || 0)) };
  }

  if (feature === 'informesIA') {
    return { usado: usos.informesIA || 0, max: lim.informesIA, restante: Math.max(0, lim.informesIA - (usos.informesIA || 0)) };
  }

  return { usado: 0, max: 0, restante: 0 };
}

function getEstadoPlan() {
  const s = _getSus();
  if (!s) return { plan: 'free', activo: false, diasRestantes: null };

  const plan  = s.plan  || 'free';
  const lim   = getPlanLimits(plan);
  const activo = s.estado === 'activa';
  let diasRestantes = null;

  if (plan === 'free' && lim.dias !== null) {
    diasRestantes = Math.max(0, lim.dias - diasDesdeInicio(s.fechaInicio));
  }

  return { plan, activo, diasRestantes };
}
