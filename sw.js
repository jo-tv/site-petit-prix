// 🧩 اسم الكاش وملفات التخزين
const CACHE_NAME = 'site-petit-prix-v1';
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
];

// 🟢 تثبيت Service Worker وتخزين الملفات
self.addEventListener('install', (event) => {
  console.log('🟢 Service Worker installé');
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      for (const url of urlsToCache) {
        try {
          const response = await fetch(url);
          if (response.ok) {
            await cache.put(url, response.clone());
            console.log(`📦 Enregistré: ${url}`);
          } else {
            console.warn(`⚠️ Skipped (not found): ${url}`);
          }
        } catch (err) {
          console.warn(`⚠️ Erreur en téléchargeant ${url}:`, err);
        }
      }
    })
  );
});

// 🔄 تفعيل الكاش الجديد وحذف القديم
self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker activé');
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
});

// ⚙️ استجابة للطلبات
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});
