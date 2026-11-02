/* Karayana Hub: behaviour. Shop details and products live in js/data.js */
(function () {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const icon = id => `<svg class="ic" aria-hidden="true"><use href="#i-${id}"/></svg>`;
  const rupee = n => "₹" + n.toLocaleString("en-IN");
  const plural = (n, w) => n + " " + w + (n === 1 ? "" : "s");

  /* ---------- State ---------- */
  const byName = {};
  PRODUCTS.forEach((p, i) => { p.i = i; byName[p.name] = p; });
  let cat = "All", query = "", list = {};
  try {
    const saved = JSON.parse(localStorage.getItem("kh2") || "{}");
    Object.keys(saved).forEach(n => { if (byName[n] && saved[n] > 0) list[n] = Math.min(99, saved[n] | 0); });
  } catch (e) {}
  const persist = () => { try { localStorage.setItem("kh2", JSON.stringify(list)); } catch (e) {} };
  const names = () => Object.keys(list);
  const totalQty = () => names().reduce((s, n) => s + list[n], 0);
  const totalPrice = () => names().reduce((s, n) => s + (byName[n].price ? byName[n].price * list[n] : 0), 0);
  const allPriced = () => names().length > 0 && names().every(n => byName[n].price > 0);

  /* ---------- Shop details ---------- */
  const digits = s => String(s || "").replace(/\D/g, "");
  const waNumber = digits(SHOP.whatsapp);
  const hasWa = waNumber.length >= 10;

  function renderInfo() {
    const rows = [];
    if (SHOP.address) rows.push(["pin", "Address", esc(SHOP.address)]);
    if (SHOP.phone) rows.push(["phone", "Phone", `<a href="tel:${esc(String(SHOP.phone).replace(/[^\d+]/g, ""))}">${esc(SHOP.phone)}</a>`]);
    if (SHOP.hours) rows.push(["clock", "Opening hours", esc(SHOP.hours)]);
    if (SHOP.address || SHOP.mapQuery) {
      const q = encodeURIComponent(SHOP.address ? SHOP.mapQuery + " " + SHOP.address : SHOP.mapQuery);
      if (SHOP.address) rows.push(["arrow", "Directions", `<a href="https://www.google.com/maps/search/?api=1&query=${q}" target="_blank" rel="noopener">Open in Google Maps</a>`]);
    }
    $("#info").innerHTML = rows.map(r => `<li>${icon(r[0])}<div><small>${r[1]}</small>${r[2]}</div></li>`).join("");
    $("#infoEmpty").hidden = rows.length > 0;
  }

  /* ---------- Shelves ---------- */
  function monogram(name) {
    const w = name.replace(/[^A-Za-z0-9’' ]/g, "").split(/\s+/).filter(Boolean);
    return ((w[0] || "?")[0] + (w[1] ? w[1][0] : "")).toUpperCase();
  }
  function actionHTML(p) {
    if (!p.stock) return `<button class="add" type="button" disabled>Sold out</button>`;
    const q = list[p.name];
    if (!q) return `<button class="add" type="button" data-add="${p.i}" aria-label="Add ${esc(p.name)} to list">${icon("plus")}Add</button>`;
    return `<div class="step-ctl" role="group" aria-label="${esc(p.name)} quantity">
      <button type="button" data-dec="${p.i}" aria-label="Remove one ${esc(p.name)}">${icon(q === 1 ? "x" : "minus")}</button>
      <output aria-live="polite">${q}</output>
      <button type="button" data-inc="${p.i}" aria-label="Add one more ${esc(p.name)}">${icon("plus")}</button></div>`;
  }
  function cardHTML(p) {
    const pic = p.img
      ? `<div class="pic photo"><img src="${esc(p.img)}" alt="${esc(p.name)}" loading="lazy"></div>`
      : `<div class="pic mono" style="--t:${esc(p.tone)}" aria-hidden="true"><span>${esc(monogram(p.name))}</span></div>`;
    return `<article class="card${list[p.name] ? " in" : ""}" data-i="${p.i}">${pic}
      <div class="bd"><span class="cat">${esc(p.cat)}</span><h3>${esc(p.name)}</h3><p>${esc(p.desc)}</p>
      ${p.price ? `<b class="pr">${rupee(p.price)}</b>` : ""}
      <div class="act">${actionHTML(p)}</div></div></article>`;
  }
  function renderChips() {
    const counts = { All: PRODUCTS.length };
    PRODUCTS.forEach(p => counts[p.cat] = (counts[p.cat] || 0) + 1);
    $("#chips").innerHTML = ["All"].concat(CATEGORIES).map(c =>
      `<button class="chip" type="button" data-cat="${esc(c)}" aria-pressed="${c === cat}">${esc(c)}<small>${counts[c] || 0}</small></button>`).join("");
  }
  function renderGrid() {
    const t = query.trim().toLowerCase();
    const r = PRODUCTS.filter(p => (cat === "All" || p.cat === cat) && (!t || (p.name + " " + p.desc + " " + p.cat).toLowerCase().includes(t)));
    $("#grid").innerHTML = r.map(cardHTML).join("");
    $("#grid").hidden = !r.length;
    $("#none").hidden = r.length > 0;
    $("#noneQ").textContent = query.trim();
    $("#count").textContent = r.length
      ? `Showing ${plural(r.length, "item")}${cat !== "All" ? " in " + cat : ""}${t ? " for “" + query.trim() + "”" : ""}`
      : "";
    $("#qClear").hidden = !query;
  }
  function refreshCard(i, focusSel) {
    const p = PRODUCTS[i], card = $(`.card[data-i="${i}"]`);
    if (!card) return;
    card.classList.toggle("in", !!list[p.name]);
    $(".act", card).innerHTML = actionHTML(p);
    if (focusSel) { const f = $(focusSel, card) || $(".step-ctl button, .add", card); f && f.focus(); }
  }

  /* ---------- List ---------- */
  function setQty(name, q, focusSel) {
    if (q <= 0) delete list[name]; else list[name] = Math.min(99, q);
    persist();
    refreshCard(byName[name].i, focusSel);
    renderListUI();
  }
  let toastT;
  function toast(msg) {
    const t = $("#toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 1900);
  }
  function renderListUI() {
    const n = totalQty(), kinds = names().length;
    $("#badge").textContent = n;
    $("#badgeSr").textContent = "My list, " + plural(n, "item");
    $("#badge").style.display = n ? "" : "none";
    $("#lbCount").textContent = plural(n, "item");
    $("#listbar").hidden = !n;
    document.body.classList.toggle("has-bar", n > 0);
    renderDrawer(); renderSummary();
  }
  function renderDrawer() {
    const k = names(), body = $("#ls"), foot = $("#drFoot");
    if (!k.length) {
      body.innerHTML = `<div class="dr-empty">${icon("bag")}<p><b>Your list is empty</b></p><p>Add items from the shelves and they will show up here.</p><button class="btn btn-primary" type="button" data-close-go="#shelves">Browse the shelves</button></div>`;
      foot.innerHTML = ""; return;
    }
    body.innerHTML = k.map(n => {
      const p = byName[n];
      return `<div class="row"><div class="nm">${esc(n)}<small>${esc(p.desc)}${p.price ? " · " + rupee(p.price * list[n]) : ""}</small></div>
        <div class="mini" role="group" aria-label="${esc(n)} quantity"><button type="button" data-dec="${p.i}" aria-label="Remove one ${esc(n)}">${icon("minus")}</button><output>${list[n]}</output><button type="button" data-inc="${p.i}" aria-label="Add one more ${esc(n)}">${icon("plus")}</button></div>
        <button class="rm" type="button" data-rm="${p.i}" aria-label="Remove ${esc(n)} from list">Remove</button></div>`;
    }).join("");
    const T = totalPrice();
    foot.innerHTML =
      (T ? `<div class="tot"><span>${allPriced() ? "Estimated total" : "Priced items so far"}</span><span>${rupee(T)}</span></div>` : "") +
      `<p class="dr-note">${plural(totalQty(), "item")}. We confirm stock and price before you pick up.</p>
       <button class="btn btn-primary btn-lg block" type="button" data-close-go="#contact">Continue to enquiry ${icon("arrow")}</button>
       <button class="link-btn" type="button" id="clearList">Clear list</button>`;
  }
  function renderSummary() {
    const k = names(), s = $("#sum");
    if (!k.length) {
      s.innerHTML = `<p>Your list is empty. <a href="#shelves" style="color:var(--link);font-weight:700">Browse the shelves</a> to add items, or type what you need below.</p>`;
      $("#itLabel").innerHTML = "What do you need?";
      $("#it").placeholder = "Items, brands, sizes or any question";
    } else {
      s.innerHTML = `<div class="ls-head"><span>Your list (${plural(totalQty(), "item")})</span><button class="link" type="button" id="editList">Edit list</button></div>
        <ul class="pills">${k.map(n => `<li>${esc(n)} <b>×${list[n]}</b></li>`).join("")}</ul>`;
      $("#itLabel").innerHTML = "Anything else? <small>(optional)</small>";
      $("#it").placeholder = "Brand, size or any question";
    }
  }

  /* ---------- Gallery + lightbox ---------- */
  let gi = 0;
  function renderGallery() {
    $("#gallery").innerHTML = GALLERY.map((g, i) =>
      `<button class="g rv" type="button" data-g="${i}" aria-label="Enlarge photo: ${esc(g.cap)}"><img src="${esc(g.src)}" alt="${esc(g.alt)}" loading="lazy"><span class="cap"><span>${esc(g.cap)}</span>${icon("expand")}</span></button>`).join("");
  }
  function showPhoto(i) {
    gi = (i + GALLERY.length) % GALLERY.length;
    const g = GALLERY[gi];
    $("#lbi").src = g.src; $("#lbi").alt = g.alt;
    $("#lbc").textContent = g.cap; $("#lbn").textContent = (gi + 1) + " / " + GALLERY.length;
  }

  /* ---------- Dialog helpers ---------- */
  function openDlg(d) { if (!d.open) d.showModal(); document.documentElement.style.overflow = "hidden"; }
  function closeDlg(d) { if (d.open) d.close(); }
  ["#dr", "#lb"].forEach(s => {
    const d = $(s);
    d.addEventListener("click", e => { if (e.target === d) d.close(); });
    d.addEventListener("close", () => { if (!$("dialog[open]")) document.documentElement.style.overflow = ""; });
  });

  /* ---------- Events ---------- */
  document.addEventListener("click", e => {
    const t = e.target.closest("button, a");
    if (!t) return;
    const d = t.dataset;

    if (d.cat !== undefined) { cat = d.cat; renderChips(); renderGrid(); const c = $(`.chip[data-cat="${CSS.escape(cat)}"]`); c && c.scrollIntoView({ inline: "center", block: "nearest" }); c && c.focus({ preventScroll: true }); return; }
    if (d.add !== undefined) { const p = PRODUCTS[d.add]; setQty(p.name, 1, ".step-ctl [data-inc]"); toast("Added " + p.name); $("#listBtn").classList.remove("bump"); void $("#listBtn").offsetWidth; $("#listBtn").classList.add("bump"); return; }
    if (d.inc !== undefined) { const p = PRODUCTS[d.inc]; setQty(p.name, list[p.name] + 1, `[data-inc]`); return; }
    if (d.dec !== undefined) { const p = PRODUCTS[d.dec]; const q = list[p.name] - 1; setQty(p.name, q, q > 0 ? `[data-dec]` : ".add"); return; }
    if (d.rm !== undefined) { setQty(PRODUCTS[d.rm].name, 0); return; }
    if (d.closeGo) { closeDlg($("#dr")); const el = $(d.closeGo); el && el.scrollIntoView({ behavior: "smooth", block: "start" }); return; }
    if (d.g !== undefined) { showPhoto(+d.g); openDlg($("#lb")); return; }
    if (t.id === "clearList") { if (confirm("Remove everything from your list?")) { list = {}; persist(); renderGrid(); renderListUI(); } return; }
    if (t.id === "editList" || t.id === "listBtn" || t.id === "listbarBtn") { openDlg($("#dr")); return; }
    if (t.id === "drClose") { closeDlg($("#dr")); return; }
    if (t.id === "lbClose") { closeDlg($("#lb")); return; }
    if (t.id === "lbPrev") { showPhoto(gi - 1); return; }
    if (t.id === "lbNext") { showPhoto(gi + 1); return; }
    if (t.id === "qClear") { $("#q").value = ""; query = ""; renderGrid(); $("#q").focus(); return; }
    if (t.id === "resetFilters") { $("#q").value = ""; query = ""; cat = "All"; renderChips(); renderGrid(); return; }
    if (t.closest("#nav") && t.tagName === "A") closeMenu();
  });

  document.addEventListener("keydown", e => {
    if ($("#lb").open) {
      if (e.key === "ArrowLeft") showPhoto(gi - 1);
      if (e.key === "ArrowRight") showPhoto(gi + 1);
    } else if (e.key === "Escape") closeMenu();
  });
  // swipe in lightbox
  let sx = null;
  $("#lb").addEventListener("touchstart", e => { sx = e.touches[0].clientX; }, { passive: true });
  $("#lb").addEventListener("touchend", e => {
    if (sx === null) return;
    const dx = e.changedTouches[0].clientX - sx; sx = null;
    if (Math.abs(dx) > 50) showPhoto(gi + (dx < 0 ? 1 : -1));
  });

  $("#q").addEventListener("input", e => { query = e.target.value; renderGrid(); });

  /* Mobile menu */
  function closeMenu() { $("#nav").classList.remove("open"); $("#menu").setAttribute("aria-expanded", "false"); }
  $("#menu").addEventListener("click", () => {
    const o = $("#nav").classList.toggle("open");
    $("#menu").setAttribute("aria-expanded", String(o));
  });
  document.addEventListener("click", e => { if (!e.target.closest(".nav")) closeMenu(); });

  /* Header shadow, toolbar border, active nav link */
  const header = $(".site-header"), toolbar = $("#toolbar");
  function onScroll() {
    header.classList.toggle("scrolled", scrollY > 8);
    const hh = header.offsetHeight;
    toolbar.classList.toggle("stuck", Math.abs(toolbar.getBoundingClientRect().top - hh) < 1 && scrollY > 8);
  }
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  const links = $$("#nav a"), secs = links.map(a => $(a.getAttribute("href")));
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(es => es.forEach(en => {
      if (en.isIntersecting) links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id));
    }), { rootMargin: "-40% 0px -55% 0px" });
    secs.forEach(s => s && io.observe(s));
    const rv = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add("on"); rv.unobserve(en.target); } }), { threshold: .12 });
    window.__rv = rv;
  }

  /* ---------- Enquiry form ---------- */
  const f = $("#f");
  $$('input[name="mode"]', f).forEach(r => r.addEventListener("change", () => {
    $("#adWrap").hidden = f.mode.value !== "Delivery";
  }));
  function setErr(id, inputId, msg) {
    $("#" + id).textContent = msg;
    const i = $("#" + inputId); i && i.setAttribute("aria-invalid", msg ? "true" : "false");
    return !msg;
  }
  ["n", "p", "a", "it"].forEach(id => $("#" + id).addEventListener("input", () => {
    const map = { n: "en", p: "ep", a: "ea", it: "ei" };
    if ($("#" + map[id]).textContent) setErr(map[id], id, "");
  }));

  let lastMsg = "";
  f.addEventListener("submit", e => {
    e.preventDefault();
    const name = $("#n").value.trim(), phone = $("#p").value.replace(/[\s-]/g, ""), notes = $("#it").value.trim();
    const delivery = f.mode.value === "Delivery", addr = $("#a").value.trim();
    const okPhone = /^(\+?91|0)?[6-9]\d{9}$/.test(phone);
    const checks = [
      [setErr("en", "n", name.length < 2 ? "Please enter your name." : ""), "n"],
      [setErr("ep", "p", okPhone ? "" : "Enter a valid 10-digit mobile number."), "p"],
      [setErr("ea", "a", delivery && addr.length < 6 ? "Enter your delivery address." : ""), "a"],
      [setErr("ei", "it", !names().length && notes.length < 2 ? "Add items from the shelves or type what you need." : ""), "it"]
    ];
    const bad = checks.find(c => !c[0]);
    if (bad) { $("#" + bad[1]).focus(); return; }

    const T = totalPrice();
    const lines = names().map(n => "• " + n + " x" + list[n] + (byName[n].price ? " (" + rupee(byName[n].price * list[n]) + ")" : ""));
    lastMsg = ["Hello Karayana Hub, I would like to enquire about:", "",
      "Name: " + name, "Phone: " + phone, "",
      lines.length ? "Items:\n" + lines.join("\n") : "",
      notes ? "Notes: " + notes : "",
      T && allPriced() ? "Estimated total: " + rupee(T) : "",
      delivery ? "Delivery to: " + addr : "Pickup from the shop",
      "", "Please confirm availability and price. Thank you."].filter((l, i, a) => l !== "" || (a[i - 1] !== "" && i)).join("\n");

    $("#outMsg").textContent = lastMsg;
    const wa = $("#outWa");
    if (hasWa) {
      wa.href = "https://wa.me/" + waNumber + "?text=" + encodeURIComponent(lastMsg);
      wa.hidden = false;
      $("#outTitle").textContent = "Opening WhatsApp… if nothing opened, use the button below.";
      window.open(wa.href, "_blank", "noopener");
    } else {
      wa.hidden = true;
      $("#outTitle").textContent = "Your enquiry is ready. Copy it and send it to the shop.";
    }
    $("#out").hidden = false; $("#out").focus();
    $("#out").scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
  $("#cp").addEventListener("click", () => {
    const span = $("#cp span"), done = () => { span.textContent = "Copied"; setTimeout(() => span.textContent = "Copy enquiry", 1800); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(lastMsg).then(done, () => { selectMsg(); });
    else selectMsg();
    function selectMsg() { const r = document.createRange(); r.selectNodeContents($("#outMsg")); const s = getSelection(); s.removeAllRanges(); s.addRange(r); span.textContent = "Press Ctrl+C to copy"; }
  });
  if (!hasWa) $("#sendText").textContent = "Prepare enquiry";

  /* ---------- Init ---------- */
  renderInfo(); renderChips(); renderGrid(); renderGallery(); renderListUI();
  $$(".sec-head, .step, .about-photo, .about-copy, .info li, .form-card, .strip-grid>div").forEach(el => el.classList.add("rv"));
  $$(".rv").forEach(el => window.__rv ? window.__rv.observe(el) : el.classList.add("on"));
})();
