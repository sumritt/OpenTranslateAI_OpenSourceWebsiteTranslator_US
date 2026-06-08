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
  };

  var ALL_LANGUAGES = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'th', name: 'Thai', nativeName: 'ไทย' },
    { code: 'zh', name: 'Chinese', nativeName: '中文' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'de', name: 'German', nativeName: 'Deutsch' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語' },
    { code: 'ko', name: 'Korean', nativeName: '한국어' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  ];
  var RTL = ['ar', 'he', 'fa', 'ur'];

  var langAttr = script.getAttribute('data-languages');
  var LANGUAGES = langAttr
    ? langAttr.split(',').map(function (c) { return c.trim(); }).map(function (code) {
        return ALL_LANGUAGES.find(function (l) { return l.code === code; }) || { code: code, name: code, nativeName: code };
      })
    : ALL_LANGUAGES;

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
        for (var i = 0; i < textNodes.length; i += CONFIG.batchSize) {
          var batch = textNodes.slice(i, i + CONFIG.batchSize);
          var texts = batch.map(function (n) { return n.originalText; });
          var out = await translateBatch(texts, target);
          batch.forEach(function (n, idx) { n.node.textContent = out[idx]; });
          ui.setProgress(Math.min(((i + CONFIG.batchSize) / textNodes.length) * 100, 100));
        }
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
      '.otw-menu{position:absolute;top:calc(100% + 8px);right:0;width:220px;max-height:380px;overflow:auto;background:#fff;border:1px solid #e5e7eb;border-radius:8px;box-shadow:0 10px 15px rgba(0,0,0,.1);display:none}' +
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

    menu.innerHTML = LANGUAGES.map(function (l) {
      return '<button class="otw-opt" type="button" data-lang="' + l.code + '">' +
        '<span>' + l.nativeName + '</span><span>' + l.name + '</span></button>';
    }).join('');

    var ui = {
      setBusy: function (b) { btn.disabled = b; if (b) menu.classList.remove('open'); },
      setProgress: function (p) { bar.style.width = p + '%'; },
      setLabel: function (code) { label.textContent = nativeName(code); bar.style.width = '0'; },
      error: function () { bar.style.width = '0'; },
    };

    label.textContent = nativeName(currentLang);
    btn.addEventListener('click', function () { if (!isTranslating) menu.classList.toggle('open'); });
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
