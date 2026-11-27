#!/usr/bin/env python3
"""Static audit of the built site in ./dist — links, images, headings, SEO, a11y."""
import os, re, json, sys
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse

DIST = "dist"
SITE = "https://shoura.co"
issues = []

def add(sev, page, msg):
    issues.append((sev, page, msg))

pages = []
for dp, _, fs in os.walk(DIST):
    for f in fs:
        if f.endswith(".html"):
            rel = os.path.relpath(os.path.join(dp, f), DIST).replace(os.sep, "/")
            # internal editors: noindex, behind a sign-in, not site pages
            if rel == "studio.html" or rel.startswith("admin/"):
                continue
            pages.append(rel)
pages.sort()

all_files = set()
for dp, _, fs in os.walk(DIST):
    for f in fs:
        all_files.add(os.path.relpath(os.path.join(dp, f), DIST).replace(os.sep, "/"))

canon_map, alt_map, titles, descs = {}, {}, {}, {}

for p in pages:
    soup = BeautifulSoup(open(os.path.join(DIST, p), encoding="utf-8").read(), "html.parser")
    base_dir = os.path.dirname(p)

    # ---- head basics
    t = soup.find("title")
    title = t.get_text() if t else ""
    titles[p] = title
    if not title:
        add("ERR", p, "no <title>")
    elif len(title) > 70:
        add("WARN", p, f"title {len(title)} chars (>70 gets truncated in Google)")
    d = soup.find("meta", attrs={"name": "description"})
    desc = d.get("content", "") if d else ""
    descs[p] = desc
    if not desc:
        add("ERR", p, "no meta description")
    elif not (70 <= len(desc) <= 165):
        add("WARN", p, f"description {len(desc)} chars (aim 70-165)")

    c = soup.find("link", attrs={"rel": "canonical"})
    if not c:
        add("ERR", p, "no canonical")
    else:
        canon_map[p] = c["href"]

    alts = soup.find_all("link", attrs={"rel": "alternate"})
    hl = {a.get("hreflang"): a.get("href") for a in alts}
    if "x-default" not in hl:
        add("WARN", p, "no x-default hreflang")
    for lang in ("en", "ar"):
        if lang not in hl:
            add("ERR", p, f"missing hreflang {lang}")
    alt_map[p] = hl

    html = soup.find("html")
    lang_attr = html.get("lang")
    dir_attr = html.get("dir")
    expected = "ar" if p.startswith("ar/") else "en"
    if lang_attr != expected:
        add("ERR", p, f"html lang={lang_attr}, expected {expected}")
    if expected == "ar" and dir_attr != "rtl":
        add("ERR", p, f"html dir={dir_attr}, expected rtl")

    # ---- JSON-LD
    for s in soup.find_all("script", attrs={"type": "application/ld+json"}):
        try:
            obj = json.loads(s.string)
        except Exception as e:
            add("ERR", p, f"invalid JSON-LD: {e}")
            continue
        if "@context" not in obj:
            add("ERR", p, "JSON-LD without @context")
        if "@type" not in obj:
            add("ERR", p, "JSON-LD without @type")

    # ---- headings
    h1s = soup.find_all("h1")
    if len(h1s) == 0:
        add("ERR", p, "no h1")
    elif len(h1s) > 1:
        add("ERR", p, f"{len(h1s)} h1 elements")
    levels = [int(h.name[1]) for h in soup.find_all(re.compile("^h[1-6]$"))]
    prev = 0
    for i, lv in enumerate(levels):
        if prev and lv > prev + 1:
            add("WARN", p, f"heading jump h{prev}->h{lv}")
            break
        prev = lv

    # ---- images
    for img in soup.find_all("img"):
        src = img.get("src", "")
        if not src:
            add("ERR", p, "img without src"); continue
        if src.startswith("http"):
            add("WARN", p, f"remote image {src}"); continue
        if src.startswith("/"):
            target = os.path.normpath(src.lstrip("/")).replace(os.sep, "/")
        else:
            target = os.path.normpath(os.path.join(base_dir, src)).replace(os.sep, "/")
        if target not in all_files:
            add("ERR", p, f"missing image: {src} -> {target}")
        if img.get("alt") is None:
            add("ERR", p, f"img without alt: {src}")
        if not (img.get("width") and img.get("height")):
            add("WARN", p, f"img without width/height (causes layout shift): {src}")

    # ---- links
    for a in soup.find_all("a"):
        href = a.get("href", "")
        if not href:
            add("ERR", p, "anchor without href"); continue
        if href.startswith(("http", "mailto:", "tel:", "#")):
            if href.startswith("http") and a.get("target") == "_blank" and "noopener" not in (a.get("rel") or []):
                add("WARN", p, f"target=_blank without rel=noopener: {href}")
            continue
        # A root-absolute href resolves from the site root, not the page's folder.
        # 404.html needs these: it is served at whatever path was mistyped, so a
        # relative link on it would point somewhere different every time.
        if href.startswith("/"):
            target = os.path.normpath(href.lstrip("/")).replace(os.sep, "/")
        else:
            target = os.path.normpath(os.path.join(base_dir, href)).replace(os.sep, "/")
        if target not in all_files:
            add("ERR", p, f"broken link: {href} -> {target}")
        if not a.get_text(strip=True) and not a.find("img") and not a.find("svg"):
            add("ERR", p, f"empty link text: {href}")

    # ---- a11y: form labels, buttons
    for inp in soup.find_all(["input", "select", "textarea"]):
        iid = inp.get("id")
        lab = soup.find("label", attrs={"for": iid}) if iid else None
        if not lab and not inp.get("aria-label") and not inp.get("aria-labelledby"):
            add("ERR", p, f"form field without associated label: #{iid or inp.name}")
    for b in soup.find_all("button"):
        if not b.get_text(strip=True) and not b.get("aria-label"):
            add("ERR", p, "button without text or aria-label")

    # ---- duplicate ids
    ids = [e["id"] for e in soup.find_all(attrs={"id": True})]
    dupes = {i for i in ids if ids.count(i) > 1}
    if dupes:
        add("ERR", p, f"duplicate ids: {sorted(dupes)}")

    # ---- lang leakage: latin-only text on ar pages in key spots
    if p.startswith("ar/"):
        for sel in ["h1", "h2"]:
            for h in soup.find_all(sel):
                txt = h.get_text(strip=True)
                if txt and not re.search(r"[؀-ۿ]", txt) and len(txt) > 14:
                    add("WARN", p, f"{sel} on Arabic page has no Arabic: {txt[:50]}")

# ---- hreflang reciprocity
def url_to_path(u):
    pth = urlparse(u).path.lstrip("/")
    return pth if pth else "index.html"

for p, hl in alt_map.items():
    other = hl.get("ar" if not p.startswith("ar/") else "en")
    if not other:
        continue
    op = url_to_path(other)
    if op.endswith("/"):
        op += "index.html"
    if op not in alt_map:
        add("ERR", p, f"hreflang points to non-existent page: {other} -> {op}")
    else:
        back = alt_map[op].get("en" if op.startswith("ar/") else "ar")
        if back and url_to_path(back) not in (p, p.replace("index.html", "")):
            bp = url_to_path(back)
            if bp.endswith("/"): bp += "index.html"
            if bp != p:
                add("ERR", p, f"hreflang not reciprocal: {p} -> {op} -> {bp}")

# ---- canonical uniqueness
seen = {}
for p, c in canon_map.items():
    if c in seen:
        add("ERR", p, f"canonical duplicated with {seen[c]}: {c}")
    seen[c] = p

# ---- duplicate titles / descriptions
for store, label in ((titles, "title"), (descs, "description")):
    rev = {}
    for p, v in store.items():
        rev.setdefault(v, []).append(p)
    for v, ps in rev.items():
        if len(ps) > 1 and v:
            add("ERR", ", ".join(ps), f"duplicate {label}: {v[:60]}")

# ---- sitemap vs files
sm = open(os.path.join(DIST, "sitemap.xml"), encoding="utf-8").read()
locs = re.findall(r"<loc>(.*?)</loc>", sm)
for loc in locs:
    pth = url_to_path(loc)
    if pth.endswith("/"): pth += "index.html"
    if pth not in all_files:
        add("ERR", "sitemap.xml", f"lists non-existent page: {loc}")
sm_set = {url_to_path(l) if not url_to_path(l).endswith("/") else url_to_path(l)+"index.html" for l in locs}
NOT_IN_SITEMAP = {"404.html"}   # noindex by design
for p in pages:
    if p in NOT_IN_SITEMAP:
        continue
    if p not in sm_set:
        add("ERR", "sitemap.xml", f"page missing from sitemap: {p}")

# ---- page weight
for p in pages:
    size = os.path.getsize(os.path.join(DIST, p))
    if size > 120_000:
        add("WARN", p, f"page HTML {size//1024} KB")
total_assets = sum(os.path.getsize(os.path.join(DIST, f)) for f in all_files if f.startswith("assets/"))

# ---- report
errs = [i for i in issues if i[0] == "ERR"]
warns = [i for i in issues if i[0] == "WARN"]
print(f"pages: {len(pages)}   assets: {total_assets//1024} KB")
print(f"ERRORS: {len(errs)}   WARNINGS: {len(warns)}\n")
from collections import Counter
def show(group, n=400):
    agg = Counter()
    for sev, page, msg in group:
        key = re.sub(r"[:\-] .*$", "", msg)[:70]
        agg[key] += 1
    for k, v in agg.most_common():
        print(f"  [{v:>3}] {k}")
    print()
print("ERRORS by kind:");  show(errs)
print("WARNINGS by kind:"); show(warns)
print("--- first 40 errors in detail ---")
for sev, page, msg in errs[:40]:
    print(f"  {page}: {msg}")
