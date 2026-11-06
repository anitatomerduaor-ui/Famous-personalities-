(function () {
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  /* ---------- toast ---------- */
  var toastEl = document.createElement('div');
  toastEl.className = 'toast';
  toastEl.setAttribute('role', 'status');
  document.body.appendChild(toastEl);
  var toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 2200);
  }

  /* ---------- photos: real photo if present, monogram plate if not ---------- */
  var credits = window.PHOTO_CREDITS || {};
  document.querySelectorAll('img[data-photo]').forEach(function (img) {
    var frame = img.closest('.portrait, .ph');
    var slug = img.getAttribute('data-photo');
    function fail() { if (frame) frame.classList.add('no-photo'); }
    img.addEventListener('error', fail);
    if (img.complete && img.naturalWidth === 0) fail();
    var c = credits[slug];
    var credEl = frame && frame.querySelector('.photo-credit');
    if (credEl && c) credEl.textContent = 'Photo: ' + c.artist + ' · ' + c.license;
  });

  /* ---------- app bar shadow + title on scroll ---------- */
  var bar = document.querySelector('.appbar');
  function onScroll() { if (bar) bar.classList.toggle('scrolled', window.scrollY > 220); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- scroll-spy chips ---------- */
  var chips = Array.prototype.slice.call(document.querySelectorAll('.chips a'));
  if (chips.length && 'IntersectionObserver' in window) {
    var byId = {};
    chips.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        chips.forEach(function (a) { a.classList.remove('active'); });
        var a = byId[en.target.id];
        if (a) {
          a.classList.add('active');
          a.parentNode.scrollTo({ left: a.offsetLeft - 18, behavior: 'smooth' });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(byId).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
  }

  /* ---------- follow ---------- */
  document.querySelectorAll('[data-follow]').forEach(function (btn) {
    var key = 'follow:' + btn.getAttribute('data-follow');
    var name = btn.getAttribute('data-name') || 'this person';
    function paint(on) {
      btn.classList.toggle('on', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      var label = btn.querySelector('.lbl');
      if (label) label.textContent = on ? (btn.classList.contains('add') ? 'Following' : 'Following') : (btn.classList.contains('add') ? 'Follow' : 'Follow');
    }
    var initial = store.get(key);
    paint(initial === null ? btn.hasAttribute('data-default-on') : initial === '1');
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var on = !btn.classList.contains('on');
      store.set(key, on ? '1' : '0');
      paint(on);
      toast(on ? 'Following ' + name + ' · Alerts: major decisions only' : 'Unfollowed ' + name);
    });
  });

  document.querySelectorAll('[data-alerts]').forEach(function (btn) {
    btn.addEventListener('click', function () { toast('Alerts: Major decisions · ET analysis · Live now'); });
  });
  document.querySelectorAll('[data-share]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var url = location.href.split('#')[0];
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(function () { toast('Link copied'); }, function () { toast(url); });
      } else { toast(url); }
    });
  });

  /* ---------- business lens ---------- */
  var LENS_NAMES = { all: 'Everything', sme: 'SME owner', investor: 'Investor' };
  var REL_TEXT = { high: 'High for you', med: 'Some impact', low: 'Low for you' };
  var showHidden = false;

  function relFor(el, lens) {
    var spec = el.getAttribute('data-rel') || '';
    var m = spec.match(new RegExp(lens + ':(high|med|low)'));
    return m ? m[1] : 'med';
  }

  function applyLens(lens) {
    document.body.setAttribute('data-lens', lens);
    document.querySelectorAll('.seg button').forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-lens') === lens ? 'true' : 'false');
    });
    var note = document.querySelector('[data-lens-note]');
    if (note) note.textContent = lens === 'all' ? 'Showing everything' : 'Ranked for: ' + LENS_NAMES[lens];

    document.querySelectorAll('[data-lens-group]').forEach(function (group) {
      var items = group.querySelectorAll('[data-rel]');
      var hidden = 0;
      items.forEach(function (it) {
        var r = lens === 'all' ? 'med' : relFor(it, lens);
        var pill = it.querySelector('.rel');
        if (pill) { pill.className = 'pill rel ' + r; pill.lastChild.textContent = REL_TEXT[r]; }
        var hide = lens !== 'all' && r === 'low' && !showHidden;
        it.hidden = hide;
        if (lens !== 'all' && r === 'low') hidden++;
        // high-relevance items float to the front
        it.style.order = lens !== 'all' && r === 'high' ? '-1' : '0';
      });
      var btn = group.parentNode.querySelector('.lens-hidden');
      if (btn) {
        btn.hidden = hidden === 0;
        btn.querySelector('b').textContent = hidden + (hidden === 1 ? ' item' : ' items') + (showHidden ? ' low for your lens' : ' hidden for your lens');
        btn.querySelector('u').textContent = showHidden ? 'Hide' : 'Show';
      }
    });
  }

  document.querySelectorAll('.lens-hidden').forEach(function (btn) {
    btn.addEventListener('click', function () {
      showHidden = !showHidden;
      applyLens(document.body.getAttribute('data-lens') || 'all');
    });
  });
  document.querySelectorAll('.seg button').forEach(function (b) {
    b.addEventListener('click', function () {
      var lens = b.getAttribute('data-lens');
      showHidden = false;
      store.set('lens', lens);
      applyLens(lens);
      if (lens !== 'all') toast('Ranked for ' + LENS_NAMES[lens]);
    });
  });
  if (document.querySelector('.seg')) applyLens(store.get('lens') || document.body.getAttribute('data-lens') || 'sme');

  /* ---------- story rings jump to the update ---------- */
  document.querySelectorAll('.ring[data-go]').forEach(function (r) {
    r.addEventListener('click', function () {
      r.classList.add('seen');
      var t = document.getElementById(r.getAttribute('data-go'));
      if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ---------- Ask: answers only from this page's entries ---------- */
  var form = document.querySelector('.ask form');
  if (form) {
    var input = form.querySelector('input');
    var out = document.querySelector('.answer');
    var STOP = ' the a an of on in to and or is are was were he his him her what which who how does did do about for with has have this that from it its my me i'.split(' ');
    function words(s) {
      return s.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(function (w) { return w.length > 2 && STOP.indexOf(w) === -1; });
    }
    function answer(q) {
      var qs = words(q);
      if (!qs.length) { out.textContent = 'Type a question first.'; return; }
      var hits = [];
      document.querySelectorAll('[data-ask]').forEach(function (el) {
        var text = el.textContent.toLowerCase();
        var score = 0;
        qs.forEach(function (w) { if (text.indexOf(w) !== -1) score++; if (text.indexOf(w.replace(/s$/, '')) !== -1) score += 0.5; });
        if (score > 0) hits.push({ el: el, score: score });
      });
      hits.sort(function (a, b) { return b.score - a.score; });
      out.innerHTML = '';
      if (!hits.length) {
        out.textContent = 'This page has no sourced entry on that yet, so there is no answer. Ask ET will not guess.';
        return;
      }
      var lead = document.createElement('p');
      lead.style.margin = '0 0 8px';
      lead.textContent = 'From this page (' + Math.min(hits.length, 3) + ' entr' + (hits.length === 1 ? 'y' : 'ies') + '):';
      out.appendChild(lead);
      hits.slice(0, 3).forEach(function (h) {
        var sec = h.el.closest('.sec');
        var secName = sec ? sec.querySelector('h2').textContent : '';
        var title = h.el.getAttribute('data-ask');
        var a = document.createElement('a');
        a.href = '#' + (sec ? sec.id : '');
        a.style.display = 'block';
        a.style.padding = '6px 0';
        a.style.color = 'var(--fg)';
        a.innerHTML = '<span style="color:var(--gold)">→</span> ';
        a.appendChild(document.createTextNode(title + ' · ' + secName));
        out.appendChild(a);
      });
      var tail = document.createElement('p');
      tail.style.margin = '8px 0 0';
      tail.style.fontSize = '12px';
      tail.style.color = 'var(--muted)';
      tail.textContent = 'Prototype: matches page entries by keyword. The live version writes a cited answer from the knowledge graph.';
      out.appendChild(tail);
    }
    form.addEventListener('submit', function (e) { e.preventDefault(); answer(input.value); });
    document.querySelectorAll('.prompts button').forEach(function (b) {
      b.addEventListener('click', function () { input.value = b.textContent; answer(b.textContent); });
    });
  }
})();
