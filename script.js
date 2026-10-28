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
        document.documentElement.classList.add('unlocked');
        window.scrollTo(0, 0);
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
  document.getElementById('days').textContent = days.toLocaleString('de-CH');

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
    var grid = document.getElementById('reasons');
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
  }
})();
