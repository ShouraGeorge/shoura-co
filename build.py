#!/usr/bin/env python3
"""
shoura.co static site builder
Reads src/template.html (the bilingual single-page source) and src/content.json,
and emits a real multi-page site: one HTML file per section and per article,
in English (root) and Arabic (/ar/), each with its own <head>, canonical,
hreflang alternates, Open Graph tags and JSON-LD.

    python3 build.py            -> writes ./dist
"""
import json, os, re, shutil, datetime, hashlib
from bs4 import BeautifulSoup

SRC   = "src/template.html"
DIST  = "dist"
# The canonical host. shoura.co itself does not answer: the apex is served by
# Namecheap's URL-redirect box, which has no certificate, so https://shoura.co
# fails outright. Pointing canonicals, hreflang, the sitemap and the structured
# data at a host that does not load would tell Google to index nothing. Move the
# nameservers to Cloudflare and the apex can serve the site directly; then this
# goes back to https://shoura.co and one deploy carries the change everywhere.
SITE  = "https://www.shoura.co"
TODAY = datetime.date.today().isoformat()

CONTACT  = "info@shoura.co"
PHONE    = "+201210103290"
LINKEDIN = "https://www.linkedin.com/in/shoura-george"

# --------------------------------------------------------------------------
# SOCIAL PROFILES
# Fill in the handles you actually use and leave the rest as "".
# Only the filled ones are rendered in the footer and in the JSON-LD sameAs,
# so an empty value is simply skipped — never a dead link.
# --------------------------------------------------------------------------
SOCIAL = [
    # key          url                                              label EN      label AR
    ("linkedin",   LINKEDIN,                                        "LinkedIn",   "لينكدإن"),
    ("whatsapp",   "https://wa.me/201210103290",                    "WhatsApp",   "واتساب"),
    ("facebook",   "",                                              "Facebook",   "فيسبوك"),
    ("instagram",  "",                                              "Instagram",  "إنستجرام"),
    ("x",          "",                                              "X",          "إكس"),
    ("youtube",    "",                                              "YouTube",    "يوتيوب"),
    ("tiktok",     "",                                              "TikTok",     "تيك توك"),
    ("behance",    "",                                              "Behance",    "بيهانس"),
]
ACTIVE_SOCIAL = [x for x in SOCIAL if x[1]]

SOCIAL_ICONS = {
 "linkedin":'<path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM2.5 21h5V9h-5v12zM10 21h5v-6.5c0-1.6.3-3.2 2.3-3.2 2 0 2 1.9 2 3.3V21h5v-7.3c0-4.3-.9-7-5-7-2 0-3.3 1.1-3.9 2.1h-.1V9H10v12z"/>',
 "whatsapp":'<path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.1-1.3A10 10 0 1 0 12 2zm5.2 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.7-.1a12 12 0 0 1-5.6-4.9c-.4-.7-.9-1.6-.9-2.5 0-1 .5-1.5.7-1.7.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2 0 .4-.1.5l-.3.4c-.1.2-.3.3-.1.6.2.3.7 1.2 1.6 2 1 .9 1.9 1.2 2.2 1.3.3.1.4.1.6-.1l.8-1c.2-.2.4-.2.6-.1l2 .9c.2.1.4.2.4.3.1.2.1.6 0 1z"/>',
 "facebook":'<path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z"/>',
 "instagram":'<path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4 1.3-.1 1.7-.1 4.8-.1zm0 3.2a6.6 6.6 0 1 0 0 13.2 6.6 6.6 0 0 0 0-13.2zm0 10.9a4.3 4.3 0 1 1 0-8.6 4.3 4.3 0 0 1 0 8.6zm8.4-11.2a1.5 1.5 0 1 1-3.1 0 1.5 1.5 0 0 1 3.1 0z"/>',
 "x":'<path d="M18.2 2h3.3l-7.2 8.3L22.7 22h-6.6l-5.2-6.8L4.9 22H1.6l7.7-8.8L1.3 2H8l4.7 6.2L18.2 2zm-1.2 18h1.8L7.1 3.9H5.2L17 20z"/>',
 "youtube":'<path d="M23 7.5s-.2-1.6-.9-2.3c-.9-.9-1.8-.9-2.3-1C17 4 12 4 12 4s-5 0-7.8.2c-.4 0-1.4 0-2.3 1-.7.7-.9 2.3-.9 2.3S.8 9.4.8 11.3v1.4c0 1.9.2 3.8.2 3.8s.2 1.6.9 2.3c.9.9 2 .9 2.5 1 1.8.2 7.6.2 7.6.2s5 0 7.8-.2c.5-.1 1.4-.1 2.3-1 .7-.7.9-2.3.9-2.3s.2-1.9.2-3.8v-1.4c0-1.9-.2-3.8-.2-3.8zM9.7 15.1V8.8l6.4 3.2-6.4 3.1z"/>',
 "tiktok":'<path d="M16.6 2h-3.1v13.1a2.7 2.7 0 1 1-2.7-2.7c.3 0 .5 0 .8.1V9.3a6 6 0 0 0-.8-.1A5.8 5.8 0 1 0 16.6 15V8.6a7 7 0 0 0 4.1 1.3V6.8a4.1 4.1 0 0 1-4.1-4.1V2z"/>',
 "behance":'<path d="M7.8 4.5c.8 0 1.5.1 2.1.2.6.1 1.1.4 1.6.6.4.3.8.7 1 1.2.2.5.4 1.1.4 1.8 0 .8-.2 1.5-.6 2-.3.5-.9 1-1.6 1.3 1 .3 1.7.8 2.2 1.4.5.7.7 1.5.7 2.4 0 .8-.1 1.4-.4 2-.3.5-.7 1-1.2 1.3-.5.4-1.1.6-1.8.8-.6.1-1.3.2-2 .2H1V4.5h6.8zM7.4 10.3c.6 0 1.1-.1 1.5-.4.4-.3.6-.8.6-1.4 0-.4-.1-.7-.2-.9-.1-.3-.3-.4-.5-.6-.2-.1-.5-.2-.8-.3H4.1v3.6h3.3zm.2 6.2c.4 0 .7 0 1-.1.3-.1.6-.2.8-.4.2-.2.4-.4.5-.7.1-.3.2-.6.2-1 0-.8-.2-1.3-.7-1.7-.4-.3-1-.5-1.8-.5H4.1v4.4h3.5zM17.7 16.4c.4.4 1 .6 1.8.6.6 0 1.1-.1 1.5-.4.4-.3.7-.6.8-.9h2.3c-.4 1.1-.9 2-1.7 2.5-.8.5-1.7.8-2.8.8-.8 0-1.5-.1-2.1-.4-.6-.2-1.1-.6-1.6-1-.4-.5-.7-1-1-1.6-.2-.6-.3-1.3-.3-2.1 0-.7.1-1.4.3-2 .2-.6.6-1.2 1-1.6.4-.5 1-.8 1.6-1.1.6-.3 1.3-.4 2-.4.8 0 1.6.2 2.2.5.6.3 1.1.8 1.5 1.3.4.6.7 1.2.8 1.9.2.7.2 1.4.2 2.2H17c0 .8.3 1.4.7 1.7zm3.1-4.7c-.3-.4-.9-.6-1.5-.6-.5 0-.9.1-1.2.2-.3.2-.5.4-.7.6-.2.2-.3.5-.3.7 0 .3-.1.5-.1.6h4.6c-.1-.7-.3-1.2-.8-1.5zM16.3 5.9h5.8v1.4h-5.8V5.9z"/>',
}

PAGES = [
    ("home",     "index.html"),
    ("about",    "about.html"),
    ("services", "services.html"),
    ("nfc",      "nfc-solutions.html"),
    ("work",     "work.html"),
    ("insights", "insights.html"),
    ("shop",     "marketplace.html"),
    ("contact",  "contact.html"),
]

META = {
 "home": {
   "en": ("Shoura George — Business Development, Connected to Real Execution",
          "Business development, market research, branding, digital systems and project leadership for companies in Egypt and the Gulf. Strategy that gets delivered."),
   "ar": ("شوره جورج — تطوير أعمال موصول بتنفيذ حقيقي",
          "تطوير أعمال وأبحاث سوق وعلامات تجارية وأنظمة رقمية وقيادة مشروعات وحلول NFC للشركات في مصر والخليج. استراتيجية تصل إلى التنفيذ.")},
 "about": {
   "en": ("About Shoura George — Business Development Professional in Cairo",
          "Business development professional in Cairo. Background across food science, advertising, operations, hospitality, tourism and consulting. Track record from 2016."),
   "ar": ("نبذة عن شوره جورج — متخصص تطوير أعمال في القاهرة",
          "متخصص تطوير أعمال بخلفية تمتد من علوم الأغذية والإعلان والتشغيل والضيافة والسياحة إلى الاستشارات الإدارية. المسار المهني من 2016 حتى الآن.")},
 "services": {
   "en": ("Services — Business Development, Research and Project Leadership",
          "Six connected tracks: business development, market research and feasibility, branding, digital systems and ERP, project leadership, proposals and tenders."),
   "ar": ("الخدمات — تطوير أعمال وأبحاث وعلامات وقيادة مشروعات",
          "ستة مسارات مترابطة: تطوير الأعمال والنمو، أبحاث السوق ودراسات الجدوى، العلامة والتسويق، الأنظمة الرقمية وERP، قيادة المشروعات، العروض والمناقصات.")},
 "nfc": {
   "en": ("NFC Solutions — Smart Business Cards and Google Review Tools in Egypt",
          "Smart NFC business cards, Google review cards and stands, and digital menu tags for restaurants, clinics and sales teams in Egypt. Tap to share, tap to review."),
   "ar": ("حلول NFC — بطاقات عمل ذكية وأدوات تقييم جوجل في مصر",
          "بطاقات عمل ذكية بتقنية NFC، ولوحات وستاندات تقييم جوجل، ولوحات قوائم طعام رقمية للمطاعم والعيادات وفرق المبيعات في مصر.")},
 "work": {
   "en": ("Selected Work — Projects and Ventures | Shoura George",
          "Eight projects with the role stated honestly: BLI brand and website work, Health Global, Egyptian Pharaonic Cave, Tareek Limousine, Blue Burger and more."),
   "ar": ("أعمال مختارة — مشاريع وعلامات ومشروعات | شوره جورج",
          "ثمانية مشاريع بتوضيح الدور بصدق: تحديث هوية وموقع BLI، وHealth Global، والكهف الفرعوني المصري، وطريق ليموزين، وBlue Burger وغيرها.")},
 "insights": {
   "en": ("Insights — Notes on Proposals, Pricing, Feasibility and Brand",
          "Practical notes on winning technical proposals, food costing, feasibility studies, brand modernization and NFC tools — written from real projects."),
   "ar": ("مقالات — ملاحظات عن العروض والتسعير والجدوى والعلامة",
          "مقالات عملية عن كسب العروض الفنية، وتكلفة الطعام وتسعير القوائم، ودراسات الجدوى، وتحديث العلامات، وأدوات NFC — مكتوبة من مشاريع حقيقية.")},
 "shop": {
   "en": ("Marketplace — Order NFC Cards, Review Tools and Digital Menus",
          "Smart business cards in PVC and metal, Google review cards and stands, digital menu tags, NFC stickers and team packs. Order straight through WhatsApp."),
   "ar": ("المتجر — اطلب بطاقات NFC وأدوات تقييم وقوائم رقمية",
          "بطاقات عمل ذكية PVC ومعدنية، ولوحات وستاندات تقييم جوجل، ولوحات قوائم رقمية، وملصقات NFC، وباقات الفرق. اطلب مباشرة عبر واتساب.")},
 "contact": {
   "en": ("Contact Shoura George — Business Development, Cairo, Egypt",
          "Describe what your business is working on. A short call, then a written scope with costs before anything starts. Email, WhatsApp or the form."),
   "ar": ("تواصل مع شوره جورج — تطوير أعمال، القاهرة، مصر",
          "اوصف ما يعمل عليه نشاطك. مكالمة قصيرة، ثم نطاق عمل مكتوب بالتكلفة قبل أن يبدأ أي شيء. بالبريد أو واتساب أو عبر النموذج.")},
}

NAV = [
    ("home",     "index.html",          "Home",          "الرئيسية"),
    ("about",    "about.html",          "About",         "نبذة"),
    ("services", "services.html",       "Services",      "الخدمات"),
    ("nfc",      "nfc-solutions.html",  "NFC Solutions", "حلول NFC"),
    ("work",     "work.html",           "Selected Work", "الأعمال"),
    ("insights", "insights.html",       "Insights",      "مقالات"),
    ("shop",     "marketplace.html",    "Marketplace",   "المتجر"),
    ("contact",  "contact.html",        "Contact",       "تواصل"),
]
NAV_PATH = {k: p for k, p, _, _ in NAV}


def esc(s):
    return (str(s).replace("&", "&amp;").replace("<", "&lt;")
            .replace(">", "&gt;").replace('"', "&quot;"))

def strip_tags(s):
    return re.sub(r"<[^>]+>", "", s)

def rel(base, path):
    return base + path

def write(path, text):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    open(path, "w", encoding="utf-8").write(text)

def resolve(node, lang):
    key = "data-ar" if lang == "ar" else "data-en"
    for el in node.select("[data-en]"):
        val = el.get(key)
        if val is None:
            continue
        frag = BeautifulSoup(val, "html.parser")
        el.clear()
        for child in list(frag.contents):
            el.append(child)
        for a in ("data-en", "data-ar"):
            el.attrs.pop(a, None)
    for el in node.select("[data-ph-en]"):
        el["placeholder"] = el.get("data-ph-ar" if lang == "ar" else "data-ph-en", "")
    return node

HASH_MAP = {
    "#home": "index.html", "#about": "about.html", "#services": "services.html",
    "#nfc": "nfc-solutions.html", "#work": "work.html", "#insights": "insights.html",
    "#shop": "marketplace.html", "#contact": "contact.html", "#top": "index.html",
}

def rewrite_links(node, lroot, aroot):
    """Turn the single-page #hash links into real page paths."""
    for a in node.select("a[href]"):
        h = a["href"]
        if not h.startswith("#"):
            continue
        if h.startswith("#post-"):
            a["href"] = lroot + "insights/" + h[len("#post-"):] + ".html"
        elif h in HASH_MAP:
            a["href"] = lroot + HASH_MAP[h]
    if aroot:
        for el in node.select("[src]"):
            v = el["src"]
            if v.startswith("assets/"):
                el["src"] = aroot + v
    return node

def fmt_date(iso, lang):
    d = datetime.date.fromisoformat(iso)
    if lang == "ar":
        months = ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو",
                  "أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"]
        return f"{d.day} {months[d.month-1]} {d.year}"
    return d.strftime("%d %b %Y")

def other_lang_href(lang, aroot, key, slug=None):
    target = f"insights/{slug}.html" if slug else NAV_PATH.get(key, "index.html")
    return aroot + ("" if lang == "ar" else "ar/") + target

def post_card(p, lang, lroot, aroot, feat=False):
    t = p[lang]
    return f'''<a class="post rv{' feat' if feat else ''}" href="{lroot}insights/{p['slug']}.html">
  <div class="post-img"><img src="{aroot}{p['img']}" alt="" loading="lazy" width="800" height="500"></div>
  <div class="post-body">
    <div class="post-meta"><span>{esc(p["topic"][lang])}</span>
      <span class="d">{fmt_date(p["date"], lang)} · {p["read"]} {"د" if lang=="ar" else "min"}</span></div>
    <h3>{esc(t["title"])}</h3>
    <p>{esc(t["excerpt"])}</p>
    <span class="more">{"اقرأ المقال" if lang=="ar" else "Read the article"}
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" width="13" height="13"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
  </div></a>'''

def posts_grid(posts, lang, lroot, aroot, feature_first):
    return "".join(post_card(p, lang, lroot, aroot, feature_first and i == 0)
                   for i, p in enumerate(posts))

def cats_bar(cats, lang):
    return "".join(
        f'<button class="chip{" on" if c["id"]=="all" else ""}" data-cat="{c["id"]}">{esc(c[lang])}</button>'
        for c in cats)

def money_static(v, lang):
    if not v:
        return "السعر عند الطلب" if lang == "ar" else "Price on request"
    return f"{v:,} <small>{'ج.م' if lang=='ar' else 'EGP'}</small>"

def prods_grid(prods, lang):
    out = []
    for p in prods:
        t = p[lang]
        out.append(f'''<article class="prod rv" data-id="{p["id"]}" data-cat="{p["cat"]}">
  <div class="prod-vis" data-art="{p["id"]}"></div>
  <div class="prod-body">
    <span class="prod-tag">{esc(t["tag"])}</span>
    <h3>{esc(t["name"])}</h3>
    <p>{esc(t["desc"][:118])}…</p>
    <div class="prod-foot">
      <span class="price">{money_static(p["price"], lang)}</span>
      <span class="btn btn-outline btn-sm">{"التفاصيل" if lang=="ar" else "Details"}</span>
    </div>
  </div></article>''')
    return "".join(out)

def article_body(body):
    out = []
    for b in body:
        if isinstance(b, str):
            out.append(f"<p>{esc(b)}</p>")
        elif "h" in b:
            out.append(f"<h2>{esc(b['h'])}</h2>")
        elif "list" in b:
            out.append("<ul>" + "".join(f"<li>{esc(i)}</li>" for i in b["list"]) + "</ul>")
    return "\n".join(out)

def breadcrumb(key, lang, canon, title=None):
    root = SITE + ("/ar/" if lang == "ar" else "/")
    items = [{"@type": "ListItem", "position": 1,
              "name": "الرئيسية" if lang == "ar" else "Home", "item": root}]
    if key == "post":
        items.append({"@type": "ListItem", "position": 2,
                      "name": "مقالات" if lang == "ar" else "Insights",
                      "item": root + "insights.html"})
        items.append({"@type": "ListItem", "position": 3, "name": title, "item": canon})
    elif key != "home":
        label = {k: (ar if lang == "ar" else en) for k, p, en, ar in NAV}.get(key, key)
        items.append({"@type": "ListItem", "position": 2, "name": label, "item": canon})
    return {"@context": "https://schema.org", "@type": "BreadcrumbList",
            "itemListElement": items}


def main():
    data = json.load(open("src/content.json", encoding="utf-8"))
    POSTS, PRODUCTS, CATS = data["POSTS"], data["PRODUCTS"], data["SHOP_CATS"]
    src = BeautifulSoup(open(SRC, encoding="utf-8").read(), "html.parser")

    if os.path.exists(DIST):
        shutil.rmtree(DIST)
    os.makedirs(DIST)
    shutil.copytree("src/assets", os.path.join(DIST, "assets"))

    # Content-hash the three assets that change under a fixed name. Without this
    # a returning visitor keeps whatever app.css their browser cached — the
    # Cache-Control fix only helps responses served after it, and anyone who
    # visited earlier is pinned for a year. A new filename sidesteps all of it.
    ASSETS = {}
    for name in ("app.css", "app.js", "content.js"):
        path = os.path.join(DIST, "assets", name)
        with open(path, "rb") as fh:
            digest = hashlib.sha256(fh.read()).hexdigest()[:10]
        stem, ext = os.path.splitext(name)
        hashed = f"{stem}.{digest}{ext}"
        os.rename(path, os.path.join(DIST, "assets", hashed))
        ASSETS[name] = hashed
    print("  assets: " + ", ".join(ASSETS.values()))
    if os.path.exists("src/studio.html"):
        studio = open("src/studio.html", encoding="utf-8").read()
        studio = studio.replace("assets/content.js", "assets/" + ASSETS["content.js"])
        with open(os.path.join(DIST, "studio.html"), "w", encoding="utf-8") as fh:
            fh.write(studio)
    urls = []

    person = {
        "@context": "https://schema.org", "@type": "Person",
        "@id": SITE + "/#person", "name": "Shoura George",
        "alternateName": "شوره جورج",
        "url": SITE, "email": CONTACT, "telephone": PHONE,
        "image": SITE + "/assets/img/ph-about.jpg",
        "jobTitle": "Business Development & Project Manager",
        "sameAs": [u for _, u, _, _ in ACTIVE_SOCIAL if "wa.me" not in u],
        "address": {"@type": "PostalAddress", "addressLocality": "Cairo", "addressCountry": "EG"},
        "knowsLanguage": ["ar", "en"],
        "knowsAbout": ["Business Development", "Market Research", "Feasibility Studies",
                       "Tenders and Proposals", "Brand Development", "Project Management",
                       "NFC Solutions", "ERP Selection"],
    }
    biz = {
        "@context": "https://schema.org", "@type": "ProfessionalService",
        "@id": SITE + "/#business", "name": "Shoura George — Business Development",
        "url": SITE, "email": CONTACT, "telephone": PHONE,
        "image": SITE + "/assets/img/og-cover.png",
        "address": {"@type": "PostalAddress", "addressLocality": "Cairo", "addressCountry": "EG"},
        "areaServed": [{"@type": "Country", "name": "Egypt"},
                       {"@type": "Country", "name": "United Arab Emirates"},
                       {"@type": "Country", "name": "Saudi Arabia"}],
        "founder": {"@id": SITE + "/#person"},
        "sameAs": [u for _, u, _, _ in ACTIVE_SOCIAL if "wa.me" not in u],
        "hasOfferCatalog": {
            "@type": "OfferCatalog", "name": "Services",
            "itemListElement": [
                {"@type": "Offer", "itemOffered": {"@type": "Service", "name": n}}
                for n in ["Business Development & Growth", "Market Research & Feasibility",
                          "Branding & Marketing Development", "Digital Solutions & Business Systems",
                          "Project Leadership & Execution", "Proposals, Tenders & Business Launch",
                          "NFC Solutions"]]},
    }

    def shell(lang, lroot, aroot, title, desc, canon, alt_abs, alt_local, body,
              jsonld=None, og_type="website", page_key=""):
        rtl = lang == "ar"
        CSS_FILE, APP_FILE, CONTENT_FILE = (
            ASSETS["app.css"], ASSETS["app.js"], ASSETS["content.js"])
        nav = "".join(
            '<a href="{}"{}>{}</a>'.format(
                lroot + p, ' class="on"' if k == page_key else "",
                esc(ar if rtl else en))
            for k, p, en, ar in NAV)
        ld = "\n".join(
            f'<script type="application/ld+json">{json.dumps(j, ensure_ascii=False)}</script>'
            for j in (jsonld or []))
        return f'''<!DOCTYPE html>
<html lang="{lang}" dir="{"rtl" if rtl else "ltr"}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="{canon}">
<link rel="alternate" hreflang="{lang}" href="{canon}">
<link rel="alternate" hreflang="{'en' if rtl else 'ar'}" href="{alt_abs}">
<link rel="alternate" hreflang="x-default" href="{alt_abs if rtl else canon}">
<meta name="author" content="Shoura George">
<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1">
<meta property="og:site_name" content="Shoura George">
<meta property="og:locale" content="{'ar_EG' if rtl else 'en_US'}">
<meta property="og:type" content="{og_type}">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{canon}">
<meta property="og:image" content="{SITE}/assets/img/og-cover.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{title}">
<meta name="twitter:description" content="{desc}">
<meta name="twitter:image" content="{SITE}/assets/img/og-cover.png">
<meta name="theme-color" content="#0E2A29">
<link rel="icon" href="{aroot}assets/img/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="{aroot}assets/img/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Inter:wght@300;400;500;600&family=Montserrat:wght@200;300;400&family=IBM+Plex+Sans+Arabic:wght@300;400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{aroot}assets/{CSS_FILE}">
{ld}
</head>
<body data-lang="{lang}" data-root="{aroot}">
<div id="progress"></div>
<header>
<div class="wrap nav">
  <a class="brand" href="{lroot}index.html" aria-label="SHOURA"><span class="wm">SHOURA</span><span class="wm-rule" aria-hidden="true"></span></a>
  <nav class="nav-links" id="navLinks">{nav}</nav>
  <div class="nav-tools">
    <a class="lang" href="{alt_local}" hreflang="{'en' if rtl else 'ar'}">{'EN' if rtl else 'عربي'}</a>
    <button class="cart-btn" id="cartBtn" aria-label="{'السلة' if rtl else 'Basket'}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18M16 10a4 4 0 0 1-8 0"/></svg>
      <span class="cart-count zero" id="cartCount">0</span>
    </button>
    <a class="btn btn-brass btn-sm" href="{lroot}contact.html">{'ابدأ محادثة' if rtl else 'Start a conversation'}</a>
  </div>
  <button class="nav-toggle" id="navToggle" aria-label="{'القائمة' if rtl else 'Menu'}">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
  </button>
</div>
</header>
<main>{body}</main>
{footer(lang, lroot, aroot)}
{drawer_modal(lang)}
<script src="{aroot}assets/{CONTENT_FILE}"></script>
<script src="{aroot}assets/{APP_FILE}"></script>
</body>
</html>'''

    def footer(lang, lroot, aroot):
        rtl = lang == "ar"
        links = "".join(
            f'<li><a href="{lroot}{p}">{esc(ar if rtl else en)}</a></li>'
            for k, p, en, ar in NAV if k != "contact")
        return f'''<footer>
<div class="wrap">
  <div class="foot-grid">
    <div>
      <img src="{aroot}assets/img/wordmark.png" alt="Shoura George" width="140" height="26">
      <p style="color:rgba(244,241,233,.6);font-size:.88rem;max-width:34ch">{'تطوير أعمال واستراتيجية وتنفيذ — بشبكة متخصصين خلف العمل.' if rtl else 'Business development, strategy and execution — with a specialist network behind the work.'}</p>
    </div>
    <div><p class="foot-h">{'تصفح' if rtl else 'Navigate'}</p><ul>{links}</ul></div>
    <div><p class="foot-h">{'تواصل' if rtl else 'Contact'}</p><ul>
      <li><a href="mailto:{CONTACT}">{CONTACT}</a></li>
      <li><a href="https://wa.me/{PHONE.lstrip('+')}">{'+20 12 1010 3290' if not rtl else '+20 12 1010 3290'}</a></li>
    </ul>
    <div class="social">{social_row(lang)}</div></div>
  </div>
  <div class="foot-bot">
    <span>© 2026 {'شوره جورج' if rtl else 'Shoura George'} · shoura.co</span>
    <span>{'القاهرة، مصر' if rtl else 'Cairo, Egypt'}</span>
  </div>
</div>
</footer>'''

    def social_row(lang):
        rtl = lang == "ar"
        out = []
        for key, url, en, ar in ACTIVE_SOCIAL:
            icon = SOCIAL_ICONS.get(key, "")
            label = ar if rtl else en
            out.append(f'<a href="{url}" target="_blank" rel="noopener" aria-label="{label}" title="{label}">'
                       f'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">{icon}</svg></a>')
        return "".join(out)

    def drawer_modal(lang):
        rtl = lang == "ar"
        return f'''<div class="overlay" id="overlay"></div>
<aside class="drawer" id="drawer" aria-label="{'السلة' if rtl else 'Basket'}">
  <div class="drawer-head"><p class="drawer-title">{'سلتك' if rtl else 'Your basket'}</p>
    <button id="cartClose" aria-label="{'إغلاق' if rtl else 'Close'}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" width="20" height="20"><path d="M18 6 6 18M6 6l12 12"/></svg></button></div>
  <div class="drawer-items" id="cartItems"></div>
  <div class="drawer-foot">
    <div class="drawer-total"><span>{'الإجمالي' if rtl else 'Total'}</span><span class="price" id="cartTotal">0</span></div>
    <p class="drawer-note">{'إرسال السلة يفتح واتساب وطلبك جاهز. لا يُخصم أي مبلغ هنا — التصميم والتسليم والدفع تُؤكَّد في المحادثة.' if rtl else 'Sending the basket opens WhatsApp with your order ready. Nothing is charged here — design, delivery and payment are confirmed in the conversation.'}</p>
    <a class="btn btn-dark" id="checkout" href="https://wa.me/{PHONE.lstrip('+')}" target="_blank" rel="noopener" style="width:100%;justify-content:center">{'إرسال الطلب على واتساب' if rtl else 'Send order on WhatsApp'}</a>
  </div>
</aside>
<div class="modal" id="modal" role="dialog" aria-modal="true">
  <div class="modal-bg" id="modalBg"></div>
  <div class="modal-box">
    <button class="modal-close" id="modalClose" aria-label="{'إغلاق' if rtl else 'Close'}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" width="18" height="18"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
    <div class="modal-vis" id="modalVis"></div>
    <div class="modal-body" id="modalBody"></div>
  </div>
</div>'''

    # ------------------------------------------------ section pages
    for key, out in PAGES:
        view = src.find(id="v-" + key)
        for lang in ("en", "ar"):
            lroot, aroot = "", ("" if lang == "en" else "../")
            node = resolve(BeautifulSoup(str(view), "html.parser"), lang)
            node = rewrite_links(node, lroot, aroot)
            inner = node.find(id="v-" + key)
            body = "".join(str(c) for c in inner.contents)

            prefix = "" if lang == "en" else "ar/"
            tail   = "" if out == "index.html" else out
            canon  = f"{SITE}/{prefix}{tail}"
            alt_abs = f"{SITE}/{'' if lang == 'ar' else 'ar/'}{tail}"
            alt_local = other_lang_href(lang, aroot, key)
            title, desc = META[key][lang]

            if key == "insights":
                body = body.replace('<div class="posts" id="postGrid"></div>',
                    ('<h2 class="sr-only">%s</h2>' % ("المقالات" if lang == "ar" else "Articles"))
                    + '<div class="posts" id="postGrid">' + posts_grid(POSTS, lang, lroot, aroot, True) + '</div>')
            if key == "services":
                body = body.replace('<div class="svc rv">',
                    ('<h2 class="sr-only">%s</h2>' % ("المسارات الستة" if lang == "ar" else "The six tracks"))
                    + '<div class="svc rv">', 1)
            if key == "work":
                body = body.replace('<div class="work rv">',
                    ('<h2 class="sr-only">%s</h2>' % ("المشاريع" if lang == "ar" else "Projects"))
                    + '<div class="work rv">', 1)
            if key == "home":
                body = body.replace('<div class="posts rv" id="homePosts"></div>',
                    '<div class="posts rv" id="homePosts">' + posts_grid(POSTS[:3], lang, lroot, aroot, False) + '</div>')
            if key == "shop":
                body = body.replace('<div class="shop-bar" id="shopBar"></div>',
                    '<div class="shop-bar" id="shopBar">' + cats_bar(CATS, lang) + '</div>')
                body = body.replace('<div class="prods" id="shopGrid"></div>',
                    ('<h2 class="sr-only">%s</h2>' % ("المنتجات" if lang == "ar" else "Products"))
                    + '<div class="prods" id="shopGrid">' + prods_grid(PRODUCTS, lang) + '</div>')

            ld = [person, biz] if key == "home" else []
            if key == "shop":
                ld = [{"@context": "https://schema.org", "@type": "ItemList",
                       "itemListElement": [
                           {"@type": "ListItem", "position": i + 1,
                            "item": {"@type": "Product", "name": p[lang]["name"],
                                     "description": p[lang]["desc"][:300],
                                     "brand": {"@type": "Brand", "name": "Shoura George"},
                                     "offers": {"@type": "Offer", "price": p["price"],
                                                "priceCurrency": "EGP",
                                                "availability": "https://schema.org/InStock",
                                                "url": canon}}}
                           for i, p in enumerate(PRODUCTS)]}]
            if key == "contact":
                ld = [{"@context": "https://schema.org", "@type": "ContactPage",
                       "url": canon, "mainEntity": {"@id": SITE + "/#person"}}]
            ld.append(breadcrumb(key, lang, canon))

            write(os.path.join(DIST, prefix, out),
                  shell(lang, lroot, aroot, esc(strip_tags(title)), esc(strip_tags(desc)),
                        canon, alt_abs, alt_local, body, jsonld=ld, page_key=key))
            urls.append((canon, "weekly" if key in ("home", "insights", "shop") else "monthly",
                         "1.0" if key == "home" else "0.8"))

    # ------------------------------------------------ article pages
    for p in POSTS:
        for lang in ("en", "ar"):
            lroot, aroot = "../", ("../" if lang == "en" else "../../")
            prefix = "" if lang == "en" else "ar/"
            canon  = f"{SITE}/{prefix}insights/{p['slug']}.html"
            alt_abs = f"{SITE}/{'' if lang == 'ar' else 'ar/'}insights/{p['slug']}.html"
            alt_local = other_lang_href(lang, aroot, "insights", p["slug"])
            t = p[lang]
            others = [o for o in POSTS if o["slug"] != p["slug"]][:2]
            ld = [{
                "@context": "https://schema.org", "@type": "Article",
                "headline": t["title"][:110], "description": t["excerpt"],
                "inLanguage": lang, "datePublished": p["date"], "dateModified": p["date"],
                "author": {"@id": SITE + "/#person"},
                "publisher": {"@id": SITE + "/#business"},
                "image": f"{SITE}/{p['img']}", "url": canon,
                "mainEntityOfPage": {"@type": "WebPage", "@id": canon},
                "articleSection": p["topic"][lang],
                "timeRequired": f"PT{p['read']}M",
            }, breadcrumb("post", lang, canon, t["title"])]

            body = f'''
<div class="art-hero">
  <div class="narrow">
    <div class="post-meta"><span>{esc(p["topic"][lang])}</span>
      <span class="d">{fmt_date(p["date"], lang)} · {p["read"]} {"د" if lang=="ar" else "min"}</span></div>
    <h1>{esc(t["title"])}</h1>
    <p class="lede">{esc(t["excerpt"])}</p>
  </div>
</div>
<div class="article"><div class="narrow art-body">
{article_body(t["body"])}
  <div class="art-foot">
    <a class="btn btn-outline" href="{lroot}insights.html">{"كل المقالات" if lang=="ar" else "All articles"}</a>
    <a class="btn btn-dark" href="{lroot}contact.html">{"ناقش مشروعك" if lang=="ar" else "Discuss your project"}</a>
  </div>
  <div style="margin-top:56px">
    <span class="eyebrow">{"اقرأ أيضًا" if lang=="ar" else "Read next"}</span>
    <div class="posts" style="grid-template-columns:repeat(2,1fr);margin-top:8px">
      {"".join(post_card(o, lang, lroot, aroot) for o in others)}
    </div>
  </div>
</div></div>'''
            write(os.path.join(DIST, prefix, "insights", p["slug"] + ".html"),
                  shell(lang, lroot, aroot,
                        esc(t["title"] + (" — شوره جورج" if lang == "ar" else " — Shoura George")),
                        esc(t["excerpt"]),
                        canon, alt_abs, alt_local, body, jsonld=ld,
                        og_type="article", page_key="insights"))
            urls.append((canon, "yearly", "0.7"))

    # ------------------------------------------------ sitemap / robots / llms
    sm = ['<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for u, freq, pri in urls:
        sm.append(f"  <url><loc>{u}</loc><lastmod>{TODAY}</lastmod>"
                  f"<changefreq>{freq}</changefreq><priority>{pri}</priority></url>")
    sm.append("</urlset>")
    write(os.path.join(DIST, "sitemap.xml"), "\n".join(sm))

    write(os.path.join(DIST, "robots.txt"),
          "User-agent: *\nAllow: /\nDisallow: /studio.html\n\n"
          "# AI answer engines are welcome to read and cite this site\n"
          "User-agent: GPTBot\nAllow: /\n"
          "User-agent: ClaudeBot\nAllow: /\n"
          "User-agent: PerplexityBot\nAllow: /\n"
          "User-agent: Google-Extended\nAllow: /\n\n"
          f"Sitemap: {SITE}/sitemap.xml\n")

    write(os.path.join(DIST, "llms.txt"), llms_txt(POSTS, PRODUCTS))
    # Every asset under /assets/ is now safe to pin: the stylesheet and the
    # scripts carry a content hash in their filename, so a change produces a
    # new name rather than a stale cache, and images never change under a
    # given name. Pages themselves are not pinned — they must pick up the new
    # asset names on the next visit.
    write(os.path.join(DIST, "_headers"),
          "/assets/*\n  Cache-Control: public, max-age=31536000, immutable\n"
          "/*\n  Cache-Control: public, max-age=0, must-revalidate\n"
          "  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n")
    print(f"built {len(urls)} pages -> {DIST}/")


def llms_txt(posts, products):
    lines = [
        "# Shoura George — shoura.co", "",
        "> Business development professional based in Cairo, Egypt, working across Egypt,",
        "> the Gulf and beyond. Helps companies identify opportunities, work through",
        "> practical challenges, and turn plans into coordinated projects — executing some",
        "> work directly and leading specialist partners for the rest.", "",
        f"Contact: {CONTACT} · WhatsApp {PHONE} · {LINKEDIN}",
        f"Languages: English and Arabic. Every page exists in both ({SITE}/ and {SITE}/ar/).",
        "", "## What he does",
        "- Business development and growth: opportunity identification, market positioning,",
        "  pricing and commercial model review, partnership development.",
        "- Market research and feasibility studies.",
        "- Branding and marketing development: brand strategy, logo and visual identity,",
        "  print, campaign assets, product visualization.",
        "- Digital solutions and business systems: website planning and coordination,",
        "  ERP selection, workflow automation.",
        "- Project leadership and execution: scoping, partner sourcing, delivery follow-up.",
        "- Proposals and tenders: tender and TOR analysis, technical offers, methodology,",
        "  financial offers and pricing models, expert selection.",
        "- NFC solutions: smart business cards, Google review cards and stands,",
        "  digital menu tags, NFC stickers, team packs.",
        "", "## Experience",
        "- 2025-present: BLI Group — Business Development & Project Manager (Egypt).",
        "- 2025-present: IMC — Business & Brand Development Consultant (Abu Dhabi, UAE).",
        "- 2024-2025: Egyptian Pharaonic Cave — Growth & Business Development Consultant.",
        "- 2020-2024: Tareek Limousine — Founder & Operations Manager.",
        "- 2019-2024: NewCraft — Business Development & Operations Coordinator.",
        "- 2014-2019: Ain Shams University — BSc Food Science & Technology.",
        "", "## Articles"]
    for p in posts:
        lines.append(f"- [{p['en']['title']}]({SITE}/insights/{p['slug']}.html): {p['en']['excerpt']}")
    lines += ["", "## Products (NFC)"]
    for p in products:
        lines.append(f"- {p['en']['name']} — {p['en']['tag']}. {p['en']['desc'][:140]}")
    lines += ["", "## Notes for citation",
              "Project descriptions on this site state the role honestly: executed directly,",
              "led and coordinated, or delivered with specialist partners. Client names and",
              "commercial details are published only with permission, so some projects are",
              "described by sector rather than by client name.", ""]
    return "\n".join(lines)


if __name__ == "__main__":
    main()
