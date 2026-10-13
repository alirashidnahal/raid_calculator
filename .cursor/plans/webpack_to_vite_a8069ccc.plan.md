---
name: Webpack to Vite
overview: "پروژه از webpack به Vite منتقل می‌شود: بوت‌استرپ، فونت و استایل از node_modules باندل می‌شوند، assets/vendor و تنظیمات webpack حذف می‌شوند، و خروجی قابل انتشار همان dist است."
todos:
  - id: vite-setup
    content: حذف تنظیمات webpack، افزودن vite.config.js و به‌روزرسانی package.json و وابستگی‌ها
    status: completed
  - id: wire-entry
    content: وصل کردن index.html و assets/main.js به ورودی Vite و حذف import وندور از style.css
    status: completed
  - id: static-and-vendor
    content: انتقال فایل‌های استاتیک ریشه به public و حذف assets/vendor
    status: completed
  - id: release-workflow
    content: انتشار خروجی dist در ورک‌فلو رلیز گیت‌هاب
    status: completed
  - id: verify
    content: بیلد و رفتار ماشین‌حساب و accordion را در مرورگر بررسی کردن
    status: completed
isProject: false
---

# مهاجرت کامل از Webpack به Vite

وضعیت فعلی: [`webpack.common.js`](webpack.common.js) ورودی `./js/app.js` را می‌خواهد که وجود ندارد. صفحه واقعی [`index.html`](index.html) است و بوت‌استرپ و وزیرمتن را از [`assets/vendor`](assets/vendor) لود می‌کند. اسکریپت‌های `start` و `build` در [`package.json`](package.json) فقط webpack را صدا می‌زنند. رلیز در [`.github/workflows/release.yml`](.github/workflows/release.yml) سورس خام را زیپ می‌کند، نه خروجی بیلد.

بعد از مهاجرت، توسعه با `npm run dev` است و سایت منتشرشده همان خروجی `npm run build` در `dist/` است.

```mermaid
flowchart LR
  indexHtml[index.html] --> mainJs[assets/main.js]
  mainJs --> bootstrap[bootstrap from node_modules]
  mainJs --> vazir[vazirmatn from node_modules]
  mainJs --> style[assets/style.css]
  publicDir[public static files] --> distOut[dist]
  mainJs --> distOut
  indexHtml --> distOut
```

## تنظیم Vite

- فایل‌های [`webpack.common.js`](webpack.common.js)، [`webpack.config.dev.js`](webpack.config.dev.js) و [`webpack.config.prod.js`](webpack.config.prod.js) حذف می‌شوند.
- [`vite.config.js`](vite.config.js) اضافه می‌شود با `base: './'` تا دارایی‌ها در زیپ رلیز و زیرپوشه XAMPP (مثل `htdocs/raid_calculator/dist`) با مسیر نسبی کار کنند. `outDir` همان `dist` می‌ماند که از قبل در [`.gitignore`](.gitignore) است.
- در [`package.json`](package.json): وابستگی‌های `webpack`، `webpack-cli`، `webpack-merge`، `html-webpack-plugin` و `copy-webpack-plugin` حذف می‌شوند و `vite` به‌عنوان devDependency نصب می‌شود. `bootstrap` و `vazirmatn` می‌مانند. اسکریپت‌ها:

```json
"dev": "vite",
"start": "vite",
"build": "vite build",
"preview": "vite preview"
```

## ورودی اپ

در [`index.html`](index.html):

- لینک CSS بوت‌استرپ، لینک `assets/style.css` و دو تگ `<script>` انتهای body حذف می‌شوند.
- یک ورودی ماژول اضافه می‌شود: `<script type="module" src="/assets/main.js"></script>`.
- آیکون‌ها و manifest با `%BASE_URL%` نوشته می‌شوند تا با `base: './'` در بیلد نسبی بمانند.

در ابتدای [`assets/main.js`](assets/main.js)، قبل از منطق فعلی ماشین‌حساب:

```js
import 'vazirmatn/Vazirmatn-font-face.css';
import 'bootstrap/dist/css/bootstrap.rtl.min.css';
import 'bootstrap';
import './style.css';
```

`import 'bootstrap'` پلاگین‌های data-api (از جمله accordion) را فعال می‌کند. منطق محاسبه RAID دست نمی‌خورد.

در [`assets/style.css`](assets/style.css) خط `@import "vendor/vazirmatn/Vazirmatn-font-face.css"` حذف می‌شود، چون فونت از پکیج npm می‌آید. تصاویر `assets/img/*.png` سر جایشان می‌مانند؛ Vite آدرس‌شان را در HTML بازنویسی می‌کند.

## فایل‌های استاتیک و حذف vendor

این فایل‌ها از ریشه به [`public/`](public) منتقل می‌شوند تا بدون هش، عیناً داخل `dist` کپی شوند (manifest به `icon.png` اشاره دارد و نباید هش شود):

- `favicon.ico`، `icon.png`، `icon.svg`، `robots.txt`، `site.webmanifest`

پوشه [`assets/vendor`](assets/vendor) (کپی کامیت‌شده bootstrap، Popper و Vazirmatn) حذف می‌شود. Popper به‌صورت وابستگی transitive بوت‌استرپ از npm می‌آید.

## رلیز گیت‌هاب

در [`.github/workflows/release.yml`](.github/workflows/release.yml) بعد از checkout، Node نصب می‌شود و `npm ci` و `npm run build` اجرا می‌شود. زیپ رلیز از محتویات `dist` ساخته می‌شود و `LICENSE` هم داخل همان زیپ کپی می‌شود. کپی دستی `assets/` و فایل‌های ریشه حذف می‌شود.

## بررسی

- `npm run build` باید بدون خطا `dist/index.html` بسازد و داخلش ارجاعی به `assets/vendor` نباشد.
- `npm run dev` در مرورگر: وارد کردن تعداد دیسک و سایز، انتخاب RAID، به‌روز شدن فضای قابل استفاده و نوار پیشرفت، و باز شدن accordion.