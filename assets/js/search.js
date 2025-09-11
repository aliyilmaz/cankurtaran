document.addEventListener('DOMContentLoaded', function () {
  const btn = document.getElementById('search-btn');
  const box = document.getElementById('search-box');
  const input = document.getElementById('search-input');
  const results = document.getElementById('search-results');

  let cities = null;
  let lastQuery = '';

  // load cities.json once
  function loadCities() {
    if (cities) return Promise.resolve(cities);
    return fetch('cities.json', { cache: 'no-cache' })
      .then(resp => resp.json())
      .then(data => {
        cities = data;
        return cities;
      })
      .catch(err => {
        console.error('cities.json yüklenemedi', err);
        cities = [];
        return cities;
      });
  }

  // debounce helper
  function debounce(fn, wait) {
    let t;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  // normalize string
  function norm(s) {
    return (s || '').toString().toLowerCase().trim();
  }

  // attempt to find coordinates in different possible shapes
  function getCoords(item) {
    if (item == null) return null;
    if (item.lat != null && item.lon != null) return [parseFloat(item.lat), parseFloat(item.lon)];
    if (item.latitude != null && item.longitude != null) return [parseFloat(item.latitude), parseFloat(item.longitude)];
    if (item.lat != null && item.lng != null) return [parseFloat(item.lat), parseFloat(item.lng)];
    if (Array.isArray(item.coords) && item.coords.length >= 2) return [parseFloat(item.coords[0]), parseFloat(item.coords[1])];
    if (item.geometry && Array.isArray(item.geometry.coordinates)) {
      const c = item.geometry.coordinates;
      return [parseFloat(c[1]), parseFloat(c[0])];
    }
    if (Array.isArray(item.coordinates) && item.coordinates.length >= 2) {
      const c = item.coordinates;
      if (Math.abs(c[0]) <= 90) return [parseFloat(c[0]), parseFloat(c[1])];
      return [parseFloat(c[1]), parseFloat(c[0])];
    }
    return null;
  }

  function getProvinceField(item) {
    // desteklenen alan isimleri: state, province, il, admin
    return item.state_name || item.province || item.il || item.admin || '';
  }

  function formatSecondary(item) {
    // country/region as secondary (shown under main "Province / District")
    const parts = [];
    if (item.region && parts.indexOf(item.region) === -1) parts.push(item.region);
    if (item.country && parts.indexOf(item.country) === -1) parts.push(item.country);
    return parts.join(', ');
  }

  function renderResults(list) {
    results.innerHTML = '';
    if (!list || list.length === 0) {
      const li = document.createElement('li');
      li.className = 'no-results';
      li.textContent = '-';
      results.appendChild(li);
      return;
    }
    list.forEach((item, idx) => {
      const li = document.createElement('li');
      li.tabIndex = 0;
      li.className = 'result-item';

      const prov = getProvinceField(item);
      const name = item.name || item.title || item.place || item.city || '—';
      // gösterim: "İl / İlçe" (ör. "Samsun / Terme") — il yoksa sadece isim göster
      const mainText = prov ? `${prov} / ${name}` : name;
      const secondary = formatSecondary(item);

      if (secondary) {
        li.innerHTML = `<div class="r-main">${escapeHtml(mainText)}</div><div class="r-sub" aria-hidden="true">${escapeHtml(secondary)}</div>`;
      } else {
        li.innerHTML = `<div class="r-main">${escapeHtml(mainText)}</div>`;
      }

      li.dataset.index = idx;
      li._raw = item;
      li.addEventListener('click', () => {
        selectResult(item);
      });
      li.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') selectResult(item);
      });
      results.appendChild(li);
    });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (m) {
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]);
    });
  }

  function selectResult(item) {
    const coords = getCoords(item);
    if (coords && typeof window.map !== 'undefined') {
      try {
        const latlng = [coords[0], coords[1]];
        window.map.setView(latlng, Math.max(window.map.getZoom(), 12));
        if (window.searchHitMarker) window.searchHitMarker.remove();
        window.searchHitMarker = L.marker(latlng).addTo(window.map);
        const popupText = buildPopupText(item);
        if (popupText) window.searchHitMarker.bindPopup(popupText).openPopup();
        setTimeout(() => {
          if (window.searchHitMarker) {
            window.searchHitMarker.remove();
            window.searchHitMarker = null;
          }
        }, 5000);
      } catch (e) {
        console.warn('Haritaya merkezlenemedi', e);
      }
    }
    box.classList.remove('visible');
    input.value = '';
    results.innerHTML = '';
  }

  function buildPopupText(item) {
    const name = item.name || item.title || item.city || item.place || '';
    const prov = getProvinceField(item);
    const secondary = formatSecondary(item);
    const main = prov ? `${prov} / ${name}` : name;
    return secondary ? `<strong>${escapeHtml(main)}</strong><br><small>${escapeHtml(secondary)}</small>` : escapeHtml(main);
  }

  function matchFields(item, q) {
    const candidates = [
        item.name, item.title, item.city, item.place, item.label,
        item.country, item.state, item.province, item.admin, item.region, item.il,
        item.state_name // ← buraya eklenmeli
    ];
    return candidates.some(f => norm(f).includes(q));
    }


  const doSearch = debounce(function () {
    const raw = input.value.trim();
    const q = norm(raw);
    if (q.length === 0) {
      results.innerHTML = '';
      return;
    }
    if (q === lastQuery) return;
    lastQuery = q;
    loadCities().then(list => {
      let filtered = [];
      // support "Province / Name" or "Name / Province" style queries separated by '/'
      if (raw.indexOf('/') !== -1) {
        const parts = raw.split('/').map(s => norm(s));
        const a = parts[0] || '';
        const b = parts[1] || '';
        filtered = list.filter(item => {
          const name = norm(item.name || item.title || item.place || item.city || '');
          const prov = norm(getProvinceField(item));
          const country = norm(item.country || '');
          // order: prov/name or name/prov, allow partial includes
          const orderProvName = prov.includes(a) && name.includes(b);
          const orderNameProv = name.includes(a) && prov.includes(b);
          const countryName = country.includes(a) && name.includes(b);
          return orderProvName || orderNameProv || countryName || (prov.includes(a) && name.includes(a) && name.includes(b));
        }).slice(0, 50);
      } else {
        // standard single-term matching across many fields (il veya ilçe ile eşleşir)
        filtered = list.filter(item => matchFields(item, q)).slice(0, 50);
      }
      renderResults(filtered);
    });
  }, 200);

  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    box.classList.toggle('visible');
    if (box.classList.contains('visible')) {
      input.focus();
      loadCities().catch(()=>{});
    } else {
      input.value = '';
      results.innerHTML = '';
    }
  });

  // close when click outside
  document.addEventListener('click', function (e) {
    if (!box.contains(e.target) && e.target !== btn) {
      box.classList.remove('visible');
    }
  });

  input.addEventListener('input', doSearch);

  // keyboard: Esc closes
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      box.classList.remove('visible');
      input.value = '';
      results.innerHTML = '';
      btn.focus();
    }
  });
});