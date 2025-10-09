// 🧩 اسم الكاش وملفات التخزين
const CACHE_NAME = 'site-petit-prix-v1';
const urlsToCache = [
  '/',
  '/sitemap.xml',
  '/robots.txt',

  // 🖼️ مجلدات وأصول الموقع
  '/public/css/styles.css',
  '/public/js/script.js',
  '/public/img/icon-512.png',

  // 📄 صفحاتك الأساسية
  '/SoinsdelapeauCosmetiques/',
  '/ProduitPromotion/',
  '/CheveuxBeaute/',
  '/VitaminesComplementsAlimentaires/',
  '/HygieneSoinsPersonnels/',
  '/AppareilsAccessoiresSante/',
  '/Politiquedeconfidentialite/',
  '/Conditionsdutilisation/',
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
