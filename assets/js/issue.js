/* AAT — the whole issue as one swipeable magazine: cover, welcome, contents, every advertiser, articles, news, exhibitions, club, back cover */
(function (W) {
  "use strict";
  var doc = W.document, A = W.AAT, D = A.D, BR = W.AAT_BRAND || {}, esc = A.esc, L = A.L, img = A.img;
  var still = W.matchMedia && W.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var UI = {
    en: { issue: "Issue", swipe: "Swipe to turn the page", contents: "Contents", close: "Close", page: "Page", of: "of", welcome: "Welcome", about: "About this issue", advs: "Advertisers", arts: "Articles", news: "News", exh: "Exhibitions", modern: "Modern products and industries", club: "Business Club", back: "Back cover", index: "A–Z index", visit: "Visit website", contact: "Contact", products: "Products", lines: "Product lines", since: "Since", years: "years", adv_n: "advertisers", prod_n: "products", exh_n: "exhibitions", art_n: "articles", news_n: "news stories", inside: "In this issue", read: "Scroll to read", by: "By", more: "more", days: "days to go", now: "On now", site: "Factory website", join: "Join the club", benefits: "What members get", advertise: "Advertise in the next issue", thanks: "Thank you for reading", sec_advs: "The advertisers of this issue, each with their own page.", sec_arts: "This month's articles, in Arabic.", sec_news: "Trade and industry news.", sec_exh: "Trade shows from now to the end of next month, country by country.", sec_modern: "AAT's selection of factories, apart from the advertisers.", lang: "ع", prev: "Previous page", next: "Next page", wa: "WhatsApp", email: "Email", tel: "Tel", all: "All sections", print: "The printed cover", zoom: "Tap the ad to enlarge" },
    ar: { issue: "العدد", swipe: "اسحب لتقليب الصفحة", contents: "المحتويات", close: "إغلاق", page: "صفحة", of: "من", welcome: "أهلاً بكم", about: "عن هذا العدد", advs: "المعلنون", arts: "المقالات", news: "الأخبار", exh: "المعارض", modern: "منتجات وصناعات حديثة", club: "نادي رجال الأعمال", back: "الغلاف الأخير", index: "فهرس أبجدي", visit: "زيارة الموقع", contact: "تواصل", products: "المنتجات", lines: "خطوط المنتجات", since: "منذ", years: "عاماً", adv_n: "معلناً", prod_n: "منتجاً", exh_n: "معرضاً", art_n: "مقالاً", news_n: "خبراً", inside: "في هذا العدد", read: "مرّر للقراءة", by: "بقلم", more: "أخرى", days: "يوماً", now: "جارٍ الآن", site: "موقع المصنع", join: "انضم إلى النادي", benefits: "ما يحصل عليه الأعضاء", advertise: "أعلن في العدد القادم", thanks: "شكراً لقراءتكم", sec_advs: "معلنو هذا العدد، لكل واحد صفحته.", sec_arts: "مقالات هذا الشهر.", sec_news: "أخبار التجارة والصناعة.", sec_exh: "المعارض من الآن حتى نهاية الشهر القادم، دولة بدولة.", sec_modern: "مختارات AAT من المصانع، مستقلة عن المعلنين.", lang: "EN", prev: "الصفحة السابقة", next: "الصفحة التالية", wa: "واتساب", email: "البريد", tel: "هاتف", all: "كل الأقسام", print: "غلاف النسخة المطبوعة", zoom: "اضغط على الإعلان لتكبيره" }
  };
  function T(k) { return (UI[A.state.lang] || UI.en)[k] || UI.en[k] || k; }
  function isAr() { return A.state.lang === "ar"; }
  function clip(s, n) { s = String(s || ""); return s.length > n ? s.slice(0, n).replace(/\s+\S*$/, "") + "…" : s; }
  function dom(u) { return String(u || "").replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/.*$/, ""); }
  function webPics(c) { return A.productsOf(c).filter(function (p) { return p.img && p.src !== "ad"; }); }
  function lines(c) { var seen = {}, out = []; A.productsOf(c).map(function (p) { return p.n; }).concat((c.hot || []).map(function (h) { return h.name; })).forEach(function (n) { if (n && !seen[n] && out.length < 8) { seen[n] = 1; out.push(n); } }); return out; }
  function paras(list) { return (list || []).map(function (p, i) { if (/^##\s*/.test(p)) return "<h4>" + esc(p.replace(/^##\s*/, "")) + "</h4>"; if (/^[•\-]\s*/.test(p)) return '<p class="bul">' + esc(p.replace(/^[•\-]\s*/, "")) + "</p>"; return "<p>" + esc(p) + "</p>"; }).join(""); }
  var ARROW = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  var CC = { tw: "#D6202B", id: "#D6202B", my: "#1B3F9C", pk: "#0B6B3A", af: "#333", dz: "#0B7A3E", eg: "#C8102E", iq: "#C8102E", kw: "#0B7A3E", ye: "#C8102E", om: "#C8102E", qa: "#8A1538", sa: "#0B6B3A", sy: "#0B7A3E", ae: "#0B7A3E", tr: "#E30A17" };

  /* ───── pages ───── */
  var pages = [], secs = [];
  function sec(id, name, color) { secs.push({ id: id, name: name, at: pages.length, color: color }); }
  function add(title, build, cls) { pages.push({ title: title, build: build, cls: cls || "", sec: secs.length - 1 }); }
  function opener(k, n, sub, color) { add(T(k), function () { return '<div class="op" style="--a:' + color + '"><i>' + (n < 10 ? "0" : "") + n + '</i><h2>' + T(k) + "</h2><p>" + sub + '</p><span class="op-go">' + ARROW + "</span></div>"; }, "pg-op"); }

  function build() {
    pages = []; secs = [];
    var M = D.magazine, cos = A.byTier(A.companies), arts = A.articlesFor(A.state.lang), news = [], ev = A.eventsWindow(new Date(), 2), MOD = W.AAT_MODERN || [], MG = W.AAT_MODERN_G || {}, cn = D.countries || {};
    D.news.forEach(function (n, i) { if (!n.only || (n.only === "ar") === isAr()) news.push([n, i]); });
    news.sort(function (a, b) { return (b[0].only ? 1 : 0) - (a[0].only ? 1 : 0); });
    var nProd = A.allProducts().length, n = 0;

    sec("cover", T("issue") + " " + M.issue, "#EC1D25");
    add(L(M.name), function () {
      var heads = (isAr() ? arts.filter(function (a) { return a.fresh; }).map(function (a) { return a.title.ar; }) : news.map(function (p) { return L(p[0].title); })).slice(0, 3);
      return '<div class="cv"><div class="cv-top"><img class="cv-logo" src="' + img("logo.png") + '" alt="AAT"><span>' + esc(M.chinese || "") + '</span></div><p class="cv-name">' + esc(L(M.name)) + '</p><div class="cv-n"><b>' + M.years + "</b><span>" + T("years") + "<small>" + T("since") + " " + M.since + '</small></span></div><p class="cv-is">' + T("issue") + " " + M.issue + " · " + esc(L(M.month)) + '</p><ul class="cv-h">' + heads.map(function (h) { return "<li>" + esc(clip(h, 90)) + "</li>"; }).join("") + '</ul><figure class="cv-pr"><img src="' + img("magazine-" + M.issue + ".jpg") + '" alt=""><figcaption>' + T("print") + '</figcaption></figure><p class="cv-sw">' + T("swipe") + " " + ARROW + "</p></div>";
    }, "pg-cover");
    add(T("welcome"), function () {
      var facts = [[M.since, T("since")], [M.issue, T("issue")], [cos.length, T("adv_n")], [nProd, T("prod_n")], [ev.length, T("exh_n")], [isAr() ? arts.length : news.length, isAr() ? T("art_n") : T("news_n")]];
      return '<div class="wl"><p class="kick">' + T("about") + "</p><h2>" + esc(L(M.tagline)) + '</h2><p class="lead">' + esc(L(M.cover)) + "</p><p>" + A.t("ab1") + "</p><p>" + A.t("ab2") + '</p><div class="wl-f">' + facts.map(function (f, i) { return '<div style="--i:' + i + '"><b>' + f[0] + "</b><span>" + f[1] + "</span></div>"; }).join("") + "</div></div>";
    }, "pg-wl");
    var tocAt = pages.length;
    add(T("contents"), function () {
      return '<div class="tc"><p class="kick">' + T("inside") + "</p><h2>" + T("contents") + '</h2><ol class="tc-l">' + secs.filter(function (s) { return s.id !== "cover"; }).map(function (s) { var end = (secs[secs.indexOf(s) + 1] || { at: pages.length }).at; return '<li><button type="button" data-go="' + s.at + '" style="--a:' + s.color + '"><i>' + (s.at + 1) + "</i><b>" + esc(s.name) + "</b><small>" + (end - s.at) + " " + T("page") + "</small>" + ARROW + "</button></li>"; }).join("") + '</ol><h3>' + T("index") + '</h3><div class="tc-az">' + cos.slice().sort(function (a, b) { return a.company.localeCompare(b.company); }).map(function (c) { return '<button type="button" data-go="' + c._pg + '"><span>' + esc(clip(c.company, 34)) + "</span><i>" + (c._pg + 1) + "</i></button>"; }).join("") + "</div></div>";
    }, "pg-tc");

    sec("advs", T("advs"), "#EC1D25"); opener("advs", ++n, T("sec_advs") + " · " + cos.length, "#EC1D25");
    cos.forEach(function (c) {
      c._pg = pages.length;
      add(c.company, function () {
        var b = BR[c.page] || {}, lg = A.logoOf(c), ps = webPics(c).slice(0, 3), u = A.safeUrl(c.web), head = (!isAr() && b.h) || L(c.tagline) || "", pgs = A.inMagazine(c) ? A.companyPages(c) : [];
        var pts = (!isAr() && b.s && b.s.length ? b.s.map(function (x) { return [x, ""]; }) : (c.hot || []).map(function (h) { return [h.name, L(h.d)]; })).slice(0, 4);
        var facts = []; if (!isAr() && b.m) b.m.forEach(function (m) { if (m.k === "a" && m.i) facts = m.i.slice(0, 4); });
        return '<div class="ad' + (pgs.length ? "" : " ad-np") + '" style="--a:' + (b.a || "#EC1D25") + ";--b:" + (b.b || "#1b1c22") + '">' +
          (pgs.length ? '<div class="ad-pg' + (pgs.length > 1 ? " two" : "") + '">' + pgs.slice(0, 2).map(function (n) { return '<button type="button" class="ad-im" data-zoom="' + img("mag/p" + n + ".jpg") + '" aria-label="' + T("zoom") + '"><img src="' + img("mag/p" + n + ".jpg") + '" alt="' + esc(c.company) + '" loading="lazy"></button>'; }).join("") + '<span class="ad-z">' + T("zoom") + "</span></div>" : "") +
          '<div class="ad-s"><header class="ad-h">' + (lg ? '<span class="ad-lg"><img src="' + img(lg) + '" alt=""></span>' : "") + "<div><h2>" + esc(c.company) + "</h2><p>" + esc(L(A.cats[c.cat])) + " · " + esc(L(c.city)) + "</p></div></header>" +
          (head ? '<p class="ad-hl">' + esc(head) + "</p>" : "") + '<p class="ad-ab">' + esc(L(c.about)) + "</p>" +
          (pts.length ? '<ul class="ad-pt">' + pts.map(function (x) { return "<li><b>" + esc(clip(x[0], 60)) + "</b>" + (x[1] ? "<span>" + esc(clip(x[1], 90)) + "</span>" : "") + "</li>"; }).join("") + "</ul>" : "") +
          (facts.length ? '<div class="ad-fx">' + facts.map(function (x) { return "<span>" + esc(clip(x, 40)) + "</span>"; }).join("") + "</div>" : "") +
          (ps.length ? '<div class="ad-g">' + ps.map(function (p) { return '<figure><img src="' + img(p.img) + '" alt="" loading="lazy"><figcaption>' + esc(clip(p.n, 34)) + "</figcaption></figure>"; }).join("") + "</div>" : "") +
          '<footer class="ad-f">' + (u ? '<a class="ad-go" href="' + esc(u) + '" target="_blank" rel="noopener noreferrer"><span><b>' + T("visit") + "</b><small>" + esc(dom(u)) + "</small></span>" + ARROW + "</a>" : "") + '<div class="ad-c">' + (c.tel ? '<a href="tel:' + esc(String(c.tel).replace(/[^+\d]/g, "")) + '"><small>' + T("tel") + "</small>" + esc(String(c.tel).split("/")[0].trim()) + "</a>" : "") + (c.email ? '<a href="mailto:' + esc(c.email) + '"><small>' + T("email") + "</small>" + esc(c.email) + "</a>" : "") + "</div></footer></div></div>";
      }, "pg-ad");
    });

    if (arts.length) {
      sec("arts", T("arts"), "#0E5C8A"); opener("arts", ++n, T("sec_arts") + " · " + arts.length, "#0E5C8A");
      arts.forEach(function (a) {
        add(a.title.ar || a.title.en, function () {
          var lg = A.articleLang(), body = (a.body[lg] && a.body[lg].length) ? a.body[lg] : (a.body.ar || a.body.en || []), bl = (a.body[lg] && a.body[lg].length) ? lg : (a.body.ar ? "ar" : "en"), pic = a.cut || a.img, au = a.author ? String(a.author).replace(/\s*\(.*\)\s*$/, "") : "";
          return '<article class="rd" lang="' + bl + '" dir="' + (bl === "ar" ? "rtl" : "ltr") + '">' + (pic ? '<figure class="rd-pic' + (a.fit ? " fit" : "") + '"><img src="' + img(pic) + '" alt="" loading="lazy"></figure>' : "") + '<div class="rd-b"><p class="kick">' + T("arts") + "</p><h2>" + esc(a.title[bl] || a.title.ar || a.title.en) + "</h2>" + (au ? '<p class="rd-by">' + (a.face ? '<img src="' + img(a.face) + '" alt="">' : "") + "<span>" + T("by") + " <b>" + esc(au) + "</b></span></p>" : "") + '<div class="prose">' + paras(body) + "</div></div></article>";
        }, "pg-rd");
      });
    }
    if (news.length) {
      sec("news", T("news"), "#7A3E9D"); opener("news", ++n, T("sec_news") + " · " + news.length, "#7A3E9D");
      news.forEach(function (p) {
        add(L(p[0].title) || p[0].title.ar || p[0].title.en, function () {
          var nb = A.newsBody[p[1]] || {}, lg = A.state.lang, body = (nb.body && (nb.body[lg] || nb.body.en || nb.body.ar)) || [], ttl = L(p[0].title) || p[0].title.ar || p[0].title.en, rtl = /[؀-ۿ]/.test(ttl);
          return '<article class="rd" dir="' + (rtl ? "rtl" : "ltr") + '"><figure class="rd-pic"><img src="' + img(p[0].img) + '" alt="" loading="lazy"></figure><div class="rd-b"><p class="kick" style="color:#7A3E9D">' + T("news") + (nb.date ? " · " + esc(A.fmtDate(nb.date)) : "") + "</p><h2>" + esc(ttl) + '</h2><div class="prose">' + paras(body) + "</div></div></article>";
        }, "pg-rd");
      });
    }
    if (ev.length) {
      sec("exh", T("exh"), "#0B7A3E"); opener("exh", ++n, T("sec_exh") + " · " + ev.length, "#0B7A3E");
      Object.keys(cn).forEach(function (k) { var list = ev.filter(function (e) { return e.country === k; }); if (!list.length) return;
        add(L(cn[k]), function () { var now = new Date();
          return '<div class="ex" style="--a:' + (CC[k] || "#0B7A3E") + '"><header><p class="kick">' + T("exh") + "</p><h2>" + esc(L(cn[k])) + "</h2><b>" + list.length + '</b></header><ol class="ex-l">' + list.map(function (e) { var d = A.parseDate(e.start), dy = A.daysUntil(e, now), u = A.safeUrl(e.url), city = D.cities && D.cities[e.city] ? L(D.cities[e.city]) : e.city;
            return "<li><i><b>" + d.getDate() + "</b>" + (d.getMonth() + 1) + "</i><span><b>" + esc(e.name) + "</b><small>" + esc(A.fmtRange(e.start, e.end)) + (city ? " · " + esc(city) : "") + "</small></span>" + (u ? '<a href="' + esc(u) + '" target="_blank" rel="noopener noreferrer" aria-label="' + T("visit") + '">' + ARROW + "</a>" : "<em>" + (dy > 0 ? dy + " " + T("days") : T("now")) + "</em>") + "</li>"; }).join("") + "</ol></div>"; }, "pg-ex");
      });
    }
    if (MOD.length) {
      sec("modern", T("modern"), "#0E7C86"); opener("modern", ++n, T("sec_modern") + " · " + MOD.length, "#0E7C86");
      Object.keys(MG).forEach(function (g) { var items = MOD.filter(function (x) { return x.g === g; }); if (!items.length) return; var gn = MG[g][A.state.lang] || MG[g].en;
        add(gn, function () { return '<div class="ex md" style="--a:#0E7C86"><header><p class="kick">' + T("modern") + "</p><h2>" + esc(gn) + "</h2><b>" + items.length + '</b></header><ol class="ex-l">' + items.map(function (x, i) { var u = A.safeUrl(x.web); return "<li><i><b>" + (i + 1) + "</b></i><span><b>" + esc(isAr() ? x.t : (x.en || x.t)) + "</b>" + (u ? "<small>" + esc(dom(u)) + "</small>" : "") + "</span>" + (u ? '<a href="' + esc(u) + '" target="_blank" rel="noopener noreferrer" aria-label="' + T("site") + '">' + ARROW + "</a>" : "") + "</li>"; }).join("") + "</ol></div>"; }, "pg-ex");
      });
    }
    sec("club", T("club"), "#B8860B");
    add(T("club"), function () { var c = D.config;
      return '<div class="cl"><p class="kick">AAT Business Club</p><h2>' + A.t("mem_title") + '</h2><p class="lead">' + A.t("cb_goals_p") + "</p><h3>" + T("benefits") + '</h3><ol class="cl-l">' + [1, 2, 3, 4, 5, 6, 7, 8].map(function (i) { return '<li style="--i:' + i + '"><i>' + A.pad2(i) + "</i>" + A.t("cb_b" + i) + "</li>"; }).join("") + '</ol><div class="row"><a class="btn" href="' + A.waLink(A.t("cb_join_wa")) + '" target="_blank" rel="noopener noreferrer">' + T("join") + " · " + T("wa") + '</a><a class="btn ln" href="mailto:' + esc(c.clubEmail) + '">' + esc(c.clubEmail) + "</a></div></div>"; }, "pg-cl");
    sec("back", T("back"), "#111");
    add(T("back"), function () { var bk = cos.filter(function (c) { return c.tier === "back"; })[0], c = D.config, b = bk ? (BR[bk.page] || {}) : {}, lg = bk && A.logoOf(bk), u = bk && A.safeUrl(bk.web);
      return '<div class="bk" style="--a:' + (b.a || "#EC1D25") + '">' + (bk ? '<a class="bk-ad"' + (u ? ' href="' + esc(u) + '" target="_blank" rel="noopener noreferrer"' : "") + ">" + (lg ? '<img src="' + img(lg) + '" alt="">' : "") + "<b>" + esc(bk.company) + "</b><span>" + esc(L(bk.about)) + "</span>" + (u ? "<em>" + esc(dom(u)) + " ↗</em>" : "") + "</a>" : "") + '<div class="bk-a"><img src="' + img("logo.png") + '" alt="AAT"><h2>' + T("thanks") + "</h2><p>" + esc(L(M.name)) + " · " + T("issue") + " " + M.issue + " · " + esc(L(M.month)) + '</p><div class="row"><a class="btn" href="' + A.mailLink(c.email, "AAT — advertising") + '">' + T("advertise") + '</a><a class="btn ln" href="' + A.waLink() + '" target="_blank" rel="noopener noreferrer" dir="ltr">' + esc(c.phoneDisplay) + "</a></div><small>" + esc(L(c.address)) + " · " + esc(c.email) + "</small></div></div>"; }, "pg-bk");
    return tocAt;
  }

  /* ───── deck ───── */
  var deck = doc.getElementById("deck"), cur = 0, tocAt = 2, io = null;
  function pageEl(i) { return deck.children[i]; }
  function fill(el) { if (el._f) return; el._f = 1; var p = pages[+el.getAttribute("data-i")]; el.firstChild.innerHTML = p.build(); }
  function go(i, smooth) { i = Math.max(0, Math.min(pages.length - 1, i)); var el = pageEl(i); if (!el) return; fill(el); deck.scrollTo({ left: el.offsetLeft - deck.offsetLeft, behavior: smooth && !still ? "smooth" : "auto" }); if (!smooth) setCur(i); }
  function setCur(i) { cur = i; var p = pages[i], s = secs[p.sec]; doc.getElementById("iz-sec").textContent = s.name; doc.getElementById("iz-ttl").textContent = p.title === s.name ? "" : clip(p.title, 44); doc.getElementById("iz-num").textContent = (i + 1) + " / " + pages.length; var r = doc.getElementById("iz-range"); r.max = pages.length - 1; r.value = i; r.style.setProperty("--p", (i / (pages.length - 1) * 100) + "%");
    doc.documentElement.style.setProperty("--sec", s.color); [].forEach.call(doc.querySelectorAll("#iz-tabs button"), function (b, k) { b.classList.toggle("on", k === p.sec); if (k === p.sec && b.scrollIntoView && b.parentNode.scrollWidth > b.parentNode.clientWidth) b.parentNode.scrollLeft = b.offsetLeft - 60 * (isAr() ? -1 : 1); });
    for (var k = i - 1; k <= i + 2; k++) if (pageEl(k)) fill(pageEl(k));
    try { history.replaceState(null, "", "#p" + (i + 1)); } catch (e) { /* preview */ } }
  function render(keep) {
    doc.documentElement.lang = A.state.lang; doc.documentElement.dir = A.dir(); tocAt = build();
    deck.innerHTML = pages.map(function (p, i) { return '<section class="pg ' + p.cls + '" data-i="' + i + '" aria-label="' + esc(p.title) + '"><div class="sheet"></div></section>'; }).join("");
    doc.getElementById("iz-tabs").innerHTML = secs.map(function (s, k) { return '<button type="button" data-go="' + s.at + '" style="--a:' + s.color + '">' + esc(s.name) + "</button>"; }).join("");
    doc.getElementById("iz-issue").textContent = T("issue") + " " + D.magazine.issue + " · " + L(D.magazine.month);
    doc.getElementById("iz-lang").textContent = T("lang"); doc.getElementById("iz-toc").setAttribute("aria-label", T("contents")); doc.getElementById("iz-toc").lastChild.textContent = T("contents");
    doc.getElementById("iz-prev").setAttribute("aria-label", T("prev")); doc.getElementById("iz-next").setAttribute("aria-label", T("next"));
    if (io) io.disconnect();
    io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { fill(e.target); if (e.intersectionRatio > .55) { e.target.classList.add("seen"); var i = +e.target.getAttribute("data-i"); if (i !== cur) setCur(i); } } }); }, { root: deck, threshold: [0, .56] });
    [].forEach.call(deck.children, function (el) { io.observe(el); });
    var m = /^#p(\d+)$/.exec(location.hash), start = keep != null ? keep : (m ? +m[1] - 1 : 0); W.requestAnimationFrame(function () { go(start, false); pageEl(Math.min(start, pages.length - 1)).classList.add("seen"); });
  }
  doc.addEventListener("click", function (ev) { var z = ev.target.closest && ev.target.closest("[data-zoom],#iz-zoom"); if (z) { var box = doc.getElementById("iz-zoom"); if (z.id === "iz-zoom") { box.hidden = true; box.innerHTML = ""; } else { box.innerHTML = '<img src="' + z.getAttribute("data-zoom") + '" alt="">'; box.hidden = false; } return; }
    var t = ev.target.closest && ev.target.closest("[data-go],[data-act]"); if (!t) return;
    if (t.hasAttribute("data-go")) { go(+t.getAttribute("data-go"), Math.abs(+t.getAttribute("data-go") - cur) < 3); return; }
    var a = t.getAttribute("data-act");
    if (a === "prev") go(cur - 1, true); else if (a === "next") go(cur + 1, true); else if (a === "toc") go(tocAt, false);
    else if (a === "lang") { A.setLang(isAr() ? "en" : "ar"); A.store.set("lang", A.state.lang); render(0); } });
  doc.getElementById("iz-range").addEventListener("input", function () { go(+this.value, false); });
  doc.addEventListener("keydown", function (ev) { if (/INPUT|TEXTAREA/.test(ev.target.tagName) && ev.target.type !== "range") return; var rtl = isAr(), d = { ArrowRight: rtl ? -1 : 1, ArrowLeft: rtl ? 1 : -1, PageDown: 1, PageUp: -1 }[ev.key]; if (d) { ev.preventDefault(); go(cur + d, true); } else if (ev.key === "Escape") { var zb = doc.getElementById("iz-zoom"); zb.hidden = true; zb.innerHTML = ""; } else if (ev.key === "Home") go(0, false); else if (ev.key === "End") go(pages.length - 1, false); });
  /* a wheel turn on a page that has nothing left to scroll turns the page (PC) */
  var wheelT = 0; deck.addEventListener("wheel", function (ev) { if (Math.abs(ev.deltaY) < Math.abs(ev.deltaX)) return; var sh = ev.target.closest && ev.target.closest(".sheet"); if (sh && sh.scrollHeight > sh.clientHeight + 4) { var atEnd = sh.scrollTop + sh.clientHeight >= sh.scrollHeight - 2, atTop = sh.scrollTop <= 0; if ((ev.deltaY > 0 && !atEnd) || (ev.deltaY < 0 && !atTop)) return; }
    var now = Date.now(); if (now - wheelT < 520 || Math.abs(ev.deltaY) < 12) return; wheelT = now; go(cur + (ev.deltaY > 0 ? 1 : -1), true); }, { passive: true });
  A.setLang(A.store.get("lang", "ar") === "ar" ? "ar" : "en");
  render(null);
})(window);
