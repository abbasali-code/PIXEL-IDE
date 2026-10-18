# Changelog — PIXEL IDE v0.4.0

---

## 🇬🇧 English

### v0.4.0 — Upgrade Dictionary Release

**Added**
- ⚙️ **Upgrade Dictionary** — a new graphical modal to manually extend the autocomplete dictionary per language
- 8 entry kinds supported: `keyword`, `builtin`, `method`, `tag`, `attr`, `property`, `value`, and `snippet`
- Snippet support with custom insert body (multi-line code blocks)
- Persistent storage via `localStorage` (key: `pixel-ide-custom-dict-v1`)
- Custom entries list per language with delete button
- Toast notifications for add / remove / duplicate actions
- Enter-to-submit in the command field
- Custom dictionary has the highest priority in autocomplete suggestions

**Changed**
- Version bumped to `v0.4.0` in title, topbar badge, and statusbar
- Autocomplete now merges three sources: custom dictionary → language keywords → user-typed words
- Plain text mode now shows only user words + custom entries (no keywords)
- `acceptSuggestion()` respects `insert` body when defined (snippet support)

**Fixed**
- None (initial dictionary release)

---

## 🇮🇷 فارسی

### نسخه ۰.۴.۰ — انتشار Upgrade Dictionary

**اضافه شده**
- ⚙️ **Upgrade Dictionary** — یک مودال گرافیکی جدید برای افزودن دستی به دیکشنری اتوکامپلیت هر زبان
- پشتیبانی از ۸ نوع آیتم: `keyword`، `builtin`، `method`، `tag`، `attr`، `property`، `value` و `snippet`
- پشتیبانی از snippet با بدنه‌ی سفارشی (بلوک‌های کد چندخطی)
- ذخیره‌سازی ماندگار در `localStorage` (کلید: `pixel-ide-custom-dict-v1`)
- لیست دستورهای سفارشی هر زبان با دکمه‌ی حذف
- نوتیفیکیشن Toast برای افزودن / حذف / تکراری بودن
- ارسال با Enter در فیلد دستور
- دیکشنری سفارشی بالاترین اولویت را در پیشنهادهای اتوکامپلیت دارد

**تغییر یافته**
- نسخه به `v0.4.0` در عنوان، بج topbar و statusbar ارتقا یافت
- اتوکامپلیت حالا سه منبع را ادغام می‌کند: دیکشنری سفارشی ← کلمات کلیدی زبان ← کلمات تایپ‌شده توسط کاربر
- حالت Plain text حالا فقط کلمات کاربر + آیتم‌های سفارشی را نشان می‌دهد (بدون کلمات کلیدی)
- `acceptSuggestion()` حالا بدنه‌ی `insert` را در صورت وجود درج می‌کند (پشتیبانی از snippet)

**رفع شده**
- موردی نبوده (انتشار اولیه‌ی دیکشنری)

---

## 🇸🇦 العربية

### الإصدار 0.4.0 — إصدار Upgrade Dictionary

**أضيف**
- ⚙️ **Upgrade Dictionary** — نافذة رسومية جديدة لإضافة إدخالات يدوية إلى قاموس الإكمال التلقائي لكل لغة
- دعم 8 أنواع من الإدخالات: `keyword` و `builtin` و `method` و `tag` و `attr` و `property` و `value` و `snippet`
- دعم المقتطفات (snippet) مع جسم مخصص (كتل أكواد متعددة الأسطر)
- تخزين دائم في `localStorage` (المفتاح: `pixel-ide-custom-dict-v1`)
- قائمة الإدخالات المخصصة لكل لغة مع زر حذف
- إشعارات Toast للإضافة / الحذف / التكرار
- الإرسال بمفتاح Enter في حقل الأمر
- القاموس المخصص له الأولوية القصوى في اقتراحات الإكمال التلقائي

**تم التغيير**
- تمت ترقية الإصدار إلى `v0.4.0` في العنوان وشارة الشريط العلوي وشريط الحالة
- الإكمال التلقائي الآن يدمج ثلاثة مصادر: القاموس المخصص ← الكلمات المفتاحية للغة ← الكلمات المكتوبة من قبل المستخدم
- وضع النص العادي الآن يعرض فقط كلمات المستخدم + الإدخالات المخصصة (بدون كلمات مفتاحية)
- `acceptSuggestion()` الآن يحترم جسم `insert` عند تحديده (دعم المقتطفات)

**تم الإصلاح**
- لا شيء (الإصدار الأولي للقاموس)