// 🧩 اسم الكاش وملفات التخزين
const CACHE_NAME = 'site-petit-prix-v1';
const urlsToCache = [
  '/',
  '/site-petit-prix/sitemap.xml',
  '/site-petit-prix/robots.txt',

  // 🖼️ مجلدات وأصول الموقع
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

self.addEventListener('install', (event) => {
  console.log('🟢 Service Worker installé');
  event.waitUntil(
    caches.open('site-cache-v1').then((cache) => {
      return cache.addAll(['/', '/index.html']);
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker activé');
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
