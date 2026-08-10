(function () {
  "use strict";

  var data = window.__RADAR_DATA__;
  var historyData = window.__RADAR_HISTORY__ || { snapshots: [] };

  var i18n = {
    en: {},
    zh: {
      navRanking: "\u6392\u540d",
      navHistory: "\u5386\u53f2",
      navMethod: "\u65b9\u6cd5",
      heroLede: "\u4e00\u4efd\u6301\u7eed\u66f4\u65b0\u7684 Codex \u5e73\u9762\u89c6\u89c9 Skill \u6307\u5357\uff0c\u8986\u76d6\u6d77\u62a5\u3001\u54c1\u724c\u7cfb\u7edf\u3001\u7f16\u8f91\u56fe\u5f62\u3001\u56fe\u50cf\u578b\u6f14\u793a\u548c\u89c6\u89c9\u751f\u4ea7\u6d41\u7a0b\u3002",
      seeRanking: "\u67e5\u770b\u4eca\u65e5\u699c\u5355",
      officialFormat: "\u5b98\u65b9 Skill \u683c\u5f0f",
      topTen: "\u524d\u5341\u540d",
      retained: "\u5386\u53f2\u524d\u5341\u9879\u76ee\u5168\u90e8\u4fdd\u7559\u3002",
      tracked: "\u4e2a\u8ffd\u8e2a\u9879\u76ee",
      everTop: "\u4e2a\u66fe\u8fdb\u5165\u524d\u5341",
      evidenceLanes: "\u4e2a\u8bc1\u636e\u7ef4\u5ea6",
      scoreRecipe: "\u8bc4\u5206\u914d\u65b9",
      designFit: "\u8bbe\u8ba1\u76f8\u5173\u6027",
      codexFit: "Codex \u517c\u5bb9\u6027",
      feedback: "\u516c\u5f00\u53cd\u9988",
      maintenance: "\u7ef4\u62a4\u6d3b\u8dc3\u5ea6",
      docs: "\u6587\u6863\u4e0e\u6848\u4f8b",
      inspectMethod: "\u67e5\u770b\u65b9\u6cd5",
      rankingTitle: "\u4eca\u65e5\u6280\u80fd\u699c\u5355",
      rankingIntro: "\u6392\u540d\u7efc\u5408\u8bbe\u8ba1\u4ef7\u503c\u3001Codex \u517c\u5bb9\u6027\u3001\u516c\u5f00\u8bc1\u636e\u3001\u7ef4\u62a4\u548c\u6587\u6863\uff1b\u70ed\u5ea6\u4e0d\u4f1a\u5355\u72ec\u51b3\u5b9a\u540d\u6b21\u3002",
      searchPlaceholder: "\u641c\u7d22\u98ce\u683c\u3001\u573a\u666f\u3001\u8bbe\u8ba1\u8005\u6216\u4ed3\u5e93...",
      allFormats: "\u5168\u90e8\u5f62\u5f0f",
      poster: "\u6d77\u62a5",
      brandSystem: "\u54c1\u724c\u7cfb\u7edf",
      presentation: "\u6f14\u793a\u8bbe\u8ba1",
      technical: "\u6280\u672f / \u5b66\u672f",
      pipeline: "\u751f\u4ea7\u6d41\u7a0b",
      sortRank: "\u6392\u5e8f\uff1a\u7f16\u8f91\u6392\u540d",
      sortScore: "\u6392\u5e8f\uff1a\u7efc\u5408\u5206",
      sortStars: "\u6392\u5e8f\uff1aGitHub Stars",
      sortConfidence: "\u6392\u5e8f\uff1a\u8bc1\u636e\u4fe1\u5fc3",
      sortRecent: "\u6392\u5e8f\uff1a\u6700\u8fd1\u6d3b\u8dc3",
      searchGithub: "\u641c\u7d22 GitHub",
      topTenOnly: "\u4ec5\u663e\u793a\u524d\u5341",
      strongEvidence: "\u8f83\u5f3a\u8bc1\u636e",
      reset: "\u91cd\u7f6e\u7b5b\u9009",
      noMatches: "\u6ca1\u6709\u5339\u914d\u7684 Skill",
      broadenSearch: "\u8bf7\u653e\u5bbd\u641c\u7d22\u8bcd\uff0c\u6216\u7528\u5f53\u524d\u5173\u952e\u8bcd\u641c\u7d22 GitHub\u3002",
      atlasTitle: "\u6309\u89c6\u89c9\u610f\u56fe\u9009\u62e9",
      atlasIntro: "\u6392\u540d\u6700\u9ad8\u4e0d\u4e00\u5b9a\u6700\u5408\u9002\u3002\u5148\u4ece\u4f60\u8981\u5236\u4f5c\u7684\u5f62\u5f0f\u51fa\u53d1\u3002",
      historyTitle: "\u699c\u5355\u4f1a\u8bb0\u4f4f\u3002",
      historyIntro: "\u79bb\u5f00\u524d\u5341\u7684 Skill \u4e0d\u4f1a\u88ab\u5220\u9664\uff1b\u6bcf\u65e5\u5feb\u7167\u4fdd\u7559\u5b83\u7684\u5386\u53f2\u540d\u6b21\u548c\u8bc1\u636e\u3002",
      rankOverTime: "\u540d\u6b21\u53d8\u5316",
      archiveTitle: "\u6c38\u4e45\u957f\u5c3e\u6863\u6848",
      archiveCopy: "\u65b0 Skill \u8fdb\u5165\u524d\u5341\u540e\uff0c\u88ab\u66ff\u4ee3\u7684\u9879\u76ee\u987a\u5ef6\u5230\u7b2c 11 \u540d\u6216\u4e4b\u540e\uff0c\u4ecd\u53ef\u641c\u7d22\u3001\u6bd4\u8f83\u548c\u8ffd\u6eaf\u3002",
      currentTop: "\u5f53\u524d\u524d\u5341",
      archiveRank: "\u6863\u6848\u540d\u6b21",
      methodTitle: "\u8bc4\u5206\u610f\u5473\u7740\u4ec0\u4e48",
      methodIntro: "\u8fd9\u662f\u4e00\u4e2a\u53ef\u590d\u7b97\u3001\u660e\u786e\u8868\u8fbe\u4e0d\u786e\u5b9a\u6027\u7684\u7f16\u8f91\u8bc4\u5206\uff0c\u4e0d\u662f\u5bf9\u5ba1\u7f8e\u7684\u5ba2\u89c2\u6d4b\u91cf\u3002",
      designDesc: "Skill \u4e0e\u6d77\u62a5\u3001\u54c1\u724c\u3001\u7f16\u8f91\u3001\u5e7f\u544a\u6216\u76f8\u90bb\u89c6\u89c9\u4efb\u52a1\u7684\u76f4\u63a5\u7a0b\u5ea6\u3002",
      codexDesc: "\u539f\u751f\u5de5\u5177\u4f7f\u7528\u3001\u6709\u6548 SKILL.md \u7ed3\u6784\u3001\u5b89\u88c5\u6e05\u6670\u5ea6\u548c\u684c\u9762\u7aef\u517c\u5bb9\u6027\u3002",
      feedbackDesc: "\u72ec\u7acb\u8bc4\u6d4b\u3001\u793e\u533a\u6848\u4f8b\u3001\u5b89\u88c5\u91cf\u548c\u9650\u5b9a\u8303\u56f4\u7684\u91c7\u7528\u4fe1\u53f7\u3002",
      maintenanceDesc: "\u4ed3\u5e93\u6d3b\u52a8\u7684\u65f6\u6548\u6027\uff1b\u505c\u6ede\u9879\u76ee\u9010\u6e10\u964d\u5206\uff0c\u4f46\u4e0d\u4f1a\u6d88\u5931\u3002",
      docsDesc: "\u5b89\u88c5\u6b65\u9aa4\u3001\u63d0\u793a\u8bcd\u914d\u65b9\u3001\u771f\u5b9e\u8f93\u51fa\u3001\u9650\u5236\u548c\u8d28\u91cf\u95e8\u69db\u3002",
      importantCaveat: "\u91cd\u8981\u8bf4\u660e",
      caveatCopy: "Stars \u548c Forks \u662f\u91c7\u7528\u5ea6\u4ee3\u7406\uff0c\u4e0d\u662f\u6ee1\u610f\u5ea6\u3002\u5305\u542b\u591a\u4e2a Skill \u7684\u5bbf\u4e3b\u4ed3\u5e93\u4f1a\u83b7\u5f97\u8303\u56f4\u6298\u6263\u3002",
      rawData: "\u6253\u5f00\u539f\u59cb\u7814\u7a76\u6570\u636e",
      footerLine: "\u7ecf\u4eba\u5de5\u7814\u7a76\u6574\u7406\uff0c\u7531 GitHub Actions \u6bcf\u65e5\u66f4\u65b0\u3002"
    }
  };

  var filters = [
    { id: "all", label: "All styles", zh: "\u5168\u90e8\u98ce\u683c", terms: [] },
    { id: "editorial", label: "Editorial", zh: "\u7f16\u8f91", terms: ["editorial", "zine", "newspaper"] },
    { id: "riso", label: "Riso / paper", zh: "Riso / \u7eb8\u5f20", terms: ["riso", "paper", "ink wash"] },
    { id: "brand", label: "Brand", zh: "\u54c1\u724c", terms: ["brand", "identity", "logo"] },
    { id: "commercial", label: "Commercial", zh: "\u5546\u4e1a", terms: ["advert", "commercial", "product", "e-commerce"] },
    { id: "academic", label: "Academic", zh: "\u5b66\u672f", terms: ["academic", "research", "engineering", "scientific", "cvpr"] },
    { id: "automation", label: "Automation", zh: "\u81ea\u52a8\u5316", terms: ["pipeline", "batch", "cli", "api"] }
  ];

  var atlas = [
    { format: "poster", title: "Editorial poster", zh: "\u7f16\u8f91\u6d77\u62a5", copy: "Zine, newspaper, risograph, and photo-derived work.", filter: "editorial" },
    { format: "brand", title: "Brand world", zh: "\u54c1\u724c\u4e16\u754c", copy: "Logo systems, identity boards, packaging, and launch visuals.", filter: "brand" },
    { format: "presentation", title: "Image-first deck", zh: "\u56fe\u50cf\u578b\u6f14\u793a", copy: "Full-frame slides, keynote moments, and visual storytelling.", filter: "all" },
    { format: "technical", title: "Research display", zh: "\u7814\u7a76\u5c55\u677f", copy: "Academic posters, engineering figures, and high-density explanation.", filter: "academic" },
    { format: "pipeline", title: "Visual pipeline", zh: "\u89c6\u89c9\u6d41\u7a0b", copy: "Batch variants, provider routing, automation, and quality gates.", filter: "automation" }
  ];

  var state = {
    query: "",
    format: "all",
    style: "all",
    topTen: false,
    strongEvidence: false,
    sort: "rank",
    language: localStorage.getItem("radar-language") || "en"
  };

  var rankingList = document.getElementById("rankingList");
  var searchInput = document.getElementById("searchInput");
  var formatFilter = document.getElementById("formatFilter");
  var sortSelect = document.getElementById("sortSelect");
  var topTenOnly = document.getElementById("topTenOnly");
  var strongEvidenceOnly = document.getElementById("strongEvidenceOnly");
  var styleFilters = document.getElementById("styleFilters");
  var emptyState = document.getElementById("emptyState");
  var drawerLayer = document.getElementById("drawerLayer");
  var detailDrawer = document.getElementById("detailDrawer");
  var lastFocused = null;

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function compactNumber(value) {
    var number = Number(value || 0);
    if (number >= 1000000) return (number / 1000000).toFixed(number >= 10000000 ? 0 : 1) + "M";
    if (number >= 1000) return (number / 1000).toFixed(number >= 10000 ? 0 : 1) + "K";
    return String(number);
  }

  function shortDate(value) {
    if (!value) return "--";
    var date = new Date(value);
    return new Intl.DateTimeFormat(state.language === "zh" ? "zh-CN" : "en-GB", { year: "numeric", month: "short", day: "2-digit" }).format(date);
  }

  function deriveFormat(item) {
    var text = (item.focus + " " + item.summary + " " + item.style.join(" ")).toLowerCase();
    if (/brand|identity|logo/.test(text)) return "brand";
    if (/presentation|slide|deck|ppt/.test(text)) return "presentation";
    if (/academic|research|engineering|scientific|cvpr/.test(text)) return "technical";
    if (/pipeline|batch|cli|api|automation|provider/.test(text)) return "pipeline";
    return "poster";
  }

  function itemText(item) {
    return [item.name, item.repo, item.focus, item.style.join(" "), item.designer, item.summary, item.scenarios.join(" "), item.tips.join(" ")].join(" ").toLowerCase();
  }

  function matchesStyle(item, id) {
    if (id === "all") return true;
    var definition = filters.find(function (filter) { return filter.id === id; });
    var text = itemText(item);
    return definition.terms.some(function (term) { return text.indexOf(term) !== -1; });
  }

  function filteredItems() {
    var query = state.query.trim().toLowerCase();
    var items = data.items.filter(function (item) {
      if (query && itemText(item).indexOf(query) === -1) return false;
      if (state.format !== "all" && deriveFormat(item) !== state.format) return false;
      if (!matchesStyle(item, state.style)) return false;
      if (state.topTen && item.rank > 10) return false;
      if (state.strongEvidence && item.confidence < 65 && !item.feedback.some(function (feedback) { return feedback.strength >= 4; })) return false;
      return true;
    });

    items.sort(function (a, b) {
      if (state.sort === "score") return b.score - a.score;
      if (state.sort === "stars") return b.metrics.stars - a.metrics.stars;
      if (state.sort === "confidence") return b.confidence - a.confidence;
      if (state.sort === "recent") return new Date(b.metrics.pushed_at) - new Date(a.metrics.pushed_at);
      return a.rank - b.rank;
    });
    return items;
  }

  function deltaMarkup(item) {
    if (item.new_top10) return '<small class="rank-change up">NEW TOP 10</small>';
    if (!item.rank_delta) return '<small class="rank-change">NO CHANGE</small>';
    var direction = item.rank_delta > 0 ? "up" : "down";
    var arrow = item.rank_delta > 0 ? "+" : "";
    return '<small class="rank-change ' + direction + '">' + arrow + item.rank_delta + " TODAY</small>";
  }

  function cardMarkup(item, index) {
    return '<button class="rank-card" type="button" data-skill-id="' + escapeHtml(item.id) + '">' +
      '<span class="card-top"><span class="medal">' + item.rank + '</span><span class="score"><b>' + item.score.toFixed(1) + '</b><small>RADAR SCORE</small></span></span>' +
      '<span class="visual-code" aria-hidden="true">0' + (index + 1) + '</span>' +
      '<h3>' + escapeHtml(item.name) + (item.new_top10 ? '<span class="new-chip">NEW</span>' : '') + '</h3>' +
      '<p class="focus">' + escapeHtml(item.focus) + '</p>' +
      '<span class="card-tags">' + item.style.slice(0, 3).map(function (tag) { return '<span>' + escapeHtml(tag) + '</span>'; }).join("") + '</span>' +
      '<span class="card-footer"><span>' + compactNumber(item.metrics.stars) + ' STARS</span><span>' + item.confidence + '% EVIDENCE</span><span>OPEN +</span></span>' +
      '</button>';
  }

  function rowMarkup(item) {
    return '<button class="rank-row ' + (item.rank > 10 ? 'archive-row' : '') + '" type="button" data-skill-id="' + escapeHtml(item.id) + '">' +
      '<span class="row-rank">' + String(item.rank).padStart(2, "0") + deltaMarkup(item) + '</span>' +
      '<span class="row-title"><h3>' + escapeHtml(item.name) + (item.new_top10 ? '<span class="new-chip">NEW</span>' : '') + '</h3><span>' + escapeHtml(item.repo) + '</span></span>' +
      '<span class="row-focus">' + escapeHtml(item.focus) + '</span>' +
      '<span class="row-style">' + item.style.slice(0, 3).map(function (tag) { return '<span>' + escapeHtml(tag) + '</span>'; }).join("") + '</span>' +
      '<span class="row-score"><b>' + item.score.toFixed(1) + '</b><span>' + item.confidence + '% EVIDENCE</span></span>' +
      '<span class="row-open" aria-hidden="true">+</span>' +
      '</button>';
  }

  function renderRanking() {
    var items = filteredItems();
    var top = items.slice(0, 3);
    var rest = items.slice(3);
    var markup = "";
    if (top.length) {
      markup += '<div class="top-stage">' + top.map(cardMarkup).join("") + '</div>';
      markup += rest.map(rowMarkup).join("");
    }
    rankingList.innerHTML = markup;
    emptyState.hidden = items.length !== 0;
    document.getElementById("resultCount").textContent = state.language === "zh" ? ("\u663e\u793a " + items.length + " / " + data.items.length + " \u4e2a Skill") : ("Showing " + items.length + " of " + data.items.length + " skills");
    var githubQuery = [state.query || "graphic design poster", "SKILL.md", "codex"].join(" ");
    document.getElementById("githubSearch").href = "https://github.com/search?q=" + encodeURIComponent(githubQuery) + "&type=repositories";
  }

  function renderStyleFilters() {
    styleFilters.innerHTML = filters.map(function (filter) {
      var label = state.language === "zh" ? filter.zh : filter.label;
      return '<button type="button" data-style="' + filter.id + '" aria-pressed="' + (state.style === filter.id) + '">' + escapeHtml(label) + '</button>';
    }).join("");
  }

  function renderAtlas() {
    document.getElementById("atlasGrid").innerHTML = atlas.map(function (item) {
      return '<button class="atlas-card" type="button" data-atlas-format="' + item.format + '" data-atlas-style="' + item.filter + '">' +
        '<span class="atlas-art" aria-hidden="true"></span><small>' + item.format.toUpperCase() + '</small><h3>' + escapeHtml(state.language === "zh" ? item.zh : item.title) + '</h3><p>' + escapeHtml(item.copy) + '</p><b>FILTER INDEX +</b></button>';
    }).join("");
  }

  function scoreBars(item) {
    var labels = {
      design_fit: state.language === "zh" ? "\u8bbe\u8ba1\u76f8\u5173" : "Design fit",
      codex_fit: state.language === "zh" ? "Codex \u517c\u5bb9" : "Codex fit",
      public_feedback: state.language === "zh" ? "\u516c\u5f00\u53cd\u9988" : "Feedback",
      maintenance: state.language === "zh" ? "\u7ef4\u62a4" : "Maintenance",
      docs_examples: state.language === "zh" ? "\u6587\u6863\u6848\u4f8b" : "Docs/examples"
    };
    return Object.keys(labels).map(function (key) {
      var value = item.score_breakdown[key];
      return '<div class="score-bar"><span>' + labels[key] + '</span><span class="track"><i class="fill" style="width:' + value + '%"></i></span><b>' + value + '</b></div>';
    }).join("");
  }

  function evidenceMarkup(item) {
    return item.feedback.map(function (feedback) {
      var strength = Array.from({ length: 5 }, function (_, index) { return '<i class="' + (index < feedback.strength ? 'on' : '') + '"></i>'; }).join("");
      return '<article class="evidence-card"><div class="evidence-top"><b>' + escapeHtml(feedback.label) + '</b><span class="strength" aria-label="Evidence strength ' + feedback.strength + ' of 5">' + strength + '</span></div><p>' + escapeHtml(feedback.summary) + '</p><a href="' + escapeHtml(feedback.url) + '" target="_blank" rel="noreferrer">OPEN SOURCE &#8599;</a></article>';
    }).join("");
  }

  function openDrawer(id) {
    var item = data.items.find(function (entry) { return entry.id === id; });
    if (!item) return;
    lastFocused = document.activeElement;
    document.getElementById("drawerRank").textContent = "#" + String(item.rank).padStart(2, "0") + " / " + item.score.toFixed(1);
    document.getElementById("drawerContent").innerHTML =
      '<section class="drawer-hero"><div class="drawer-labels">' + item.style.map(function (tag) { return '<span>' + escapeHtml(tag) + '</span>'; }).join("") + '</div><h2 id="drawerTitle">' + escapeHtml(item.name) + '</h2><p>' + escapeHtml(item.summary) + '</p>' +
      '<div class="drawer-scoreline"><div><b>' + item.score.toFixed(1) + '</b><span>Radar score</span></div><div><b>' + compactNumber(item.metrics.stars) + '</b><span>GitHub stars</span></div><div><b>' + item.confidence + '%</b><span>Evidence confidence</span></div></div></section>' +
      '<div class="drawer-body">' +
      '<section class="drawer-block"><h3>' + (state.language === "zh" ? "\u4e13\u6ce8\u5f62\u5f0f / \u9002\u5408\u8bbe\u8ba1\u8005" : "Focus / best for") + '</h3><p><b>' + escapeHtml(item.focus) + '</b><br>' + escapeHtml(item.designer) + '</p></section>' +
      '<section class="drawer-block"><h3>' + (state.language === "zh" ? "\u4f7f\u7528\u573a\u666f" : "Use cases") + '</h3><ul class="drawer-list">' + item.scenarios.map(function (entry) { return '<li>' + escapeHtml(entry) + '</li>'; }).join("") + '</ul></section>' +
      '<section class="drawer-block"><h3>' + (state.language === "zh" ? "\u4f7f\u7528\u6280\u5de7" : "Working tips") + '</h3><ul class="drawer-list">' + item.tips.map(function (entry) { return '<li>' + escapeHtml(entry) + '</li>'; }).join("") + '</ul></section>' +
      '<section class="drawer-block"><h3>' + (state.language === "zh" ? "\u8bc4\u5206\u62c6\u89e3" : "Score breakdown") + '</h3><div class="score-bars">' + scoreBars(item) + '</div></section>' +
      '<section class="drawer-block"><h3>' + (state.language === "zh" ? "\u516c\u5f00\u53cd\u9988\u4e0e\u8bc1\u636e" : "Public feedback & evidence") + '</h3>' + evidenceMarkup(item) + '</section>' +
      '<section class="drawer-block"><h3>' + (state.language === "zh" ? "\u4ed3\u5e93\u4fe1\u53f7" : "Repository signals") + '</h3><p>' + compactNumber(item.metrics.stars) + ' stars / ' + compactNumber(item.metrics.forks) + ' forks / ' + item.metrics.open_issues + ' open issues<br>Last push: ' + shortDate(item.metrics.pushed_at) + ' / License: ' + escapeHtml(item.metrics.license) + '<br>Metric scope: ' + escapeHtml(item.metric_scope) + ' x ' + item.scope_factor + '</p></section>' +
      '<a class="drawer-cta" href="' + escapeHtml(item.download_url) + '" target="_blank" rel="noreferrer"><span>' + (state.language === "zh" ? "\u4e0b\u8f7d / \u67e5\u770b Skill" : "DOWNLOAD / VIEW SKILL") + '<small>' + escapeHtml(item.repo + " / " + item.skill_path) + '</small></span><b>&#8599;</b></a>' +
      '</div>';
    drawerLayer.hidden = false;
    document.body.style.overflow = "hidden";
    detailDrawer.focus();
  }

  function closeDrawer() {
    drawerLayer.hidden = true;
    document.body.style.overflow = "";
    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
  }

  function applyTranslations() {
    var dictionary = i18n[state.language] || {};
    document.documentElement.lang = state.language === "zh" ? "zh-CN" : "en";
    document.querySelectorAll("[data-i18n]").forEach(function (element) {
      var key = element.getAttribute("data-i18n");
      if (dictionary[key]) element.textContent = dictionary[key];
      else if (element.dataset.enText) element.textContent = element.dataset.enText;
      else if (state.language === "en") element.dataset.enText = element.textContent;
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (element) {
      var key = element.getAttribute("data-i18n-placeholder");
      if (!element.dataset.enPlaceholder) element.dataset.enPlaceholder = element.placeholder;
      element.placeholder = state.language === "zh" && dictionary[key] ? dictionary[key] : element.dataset.enPlaceholder;
    });
    document.getElementById("languageToggle").textContent = state.language === "zh" ? "EN" : "ZH";
    renderStyleFilters();
    renderAtlas();
    renderRanking();
  }

  function renderHistory() {
    var snapshots = historyData.snapshots || [];
    var container = document.getElementById("historyChart");
    if (!snapshots.length) {
      container.textContent = "No snapshots yet.";
      return;
    }
    document.getElementById("historyRange").textContent = snapshots[0].date + " / " + snapshots[snapshots.length - 1].date;
    document.getElementById("archiveCount").textContent = String(data.stats.tracked - data.stats.top10).padStart(2, "0");
    if (snapshots.length === 1) {
      var top = data.items.slice(0, 10);
      var lines = top.map(function (item, index) {
        var y = 20 + index * 30;
        var width = 77 - index * 4.9;
        return '<text x="0" y="' + (y + 10) + '" fill="currentColor" opacity=".68" font-size="9">' + String(item.rank).padStart(2, "0") + '</text>' +
          '<rect x="28" y="' + y + '" width="' + width + '%" height="11" fill="' + (index < 3 ? '#cdf04c' : '#f2efe6') + '" opacity="' + (1 - index * 0.05) + '"></rect>' +
          '<text x="' + (35 + width * 7.1) + '" y="' + (y + 10) + '" fill="currentColor" font-size="8">' + escapeHtml(item.name.slice(0, 28)) + '</text>';
      }).join("");
      container.innerHTML = '<svg viewBox="0 0 900 330" preserveAspectRatio="none" aria-label="Baseline ranking snapshot"><text x="0" y="325" fill="currentColor" opacity=".45" font-size="8">BASELINE SNAPSHOT / DAILY LINES APPEAR AFTER THE NEXT REFRESH</text>' + lines + '</svg>';
      return;
    }
    var width = 900;
    var height = 330;
    var selected = data.items.filter(function (item) { return item.ever_top10; }).slice(0, 8);
    var colors = ["#cdf04c", "#f2efe6", "#214de8", "#e34c36", "#9da57b", "#d2c3ff", "#f4b45d", "#8dd8c8"];
    var grid = Array.from({ length: 10 }, function (_, index) {
      var y = 20 + index * 29;
      return '<line x1="32" y1="' + y + '" x2="885" y2="' + y + '" stroke="currentColor" opacity=".12"/><text x="0" y="' + (y + 3) + '" fill="currentColor" opacity=".5" font-size="8">' + (index + 1) + '</text>';
    }).join("");
    var paths = selected.map(function (item, colorIndex) {
      var points = snapshots.map(function (snapshot, index) {
        var rank = snapshot.ranks[item.id] || data.stats.tracked;
        var x = 34 + index * (848 / Math.max(1, snapshots.length - 1));
        var y = 20 + (Math.min(rank, 11) - 1) * 29;
        return [x, y];
      });
      var d = points.map(function (point, index) { return (index ? "L" : "M") + point[0].toFixed(1) + " " + point[1].toFixed(1); }).join(" ");
      var last = points[points.length - 1];
      return '<path d="' + d + '" fill="none" stroke="' + colors[colorIndex] + '" stroke-width="2.3"/><circle cx="' + last[0] + '" cy="' + last[1] + '" r="4" fill="' + colors[colorIndex] + '"/><text x="' + (last[0] - 4) + '" y="' + (last[1] - 8) + '" text-anchor="end" fill="' + colors[colorIndex] + '" font-size="8">' + escapeHtml(item.name.slice(0, 18)) + '</text>';
    }).join("");
    container.innerHTML = '<svg viewBox="0 0 ' + width + ' ' + height + '" preserveAspectRatio="none" aria-label="Historical top ten ranking lines">' + grid + paths + '</svg>';
  }

  function initializeHeader() {
    document.getElementById("trackedCount").textContent = data.stats.tracked;
    document.getElementById("everCount").textContent = data.stats.ever_top10;
    document.getElementById("heroDate").textContent = data.ranking_date;
    var badge = document.getElementById("freshnessBadge");
    badge.querySelector("span").textContent = data.source_status === "github-api" ? "Updated " + data.ranking_date : "Cached " + data.ranking_date;
    if (data.source_status !== "github-api") badge.classList.add("is-cached");
  }

  function resetFilters() {
    state.query = "";
    state.format = "all";
    state.style = "all";
    state.topTen = false;
    state.strongEvidence = false;
    state.sort = "rank";
    searchInput.value = "";
    formatFilter.value = "all";
    sortSelect.value = "rank";
    topTenOnly.checked = false;
    strongEvidenceOnly.checked = false;
    renderStyleFilters();
    renderRanking();
  }

  function bindEvents() {
    searchInput.addEventListener("input", function () { state.query = searchInput.value; renderRanking(); });
    formatFilter.addEventListener("change", function () { state.format = formatFilter.value; renderRanking(); });
    sortSelect.addEventListener("change", function () { state.sort = sortSelect.value; renderRanking(); });
    topTenOnly.addEventListener("change", function () { state.topTen = topTenOnly.checked; renderRanking(); });
    strongEvidenceOnly.addEventListener("change", function () { state.strongEvidence = strongEvidenceOnly.checked; renderRanking(); });
    document.getElementById("searchForm").addEventListener("submit", function (event) { event.preventDefault(); });
    document.getElementById("resetFilters").addEventListener("click", resetFilters);

    styleFilters.addEventListener("click", function (event) {
      var button = event.target.closest("[data-style]");
      if (!button) return;
      state.style = button.dataset.style;
      renderStyleFilters();
      renderRanking();
    });

    rankingList.addEventListener("click", function (event) {
      var button = event.target.closest("[data-skill-id]");
      if (button) openDrawer(button.dataset.skillId);
    });

    document.getElementById("atlasGrid").addEventListener("click", function (event) {
      var button = event.target.closest("[data-atlas-format]");
      if (!button) return;
      state.format = button.dataset.atlasFormat;
      state.style = button.dataset.atlasStyle;
      formatFilter.value = state.format;
      renderStyleFilters();
      renderRanking();
      window.scrollTo({ top: document.getElementById("ranking").offsetTop - 50, behavior: "smooth" });
    });

    document.getElementById("closeDrawer").addEventListener("click", closeDrawer);
    document.getElementById("drawerBackdrop").addEventListener("click", closeDrawer);
    document.addEventListener("keydown", function (event) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInput.focus();
      }
      if (event.key === "Escape" && !drawerLayer.hidden) closeDrawer();
    });

    document.getElementById("languageToggle").addEventListener("click", function () {
      state.language = state.language === "en" ? "zh" : "en";
      localStorage.setItem("radar-language", state.language);
      applyTranslations();
    });

    var tweaksTrigger = document.getElementById("tweaksTrigger");
    var tweaksPanel = document.getElementById("tweaksPanel");
    function closeTweaks() {
      tweaksPanel.hidden = true;
      tweaksTrigger.hidden = false;
      tweaksTrigger.setAttribute("aria-expanded", "false");
    }
    tweaksTrigger.addEventListener("click", function () {
      tweaksPanel.hidden = false;
      tweaksTrigger.hidden = true;
      tweaksTrigger.setAttribute("aria-expanded", "true");
    });
    document.getElementById("closeTweaks").addEventListener("click", closeTweaks);
    document.getElementById("themeSelect").addEventListener("change", function (event) {
      document.documentElement.dataset.theme = event.target.value;
      localStorage.setItem("radar-theme", event.target.value);
    });
    document.getElementById("densitySelect").addEventListener("change", function (event) {
      document.documentElement.dataset.density = event.target.value;
      localStorage.setItem("radar-density", event.target.value);
    });
  }

  function restoreTweaks() {
    var theme = localStorage.getItem("radar-theme") || "paper";
    var density = localStorage.getItem("radar-density") || "balanced";
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.density = density;
    document.getElementById("themeSelect").value = theme;
    document.getElementById("densitySelect").value = density;
  }

  function failGracefully() {
    if (rankingList) rankingList.innerHTML = '<div class="empty-state"><span>!</span><h3>Ranking data did not load.</h3><p>Run scripts/update_rankings.py or open data/rankings.json.</p></div>';
  }

  if (!data || !Array.isArray(data.items)) {
    failGracefully();
    return;
  }

  document.querySelectorAll("[data-i18n]").forEach(function (element) {
    element.dataset.enText = element.textContent;
  });
  initializeHeader();
  restoreTweaks();
  renderStyleFilters();
  renderAtlas();
  renderRanking();
  renderHistory();
  bindEvents();
  applyTranslations();
})();
