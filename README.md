# shoura.co

موقع شوره جورج — 26 صفحة ثابتة، عربي وإنجليزي، مبنية من مصدر واحد.

## الهيكل

```
src/
  template.html        المصدر ثنائي اللغة لكل الأقسام (data-en / data-ar)
  studio.html          استوديو المحتوى — واجهة إضافة المنتجات والمقالات
  assets/
    content.js      ★  المنتجات والمقالات — ده الملف اللي بيتغيّر باستمرار
    app.css            كل التصميم
    app.js             السلة والفلاتر والأنيميشن
    img/ covers/       الصور والأغلفة
build.py               المولّد: src → dist (26 صفحة + sitemap + robots + llms)
audit.py               الفحص: روابط، صور، عناوين، إمكانية وصول، SEO
dist/                  الناتج (مولّد — متتعدّلش يدوي، ومتترفعش على git)
```

## البناء محليًا

```bash
pip install -r requirements.txt
node -e "const fs=require('fs');const c=fs.readFileSync('src/assets/content.js','utf8');
         fs.writeFileSync('src/content.json',JSON.stringify(new Function(c+';return {PRODUCTS,SHOP_CATS,POSTS};')(),null,1))"
python3 build.py     # يولّد dist/
python3 audit.py     # لازم يطلع ERRORS: 0
```

## النشر

كل push على `main` بيشغّل `.github/workflows/deploy.yml`:
يبني → يفحص → لو الفحص نضيف ينشر على Cloudflare Pages.

مطلوب مرة واحدة في Settings → Secrets and variables → Actions:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

## تعديل المحتوى

افتح `https://shoura.co/studio.html` → عدّل → **تصدير content.js** →
حطّ الملف مكان `src/assets/content.js` واعمل commit. الباقي أوتوماتيك.

## قواعد لازم تتحافظ عليها

- **`id` و `slug` ما بيتغيروش بعد النشر** — تغييرهم بيكسر اللينكات وترتيب جوجل.
- **كل محتوى لازم يكون باللغتين.** الموقع ثنائي اللغة بـ `hreflang` متبادل؛ صفحة ناقصة بلغة بتكسر الربط.
- **`dist/` مولّد.** أي تعديل فيه بيضيع مع أول بناء. عدّل `src/`.
- **`audit.py` لازم يطلع صفر أخطاء** قبل أي نشر — الـworkflow بيوقف لو لقى خطأ.
- **الأسعار في `content.js`** بالجنيه المصري. `0` يعني «السعر عند الطلب».

## روابط السوشيال

في `build.py` فيه `SOCIAL` — قائمة الحسابات. املا اللي عندك وسيب الباقي `""`.
اللي مليان بس بيظهر في الفوتر وفي بيانات `sameAs` المنظمة، فمفيش لينك ميت أبدًا.
