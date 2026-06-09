(function () {
  'use strict';

  var script = document.currentScript || document.querySelector('script[data-proxy]');
  if (!script) {
    console.error('[widget.js] cannot locate its <script> tag; ensure the tag has a data-proxy attribute');
    return;
  }
  var CONFIG = {
    proxyUrl: script.getAttribute('data-proxy'),
    token: script.getAttribute('data-token') || '',
    defaultLang: script.getAttribute('data-default') || 'en',
    targetElementId: script.getAttribute('data-element') || '',
    batchSize: 25,
    concurrency: parseInt(script.getAttribute('data-concurrency') || '5', 10) || 5,
  };

  var ALL_LANGUAGES = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'zh', name: 'Chinese', nativeName: '中文' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
    { code: 'ru', name: 'Russian', nativeName: 'Русский' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語' },
    { code: 'de', name: 'German', nativeName: 'Deutsch' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'ko', name: 'Korean', nativeName: '한국어' },
    { code: 'it', name: 'Italian', nativeName: 'Italiano' },
    { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
    { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
    { code: 'th', name: 'Thai', nativeName: 'ไทย' },
    { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
    { code: 'pl', name: 'Polish', nativeName: 'Polski' },
    { code: 'uk', name: 'Ukrainian', nativeName: 'Українська' },
    { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
    { code: 'fa', name: 'Persian', nativeName: 'فارسی' },
    { code: 'he', name: 'Hebrew', nativeName: 'עברית' },
    { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
    { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu' },
    { code: 'fil', name: 'Filipino', nativeName: 'Filipino' },
    { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili' },
    { code: 'ro', name: 'Romanian', nativeName: 'Română' },
    { code: 'el', name: 'Greek', nativeName: 'Ελληνικά' },
    { code: 'cs', name: 'Czech', nativeName: 'Čeština' },
    { code: 'hu', name: 'Hungarian', nativeName: 'Magyar' },
    { code: 'sv', name: 'Swedish', nativeName: 'Svenska' },
    { code: 'da', name: 'Danish', nativeName: 'Dansk' },
    { code: 'fi', name: 'Finnish', nativeName: 'Suomi' },
    { code: 'no', name: 'Norwegian', nativeName: 'Norsk' },
    { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina' },
    { code: 'bg', name: 'Bulgarian', nativeName: 'Български' },
    { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski' },
    { code: 'sr', name: 'Serbian', nativeName: 'Српски' },
    { code: 'lt', name: 'Lithuanian', nativeName: 'Lietuvių' },
    { code: 'sl', name: 'Slovenian', nativeName: 'Slovenščina' },
    { code: 'et', name: 'Estonian', nativeName: 'Eesti' },
    { code: 'lv', name: 'Latvian', nativeName: 'Latviešu' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
    { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
    { code: 'my', name: 'Burmese', nativeName: 'မြန်မာ' },
    { code: 'km', name: 'Khmer', nativeName: 'ខ្មែរ' },
    { code: 'ne', name: 'Nepali', nativeName: 'नेपाली' },
  ];
  var RTL = ['ar', 'he', 'fa', 'ur'];

  function parseList(attr) {
    return attr
      ? attr.split(',').map(function (c) { return c.trim(); }).filter(Boolean)
      : [];
  }

  function computeLanguages(all, include, exclude, defaultLang) {
    var base = include.length
      ? all.filter(function (l) { return include.indexOf(l.code) !== -1; })
      : all;
    var filtered = base.filter(function (l) { return exclude.indexOf(l.code) === -1; });
    var hasDefault = filtered.some(function (l) { return l.code === defaultLang; });
    if (!hasDefault) {
      var match = all.filter(function (l) { return l.code === defaultLang; });
      var dl = match[0] || { code: defaultLang, name: defaultLang, nativeName: defaultLang };
      return [dl].concat(filtered);
    }
    return filtered;
  }

  var LANGUAGES = computeLanguages(
    ALL_LANGUAGES,
    parseList(script.getAttribute('data-languages')),
    parseList(script.getAttribute('data-exclude')),
    CONFIG.defaultLang
  );

  var currentLang = CONFIG.defaultLang;
  var textNodes = [];
  var cache = {};
  var isTranslating = false;

  function getRoot() {
    return (CONFIG.targetElementId && document.getElementById(CONFIG.targetElementId)) || document.body;
  }

  function extractTextNodes() {
    textNodes = [];
    var walker = document.createTreeWalker(getRoot(), NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        var parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        var tag = parent.tagName;
        if (tag === 'SCRIPT' || tag === 'STYLE' || parent.closest('[data-no-translate]')) {
          return NodeFilter.FILTER_REJECT;
        }
        return node.textContent.trim().length > 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      },
    });
    var node;
    while ((node = walker.nextNode())) {
      textNodes.push({ node: node, originalText: node.textContent });
    }
  }

  function cacheKey(text, target) {
    return target + '::' + text.trim();
  }

  async function translateBatch(texts, target) {
    if (texts.every(function (t) { return cache[cacheKey(t, target)] !== undefined; })) {
      return texts.map(function (t) { return cache[cacheKey(t, target)]; });
    }
    var headers = { 'Content-Type': 'application/json' };
    if (CONFIG.token) headers['X-Widget-Token'] = CONFIG.token;
    var res = await fetch(CONFIG.proxyUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ texts: texts, target: target }),
    });
    if (!res.ok) throw new Error('Proxy error ' + res.status);
    var data = await res.json();
    if (!Array.isArray(data.translations) || data.translations.length !== texts.length) {
      throw new Error('Malformed response');
    }
    texts.forEach(function (t, i) { cache[cacheKey(t, target)] = data.translations[i]; });
    return data.translations;
  }

  function setDir(target) {
    document.documentElement.lang = target;
    document.documentElement.dir = RTL.indexOf(target) !== -1 ? 'rtl' : 'ltr';
  }

  async function translateTo(target, ui) {
    if (isTranslating || target === currentLang) return;
    isTranslating = true;
    ui.setBusy(true);
    try {
      if (target === CONFIG.defaultLang) {
        textNodes.forEach(function (n) { n.node.textContent = n.originalText; });
        setDir(CONFIG.defaultLang);
      } else {
        var chunks = [];
        for (var i = 0; i < textNodes.length; i += CONFIG.batchSize) {
          chunks.push(textNodes.slice(i, i + CONFIG.batchSize));
        }
        var completed = 0;
        var nextChunk = 0;
        var worker = async function () {
          while (true) {
            var idx = nextChunk++;
            if (idx >= chunks.length) return;
            var batch = chunks[idx];
            var texts = batch.map(function (n) { return n.originalText; });
            var out = await translateBatch(texts, target);
            batch.forEach(function (n, j) { n.node.textContent = out[j]; });
            completed++;
            ui.setProgress((completed / chunks.length) * 100);
          }
        };
        var poolSize = Math.min(CONFIG.concurrency, chunks.length);
        var pool = [];
        for (var w = 0; w < poolSize; w++) pool.push(worker());
        await Promise.all(pool);
        setDir(target);
      }
      currentLang = target;
      ui.setLabel(target);
    } catch (e) {
      console.error('Translation failed', e);
      ui.error();
    } finally {
      isTranslating = false;
      ui.setBusy(false);
    }
  }

  function buildUI() {
    var css =
      '.otw{position:fixed;top:20px;right:20px;z-index:9999;font-family:-apple-system,Segoe UI,Roboto,sans-serif}' +
      '.otw-btn{display:flex;align-items:center;gap:8px;background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:10px 16px;cursor:pointer;box-shadow:0 4px 6px rgba(0,0,0,.1);font-size:14px;font-weight:500}' +
      '.otw-btn:disabled{opacity:.5;cursor:not-allowed}' +
      '.otw-menu{position:absolute;top:calc(100% + 8px);right:0;width:220px;background:#fff;border:1px solid #e5e7eb;border-radius:8px;box-shadow:0 10px 15px rgba(0,0,0,.1);display:none;overflow:hidden}' +
      '.otw-search{width:100%;box-sizing:border-box;padding:10px 16px;border:none;border-bottom:1px solid #e5e7eb;font-size:14px;outline:none}' +
      '.otw-list{max-height:320px;overflow:auto}' +
      '.otw-empty{padding:10px 16px;color:#9ca3af;font-size:13px;display:none}' +
      '.otw-menu.open{display:block}' +
      '.otw-opt{width:100%;padding:10px 16px;border:none;background:#fff;text-align:left;cursor:pointer;display:flex;justify-content:space-between}' +
      '.otw-opt:hover{background:#f9fafb}' +
      '.otw-bar{height:4px;background:#2563eb;width:0;transition:width .3s}';
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    var root = document.createElement('div');
    root.className = 'otw';
    root.setAttribute('data-no-translate', '');
    root.innerHTML =
      '<button class="otw-btn" type="button"><span class="otw-label">🌐</span></button>' +
      '<div class="otw-menu"></div>' +
      '<div class="otw-bar"></div>';
    document.body.appendChild(root);

    var btn = root.querySelector('.otw-btn');
    var menu = root.querySelector('.otw-menu');
    var label = root.querySelector('.otw-label');
    var bar = root.querySelector('.otw-bar');

    function nativeName(code) {
      var l = LANGUAGES.find(function (x) { return x.code === code; });
      return l ? l.nativeName : code;
    }

    menu.innerHTML =
      '<input class="otw-search" type="text" placeholder="Search language…" />' +
      '<div class="otw-list">' +
      LANGUAGES.map(function (l) {
        var search = (l.code + ' ' + l.name + ' ' + l.nativeName).toLowerCase();
        return '<button class="otw-opt" type="button" data-lang="' + l.code + '" data-search="' + search + '">' +
          '<span>' + l.nativeName + '</span><span>' + l.name + '</span></button>';
      }).join('') +
      '<div class="otw-empty">No languages found</div>' +
      '</div>';

    var searchInput = menu.querySelector('.otw-search');
    var emptyRow = menu.querySelector('.otw-empty');
    searchInput.addEventListener('input', function () {
      var q = searchInput.value.trim().toLowerCase();
      var anyVisible = false;
      menu.querySelectorAll('.otw-opt').forEach(function (opt) {
        var match = !q || opt.getAttribute('data-search').indexOf(q) !== -1;
        opt.style.display = match ? '' : 'none';
        if (match) anyVisible = true;
      });
      emptyRow.style.display = anyVisible ? 'none' : 'block';
    });

    var ui = {
      setBusy: function (b) { btn.disabled = b; if (b) menu.classList.remove('open'); },
      setProgress: function (p) { bar.style.width = p + '%'; },
      setLabel: function (code) { label.textContent = nativeName(code); bar.style.width = '0'; },
      error: function () { bar.style.width = '0'; },
    };

    label.textContent = nativeName(currentLang);
    btn.addEventListener('click', function () {
      if (isTranslating) return;
      var willOpen = !menu.classList.contains('open');
      menu.classList.toggle('open');
      if (willOpen) {
        searchInput.value = '';
        menu.querySelectorAll('.otw-opt').forEach(function (opt) { opt.style.display = ''; });
        emptyRow.style.display = 'none';
        searchInput.focus();
      }
    });
    menu.addEventListener('click', function (e) {
      var opt = e.target.closest('.otw-opt');
      if (opt) translateTo(opt.getAttribute('data-lang'), ui);
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.otw')) menu.classList.remove('open');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') menu.classList.remove('open');
    });
  }

  function start() {
    if (!CONFIG.proxyUrl) {
      console.error('[widget.js] missing data-proxy attribute');
      return;
    }
    extractTextNodes();
    buildUI();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
