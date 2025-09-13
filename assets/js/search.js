document.addEventListener('DOMContentLoaded', function () {
  const btn = document.getElementById('search-btn');
  const box = document.getElementById('search-box');
  const input = document.getElementById('search-input');
  const results = document.getElementById('search-results');

  // Başta input ve buton pasif
  input.disabled = true;
  btn.disabled = true;
  input.placeholder = "Veriler yükleniyor...";

  let cities = null;
  let lastQuery = '';
  let currentPage = 1;
  const RESULTS_PER_PAGE = 10;
  let currentFilteredResults = [];

  // IndexedDB ayarları
  const DB_NAME = 'CitiesDB';
  const DB_VERSION = 1;
  const STORE_NAME = 'cities';
  let db = null;

  // Debug paneli ve toggle butonu
  const debugPanel = document.createElement('div');
  debugPanel.id = 'search-debug-panel';
  debugPanel.style.display = 'none'; // başlangıçta gizli

  const debugToggleBtn = document.createElement('button');
  debugToggleBtn.textContent = '🔍 Debug';
  debugToggleBtn.id = 'search-debug-toggle';

  const debugClearBtn = document.createElement('button');
  debugClearBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"/>
  <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466"/>
</svg>`;
  debugClearBtn.id = 'search-debug-clear';
  debugClearBtn.title = 'Logları Temizle';
  debugClearBtn.style.display = 'none'; // başlangıçta gizli

  debugToggleBtn.addEventListener('click', () => {
    const isVisible = debugPanel.style.display === 'block';
    if (isVisible) {
      debugPanel.style.display = 'none';
      debugClearBtn.style.display = 'none';
      debugToggleBtn.textContent = '🔍 Debug';
      debugToggleBtn.style.background = '#007bff';
    } else {
      debugPanel.style.display = 'block';
      debugClearBtn.style.display = 'inline-block';
      debugToggleBtn.textContent = '👁️ Debug';
      debugToggleBtn.style.background = '#28a745';
    }
  });

  debugClearBtn.addEventListener('click', () => {
    debugPanel.innerHTML = '';
    log('Loglar temizlendi');
  });

  document.body.appendChild(debugPanel);
  document.body.appendChild(debugToggleBtn);
  document.body.appendChild(debugClearBtn);

  function log(...args) {
    const message = args.map(arg => 
      typeof arg === 'object' ? JSON.stringify(arg).substring(0, 100) : String(arg)
    ).join(' ');
    
    console.log('[Search]', ...args);
    
    const debugLine = document.createElement('div');
    debugLine.textContent = new Date().toLocaleTimeString() + ': ' + message;
    debugLine.style.borderBottom = '1px solid #333';
    debugLine.style.padding = '2px 0';
    debugLine.style.fontFamily = 'monospace';
    debugLine.style.fontSize = '11px';
    debugLine.style.wordBreak = 'break-word';
    
    debugPanel.appendChild(debugLine);
    debugPanel.scrollTop = debugPanel.scrollHeight;
    
    if (debugPanel.children.length > 50) {
      debugPanel.removeChild(debugPanel.firstChild);
    }
  }

  // IndexedDB işlemleri
  function openDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      
      request.onerror = () => {
        log('IndexedDB açılırken hata:', request.error);
        reject(request.error);
      };
      
      request.onsuccess = () => {
        db = request.result;
        log('IndexedDB başarıyla açıldı');
        resolve(db);
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('name', 'name', { unique: false });
          store.createIndex('state_name', 'state_name', { unique: false });
          log('IndexedDB store oluşturuldu');
        }
      };
    });
  }

  function addCitiesToDB(citiesData) {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject(new Error('DB bağlantısı yok'));
        return;
      }
      
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      // Önce mevcut verileri temizle
      const clearRequest = store.clear();
      
      clearRequest.onsuccess = () => {
        log('Mevcut veriler temizlendi, yeni veriler ekleniyor:', citiesData.length);
        
        let added = 0;
        let errors = 0;
        
        citiesData.forEach(city => {
          const request = store.add(city);
          
          request.onsuccess = () => {
            added++;
          };
          
          request.onerror = () => {
            errors++;
            log('Veri eklenirken hata:', request.error, city);
          };
        });
        
        transaction.oncomplete = () => {
          log(`Veri ekleme tamamlandı: ${added} başarılı, ${errors} hatalı`);
          resolve({ added, errors });
        };
        
        transaction.onerror = () => {
          log('Transaction hatası:', transaction.error);
          reject(transaction.error);
        };
      };
      
      clearRequest.onerror = () => {
        log('Temizleme hatası:', clearRequest.error);
        reject(clearRequest.error);
      };
    });
  }

  function getAllCitiesFromDB() {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject(new Error('DB bağlantısı yok'));
        return;
      }
      
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();
      
      request.onsuccess = () => {
        log('IndexedDB\'den veriler alındı:', request.result.length);
        resolve(request.result);
      };
      
      request.onerror = () => {
        log('Veri alınırken hata:', request.error);
        reject(request.error);
      };
    });
  }

  function searchInDB(query) {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject(new Error('DB bağlantısı yok'));
        return;
      }
      
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const results = [];
      
      // Tüm kayıtları tarayarak arama yap
      const request = store.openCursor();
      
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          const item = cursor.value;
          if (searchInItem(item, query)) {
            results.push(item);
          }
          cursor.continue();
        } else {
          log('IndexedDB arama tamamlandı:', results.length, 'sonuç bulundu');
          resolve(results);
        }
      };
      
      request.onerror = () => {
        log('Cursor hatası:', request.error);
        reject(request.error);
      };
    });
  }

  async function loadCities() {
    if (cities) {
      log('Şehirler zaten yüklü:', cities.length);
      return cities;
    }
    
    try {
      // Önce IndexedDB'yi aç
      await openDatabase();
      
      // IndexedDB'de veri var mı kontrol et
      const dbCities = await getAllCitiesFromDB();
      
      if (dbCities && dbCities.length > 0) {
        log('IndexedDB\'den şehirler yüklendi:', dbCities.length);
        cities = dbCities;
        
        // ✅ Input ve buton etkinleştir
        input.disabled = false;
        btn.disabled = false;
        input.placeholder = "Şehir ara...";
        log('Input ve buton etkinleştirildi (IndexedDB)');
        
        return cities;
      }
      
      // IndexedDB'de veri yoksa JSON'dan yükle
      log('IndexedDB\'de veri bulunamadı, JSON dosyası yükleniyor...');
      
      const testResponse = await fetch('cities.json', { method: 'HEAD' });
      if (!testResponse.ok) {
        throw new Error('JSON dosyası bulunamadı');
      }
      
      log('JSON dosyası bulundu, yükleniyor...');
      const response = await fetch('cities.json');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const jsonText = await response.text();
      log('JSON metni alındı, uzunluk:', jsonText.length);
      
      const data = JSON.parse(jsonText);
      log('JSON parse edildi, kayıt sayısı:', data.length);
      
      if (!Array.isArray(data)) {
        throw new Error('JSON bir dizi değil');
      }
      
      // Verileri IndexedDB'ye kaydet
      await addCitiesToDB(data);
      cities = data;
      log('Şehirler başarıyla yüklendi ve IndexedDB\'ye kaydedildi:', cities.length);

      // ✅ Input ve buton etkinleştir
      input.disabled = false;
      btn.disabled = false;
      input.placeholder = "Şehir ara...";
      log('Input ve buton etkinleştirildi');

      return cities;
      
    } catch (error) {
      log('Yükleme hatası:', error.toString());
      
      // IndexedDB'den tekrar dene
      try {
        const dbCities = await getAllCitiesFromDB();
        if (dbCities && dbCities.length > 0) {
          cities = dbCities;
          log('IndexedDB\'den fallback veri yüklendi:', cities.length);
          
          input.disabled = false;
          btn.disabled = false;
          input.placeholder = "Şehir ara...";
          return cities;
        }
      } catch (dbError) {
        log('IndexedDB fallback hatası:', dbError);
      }
      
      // Son çare: fallback test verisi
      cities = [
        { id: 105641, name: "Abana", state_name: "Kastamonu", latitude: "41.97858000", longitude: "34.01100000" },
        { id: 105642, name: "Acıgöl", state_name: "Nevşehir", latitude: "38.55028000", longitude: "34.50917000" },
        { id: 105643, name: "Acıpayam", state_name: "Denizli", latitude: "37.42385000", longitude: "29.34941000" },
        { id: 105644, name: "Adana", state_name: "Adana", latitude: "37.00000000", longitude: "35.32133500" },
        { id: 105645, name: "Adapazarı", state_name: "Sakarya", latitude: "40.78056000", longitude: "30.40333000" },
        { id: 105646, name: "İstanbul", state_name: "İstanbul", latitude: "41.00824000", longitude: "28.97835900" },
        { id: 105647, name: "Kadıköy", state_name: "İstanbul", latitude: "40.98153000", longitude: "29.05796000" },
        { id: 105648, name: "Ankara", state_name: "Ankara", latitude: "39.91987000", longitude: "32.85427000" }
      ];
      
      log('Fallback test verisi kullanılıyor:', cities.length, 'kayıt');

      input.disabled = false;
      btn.disabled = false;
      input.placeholder = "Şehir ara...";
      log('Input ve buton etkinleştirildi (fallback)');

      return cities;
    }
  }

  function debounce(fn, wait) {
    let t;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  function norm(s) {
    if (typeof s !== 'string') return '';
    return s.toLowerCase().trim()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
      .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c');
  }

  function escapeHtml(s) {
    if (typeof s !== 'string') return '';
    return s.replace(/[&<>"']/g, m => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[m]));
  }

  function renderResults(list, page = 1) {
    results.innerHTML = '';
    
    if (!list || list.length === 0) {
      results.innerHTML = '<li class="no-results">-</li>';
      log('Sonuç bulunamadı');
      return;
    }
    
    const startIndex = (page - 1) * RESULTS_PER_PAGE;
    const endIndex = startIndex + RESULTS_PER_PAGE;
    const displayList = list.slice(startIndex, endIndex);
    
    log(`${list.length} sonuç bulundu, gösterilen: ${startIndex + 1}-${Math.min(endIndex, list.length)}`);
    
    displayList.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'result-item';
      li.tabIndex = 0;

      const name = item.name || '—';
      const state = item.state_name || '';
      const mainText = state ? `${state} / ${name}` : name;

      li.innerHTML = `<div class="r-main">${escapeHtml(mainText)}</div>`;
      li._raw = item;
      
      li.addEventListener('click', (e) => {
        e.stopPropagation();
        log('Seçilen:', name);
        selectResult(item);
      });
      
      li.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.stopPropagation();
          log('Enter ile seçildi:', name);
          selectResult(item);
        }
      });
      
      results.appendChild(li);
    });

    if (endIndex < list.length) {
      const moreButton = document.createElement('li');
      moreButton.className = 'more-results-btn';
      moreButton.innerHTML = `
        <div style="text-align: center; padding: 10px; color: #007bff; cursor: pointer;">
          <strong>Daha Fazla Sonuç Göster</strong>
          <div style="font-size: 12px; color: #666;">
            ${endIndex} / ${list.length} sonuç gösteriliyor
          </div>
        </div>
      `;
      
      moreButton.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        currentPage++;
        log('Daha fazla sonuç yükleniyor, sayfa:', currentPage);
        renderResults(list, currentPage);
      });
      
      results.appendChild(moreButton);
    } else if (list.length > RESULTS_PER_PAGE) {
      const showingAll = document.createElement('li');
      showingAll.className = 'showing-all';
      showingAll.innerHTML = `
        <div style="text-align: center; padding: 8px; color: #28a745; font-size: 12px;">
          <strong>✓ Tüm sonuçlar gösteriliyor</strong>
          <div>${list.length} sonuç</div>
        </div>
      `;
      results.appendChild(showingAll);
    }
  }

  function selectResult(item) {
    const name = item.name || '—';
    const state = item.state_name || '';
    log('Sonuç seçildi:', state, '/', name);
    
    try {
      const lat = parseFloat(item.latitude);
      const lon = parseFloat(item.longitude);
      
      if (!isNaN(lat) && !isNaN(lon) && typeof window.map !== 'undefined') {
        const coords = [lat, lon];
        window.map.setView(coords, Math.max(window.map.getZoom(), 12));
        
        if (window.searchHitMarker) {
          window.searchHitMarker.remove();
        }
        
        window.searchHitMarker = L.marker(coords).addTo(window.map);
        const popupText = `<strong>${escapeHtml(state)} / ${escapeHtml(name)}</strong>`;
        window.searchHitMarker.bindPopup(popupText).openPopup();
        
        setTimeout(() => {
          if (window.searchHitMarker) {
            window.searchHitMarker.remove();
            window.searchHitMarker = null;
          }
        }, 5000);
      }
    } catch (e) {
      log('Harita hatası:', e);
    }
    
    box.classList.remove('visible');
    input.value = '';
    results.innerHTML = '';
    currentPage = 1;
  }

  function searchInItem(item, q) {
    if (!item || !q) return false;
    if (item.name && norm(item.name).includes(q)) return true;
    if (item.state_name && norm(item.state_name).includes(q)) return true;
    return false;
  }

  const doSearch = debounce(function () {
    const raw = input.value.trim();
    const q = norm(raw);
    
    log('Arama yapılıyor:', '"' + raw + '" -> "' + q + '"');
    
    if (q.length === 0) {
      results.innerHTML = '';
      lastQuery = '';
      currentPage = 1;
      return;
    }

     results.innerHTML = '<li class="searching"><img src="assets/img/0_cWpsf9D3g346Va20.gif"></li>';
    
    lastQuery = q;
    currentPage = 1;
    
    // IndexedDB'de arama yap
    searchInDB(q).then(filteredResults => {
      currentFilteredResults = filteredResults;
      log('IndexedDB arama sonucu:', currentFilteredResults.length);
      renderResults(currentFilteredResults, currentPage);
    }).catch(error => {
      log('IndexedDB arama hatası:', error);
      // Fallback: memory'de arama
      if (cities) {
        currentFilteredResults = cities.filter(item => searchInItem(item, q));
        log('Memory fallback arama sonucu:', currentFilteredResults.length);
        renderResults(currentFilteredResults, currentPage);
      } else {
        renderResults([]);
      }
    });
  }, 400);

  btn.addEventListener('click', function (e) {
    if (btn.disabled) return; // güvenlik için
    
    e.stopPropagation();
    log('Arama butonuna tıklandı');
    
    const isVisible = box.classList.contains('visible');
    box.classList.toggle('visible');
    
    if (!isVisible) {
      input.focus();
      log('Arama kutusu açıldı');
      loadCities().catch(error => log('Yükleme hatası:', error));
    } else {
      input.value = '';
      results.innerHTML = '';
      currentPage = 1;
      log('Arama kutusu kapatıldı');
    }
  });

  document.addEventListener('click', function (e) {
    if (e.target.closest('.more-results-btn')) {
      return;
    }
    
    if (!box.contains(e.target) && e.target !== btn && box.classList.contains('visible')) {
      box.classList.remove('visible');
      input.value = '';
      results.innerHTML = '';
      currentPage = 1;
      log('Dışarı tıklandı, kapatıldı');
    }
  });

  input.addEventListener('input', doSearch);

  input.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && box.classList.contains('visible')) {
      box.classList.remove('visible');
      input.value = '';
      results.innerHTML = '';
      currentPage = 1;
      log('ESC ile kapatıldı');
    }
  });

  // ✅ Sayfa yüklenince JSON otomatik yüklensin ve IndexedDB'ye kaydedilsin
  loadCities().catch(error => log('Sayfa yüklenirken hata:', error));

  log('Arama sistemi hazır (IndexedDB entegreli).');
  log('Test için: "ana", "ada", "istanbul" yazmayı deneyin');
  log('Debug panelini sağ alttaki butonla açıp kapatabilirsiniz');
});