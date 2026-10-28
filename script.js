(function () {
  var STORAGE_KEY = 'rebi-elias';
  var PIN_KEY = 'rebi-elias-pin';
  // SHA-256 vom PIN, dass er nöd im Klartext im Code staht
  var PIN_HASH = '24e43df12e68c74a4bfe2d6c2dd6c62ac9956413027a1cc48aaac9b4e67ad782';

  // PIN-Schloss
  var gate = document.getElementById('pin-gate');
  var pinInput = document.getElementById('pin-input');
  var pinError = document.getElementById('pin-error');

  function sha256(text) {
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)).then(function (buf) {
      return Array.prototype.map.call(new Uint8Array(buf), function (b) {
        return ('0' + b.toString(16)).slice(-2);
      }).join('');
    });
  }

  function checkPin() {
    sha256(pinInput.value).then(function (hash) {
      if (hash === PIN_HASH) {
        try { localStorage.setItem(PIN_KEY, 'ok'); } catch (e) {}
        pinInput.blur();
        if (reducedMotion) return unlock();
        heartBurst(pinInput.getBoundingClientRect());
        gate.classList.add('leaving');
        setTimeout(unlock, 450);
      } else {
        pinError.textContent = 'Falsche PIN, probier nomol ♡';
        pinInput.classList.remove('wrong');
        void pinInput.offsetWidth;
        pinInput.classList.add('wrong');
        pinInput.value = '';
        pinInput.focus();
      }
    });
  }

  function unlock() {
    document.documentElement.classList.add('unlocked');
    window.scrollTo(0, 0);
    playIntro();
  }

  gate.addEventListener('submit', function (e) {
    e.preventDefault();
    checkPin();
  });
  pinInput.addEventListener('input', function () {
    pinInput.value = pinInput.value.replace(/\D/g, '');
    if (pinInput.value.length === 6) checkPin();
  });

  // Tageszähler sit em 31.10.2024
  var days = Math.floor((new Date() - new Date(2024, 9, 31)) / 864e5);
  var daysEl = document.getElementById('days');
  daysEl.textContent = days.toLocaleString('de-CH');

  // Animation bim Ufmache: Herz-Explosion, Siite baut sich uf, Zähler zellt, Herz-Räge
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var introPlaying = false;

  function heartBurst(rect) {
    var box = document.createElement('div');
    box.className = 'fx';
    var cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
    for (var i = 0; i < 36; i++) {
      var h = document.createElement('span');
      var angle = (i / 36) * Math.PI * 2 + Math.random() * 0.3;
      var dist = 140 + Math.random() * 220;
      h.className = 'fx-burst';
      h.textContent = i % 4 ? '♥' : '✦';
      h.style.left = cx + 'px';
      h.style.top = cy + 'px';
      h.style.fontSize = (18 + Math.random() * 26) + 'px';
      h.style.color = i % 3 ? '#e0368a' : i % 2 ? '#ff6fb5' : '#fff';
      h.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
      h.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
      h.style.setProperty('--r', (Math.random() * 360 - 180) + 'deg');
      h.style.animationDelay = Math.random() * 0.1 + 's';
      box.appendChild(h);
    }
    document.body.appendChild(box);
    setTimeout(function () { box.remove(); }, 1600);
  }

  function heartRain() {
    var box = document.createElement('div');
    box.className = 'fx';
    for (var i = 0; i < 32; i++) {
      var h = document.createElement('span');
      h.className = 'fx-rain';
      h.textContent = i % 5 ? '♥' : '✦';
      h.style.left = Math.random() * 100 + '%';
      h.style.fontSize = (14 + Math.random() * 22) + 'px';
      h.style.color = i % 3 ? '#ff6fb5' : i % 2 ? '#e0368a' : '#fff';
      h.style.setProperty('--r', (Math.random() * 540 - 270) + 'deg');
      h.style.setProperty('--sway', (Math.random() * 80 - 40) + 'px');
      h.style.animationDuration = (2.6 + Math.random() * 2) + 's';
      h.style.animationDelay = (0.3 + Math.random() * 1.4) + 's';
      box.appendChild(h);
    }
    document.body.appendChild(box);
    setTimeout(function () { box.remove(); }, 6500);
  }

  function countUp() {
    var start = null, duration = 1600;
    daysEl.textContent = '0';
    setTimeout(function () {
      requestAnimationFrame(function step(t) {
        if (start === null) start = t;
        var p = Math.min((t - start) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        daysEl.textContent = Math.round(days * eased).toLocaleString('de-CH');
        if (p < 1) requestAnimationFrame(step);
      });
    }, 900);
  }

  function playIntro() {
    if (reducedMotion) return;
    introPlaying = true;
    document.documentElement.classList.add('intro');
    countUp();
    heartRain();
    if (grid.children.length) watchTiles();
  }

  // Kachle ploppe nachenand uf, sobald mer zu ihne abe scrollt
  function watchTiles() {
    var tiles = Array.prototype.slice.call(grid.children);
    tiles.forEach(function (t) { t.classList.add('tile-hidden'); });
    var io = new IntersectionObserver(function (entries) {
      if (!entries.some(function (e) { return e.isIntersecting; })) return;
      io.disconnect();
      tiles.forEach(function (t, i) {
        setTimeout(function () {
          var wasOpen = t.classList.contains('open');
          t.style.animation = '';
          t.classList.remove('tile-hidden');
          t.classList.add('tile-in');
          t.addEventListener('animationend', function () {
            // scho offeni Kachle sölled nöd nomol ploppe
            if (wasOpen) t.style.animation = 'none';
            t.classList.remove('tile-in');
          }, { once: true });
        }, i * 70);
      });
    }, { threshold: 0.15 });
    io.observe(grid);
  }

  // Glitzer-Sternli
  var sparkles = document.getElementById('sparkles');
  for (var i = 0; i < 40; i++) {
    var s = document.createElement('span');
    s.textContent = '✦';
    s.style.left = ((i * 53) % 100) + '%';
    s.style.top = ((i * 29) % 100) + '%';
    s.style.fontSize = (10 + ((i * 37) % 22)) + 'px';
    s.style.color = i % 3 ? '#fff' : '#ff6fb5';
    s.style.animationDuration = (2 + (i % 5) * 0.6) + 's';
    s.style.animationDelay = ((i % 7) * 0.4) + 's';
    sparkles.appendChild(s);
  }

  // Gründ-Kachle: Texte chömed us texte.json, welli offe sind, merkt sich dä Browser
  var reasons = [];
  var opened = [];
  try {
    opened = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}').opened || [];
  } catch (e) {}

  fetch('texte.json', { cache: 'no-cache' })
    .then(function (res) { return res.json(); })
    .then(function (config) {
      if (config.titel) document.getElementById('reasons-title').textContent = config.titel;
      reasons = config.gruend || [];
      renderReasons();
    });

  function save() {
    try {
      var stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      stored.opened = opened;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch (e) {}
  }

  function showReason(btn, i) {
    btn.classList.add('open');
    btn.textContent = reasons[i];
  }

  function renderReasons() {
    reasons.forEach(function (text, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'reason';
      btn.textContent = '♥';
      if (opened.indexOf(i) !== -1) {
        showReason(btn, i);
        btn.style.animation = 'none';
      }
      btn.addEventListener('click', function () {
        if (opened.indexOf(i) !== -1) return;
        opened.push(i);
        save();
        showReason(btn, i);
      });
      grid.appendChild(btn);
    });
    if (introPlaying) watchTiles();
  }

  var grid = document.getElementById('reasons');
  if (document.documentElement.classList.contains('unlocked')) playIntro();
})();
