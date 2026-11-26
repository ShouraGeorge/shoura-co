/* =======================================================================
   shoura.co — content file
   صُدِّر من استوديو المحتوى في 2026-11-26 09:21
   المنتجات والمقالات. عدّل من الاستوديو، مش من هنا، عشان ما يحصلش أخطاء.
   ======================================================================= */

const PRODUCTS = [
  {
    "id": "card-classic",
    "cat": "cards",
    "price": 379,
    "en": {
      "name": "Smart Business Card — Classic",
      "tag": "PVC · printed both sides",
      "desc": "A printed PVC card with an NFC chip inside. Tap it on any modern phone and your full profile opens — name, title, phone, WhatsApp, email, website, social links and a save-to-contacts button. No app needed on either side.",
      "specs": [
        "NFC chip + QR code backup",
        "Full-colour print, both sides",
        "Digital profile page included",
        "Update your details any time — the card never changes",
        "Delivery 3–5 working days"
      ]
    },
    "ar": {
      "name": "بطاقة عمل ذكية — كلاسيك",
      "tag": "PVC · طباعة وجهين",
      "desc": "بطاقة PVC مطبوعة بشريحة NFC بداخلها. قرّبها من أي هاتف حديث فيُفتح ملفك الكامل — الاسم والمسمى والهاتف وواتساب والبريد والموقع وحساباتك، وزر لحفظ بياناتك في جهات الاتصال مباشرة. بلا تطبيق على الطرفين.",
      "specs": [
        "شريحة NFC + رمز QR احتياطي",
        "طباعة ألوان كاملة على الوجهين",
        "صفحة ملف رقمي مشمولة",
        "تُحدّث بياناتك في أي وقت والبطاقة لا تتغيّر",
        "التسليم من 3 إلى 5 أيام عمل"
      ]
    }
  },
  {
    "id": "card-metal",
    "cat": "cards",
    "price": 1200,
    "en": {
      "name": "Smart Business Card — Metal",
      "tag": "Brushed steel · laser engraved",
      "desc": "The same technology in brushed stainless steel with a laser-engraved logo. It is heavier than a normal card, and that weight is the point — it gets handled, kept and remembered. Built for founders, directors and anyone whose card needs to outlast the meeting.",
      "specs": [
        "Brushed stainless steel body",
        "Laser-engraved logo and name",
        "NFC chip + QR code backup",
        "Digital profile page included",
        "Delivery 7–10 working days"
      ]
    },
    "ar": {
      "name": "بطاقة عمل ذكية — معدنية",
      "tag": "ستانلس مصنفر · حفر ليزر",
      "desc": "التقنية نفسها في ستانلس ستيل مصنفر بشعار محفور بالليزر. أثقل من البطاقة العادية، وهذا الثقل هو المقصود — تُمسَك وتُحفَظ وتُتذكَّر. مصمّمة للمؤسسين والمديرين ولكل من يحتاج بطاقته أن تبقى بعد الاجتماع.",
      "specs": [
        "جسم ستانلس ستيل مصنفر",
        "حفر ليزر للشعار والاسم",
        "شريحة NFC + رمز QR احتياطي",
        "صفحة ملف رقمي مشمولة",
        "التسليم من 7 إلى 10 أيام عمل"
      ]
    }
  },
  {
    "id": "review-card",
    "cat": "reviews",
    "price": 350,
    "en": {
      "name": "Google Review Card",
      "tag": "For restaurants, clinics and retail",
      "desc": "A tap takes the customer straight to your Google review page, already open, already pointed at the star rating. The gap between a happy customer and a written review is usually just friction — this removes it.",
      "specs": [
        "Opens your Google review form directly",
        "NFC + QR on the same card",
        "Your logo and wording",
        "Works on any modern phone",
        "Sold individually or in packs of 10"
      ]
    },
    "ar": {
      "name": "لوحة تقييمات جوجل",
      "tag": "للمطاعم والعيادات والمحلات",
      "desc": "لمسة واحدة تنقل العميل مباشرة إلى صفحة تقييمك على جوجل، مفتوحة وجاهزة على التقييم بالنجوم. الفارق بين عميل راضٍ وتقييم مكتوب هو غالبًا عقبة صغيرة — وهذه تزيلها.",
      "specs": [
        "يفتح نموذج تقييم جوجل مباشرة",
        "NFC وQR على البطاقة نفسها",
        "شعارك وصياغتك",
        "يعمل على أي هاتف حديث",
        "يُباع فرديًا أو بعبوات 10"
      ]
    }
  },
  {
    "id": "review-stand",
    "cat": "reviews",
    "price": 600,
    "en": {
      "name": "Review Stand — Table Top",
      "tag": "Acrylic stand · counter or table",
      "desc": "The same review technology in a weighted acrylic stand that sits on a counter, a reception desk or a restaurant table. Visible, reachable, and it survives being knocked about all day.",
      "specs": [
        "Weighted acrylic base",
        "NFC + QR panel",
        "Custom printed artwork",
        "Table, counter or reception",
        "Bulk pricing for multiple tables"
      ]
    },
    "ar": {
      "name": "ستاند تقييمات — للطاولة",
      "tag": "أكريليك · للكاونتر أو الطاولة",
      "desc": "تقنية التقييم نفسها في ستاند أكريليك بقاعدة ثقيلة يقف على الكاونتر أو مكتب الاستقبال أو طاولة المطعم. ظاهر وفي المتناول، ويتحمّل الاستخدام طوال اليوم.",
      "specs": [
        "قاعدة أكريليك ثقيلة",
        "لوحة NFC وQR",
        "تصميم مطبوع حسب الطلب",
        "للطاولة أو الكاونتر أو الاستقبال",
        "أسعار خاصة للكميات"
      ]
    }
  },
  {
    "id": "menu-tags",
    "cat": "hospitality",
    "price": 1800,
    "en": {
      "name": "Digital Menu Tags — Set of 10",
      "tag": "For restaurants and cafés",
      "desc": "Ten table tags that open your menu on the customer's phone. Change a price or take a dish off at ten in the morning and every table is updated — no reprinting, no stickers over old prices, no out-of-date menu in circulation.",
      "specs": [
        "10 table tags, NFC + QR",
        "Hosted digital menu page",
        "Update prices and items yourself",
        "Arabic and English menu versions",
        "Covers the cost of one menu reprint"
      ]
    },
    "ar": {
      "name": "لوحات قائمة رقمية — طقم 10",
      "tag": "للمطاعم والكافيهات",
      "desc": "عشر لوحات للطاولات تفتح قائمة الطعام على هاتف العميل. غيّر سعرًا أو احذف صنفًا في العاشرة صباحًا فتتحدث كل الطاولات — بلا إعادة طباعة، وبلا ملصقات فوق الأسعار القديمة، وبلا قائمة قديمة متداولة.",
      "specs": [
        "10 لوحات طاولة بـ NFC وQR",
        "صفحة قائمة طعام رقمية مستضافة",
        "تحدّث الأسعار والأصناف بنفسك",
        "نسختان عربي وإنجليزي",
        "تكلفته تعادل إعادة طباعة قائمة واحدة"
      ]
    }
  },
  {
    "id": "stickers",
    "cat": "cards",
    "price": 500,
    "en": {
      "name": "Smart Contact Stickers — Pack of 5",
      "tag": "Stick on anything",
      "desc": "Thin NFC stickers you can put on the back of a phone, a laptop, a shop window, a delivery bike or a product box. Each one can point somewhere different — your profile, your WhatsApp, a specific product page.",
      "specs": [
        "5 stickers per pack",
        "Adhesive, weather-resistant",
        "Each programmable to its own link",
        "Re-programmable later",
        "Printed or plain"
      ]
    },
    "ar": {
      "name": "ملصقات تواصل ذكية — عبوة 5",
      "tag": "ألصقها على أي شيء",
      "desc": "ملصقات NFC رفيعة تضعها على ظهر هاتف أو حاسوب محمول أو واجهة متجر أو دراجة توصيل أو علبة منتج. كل واحدة يمكن أن توجّه إلى مكان مختلف — ملفك، أو واتسابك، أو صفحة منتج بعينه.",
      "specs": [
        "5 ملصقات في العبوة",
        "لاصقة ومقاومة للظروف الجوية",
        "كل واحدة تُبرمج على رابط مستقل",
        "قابلة لإعادة البرمجة",
        "مطبوعة أو سادة"
      ]
    }
  },
  {
    "id": "profile-page",
    "cat": "digital",
    "price": 900,
    "en": {
      "name": "Digital Profile Page — 1 Year",
      "tag": "Your page behind the card",
      "desc": "The page that opens when someone taps your card: your photo, title, company, every contact method as a button, your links, and a save-to-contacts file. Hosted, maintained and editable by you for a year.",
      "specs": [
        "Custom page design",
        "Save-to-contacts (vCard) button",
        "WhatsApp, call, email and map buttons",
        "Edit your own details any time",
        "One year of hosting included"
      ]
    },
    "ar": {
      "name": "صفحة ملف رقمي — سنة",
      "tag": "الصفحة التي خلف البطاقة",
      "desc": "الصفحة التي تُفتح حين يقرّب أحدهم بطاقتك: صورتك ومسماك وشركتك وكل وسيلة تواصل كزر، وروابطك، وملف لحفظ بياناتك في جهات الاتصال. مستضافة ومصانة ويمكنك تعديلها بنفسك لمدة سنة.",
      "specs": [
        "تصميم صفحة مخصص",
        "زر حفظ في جهات الاتصال (vCard)",
        "أزرار واتساب واتصال وبريد وخريطة",
        "تعديل بياناتك في أي وقت",
        "استضافة سنة مشمولة"
      ]
    }
  },
  {
    "id": "team-pack",
    "cat": "business",
    "price": 5500,
    "en": {
      "name": "Team Pack — 10 Cards",
      "tag": "For sales teams and companies",
      "desc": "Ten smart cards on one consistent company design, each with its own profile page, plus one place to manage all of them. When someone joins or leaves, you update the page — you don't reprint a box of cards.",
      "specs": [
        "10 smart cards, unified design",
        "A profile page per person",
        "Central management for all cards",
        "Company branding throughout",
        "Reassign a card when staff change"
      ]
    },
    "ar": {
      "name": "باقة الفريق — 10 بطاقات",
      "tag": "لفرق المبيعات والشركات",
      "desc": "عشر بطاقات ذكية بتصميم موحّد للشركة، لكل واحدة صفحة ملف خاصة بها، مع مكان واحد لإدارتها جميعًا. وحين ينضم أحد أو يغادر، تعدّل الصفحة — لا تعيد طباعة علبة بطاقات.",
      "specs": [
        "10 بطاقات ذكية بتصميم موحّد",
        "صفحة ملف لكل شخص",
        "إدارة مركزية لكل البطاقات",
        "هوية الشركة في كل العناصر",
        "إعادة تخصيص البطاقة عند تغيير الموظفين"
      ]
    }
  }
];

const SHOP_CATS = [
  {
    "id": "all",
    "en": "All products",
    "ar": "كل المنتجات"
  },
  {
    "id": "cards",
    "en": "Smart cards",
    "ar": "البطاقات الذكية"
  },
  {
    "id": "reviews",
    "en": "Review tools",
    "ar": "أدوات التقييم"
  },
  {
    "id": "hospitality",
    "en": "Hospitality",
    "ar": "الضيافة"
  },
  {
    "id": "digital",
    "en": "Digital",
    "ar": "رقمي"
  },
  {
    "id": "business",
    "en": "For teams",
    "ar": "للفرق"
  }
];

const POSTS = [
  {
    "slug": "winning-tenders",
    "date": "2026-10-12",
    "read": 7,
    "topic": {
      "en": "Proposals & Tenders",
      "ar": "العروض والمناقصات"
    },
    "img": "assets/covers/tenders.svg",
    "en": {
      "title": "What actually decides a technical proposal",
      "excerpt": "Most losing bids are not beaten on price. They are beaten on the three pages the evaluation committee reads most carefully.",
      "body": [
        "I have spent a fair amount of the last two years reading tender documents, writing technical and financial offers, and watching which ones go through. The pattern that surprised me is how rarely price is the deciding factor, and how often a bid loses on something the bidder had full control over.",
        {
          "h": "The evaluation grid is published. Read it as a scoring sheet."
        },
        "Almost every serious tender tells you how it will be scored — technical weight versus financial weight, and the sub-criteria underneath. People skim this and go straight to writing. That is backwards. If methodology carries thirty points and team CVs carry twenty-five, your proposal should visibly spend its energy there, in that order, with headings the evaluator can match to their own sheet without searching.",
        "A committee scoring twelve proposals in a week is not reading for pleasure. Make their job mechanical. If the criterion is called \"Understanding of the assignment\", your section should be called \"Understanding of the assignment\".",
        {
          "h": "Methodology is where bids are actually lost"
        },
        "The weakest section in most proposals is the one describing how the work will be done. It gets filled with generic phases — inception, implementation, reporting — that would fit any project in any sector. The evaluator has read that paragraph forty times.",
        "What scores is specificity that could only have been written about this assignment: the actual constraints in the terms of reference, the sequence you would follow and why, what you would do in the first two weeks, which risks are real for this client and how you would handle them. A methodology that could be copied into another bid unchanged is a methodology that earns the minimum.",
        {
          "h": "Experts are evidence, not decoration"
        },
        "A CV attached without a reason scores nothing. The link between the expert and the assignment has to be made explicitly — this person is proposed for this component because of this specific prior experience. If the terms of reference ask for someone with sector experience and a particular qualification, say plainly where in the CV both of those sit.",
        {
          "h": "The financial offer tells a story too"
        },
        "A price that is far below the others is not read as good value. It is read as a bidder who has misunderstood the scope, and it invites questions you do not want. Build the number from the work — days, rates, travel, production, contingency — so that if you are asked to defend any line, you can. A defensible price beats a low one.",
        {
          "h": "The administrative envelope kills more bids than anything else"
        },
        "Missing registration documents, an unstamped page, a tax certificate that expired last month, a bid bond with the wrong validity period, a signature in the wrong place. Technically excellent proposals get excluded before the technical committee ever sees them.",
        {
          "list": [
            "Build a checklist from the tender's own document list, not from memory",
            "Sort out anything with an expiry date first — those have lead times you do not control",
            "Have someone who did not write the bid check the envelope against the checklist",
            "Submit a day early. The portal will be slow on the deadline, every time"
          ]
        },
        {
          "h": "After the result"
        },
        "Most agencies will give you a debrief if you ask for one professionally. Win or lose, ask. The scoring breakdown tells you more about how to write the next proposal than any amount of guessing — and it costs you one polite email."
      ]
    },
    "ar": {
      "title": "ما الذي يحسم العرض الفني فعليًا",
      "excerpt": "معظم العروض الخاسرة لا تخسر على السعر. تخسر على الصفحات الثلاث التي تقرأها لجنة التقييم بأكبر قدر من الانتباه.",
      "body": [
        "قضيتُ جزءًا كبيرًا من العامين الماضيين في قراءة وثائق المناقصات، وإعداد العروض الفنية والمالية، ومتابعة أيّها يمر. والمفاجئ أن السعر نادرًا ما كان هو الحاسم. الأغلب أن العرض يخسر بسبب شيء كان في يد كاتبه من البداية.",
        {
          "h": "جدول التقييم منشور. اقرأه كورقة درجات."
        },
        "تخبرك كل مناقصة جادة تقريبًا بكيفية تقييمها — وزن الجانب الفني مقابل المالي، والمعايير الفرعية تحتهما. يمرّ الناس على هذا سريعًا ويبدأون الكتابة. وهذا عكس الترتيب الصحيح. إذا كانت المنهجية تحمل ثلاثين درجة والسير الذاتية خمسًا وعشرين، فليكن ثقل عرضك هناك وبهذا الترتيب، وبعناوين يطابقها المقيّم بورقته دون أن يبحث.",
        "اللجنة التي تراجع اثني عشر عرضًا في أسبوع لا تقرأ للمتعة. سهّل عليها حتى لا تحتاج تفكيرًا: إذا كان المعيار اسمه «فهم المهمة»، فليكن قسمك اسمه «فهم المهمة».",
        {
          "h": "المنهجية هي حيث تُخسر العروض فعلًا"
        },
        "أضعف قسم في معظم العروض هو الذي يصف كيفية تنفيذ العمل. يُملأ بمراحل عامة — تمهيد، تنفيذ، تقارير — تصلح لأي مشروع في أي قطاع. وقد قرأ المقيّم تلك الفقرة أربعين مرة.",
        "ما يُحرز درجات هو تحديد لا يمكن كتابته إلا عن هذه المهمة بالذات: القيود الفعلية في الشروط المرجعية، والتسلسل الذي ستتبعه ولماذا، وما ستفعله في أول أسبوعين، وأي المخاطر حقيقية لدى هذا العميل وكيف ستتعامل معها. والمنهجية التي تصلح لعرض آخر كما هي، تستحق أقل الدرجات.",
        {
          "h": "الخبراء دليل، لا زينة"
        },
        "سيرة ذاتية مرفقة بلا تفسير لا تضيف درجة واحدة. يجب إظهار الصلة بين الخبير والمهمة صراحة — هذا الشخص مُقترح لهذا المكوّن بسبب هذه الخبرة السابقة تحديدًا. وإذا طلبت الشروط المرجعية خبرة قطاعية ومؤهلًا بعينه، فقل بوضوح أين يقع كلٌّ منهما في السيرة.",
        {
          "h": "العرض المالي يحكي قصة أيضًا"
        },
        "السعر الأقل بكثير من غيره لا يوحي بقيمة أفضل، بل بأن صاحبه لم يفهم النطاق — ويفتح أسئلة أنت في غنى عنها. ابنِ الرقم من العمل نفسه — أيام وأسعار وتنقلات وإنتاج واحتياطي — بحيث تستطيع الدفاع عن أي بند إذا سُئلت. السعر القابل للدفاع عنه يتفوق على السعر المنخفض.",
        {
          "h": "المظروف الإداري يقتل عروضًا أكثر من أي شيء آخر"
        },
        "مستندات تسجيل ناقصة، صفحة بلا ختم، شهادة ضريبية انتهت الشهر الماضي، خطاب ضمان بمدة سريان خاطئة، توقيع في غير مكانه. عروض ممتازة فنيًا تُستبعد قبل أن تراها اللجنة الفنية أصلًا.",
        {
          "list": [
            "ابنِ قائمة تحقق من قائمة مستندات المناقصة نفسها، لا من الذاكرة",
            "أنهِ أولًا كل ما له تاريخ انتهاء — فمدد استخراجه ليست تحت سيطرتك",
            "اجعل شخصًا لم يكتب العرض يراجع المظروف مقابل القائمة",
            "قدّم قبل الموعد بيوم. البوابة ستكون بطيئة يوم الإغلاق، في كل مرة"
          ]
        },
        {
          "h": "بعد النتيجة"
        },
        "معظم الجهات تمنحك جلسة توضيح إذا طلبتها بمهنية. اطلبها، فزتَ أو خسرت. تفصيل الدرجات يعلّمك عن كتابة العرض التالي أكثر من أي تخمين — وتكلفته رسالة مهذبة واحدة."
      ]
    }
  },
  {
    "slug": "menu-pricing",
    "date": "2026-09-18",
    "read": 6,
    "topic": {
      "en": "Pricing & Costing",
      "ar": "التسعير والتكلفة"
    },
    "img": "assets/covers/pricing.svg",
    "en": {
      "title": "Food costing: the numbers most kitchens never run",
      "excerpt": "A restaurant can be full every night and still lose money. Usually the menu is doing it, one dish at a time.",
      "body": [
        "I came to this from an unusual direction — a food science degree first, restaurant work later. The combination made one thing obvious very quickly: most small restaurants price from the market, not from their own numbers. They look at what the place down the road charges, land somewhere near it, and never check whether that price covers what the dish actually costs them.",
        {
          "h": "Start with the recipe card, not the menu"
        },
        "Every dish needs a written recipe with weights, not descriptions. Not \"cheese\" — eighty grams of cheese. Not \"sauce\" — forty millilitres. Until the quantities are written down, three cooks make the same dish three different ways and none of your costs mean anything.",
        "Then cost each line at your actual delivered price, including waste. If you buy a case of tomatoes and trim fifteen percent of it away, your real cost per usable kilo is higher than the invoice says. Yield is where the quiet losses live.",
        {
          "h": "Food cost percentage is a signal, not a target"
        },
        "Divide the dish cost by its menu price. A number in the high twenties or low thirties is a common comfort zone, but the percentage on its own tells you little. A dish at thirty-eight percent that sells two hundred times a week can contribute more cash than a dish at twenty-two percent that sells nine times.",
        "This is why the useful figure is contribution in money, not percentage: menu price minus dish cost, times how many you actually sell. Rent is paid in pounds, not in percentages.",
        {
          "h": "Sort the menu into four groups"
        },
        "Take every item and place it on two axes — how popular it is, and how much cash it contributes. You get four groups, and each one has a different action:",
        {
          "list": [
            "Popular and profitable: protect these. Do not change the recipe, do not let quality slip, keep them visible on the menu",
            "Popular but thin margin: these are the ones to work on. Re-check portion size, supplier price, or raise the price slightly — popularity gives you room",
            "Profitable but ignored: a placement and description problem more than a food problem. Move it, photograph it, let staff recommend it",
            "Neither popular nor profitable: remove it. It is consuming stock, prep time and menu space"
          ]
        },
        {
          "h": "A price rise is smaller than you think"
        },
        "Owners resist raising prices because they imagine customers watching every item. In practice a five percent rise on a mid-priced dish is a few pounds, and it usually passes unnoticed, while five percent off the top line is very noticeable in the accounts. The risk is concentrated in the two or three signature items people actually remember the price of — leave those alone and move the rest.",
        {
          "h": "Recost every quarter, and whenever a supplier moves"
        },
        "Costing is not a one-time exercise. Supplier prices move, and a menu costed eighteen months ago is describing a restaurant that no longer exists. Put a recurring date in the calendar and treat it as maintenance, not a project."
      ]
    },
    "ar": {
      "title": "تكلفة الطعام: الأرقام التي لا يحسبها معظم المطابخ",
      "excerpt": "قد يمتلئ المطعم كل ليلة ويظل يخسر. وغالبًا ما تكون القائمة هي السبب، طبقًا تلو الآخر.",
      "body": [
        "جئتُ إلى هذا من اتجاه غير معتاد — دراسة علوم أغذية أولًا، ثم العمل مع المطاعم لاحقًا. وقد أوضح هذا المزيج أمرًا بسرعة: معظم المطاعم الصغيرة تسعّر من السوق، لا من أرقامها. تنظر إلى سعر المحل المجاور، وتستقر قريبًا منه، ولا تتحقق أبدًا مما إذا كان ذلك السعر يغطي التكلفة الفعلية للطبق.",
        {
          "h": "ابدأ من بطاقة الوصفة، لا من قائمة الطعام"
        },
        "كل طبق يحتاج وصفة مكتوبة بالأوزان، لا بالأوصاف. ليس «جبنة» — بل ثمانون جرامًا من الجبنة. وليس «صوص» — بل أربعون مليلترًا. وقبل أن تُكتب الكميات، يخرج الطبق من ثلاثة طهاة بثلاث صور مختلفة، وعندها لا يعني حساب التكلفة شيئًا.",
        "ثم احسب تكلفة كل بند بسعر التوريد الفعلي، شاملًا الهالك. إذا اشتريت صندوق طماطم وتخلصت من خمسة عشر بالمئة منه، فتكلفتك الحقيقية للكيلو الصالح أعلى مما تقوله الفاتورة. في نسبة الصالح تختبئ الخسائر الصامتة.",
        {
          "h": "نسبة تكلفة الطعام مؤشر، لا هدف"
        },
        "اقسم تكلفة الطبق على سعره في القائمة. الرقم في أواخر العشرينات أو أوائل الثلاثينات منطقة مريحة شائعة، لكن النسبة وحدها لا تقول الكثير. طبق بنسبة ثمانية وثلاثين بالمئة يُباع مئتي مرة أسبوعيًا قد يساهم بنقد أكثر من طبق بنسبة اثنين وعشرين يُباع تسع مرات.",
        "لهذا فالرقم المفيد هو المساهمة بالجنيه، لا بالنسبة: سعر القائمة ناقص تكلفة الطبق، مضروبًا في عدد ما تبيعه فعلًا. فالإيجار يُدفع بالجنيه، لا بالنسب المئوية.",
        {
          "h": "صنّف القائمة إلى أربع مجموعات"
        },
        "خذ كل صنف وضعه على محورين — مدى رواجه، ومقدار ما يساهم به من نقد. ستحصل على أربع مجموعات، ولكل منها إجراء مختلف:",
        {
          "list": [
            "رائج ومربح: احمِ هذه. لا تغيّر الوصفة، ولا تدع الجودة تنزل، وأبقها ظاهرة في القائمة",
            "رائج وهامشه ضعيف: هذه هي التي تُعالَج. راجع حجم الحصة أو سعر المورد، أو ارفع السعر قليلًا — فالرواج يمنحك مساحة",
            "مربح ومهمَل: مشكلة موضع ووصف أكثر منها مشكلة طعام. انقله، وصوّره، ودع الطاقم يرشّحه",
            "لا رائج ولا مربح: احذفه. فهو يستهلك مخزونًا ووقت تحضير ومساحة في القائمة"
          ]
        },
        {
          "h": "رفع السعر أصغر مما تتخيل"
        },
        "يقاوم الملاك رفع الأسعار لأنهم يتخيلون العملاء يراقبون كل صنف. وعمليًا، زيادة خمسة بالمئة على طبق متوسط السعر هي بضعة جنيهات تمر دون ملاحظة غالبًا، بينما خمسة بالمئة من إجمالي الإيراد تُلاحَظ بوضوح شديد في الحسابات. الخطر مركّز في الصنفين أو الثلاثة المميزة التي يحفظ الناس سعرها فعلًا — اتركها وحرّك الباقي.",
        {
          "h": "أعد حساب التكلفة كل ربع سنة، ومع كل تحرّك للموردين"
        },
        "حساب التكلفة ليس تمرينًا لمرة واحدة. أسعار الموردين تتحرك، والقائمة المحسوبة قبل ثمانية عشر شهرًا تصف مطعمًا لم يعد موجودًا. ضع موعدًا متكررًا في التقويم وتعامل معه كصيانة، لا كمشروع."
      ]
    }
  },
  {
    "slug": "feasibility-questions",
    "date": "2026-08-24",
    "read": 6,
    "topic": {
      "en": "Feasibility & Research",
      "ar": "الجدوى والأبحاث"
    },
    "img": "assets/covers/feasibility.svg",
    "en": {
      "title": "The five feasibility questions founders skip",
      "excerpt": "A feasibility study that only proves the idea works is not a study. It is a brochure with a spreadsheet attached.",
      "body": [
        "Most of the feasibility work I am asked to scope arrives with the conclusion already decided. The founder wants the project to work, and what they are really asking for is a document that says so to a bank or a partner. That document is easy to produce and worth very little, because it answers the wrong questions.",
        "A study earns its cost when it is willing to come back negative. Five questions decide whether it will.",
        {
          "h": "1. Who stops buying from someone else so they can buy from you?"
        },
        "Market size is the most abused number in any feasibility study. A sector worth billions tells you nothing about whether anyone will switch to you. The useful question is narrower and harder: name the specific customer, say who they buy from today, and explain what changes in their situation that makes them move. If you cannot describe that switch concretely, the market size figure is decoration.",
        {
          "h": "2. What does the second year cost?"
        },
        "Founders model the launch carefully and the year after it barely at all. The opening is the cheap part. Year two carries full rent with no landlord grace period, staff who now expect raises, equipment entering its first real maintenance cycle, and the marketing spend that was supposed to taper but did not. Projects fail in year two far more often than at launch.",
        {
          "h": "3. How long is the cash gap, and who funds it?"
        },
        "Not whether the business is profitable — when it is. Count the months between the first pound spent and the first month where money coming in exceeds money going out, then ask plainly who pays the bills during those months. A profitable business with no answer to that question still closes.",
        {
          "h": "4. What has to be true for this to work?"
        },
        "Every model rests on assumptions, and most of them stay buried in the cells. Pull them out and write them as a list: this many customers per day, this average ticket, this rent, this conversion rate, this supply price. Then test each one. If the whole thing collapses when average ticket drops ten percent, you have not found a business — you have found a very specific bet, and you should know that before signing a lease.",
        {
          "h": "5. What does the honest version of the competition look like?"
        },
        "Competitor sections are usually written to be reassuring. The useful version is uncomfortable: go to the competitor, buy from them, time the service, photograph the place, count the customers across three different days and times. One afternoon of that is worth more than a month of desk research, and it regularly changes the plan.",
        {
          "h": "What a real study gives you"
        },
        "Not permission to proceed. A clearer sense of what the project actually requires, where it breaks, and what you would need to see in the first three months to know you are on track. Sometimes the most valuable outcome is a decision not to proceed — made before the money is spent rather than after."
      ]
    },
    "ar": {
      "title": "خمسة أسئلة جدوى يتخطاها المؤسسون",
      "excerpt": "دراسة الجدوى التي تثبت نجاح الفكرة فقط ليست دراسة. إنها كتيب دعائي مرفق به جدول حسابات.",
      "body": [
        "معظم أعمال الجدوى التي أُطلب لتحديد نطاقها تصل والنتيجة محسومة سلفًا. المؤسس يريد للمشروع أن ينجح، وما يطلبه فعليًا وثيقة تقول ذلك لبنك أو لشريك. تلك الوثيقة سهلة الإنتاج وقليلة القيمة، لأنها تجيب عن الأسئلة الخطأ.",
        "الدراسة تستحق تكلفتها حين تكون مستعدة أن تعود بنتيجة سلبية. وهذه خمسة أسئلة تكشف إن كانت كذلك.",
        {
          "h": "١. من الذي سيتوقف عن الشراء من غيرك ليشتري منك؟"
        },
        "حجم السوق هو الرقم الأكثر إساءة استخدام في أي دراسة جدوى. قطاع بمليارات لا يقول شيئًا عن استعداد أحد للتحوّل إليك. السؤال المفيد أضيق وأصعب: سمِّ العميل تحديدًا، وقل ممن يشتري اليوم، واشرح ما الذي يتغير في وضعه فيجعله ينتقل. إذا لم تستطع وصف هذا التحوّل بدقة، فرقم حجم السوق زينة.",
        {
          "h": "٢. كم تكلفة السنة الثانية؟"
        },
        "يبني المؤسسون نموذج الإطلاق بعناية، والسنة التي تليه بالكاد. الافتتاح هو الجزء الرخيص. السنة الثانية تحمل إيجارًا كاملًا بلا فترة سماح، وطاقمًا صار يتوقع زيادات، ومعدات تدخل أول دورة صيانة حقيقية، وإنفاقًا تسويقيًا كان يُفترض أن يقل فلم يقل. تفشل المشروعات في سنتها الثانية أكثر بكثير مما تفشل عند الإطلاق.",
        {
          "h": "٣. ما طول فجوة النقد، ومن يموّلها؟"
        },
        "ليس هل المشروع مربح — بل متى. احسب الشهور بين أول جنيه يُنفق وأول شهر يتجاوز فيه الداخل الخارج، ثم اسأل بصراحة: من يدفع الفواتير خلال تلك الشهور؟ المشروع المربح الذي لا إجابة لديه عن هذا السؤال يُغلق رغم ربحيته.",
        {
          "h": "٤. ما الذي يجب أن يكون صحيحًا حتى ينجح هذا؟"
        },
        "كل نموذج يقوم على افتراضات، ومعظمها يظل مدفونًا في الخلايا. أخرجها واكتبها كقائمة: هذا العدد من العملاء يوميًا، وهذا متوسط الفاتورة، وهذا الإيجار، وهذه نسبة التحويل، وهذا سعر التوريد. ثم اختبر كلًا منها. إذا انهار كل شيء عند انخفاض متوسط الفاتورة عشرة بالمئة، فأنت لم تجد مشروعًا — وجدت رهانًا محددًا جدًا، ويجدر أن تعرف ذلك قبل توقيع عقد الإيجار.",
        {
          "h": "٥. كيف تبدو النسخة الصادقة من المنافسة؟"
        },
        "تُكتب أقسام المنافسين عادةً لتكون مطمئنة. والنسخة المفيدة غير مريحة: اذهب إلى المنافس، واشترِ منه، واحسب زمن الخدمة، وصوّر المكان، وعُدّ العملاء في ثلاثة أيام وأوقات مختلفة. ظهيرة واحدة من هذا تساوي أكثر من شهر بحث مكتبي، وكثيرًا ما تغيّر الخطة.",
        {
          "h": "ما الذي تمنحك إياه دراسة حقيقية"
        },
        "ليس إذنًا بالمضي. بل فهمًا أوضح لما يتطلبه المشروع فعلًا، وأين ينكسر، وما الذي تحتاج أن تراه في الشهور الثلاثة الأولى لتعرف أنك على المسار. وأحيانًا تكون أثمن نتيجة هي قرار بعدم المضي — يُتخذ قبل إنفاق المال لا بعده."
      ]
    }
  },
  {
    "slug": "logo-refresh",
    "date": "2026-07-30",
    "read": 5,
    "topic": {
      "en": "Brand",
      "ar": "العلامة التجارية"
    },
    "img": "assets/covers/brand.svg",
    "en": {
      "title": "Refresh the logo, or leave it alone?",
      "excerpt": "An established company's logo is rarely the problem. Usually the problem is everything printed around it.",
      "body": [
        "When a company that has been trading for twenty years asks for a new logo, the request is almost never really about the logo. Something else has gone wrong — the materials look dated next to a competitor's, the files have been lost and everything is a screenshot of a screenshot, or a new generation has taken over and wants the brand to feel like theirs.",
        "Those are three different problems and only one of them is solved by drawing a new mark.",
        {
          "h": "Recognition is an asset you have already paid for"
        },
        "Every year a mark stays in the market, it accumulates recognition you cannot buy back. Clients associate it with contracts that went well. It is on the sign, the stamp, the proposals in someone's archive. Throwing that away for a shape you prefer aesthetically is an expensive trade, and it is usually made on the designer's taste rather than the business's interest.",
        {
          "h": "The modernization approach"
        },
        "On the BLI work, the brief was effectively this: the firm had standing in its market and a mark people knew, but the execution had aged — heavy drop shadows, a cramped bilingual lockup, strokes that disappeared at small sizes. The answer was not a new identity. It was the same mark rebuilt properly: the letterforms cleaned and evened, the effects removed, the typography balanced, the descriptor reset so it reads at any size.",
        "Anyone who knew the company still recognized it immediately. That is the test. If regular clients have to be told the logo changed, the refresh was probably right. If they ask who the new company is, you have thrown away the asset.",
        {
          "h": "When replacement is the right call"
        },
        {
          "list": [
            "The business has genuinely changed what it does, and the mark describes the old activity",
            "The mark cannot survive its most common use — it is illegible as an app icon or on a small label",
            "There is a legal or similarity problem with another brand",
            "There is no mark at all, only an accumulation of different versions nobody controls"
          ]
        },
        {
          "h": "What usually fixes it instead"
        },
        "In most cases the logo is fine and the system around it is missing. No defined colours, so every printer produces a different shade. No typeface rule, so each document uses whatever was installed. No proper file set, so the sign-maker works from a low-resolution image. No template, so every proposal looks like a different company wrote it.",
        "Building that system — colours, type, spacing, a document template, a correct file set — changes how the company looks far more than a new logo would, and it does not spend the recognition you already own.",
        {
          "h": "A reasonable sequence"
        },
        "Audit what exists and where it is used. Fix the file set first. Define the system. Rebuild the materials. Only then, if the mark itself still fails, redraw it — and when you do, redraw it as the same brand, not a different one."
      ]
    },
    "ar": {
      "title": "نحدّث الشعار أم نتركه؟",
      "excerpt": "نادرًا ما يكون شعار شركة راسخة هو المشكلة. المشكلة عادةً كل ما يُطبع حوله.",
      "body": [
        "حين تطلب شركة تعمل منذ عشرين عامًا شعارًا جديدًا، لا يكون الطلب عن الشعار فعليًا في الغالب. شيء آخر اختلّ — المواد تبدو قديمة بجوار منافس، أو الملفات ضاعت وصار كل شيء لقطة شاشة عن لقطة شاشة، أو تولّى جيل جديد يريد علامة تشبهه هو.",
        "هذه ثلاث مشكلات مختلفة، وواحدة فقط منها تُحلّ برسم علامة جديدة.",
        {
          "h": "التميّز أصل دفعتَ ثمنه بالفعل"
        },
        "مع كل سنة تبقى فيها العلامة في السوق، تتراكم لها معرفة لا يمكنك شراؤها مجددًا. يربطها العملاء بعقود سارت جيدًا. وهي على اللافتة والختم والعروض في أرشيف أحدهم. التخلي عن ذلك مقابل شكل تفضّله جماليًا مقايضة مكلفة، وتُتخذ عادةً بذوق المصمم لا بمصلحة الشركة.",
        {
          "h": "منهج التحديث"
        },
        "في عمل BLI كان البريف عمليًا كالتالي: للشركة مكانة في سوقها وعلامة يعرفها الناس، لكن التنفيذ تقادم — ظلال ثقيلة، وتركيب ثنائي اللغة مزدحم، وخطوط تختفي في المقاسات الصغيرة. ولم يكن الحل هوية جديدة، بل العلامة نفسها معادًا بناؤها بإتقان: حروف نُظّفت وضُبطت، وتأثيرات أُزيلت، وطباعة متوازنة، ووصف أُعيد ضبطه ليُقرأ في أي مقاس.",
        "كل من يعرف الشركة ظل يميّزها فورًا. وهذا هو الاختبار. إذا احتاج العملاء المعتادون أن تخبرهم بأن الشعار تغيّر، فالتحديث غالبًا كان صائبًا. وإذا سألوا من هذه الشركة الجديدة، فقد تخليتَ عن الأصل.",
        {
          "h": "متى يكون الاستبدال هو القرار الصحيح"
        },
        {
          "list": [
            "تغيّر نشاط الشركة فعليًا، والعلامة تصف النشاط القديم",
            "العلامة لا تصمد في أكثر استخداماتها شيوعًا — غير مقروءة كأيقونة تطبيق أو على ملصق صغير",
            "وجود مشكلة قانونية أو تشابه مع علامة أخرى",
            "لا توجد علامة أصلًا، بل تراكم نسخ مختلفة لا يضبطها أحد"
          ]
        },
        {
          "h": "ما الذي يصلح الأمر عادةً بدلًا من ذلك"
        },
        "في معظم الحالات الشعار سليم والنظام حوله غائب. لا ألوان محددة، فتخرج كل مطبعة بدرجة مختلفة. ولا قاعدة للخطوط، فيستخدم كل مستند ما وجده مثبتًا. ولا مجموعة ملفات سليمة، فيعمل صانع اللافتة من صورة منخفضة الدقة. ولا قالب، فيبدو كل عرض وكأن شركة مختلفة كتبته.",
        "بناء ذلك النظام — ألوان وخطوط ومسافات وقالب مستندات ومجموعة ملفات صحيحة — يغيّر شكل الشركة أكثر بكثير من شعار جديد، ومن غير أن يبدّد التميّز الذي تملكه بالفعل.",
        {
          "h": "تسلسل معقول"
        },
        "راجع ما هو موجود وأين يُستخدم. أصلح مجموعة الملفات أولًا. حدّد النظام. أعد بناء المواد. وعندها فقط، إن ظلت العلامة نفسها قاصرة، أعد رسمها — وحين تفعل، ارسمها بوصفها العلامة نفسها، لا علامة أخرى."
      ]
    }
  },
  {
    "slug": "nfc-cards",
    "date": "2026-11-05",
    "read": 5,
    "topic": {
      "en": "NFC & Digital Tools",
      "ar": "حلول NFC"
    },
    "img": "assets/covers/nfc.svg",
    "en": {
      "title": "What an NFC card actually fixes",
      "excerpt": "The paper card is not the problem. What happens to it in the forty-eight hours after the meeting is the problem.",
      "body": [
        "Pick a conference you went to this year. Count the cards you collected. Now count how many of those contacts are saved in your phone. The gap between those two numbers is the entire argument, and it has nothing to do with paper being old-fashioned.",
        {
          "h": "Where the contact is actually lost"
        },
        "A card has to be typed in by hand to become useful, and typing it is a small chore that always gets postponed. It goes into a pocket, then a bag, then a drawer. By the time anyone looks at it, the context is gone — you have a name and a company and no memory of why you were talking.",
        "An NFC card removes the typing. The other person taps their phone on it, your page opens, they press save, and the contact is in their phone before the conversation has finished. The friction was never the paper. It was the transcription.",
        {
          "h": "What it does that paper cannot"
        },
        {
          "list": [
            "Your details stay current — change your number or title on the page and every card already handed out is updated",
            "It carries more than a card can hold: portfolio, catalogue, location, booking link, payment details",
            "WhatsApp opens as a button, not as a number someone has to copy",
            "You can see that it is being used, which is more than a box of printed cards will ever tell you"
          ]
        },
        {
          "h": "Review cards are the clearer business case"
        },
        "For a restaurant or a clinic, the review card is an easier argument than the business card. Most satisfied customers would leave a review if it took one action. Instead it takes finding the business on Maps, scrolling, tapping, and by then the moment has passed. A tag on the table or the counter removes every step except writing the review.",
        "The effect compounds in a way few things in a small business do, because the reviews keep working long after the customer has left.",
        {
          "h": "Where it is genuinely worth it"
        },
        "Field sales teams, restaurants and cafés, clinics, real estate, events and exhibitions, anyone who hands out a card more than a few times a week. If you give out three cards a month, this is a gadget. If you give out thirty, it changes the follow-up rate.",
        {
          "h": "Two honest limitations"
        },
        "Older phones will not read NFC, which is why every card should carry a QR code as well — the same link, a different way in. And the card is only as good as the page behind it. A tap that opens a slow, badly built page is worse than paper, because you have spent the person's attention and given them nothing. The chip is the cheap part. The page is the product."
      ]
    },
    "ar": {
      "title": "ما الذي تحلّه بطاقة NFC فعليًا",
      "excerpt": "البطاقة الورقية ليست المشكلة. المشكلة ما يحدث لها في الثماني والأربعين ساعة التالية للاجتماع.",
      "body": [
        "اختر مؤتمرًا حضرته هذا العام. عُدّ البطاقات التي جمعتها. ثم عُدّ كم من أصحابها محفوظ في هاتفك. الفرق بين الرقمين هو الحجة كلها، ولا علاقة له بكون الورق قديم الطراز.",
        {
          "h": "أين يضيع التواصل فعلًا"
        },
        "البطاقة تحتاج إدخالًا يدويًا لتصبح مفيدة، وإدخالها مهمة صغيرة تُؤجَّل دائمًا. تدخل الجيب، ثم الحقيبة، ثم الدرج. وحين ينظر إليها أحد، يكون السياق قد ضاع — اسم وشركة، وبلا أي ذكرى لسبب الحديث أصلًا.",
        "بطاقة NFC تلغي الكتابة. الطرف الآخر يقرّب هاتفه منها، فتُفتح صفحتك، فيضغط حفظ، فيصبح الاتصال في هاتفه قبل أن ينتهي الحديث. العقبة لم تكن الورق قط. كانت النسخ اليدوي.",
        {
          "h": "ما يفعله ولا يستطيعه الورق"
        },
        {
          "list": [
            "بياناتك تبقى محدّثة — غيّر رقمك أو مسماك في الصفحة فتتحدث كل البطاقات الموزّعة بالفعل",
            "تحمل أكثر مما تسع البطاقة: أعمال سابقة وكتالوج وموقع ورابط حجز وبيانات دفع",
            "واتساب يُفتح كزر، لا كرقم على أحدهم نسخه",
            "يمكنك أن تعرف أنها تُستخدم فعلًا، وهذا أكثر مما ستخبرك به علبة بطاقات مطبوعة"
          ]
        },
        {
          "h": "لوحات التقييم هي الحالة التجارية الأوضح"
        },
        "بالنسبة لمطعم أو عيادة، لوحة التقييم حجة أسهل من بطاقة العمل. معظم العملاء الراضين سيتركون تقييمًا لو تطلّب الأمر إجراءً واحدًا. لكنه يتطلب البحث عن المكان على الخرائط، والتمرير، والضغط، وعندها يكون الوقت قد فات. لوحة على الطاولة أو الكاونتر تزيل كل خطوة ما عدا كتابة التقييم.",
        "وأثره يتراكم بشكل قلّ أن تجده في نشاط صغير، لأن التقييم يظل يشتغل لك بعد انصراف العميل بوقت طويل.",
        {
          "h": "أين يستحق فعلًا"
        },
        "فرق المبيعات الميدانية، والمطاعم والكافيهات، والعيادات، والعقارات، والمعارض والفعاليات، وكل من يوزّع بطاقة أكثر من بضع مرات أسبوعيًا. إن كنت توزّع ثلاث بطاقات شهريًا، فهي لعبة لا أكثر. وإن كنت توزّع ثلاثين، فهي تغيّر معدل المتابعة فعلًا.",
        {
          "h": "حدّان لا بد من ذكرهما"
        },
        "الهواتف الأقدم لا تقرأ NFC، ولهذا يجب أن تحمل كل بطاقة رمز QR أيضًا — الرابط نفسه بمدخل مختلف. والبطاقة لا تساوي أكثر من الصفحة التي خلفها. لمسة تفتح صفحة بطيئة سيئة البناء أسوأ من الورق، لأنك أنفقت انتباه الشخص ولم تعطه شيئًا. الشريحة هي الجزء الرخيص. الصفحة هي المنتج."
      ]
    }
  }
];
