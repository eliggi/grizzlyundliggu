(function () {
  var STORAGE_KEY = 'rebi-elias';

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
