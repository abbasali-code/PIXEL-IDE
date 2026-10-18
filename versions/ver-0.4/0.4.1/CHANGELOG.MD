# Changelog — PIXEL IDE

---

## 🇬🇧 English

### v0.4.1 — Stability & Indent Rainbow

**Added**
- **Tab persistence** — tabs and their content are saved in `localStorage` (key: `pixel-ide-tabs-v1`) and restored on reload
- **Rainbow indent guides** — colored indent borders between indentation columns, inspired by the VS Code *Indent-Rainbow* extension
- Custom dictionary words are now highlighted in syntax with a dedicated color (`.tok-custom`)

**Changed**
- Autocomplete popup now positions correctly relative to `code-col` instead of the scroll container
- `Ctrl+Space` now shows all items of the current language even when no prefix is typed
- Snippet cursor now lands in the middle of the inserted body (or at a `\u200b` placeholder if present) instead of at the end
- Header wraps gracefully on mobile (`flex-wrap`) and hides the version badge under 600px

**Fixed**
- Autocomplete popup offset after scrolling
- Line/column indicator in the statusbar now updates with `↑` and `↓`
- Autocomplete popup stays open after switching tabs
- Logo no longer breaks the layout when `assets/icons/logo.svg` is missing
- Indent guides no longer overlap code (rewritten using inline `span` elements with `border-left`)

---

## 🇮🇷 فارسی

### نسخه ۰.۴.۱ — پایداری و تورفتگی رنگی

**اضافه شده**
- **ذخیره‌ی تب‌ها** — تب‌ها و محتواشون در `localStorage` (کلید: `pixel-ide-tabs-v1`) ذخیره و بعد از رفرش بازیابی می‌شن
- **تورفتگی رنگی (Rainbow Indent)** — مرزهای رنگی بین ستون‌های تورفتگی، الهام‌گرفته از افزونه‌ی *Indent-Rainbow* وی‌اس‌کد
- کلمات دیکشنری شخصی حالا در سینتکس با یک رنگ اختصاصی (`.tok-custom`) هایلایت می‌شن

**تغییر یافته**
- پاپ‌آپ اتوکامپلیت حالا موقعیتش رو نسبت به `code-col` محاسبه می‌کنه، نه نسبت به کانتینر اسکرول
- `Ctrl+Space` حالا حتی بدون تایپ حرف، همه‌ی آیتم‌های زبان فعلی رو نشون می‌ده
- نشانگر اسنیپت حالا وسط بدنه‌ی درج‌شده می‌شینه (یا اگر `\u200b` وجود داشته باشه، اونجا)، نه ته اون
- هدر در موبایل به‌صورت خودکار می‌شکنه (`flex-wrap`) و بج نسخه زیر ۶۰۰px مخفی می‌شه

**رفع شده**
- جابه‌جایی نادرست پاپ‌آپ اتوکامپلیت بعد از اسکرول
- شماره خط و ستون در statusbar حالا با `↑` و `↓` هم آپدیت می‌شه
- پاپ‌آپ اتوکامپلیت بعد از عوض کردن تب باز نمی‌مونه
- لوگو در صورت نبودن `assets/icons/logo.svg` دیگر چیدمان رو نمی‌شکنه
- راهنماهای تورفتگی دیگر روی کد نمی‌ریزن (با `span` inline و `border-left` بازنویسی شد)

---

## 🇸🇦 العربية

### الإصدار 0.4.1 — الاستقرار و تورفتگی رنگی

**أضيف**
- **حفظ التبويبات** — يتم حفظ التبويبات ومحتواها في `localStorage` (المفتاح: `pixel-ide-tabs-v1`) واستعادتها عند إعادة التحميل
- **مسارات التوريد الملونة (Rainbow Indent)** — حدود ملوّنة بين أعمدة التوريد، مستوحاة من إضافة *Indent-Rainbow* في VS Code
- كلمات القاموس المخصص أصبحت الآن مُبرزة في الصياغة بلون مخصص (`.tok-custom`)

**تم التغيير**
- نافذة الإكمال التلقائي الآن تُحدد موقعها بالنسبة إلى `code-col` بدلاً من حاوية التمرير
- `Ctrl+Space` الآن يُظهر جميع عناصر اللغة الحالية حتى بدون كتابة أي حرف
- مؤشر المقتطف يستقر الآن في منتصف الجسم المُدرج (أو عند `\u200b` إن وُجد) بدلاً من نهايته
- رأس الصفحة يلتف بشكل سلس على الجوال (`flex-wrap`) وتُخفى شارة الإصدار تحت 600px

**تم الإصلاح**
- إزاحة نافذة الإكمال التلقائي بعد التمرير
- مؤشر السطر/العمود في شريط الحالة يتحدث الآن مع `↑` و `↓`
- نافذة الإكمال التلقائي لا تبقى مفتوحة بعد تبديل التبويبات
- الشعار لم يعد يكسر التخطيط عند غياب `assets/icons/logo.svg`
- مسارات التوريد لم تعد تتداخل مع الكود (أُعيدت كتابتها باستخدام عناصر `span` سطرية مع `border-left`)