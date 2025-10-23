// ====================================================
// 🧱 CONFIGURATION DU SERVICE WORKER
// ====================================================

// ⚙️ رقم الإصدار (غيّره عند أي تعديل للملفات لتحديث الكاش تلقائياً)
const CACHE_VERSION = 'v2.0.1';
const CACHE_NAME = 'site-petit-prix-v1';
// 🗂️ الملفات التي سيتم حفظها في الكاش (أضف أو عدّل حسب مشروعك)
const urlsToCache = [
  '/site-petit-prix/',
  '/site-petit-prix/sitemap.xml',
  '/site-petit-prix/robots.txt',
  
  // 🖼️ مجلدات وأصول الموقع (عدّل حسب موقع ملفاتك)
  '/site-petit-prix/public/css/styles.css',
  '/site-petit-prix/public/js/script.js',
  '/site-petit-prix/public/img/icon-512.png',
  
  // 📄 صفحاتك الأساسية
  '/site-petit-prix/SoinsdelapeauCosmetiques/',
  '/site-petit-prix/ProduitPromotion/',
  '/site-petit-prix/CheveuxBeaute/',
  '/site-petit-prix/VitaminesComplementsAlimentaires/',
  '/site-petit-prix/HygieneSoinsPersonnels/',
  '/site-petit-prix/AppareilsAccessoiresSante/',
  '/site-petit-prix/Politiquedeconfidentialite/',
  '/site-petit-prix/Conditionsdutilisation/',
  '/site-petit-prix/Maternite-ProduitsBebe/',
  '/site-petit-prix/Nutrition-Produits-Minceur/',
  '/site-petit-prix/Huiles-Essentielles-Aromatherapie/',
];

// ====================================================
// 🟢 INSTALLATION — تحميل الملفات وتخزينها في الكاش
// ====================================================
self.addEventListener('install', (event) => {
  console.log(`🟢 Service Worker installé (${CACHE_VERSION})`);
  
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      console.log('📦 Mise en cache initiale des fichiers...');
      for (const url of urlsToCache) {
        try {
          // ⚠️ استخدام no-store لضمان تحميل الملفات الحديثة
          const response = await fetch(url, { cache: 'no-store' });
          if (response.ok) {
            await cache.put(url, response.clone());
            console.log(`✅ Fichier mis en cache: ${url}`);
          } else {
            console.warn(`⚠️ Fichier ignoré (non trouvé): ${url}`);
          }
        } catch (err) {
          console.warn(`⚠️ Erreur lors du cache de ${url}:`, err);
        }
      }
    })
  );
  
  // يجعل SW الجديد جاهزاً فوراً بدون انتظار إغلاق الصفحات القديمة
  self.skipWaiting();
});

// ====================================================
// 🔄 ACTIVATE — حذف الكاش القديم وتفعيل الجديد فوراً
// ====================================================
self.addEventListener('activate', (event) => {
  console.log(`✅ Service Worker activé (${CACHE_VERSION})`);
  
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('🧹 Suppression du cache ancien:', key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  
  // يفعّل النسخة الجديدة مباشرة لجميع الصفحات المفتوحة
  self.clients.claim();
});

// ====================================================
// ⚙️ FETCH — التعامل مع الطلبات: الشبكة أولاً ثم الكاش كاحتياط
// ====================================================
self.addEventListener('fetch', (event) => {
  // نتجاهل طلبات Chrome extension أو المتصفح نفسه
  if (event.request.url.startsWith('chrome-extension') || event.request.url.includes('browser-sync')) {
    return;
  }
  
  event.respondWith(
    fetch(event.request)
    .then((response) => {
      // ✅ حفظ النسخة الجديدة في الكاش لتحديث لاحق
      const clone = response.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
      return response;
    })
    .catch(() => {
      // ⚠️ في حال انقطاع الإنترنت، نستخدم النسخة المخزّنة
      return caches.match(event.request);
    })
  );
});

// ====================================================
// 🔔 MESSAGE — استقبال إشعارات من الصفحة لتحديث SW يدوياً
// ====================================================
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('⚡ Passage immédiat au nouveau Service Worker...');
    self.skipWaiting();
  }
});