// Página de ocorrências: mapa, filtros, lista e detalhe
(function () {
  const listEl = document.getElementById('occ-list');
  const mapEl = document.getElementById('occ-map');
  if (!listEl || !mapEl || !window.carregarOcorrencias) return;

  const TIPOS = {
    incendio: { nome: 'Incêndio', cor: '#d0343b' },
    saude: { nome: 'Saúde', cor: '#2f7de1' },
    acidente: { nome: 'Acidente / salvamento', cor: '#f08c00' },
    outro: { nome: 'Outra', cor: '#6c757d' },
  };
  const ICONES = {
    incendio: '#i-fire', saude: '#i-heart', acidente: '#i-ambulance', outro: '#i-shield',
  };

  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const hora = (d) => d.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
  const haQuanto = (d) => {
    const m = Math.round((Date.now() - d.getTime()) / 60000);
    if (m < 1) return 'agora';
    if (m < 60) return `há ${m} min`;
    const h = Math.floor(m / 60);
    return `há ${h} h${m % 60 ? ` ${m % 60} min` : ''}`;
  };

  let dados = [];
  let filtro = 'todas';
  const marcadores = {};

  // Se o mapa (Leaflet) não carregar, a lista continua a funcionar
  const temMapa = typeof window.L !== 'undefined';
  let map = null;
  if (temMapa) {
    map = L.map(mapEl, { scrollWheelZoom: false }).setView([38.83, -9.40], 11);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
  } else {
    mapEl.hidden = true;
  }

  function icone(o) {
    const t = TIPOS[o.tipo] || TIPOS.outro;
    const ativa = o.estado !== 'Concluída';
    return L.divIcon({
      className: '',
      html: `<span class="occ-pin${ativa ? ' is-active' : ''}" style="--c:${t.cor}"></span>`,
      iconSize: [22, 22],
      iconAnchor: [11, 11],
    });
  }

  function visivel(o) {
    if (filtro === 'todas') return true;
    if (filtro === 'ativas') return o.estado !== 'Concluída';
    return o.tipo === filtro;
  }

  function cartao(o) {
    const t = TIPOS[o.tipo] || TIPOS.outro;
    const ativa = o.estado !== 'Concluída';
    return `<button type="button" class="occ-card${ativa ? ' is-active' : ''}" data-id="${esc(o.id)}" style="--c:${t.cor}">
      <span class="occ-card-ico"><svg class="icon" aria-hidden="true"><use href="${ICONES[o.tipo] || ICONES.outro}"/></svg></span>
      <span class="occ-card-body">
        <span class="occ-card-top"><span class="occ-state">${esc(o.estado)}</span><span>${hora(o.data)} · ${haQuanto(o.data)}</span></span>
        <strong>${esc(o.natureza)}</strong>
        <span class="occ-place">${esc(o.localidade)}</span>
        <span class="occ-pills"><span>${o.operacionais} operacionais</span><span>${o.viaturas} viaturas</span>${o.meios_aereos ? `<span>${o.meios_aereos} meio aéreo</span>` : ''}</span>
      </span>
    </button>`;
  }

  function render() {
    const vis = dados.filter(visivel);
    listEl.innerHTML = vis.length ? vis.map(cartao).join('') : '<p class="occ-empty">Sem ocorrências para este filtro.</p>';
    dados.forEach((o) => {
      const m = marcadores[o.id];
      if (!m) return;
      if (visivel(o)) m.addTo(map); else m.remove();
    });
  }

  function abrir(id) {
    const o = dados.find((x) => x.id === id);
    if (!o) return;
    const t = TIPOS[o.tipo] || TIPOS.outro;
    const box = document.getElementById('occ-modal-box');
    const q = `${o.lat},${o.lng}`;
    box.innerHTML = `<div class="occ-modal-head" style="--c:${t.cor}">
        <span class="occ-state">${esc(o.estado)}</span>
        <h3 id="occ-modal-title">${esc(o.natureza)}</h3>
        <button type="button" class="occ-close" data-close aria-label="Fechar">×</button>
      </div>
      <dl class="occ-details">
        <dt>Tipo</dt><dd>${esc(t.nome)}</dd>
        <dt>Início</dt><dd>${hora(o.data)} (${haQuanto(o.data)})</dd>
        <dt>Local</dt><dd>${esc(o.localidade)}</dd>
        <dt>Freguesia</dt><dd>${esc(o.freguesia)}</dd>
        <dt>Operacionais</dt><dd>${o.operacionais}</dd>
        <dt>Viaturas</dt><dd>${o.viaturas}</dd>
        <dt>Meios aéreos</dt><dd>${o.meios_aereos}</dd>
      </dl>
      <iframe class="occ-modal-map" loading="lazy" title="Mapa da localização" src="https://www.google.com/maps?q=${encodeURIComponent(q)}&z=15&output=embed"></iframe>
      <a class="btn btn-dark" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}" target="_blank" rel="noopener">Abrir no Google Maps</a>`;
    const modal = document.getElementById('occ-modal');
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    box.querySelector('.occ-close').focus();
  }

  function fechar() {
    const modal = document.getElementById('occ-modal');
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  // O modal fica diretamente no body para não ficar por baixo do cabeçalho fixo
  document.body.appendChild(document.getElementById('occ-modal'));
  document.getElementById('occ-modal').addEventListener('click', (e) => {
    if (e.target.closest('[data-close]')) fechar();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') fechar(); });

  listEl.addEventListener('click', (e) => {
    const c = e.target.closest('.occ-card');
    if (c) abrir(c.dataset.id);
  });

  document.querySelectorAll('.occ-filters button').forEach((b) => {
    b.addEventListener('click', () => {
      filtro = b.dataset.filter;
      document.querySelectorAll('.occ-filters button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      render();
    });
  });

  function atualizar() {
    window.carregarOcorrencias().then((lista) => {
      dados = lista;
      Object.values(marcadores).forEach((m) => m.remove());
      dados.forEach((o) => {
        if (!temMapa) return;
        const m = L.marker([o.lat, o.lng], { icon: icone(o), title: o.natureza });
        m.on('click', () => abrir(o.id));
        marcadores[o.id] = m;
      });
      const ativas = dados.filter((o) => o.estado !== 'Concluída');
      const set = (k, v) => { const el = document.querySelector(`[data-stat="${k}"]`); if (el) el.textContent = v; };
      set('ativas', ativas.length);
      set('operacionais', ativas.reduce((a, o) => a + o.operacionais, 0));
      set('viaturas', ativas.reduce((a, o) => a + o.viaturas, 0));
      set('total', dados.length);
      const up = document.querySelector('[data-occ-updated]');
      if (up) up.textContent = `às ${hora(new Date())}`;
      render();
    }).catch(() => {
      listEl.innerHTML = '<p class="occ-empty">Não foi possível carregar as ocorrências. Tente novamente mais tarde.</p>';
    });
  }

  atualizar();
  setInterval(atualizar, 120000);
})();
