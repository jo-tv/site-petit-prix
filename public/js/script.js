document.addEventListener('DOMContentLoaded', function () {
  // Initialize Swiper for Product Showcase
  if (document.querySelector('.product-swiper')) {
    new Swiper('.product-swiper', {
      slidesPerView: 1,
      spaceBetween: 25, // Adjusted space
      loop: true,
      grabCursor: true,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        576: {
          // Small devices
          slidesPerView: 2,
          spaceBetween: 20,
        },
        768: {
          // Medium devices
          slidesPerView: 3,
          spaceBetween: 25,
        },
        992: {
          // Large devices
          slidesPerView: 3, // Kept 3 for better visibility
          spaceBetween: 30,
        },
        1200: {
          // Extra large devices
          slidesPerView: 4,
          spaceBetween: 30,
        },
      },
    });
  }

  // Initialize Swiper for Testimonials
  if (document.querySelector('.testimonial-slider')) {
    new Swiper('.testimonial-slider', {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      autoplay: {
        delay: 5500, // Slightly longer delay
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
          spaceBetween: 30,
        },
        992: {
          slidesPerView: 2, // Keep 2 for testimonials for better readability
          spaceBetween: 30,
        },
        1200: {
          slidesPerView: 3, // Show 3 on larger screens
          spaceBetween: 30,
        },
      },
    });
  }

  // Initialize Flatpickr for Date Picker
  if (document.getElementById('consultDate')) {
    flatpickr('#consultDate', {
      altInput: true,
      altFormat: 'F j, Y', // More readable format
      dateFormat: 'Y-m-d',
      minDate: 'today',
      disableMobile: 'true', // Use native date picker on mobile for better UX
    });
  }

  // Form Validations
  function handleFormSubmission(formId, feedbackElementId, successMessage) {
    const form = document.getElementById(formId);
    const feedbackElement = document.getElementById(feedbackElementId);

    if (form && feedbackElement) {
      // Ensure elements exist
      form.addEventListener('submit', function (event) {
        event.preventDefault(); // Always prevent default first
        event.stopPropagation(); // Stop propagation

        if (form.checkValidity()) {
          feedbackElement.innerHTML = `<div class="alert alert-success alert-dismissible fade show" role="alert">
                            ${successMessage}
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>`;
          form.reset();
          form.classList.remove('was-validated'); // Reset validation state
        } else {
          feedbackElement.innerHTML = `<div class="alert alert-danger alert-dismissible fade show" role="alert">
                            Veuillez remplir correctement tous les champs obligatoires.
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>`;
          form.classList.add('was-validated'); // Show validation feedback
        }
      });
    }
  }

  // ✅ Forms existants
  handleFormSubmission(
    'consultationForm',
    'consultationFormFeedback',
    'Thank you! Your consultation request has been submitted. We will contact you shortly to confirm.'
  );
  handleFormSubmission(
    'newsletterForm',
    'newsletterFeedback',
    'Success! You are now subscribed to the PharmaSleek newsletter.'
  );
  handleFormSubmission(
    'contactForm',
    'contactFormFeedback',
    'Message sent! Thank you for reaching out. We will get back to you as soon as possible.'
  );

  // ✅ Nouveau form : Réclamations
  handleFormSubmission(
    'reclamationForm',
    'reclamationFormFeedback',
    'Votre réclamation a bien été envoyée. Nous vous répondrons dans les plus brefs délais.'
  );

  // Set current year in footer
  const currentYearElement = document.getElementById('currentYear');
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }
});

// ✅ Initialisation EmailJS
emailjs.init('1vfO80JZbsuVUxvH1');

// Ajouter l'heure actuelle
document.getElementById('reclamationTime').value = new Date().toLocaleString();

document.getElementById('reclamationForm').addEventListener('submit', function (e) {
  e.preventDefault();

  emailjs.sendForm('service_vsz1u1h', 'template_r4a0avd', this).then(
    () => {
      document.getElementById('reclamationFormFeedback').innerHTML = `
          <div class="alert alert-success alert-dismissible fade show" role="alert">
            ✅ Votre réclamation a été envoyée avec succès
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>`;
      this.reset();
    },
    (error) => {
      document.getElementById('reclamationFormFeedback').innerHTML = `
          <div class="alert alert-danger alert-dismissible fade show" role="alert">
            ❌ Erreur lors de l'envoi : ${error.text}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>`;
    }
  );
});

// cards wattsap
let cartIcon = document.getElementById('floating-cart');
const cartPopup = document.getElementById('cart-popup');
const closeBtn = document.querySelector('#cart-popup .close-btn');
const cartCount = document.getElementById('cart-count');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const whatsappBtn = document.getElementById('whatsapp-btn');

// استرجاع السلة من localStorage أو إنشاء جديدة
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// تحديث السلة عند تحميل الصفحة
updateCart();

// فتح / إغلاق السلة
cartIcon.addEventListener('click', () => cartPopup.classList.add('active'));
closeBtn.addEventListener('click', () => cartPopup.classList.remove('active'));

// استهداف كل الأزرار داخل product-card و medicine-card
// 🟢 Delegation
document.getElementById('productList').addEventListener('click', function (e) {
  if (e.target.closest('.add-to-cart')) {
    e.preventDefault();

    const card = e.target.closest('.product-card, .medicine-card');
    const title = card.querySelector('.card-title').innerText;
    const priceText = card
      .querySelector('.price')
      .innerText.replace('DH', '')
      .replace('$', '')
      .trim();
    const price = parseFloat(priceText.replace(',', '.'));
    const imgSrc = card.querySelector('img').src;

    const existing = cart.find((item) => item.title === title);
    if (existing) {
      existing.qty++;
    } else {
      cart.push({ title, price, qty: 1, imgSrc });
    }
    updateCart();
  }
});

function updateCart() {
  cartCount.innerText = cart.reduce((acc, item) => acc + item.qty, 0);
  cartItemsContainer.innerHTML = '';

  cart.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'cart-item d-flex align-items-center mb-2';
    div.innerHTML = `
        <img src="${item.imgSrc}" alt="${
          item.title
        }" style="width:60px; height:60px; object-fit:cover; margin-right:10px;">
        <div class="cart-item-details flex-grow-1">
          <span style="color:red;margin:5px auto">${item.title}</span>
          <span style="
            color: #000;
            margin: 6px 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.95em;
            gap: 8px;
            background: #f8f9fa;
            padding: 6px 10px;
            border-radius: 8px;
            box-shadow: 0 1px 4px rgba(0,0,0,0.1);
          ">
            <span style="display: flex; align-items: center; gap: 3px;">
              <i class="fa-solid fa-tag" style="color:#3cc743;"></i>
              ${item.price}
            </span>
          
            <span style="display: flex; align-items: center; gap: 5px;">
              <i class="fa-solid fa-xmark" style="color:#555;"></i>
              ${item.qty}
            </span>
          
            <span style="display: flex; align-items: center; gap: 5px; font-weight: 600; color:#d32f2f;">
              <i class="fa-solid fa-coins"></i>
              ${(item.price * item.qty).toFixed(2)} DH
            </span>
          </span>
        </div>
        <button data-index="${index}" class="btn btn-sm btn-danger">&times;</button>
      `;
    cartItemsContainer.appendChild(div);

    div.querySelector('button').addEventListener('click', () => {
      cart.splice(index, 1);
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCart();
    });
  });

  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  cartTotal.innerText = `Total: ${total.toFixed(2)} DH`;
}

// إرسال عبر واتساب
whatsappBtn.addEventListener('click', () => {
  if (cart.length === 0) return alert('Votre panier est vide !');
  let message = 'Bonjour, je souhaite commander :%0A';
  cart.forEach((item) => {
    message += `- ${item.title} x${item.qty} : ${(item.price * item.qty).toFixed(2)} DH%0A`;
  });
  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  message += `Total: ${total.toFixed(2)} DH`;

  // رقم واتساب (استبدله بالرقم الفعلي)
  const whatsappNumber = '212601862102';
  window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
});

document.getElementById('whatsappForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const phone = document.getElementById('clientPhone').value.trim();
  if (phone.length < 10) {
    document.getElementById('whatsappFeedback').innerHTML =
      '<span class="text-danger">Veuillez entrer un numéro valide (10 chiffres).</span>';
    return;
  }

  // numéro de la parapharmacie
  const adminNumber = '212601862102'; // format international (Maroc = 212)
  const message =
    'Bonjour, je souhaite rejoindre le groupe Para Petit Prix pour recevoir les offres et nouveautés.';
  const whatsappURL = `https://wa.me/${adminNumber}?text=${encodeURIComponent(
    message
  )}%0AMon numéro: ${phone}`;

  // ouvrir WhatsApp
  window.open(whatsappURL, '_blank');
});


  
const slides = document.querySelectorAll('.swiper-slide');
const swiper = new Swiper('.swiper', {
  slidesPerView: 3,
  spaceBetween: 10,
  loop: slides.length > 3, // ✅ تفعيل loop فقط عند الحاجة
  pagination: { el: '.swiper-pagination' },
  navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
});