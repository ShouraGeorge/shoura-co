/* =========================================================
   shoura.co — application script (multi-page build)
   Language is fixed per page (body[data-lang]); no client routing.
   Handles: product artwork, category filter, product modal,
   basket, mobile nav, scroll reveals, contact form.
   ========================================================= */
(function(){
"use strict";

const WHATSAPP = "201210103290";
const CONTACT  = "info@shoura.co";
const CURRENCY = { en: "EGP", ar: "ج.م" };

const $  = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const lang = document.body.getAttribute("data-lang") === "ar" ? "ar" : "en";
const isAr = () => lang === "ar";
const T = (o) => o ? (isAr() ? o.ar : o.en) : "";
const esc = (s) => String(s).replace(/[&<>"']/g, c =>
  ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));

const store = {
  get(k, d){ try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch(e){ return d; } },
  set(k, v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){} }
};

let cart = store.get("sg_cart", []) || [];
let modalProduct = null, modalQty = 1;
const HAS_PRODUCTS = typeof PRODUCTS !== "undefined";

/* asset root — "" on top-level pages, "../" under /ar/ — derived from the
   stylesheet href so it stays correct whatever depth the page sits at. */
const AROOT = (function(){
  const l = document.querySelector('link[rel="stylesheet"][href*="app.css"]');
  const h = l ? l.getAttribute("href") : "";
  return h.replace(/assets\/app\.css.*$/, "");
})();

/* ---------------- product artwork (inline SVG) ---------------- */
function artFor(id){
  const card = (fill, accent, label) => `
    <svg viewBox="0 0 200 126" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs><linearGradient id="g${id}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${fill}"/><stop offset="1" stop-color="${accent}"/></linearGradient></defs>
      <rect x="2" y="2" width="196" height="122" rx="9" fill="url(#g${id})" stroke="rgba(244,241,233,.3)"/>
      <circle cx="160" cy="34" r="17" fill="none" stroke="#C9A06A" stroke-width="1.2" opacity=".5"/>
      <path d="M152 34a8 8 0 0 1 16 0M147 34a13 13 0 0 1 26 0" fill="none" stroke="#C9A06A" stroke-width="1.4" stroke-linecap="round"/>
      <rect x="22" y="86" width="74" height="4" rx="2" fill="#F4F1E9" opacity=".82"/>
      <rect x="22" y="96" width="46" height="3" rx="1.5" fill="#C9A06A" opacity=".8"/>
      <text x="22" y="46" font-family="Georgia,serif" font-size="15" fill="#F4F1E9" opacity=".95">${label}</text>
    </svg>`;
  const star = `
    <svg viewBox="0 0 200 126" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="2" y="2" width="196" height="122" rx="9" fill="#12302F" stroke="rgba(244,241,233,.3)"/>
      ${[0,1,2,3,4].map(i=>`<path transform="translate(${30+i*29},44) scale(.9)" d="M10 0l3.1 6.3 6.9 1-5 4.9 1.2 6.9L10 15.8 3.8 19.1 5 12.2 0 7.3l6.9-1z" fill="#C9A06A"/>`).join("")}
      <rect x="40" y="78" width="120" height="4" rx="2" fill="#F4F1E9" opacity=".78"/>
      <rect x="62" y="90" width="76" height="3" rx="1.5" fill="#F4F1E9" opacity=".4"/>
    </svg>`;
  const stand = `
    <svg viewBox="0 0 200 126" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="52" y="16" width="96" height="76" rx="4" fill="#12302F" stroke="rgba(244,241,233,.3)"/>
      <path d="M40 92h120l-10 16H50z" fill="#1d4442" stroke="rgba(244,241,233,.22)"/>
      ${[0,1,2].map(i=>`<path transform="translate(${74+i*22},40) scale(.8)" d="M10 0l3.1 6.3 6.9 1-5 4.9 1.2 6.9L10 15.8 3.8 19.1 5 12.2 0 7.3l6.9-1z" fill="#C9A06A"/>`).join("")}
      <rect x="72" y="66" width="56" height="4" rx="2" fill="#F4F1E9" opacity=".7"/>
    </svg>`;
  const tag = `
    <svg viewBox="0 0 200 126" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      ${[0,1,2].map(i=>`<g transform="translate(${26+i*56},${20+i*6})">
        <rect width="52" height="70" rx="8" fill="#12302F" stroke="rgba(244,241,233,.28)"/>
        <circle cx="26" cy="24" r="11" fill="none" stroke="#C9A06A" stroke-width="1.2" opacity=".6"/>
        <path d="M20 24a6 6 0 0 1 12 0" fill="none" stroke="#C9A06A" stroke-width="1.4" stroke-linecap="round"/>
        <rect x="12" y="46" width="28" height="3" rx="1.5" fill="#F4F1E9" opacity=".65"/>
        <rect x="16" y="54" width="20" height="2.5" rx="1.2" fill="#C9A06A" opacity=".7"/>
      </g>`).join("")}
    </svg>`;
  const sticker = `
    <svg viewBox="0 0 200 126" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      ${[0,1,2,3,4].map(i=>`<g transform="translate(${28+i*30},${34+(i%2)*18})">
        <circle r="21" cx="21" cy="21" fill="#12302F" stroke="rgba(244,241,233,.3)"/>
        <path d="M14 21a7 7 0 0 1 14 0M9.5 21a11.5 11.5 0 0 1 23 0" fill="none" stroke="#C9A06A" stroke-width="1.4" stroke-linecap="round"/>
      </g>`).join("")}
    </svg>`;
  const phone = `
    <svg viewBox="0 0 200 126" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="72" y="8" width="56" height="110" rx="9" fill="#12302F" stroke="rgba(244,241,233,.32)"/>
      <circle cx="100" cy="36" r="13" fill="#1d4442" stroke="#C9A06A" stroke-width="1"/>
      <rect x="84" y="56" width="32" height="3.5" rx="1.75" fill="#F4F1E9" opacity=".8"/>
      <rect x="90" y="65" width="20" height="2.5" rx="1.25" fill="#C9A06A" opacity=".85"/>
      ${[0,1,2].map(i=>`<rect x="82" y="${78+i*12}" width="36" height="8" rx="4" fill="#245B55" opacity=".9"/>`).join("")}
    </svg>`;
  const team = `
    <svg viewBox="0 0 200 126" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      ${[0,1,2,3].map(i=>`<g transform="translate(${18+i*38},${22+(i%2)*26}) rotate(${i%2?-4:4} 32 20)">
        <rect width="64" height="40" rx="5" fill="#12302F" stroke="rgba(244,241,233,.28)"/>
        <rect x="9" y="25" width="26" height="3" rx="1.5" fill="#F4F1E9" opacity=".7"/>
        <rect x="9" y="31" width="16" height="2.5" rx="1.25" fill="#C9A06A" opacity=".8"/>
        <path d="M46 16a5 5 0 0 1 10 0" fill="none" stroke="#C9A06A" stroke-width="1.2" stroke-linecap="round"/>
      </g>`).join("")}
    </svg>`;
  return {
    "card-classic": card("#1d4442", "#0E2A29", "SG"),
    "card-metal":   card("#3d4a4a", "#1b2423", "SG"),
    "review-card":  star, "review-stand": stand, "menu-tags": tag,
    "stickers": sticker, "profile-page": phone, "team-pack": team
  }[id] || card("#1d4442", "#0E2A29", "SG");
}

/* product visual: uploaded photo if there is one, generated artwork if not */
function visFor(id){
  const p = HAS_PRODUCTS ? PRODUCTS.find(x => x.id === id) : null;
  if (p && p.img){
    const t = T(p) || {};
    return '<img src="' + AROOT + esc(p.img) + '" alt="' + esc(t.name || "") +
           '" loading="lazy" decoding="async" width="900" height="567">';
  }
  return artFor(id);
}

function money(v){
  if (!v) return isAr() ? "السعر عند الطلب" : "Price on request";
  return v.toLocaleString("en-US") + ' <small>' + CURRENCY[lang] + '</small>';
}

/* ---------------- shop ---------------- */
function paintArtwork(){
  $$("[data-art]").forEach(el => { el.innerHTML = visFor(el.getAttribute("data-art")); });
}
function filterShop(cat){
  $$("#shopBar .chip").forEach(c => c.classList.toggle("on", c.getAttribute("data-cat") === cat));
  $$("#shopGrid .prod").forEach(p => {
    const show = cat === "all" || p.getAttribute("data-cat") === cat;
    p.style.display = show ? "" : "none";
    if (show) p.classList.add("in");
  });
}
function openProduct(id){
  if (!HAS_PRODUCTS) return;
  const p = PRODUCTS.find(x => x.id === id); if (!p) return;
  modalProduct = p; modalQty = 1;
  const t = T(p);
  $("#modalVis").innerHTML = visFor(p.id);
  $("#modalBody").innerHTML = `
    <span class="prod-tag">${esc(t.tag)}</span>
    <h3>${esc(t.name)}</h3>
    <p style="color:var(--muted);font-size:.96rem;line-height:1.68">${esc(t.desc)}</p>
    <ul class="specs">${t.specs.map(s => `<li>${esc(s)}</li>`).join("")}</ul>
    <div style="display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;
                padding-top:18px;border-top:1px solid var(--line)">
      <span class="price" style="font-size:1.7rem">${money(p.price)}</span>
      <div class="qty"><button id="qMinus" aria-label="-">−</button><span id="qVal">1</span><button id="qPlus" aria-label="+">+</button></div>
    </div>
    <button class="btn btn-dark" id="addBtn" style="width:100%;justify-content:center;margin-top:18px">
      ${isAr() ? "أضف إلى السلة" : "Add to basket"}</button>`;
  $("#modal").classList.add("open");
  $("#qMinus").onclick = () => { modalQty = Math.max(1, modalQty - 1); $("#qVal").textContent = modalQty; };
  $("#qPlus").onclick  = () => { modalQty = Math.min(99, modalQty + 1); $("#qVal").textContent = modalQty; };
  $("#addBtn").onclick = () => { addToCart(p.id, modalQty); closeModal(); openCart(); };
}
function closeModal(){ const m = $("#modal"); if (m) m.classList.remove("open"); }

/* ---------------- cart ---------------- */
function addToCart(id, qty){
  const line = cart.find(l => l.id === id);
  if (line) line.q += qty; else cart.push({ id, q: qty });
  store.set("sg_cart", cart); renderCart(); bump();
}
function removeFromCart(id){
  cart = cart.filter(l => l.id !== id);
  store.set("sg_cart", cart); renderCart();
}
function product(id){ return HAS_PRODUCTS ? PRODUCTS.find(x => x.id === id) : null; }
function cartTotal(){
  return cart.reduce((s, l) => { const p = product(l.id); return s + (p && p.price ? p.price * l.q : 0); }, 0);
}
function bump(){
  const el = $("#cartCount");
  if (el && el.animate) el.animate(
    [{transform:"scale(1)"},{transform:"scale(1.45)"},{transform:"scale(1)"}],
    {duration:380, easing:"ease-out"});
}
function renderCart(){
  const c = $("#cartCount"); if (!c) return;
  const n = cart.reduce((s, l) => s + l.q, 0);
  c.textContent = n; c.classList.toggle("zero", n === 0);

  const box = $("#cartItems");
  if (!cart.length || !HAS_PRODUCTS){
    box.innerHTML = `<div class="empty">${isAr() ? "السلة فارغة." : "Your basket is empty."}</div>`;
  } else {
    box.innerHTML = cart.map(l => {
      const p = product(l.id); if (!p) return "";
      const t = T(p);
      return `<div class="ci">
        <div class="ci-vis">${visFor(p.id)}</div>
        <div class="ci-info">
          <h4>${esc(t.name)}</h4>
          <div class="cp">${isAr()?"الكمية":"Qty"}: ${l.q} · ${money(p.price)}</div>
          <button class="ci-rm" data-rm="${p.id}">${isAr()?"إزالة":"Remove"}</button>
        </div></div>`;
    }).join("");
  }
  $("#cartTotal").innerHTML = money(cartTotal());
  const co = $("#checkout"); if (co) co.href = checkoutUrl();
}
function openCart(){ $("#drawer").classList.add("open"); $("#overlay").classList.add("on"); }
function closeCart(){ $("#drawer").classList.remove("open"); $("#overlay").classList.remove("on"); }

function checkoutUrl(){
  const ar = isAr();
  if (!cart.length || !HAS_PRODUCTS){
    return "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(
      ar ? "مرحبًا، أود الاستفسار عن منتجات NFC." : "Hello — I'd like to ask about the NFC products.");
  }
  const lines = cart.map(l => {
    const p = product(l.id); const t = T(p);
    return `• ${t.name} × ${l.q}` + (p.price ? ` — ${(p.price*l.q).toLocaleString("en-US")} EGP` : "");
  }).join("\n");
  const total = cartTotal();
  const msg = (ar ? "طلب من shoura.co\n\n" : "Order from shoura.co\n\n") + lines +
    (total ? `\n\n${ar ? "الإجمالي" : "Total"}: ${total.toLocaleString("en-US")} EGP` : "") +
    (ar ? "\n\nالاسم:\nالعنوان:\n" : "\n\nName:\nDelivery address:\n");
  return "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(msg);
}

/* ---------------- reveals ---------------- */
function observeReveals(){
  const items = $$(".rv:not(.in)");
  if (!("IntersectionObserver" in window)){ items.forEach(e => e.classList.add("in")); return; }
  const io = new IntersectionObserver(es => {
    es.forEach(e => { if (e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: .06, rootMargin: "0px 0px -50px 0px" });
  items.forEach(e => io.observe(e));
}

/* ---------------- contact form ---------------- */
function initForm(){
  const form = $("#briefForm"); if (!form) return;
  form.addEventListener("submit", e => {
    e.preventDefault();
    const ar = isAr(), out = $("#formOut");
    const g = id => ($("#" + id).value || "").trim();
    const need = $("#f_need");
    const needTxt = need.options[need.selectedIndex].textContent;
    if (!g("f_name") || !g("f_contact")){
      out.className = "out show";
      out.innerHTML = ar ? "من فضلك أدخل الاسم ووسيلة تواصل." : "Please enter your name and a way to reach you.";
      return;
    }
    const body = ar
      ? `الاسم: ${g("f_name")}\nالشركة: ${g("f_co")||"—"}\nالتواصل: ${g("f_contact")}\nالخدمة: ${needTxt}\n\n${g("f_msg")||"—"}`
      : `Name: ${g("f_name")}\nCompany: ${g("f_co")||"—"}\nContact: ${g("f_contact")}\nService: ${needTxt}\n\n${g("f_msg")||"—"}`;
    const subj = ar ? `طلب عبر shoura.co — ${needTxt}` : `Enquiry via shoura.co — ${needTxt}`;
    out.className = "out show";
    out.innerHTML =
      `<b>${ar ? "رسالتك جاهزة." : "Your message is ready."}</b> ${ar ? "أرسلها عبر البريد أو واتساب — أو انسخها." : "Send it by email or WhatsApp — or copy it."}
       <pre id="msgBox"></pre>
       <a class="btn btn-dark btn-sm" style="margin-inline-end:8px" href="mailto:${CONTACT}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(body)}">${ar?"إرسال بالبريد":"Send by email"}</a>
       <a class="btn btn-outline btn-sm" style="margin-inline-end:8px" target="_blank" rel="noopener" href="https://wa.me/${WHATSAPP}?text=${encodeURIComponent(subj+"\n\n"+body)}">${ar?"إرسال بواتساب":"Send by WhatsApp"}</a>
       <button type="button" class="btn btn-outline btn-sm" id="copyBtn">${ar?"نسخ":"Copy"}</button>`;
    $("#msgBox").textContent = body;
    $("#copyBtn").onclick = function(){
      const b = this;
      try {
        navigator.clipboard.writeText(body).then(
          () => { b.textContent = ar ? "تم النسخ" : "Copied"; },
          () => { b.textContent = ar ? "انسخ النص يدويًا" : "Select the text above"; });
      } catch(err){ b.textContent = ar ? "انسخ النص يدويًا" : "Select the text above"; }
    };
  });
}

/* ---------------- preview fallback ----------------
   Inside a sandboxed preview frame, normal link navigation can be blocked.
   There we fetch the target page and swap <main> instead. On a real host
   (shoura.co) this never runs and links behave normally — which is what
   search engines need. */
function initFrameFallback(){
  if (window.self === window.top) return;
  document.addEventListener("click", async e => {
    const a = e.target.closest("a[href]");
    if (!a) return;
    const href = a.getAttribute("href");
    if (!href || /^(https?:|mailto:|tel:|#)/.test(href) || a.target === "_blank") return;
    e.preventDefault();
    try {
      const res = await fetch(href);
      const doc = new DOMParser().parseFromString(await res.text(), "text/html");
      document.documentElement.lang = doc.documentElement.lang;
      document.documentElement.dir  = doc.documentElement.dir;
      document.body.setAttribute("data-lang", doc.body.getAttribute("data-lang"));
      document.querySelector("main").innerHTML = doc.querySelector("main").innerHTML;
      document.querySelector("header").innerHTML = doc.querySelector("header").innerHTML;
      document.querySelector("footer").innerHTML = doc.querySelector("footer").innerHTML;
      document.title = doc.title;
      window.scrollTo(0, 0);
      paintArtwork(); observeReveals(); initForm(); wireHeader();
      $$(".rv").forEach(el => el.classList.add("in"));
    } catch(err){ location.href = href; }
  });
}

function wireHeader(){
  const tog = $("#navToggle"), links = $("#navLinks");
  if (tog) tog.onclick = () => links.classList.toggle("open");
  const cb = $("#cartBtn"); if (cb) cb.onclick = openCart;
  renderCart();
}

/* ---------------- init ---------------- */
function init(){
  paintArtwork();
  wireHeader();
  const cc = $("#cartClose"); if (cc) cc.onclick = closeCart;
  const ov = $("#overlay");   if (ov) ov.onclick = closeCart;
  const mb = $("#modalBg");   if (mb) mb.onclick = closeModal;
  const mc = $("#modalClose");if (mc) mc.onclick = closeModal;

  document.addEventListener("keydown", e => { if (e.key === "Escape"){ closeModal(); closeCart(); } });
  document.addEventListener("click", e => {
    const chip = e.target.closest("[data-cat].chip");
    if (chip){ filterShop(chip.getAttribute("data-cat")); return; }
    const rm = e.target.closest("[data-rm]");
    if (rm){ removeFromCart(rm.getAttribute("data-rm")); return; }
    const prod = e.target.closest(".prod[data-id]");
    if (prod){ openProduct(prod.getAttribute("data-id")); return; }
  });

  window.addEventListener("scroll", () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const bar = $("#progress");
    if (bar) bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
    document.querySelector("header").classList.toggle("solid", h.scrollTop > 40);
  }, { passive: true });

  initForm();
  observeReveals();
  initFrameFallback();
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
else init();

})();
