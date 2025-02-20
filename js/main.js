// 0-50 qatorlar: Umumiy sozlamalar va yuklanish effekti
document.addEventListener('DOMContentLoaded', () => {
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';
    loadingOverlay.appendChild(spinner);
    document.body.appendChild(loadingOverlay);

    setTimeout(() => {
        loadingOverlay.style.display = 'none';
    }, 1500);
});

// Savat funksiyalari
let cart = JSON.parse(localStorage.getItem('cart')) || [];

const addToCartButtons = document.querySelectorAll('.add-to-cart');
const cartModal = document.getElementById('cartModal');
const cartItems = document.getElementById('cartItems');

function updateCart() {
    cartItems.innerHTML = '';
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Savat hali bo‘sh.</p>';
    } else {
        cart.forEach(item => {
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <span>${item.name} - ${item.price} UZS</span>
                <button class="remove-btn" data-name="${item.name}">Olib tashlash</button>
            `;
            cartItems.appendChild(div);
        });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
}

addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
        const productName = button.getAttribute('data-product');
        const price = button.parentElement.querySelector('.card-text').textContent;
        cart.push({ name: productName, price: price });
        updateCart();
        alert(`${productName} savatga qo‘shildi!`);
    });
});

cartItems.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-btn')) {
        const name = e.target.getAttribute('data-name');
        cart = cart.filter(item => item.name !== name);
        updateCart();
    }
});

// 51-100 qatorlar: Qidiruv funksiyasi
const searchInput = document.querySelector('.form-control');
const productCards = document.querySelectorAll('.card');

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    productCards.forEach(card => {
        const title = card.querySelector('.card-title').textContent.toLowerCase();
        if (title.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
});

// Mahsulot filtrlari
const filterSelect = document.createElement('select');
filterSelect.className = 'filter-select';
filterSelect.innerHTML = `
    <option value="all">Barcha mahsulotlar</option>
    <option value="men">Erkaklar</option>
    <option value="women">Ayollar</option>
    <option value="kids">Bolalar</option>
`;
document.querySelector('.filters').appendChild(filterSelect);

filterSelect.addEventListener('change', (e) => {
    const filter = e.target.value;
    productCards.forEach(card => {
        const category = card.querySelector('.card-title').textContent.includes('Erkaklar') ? 'men' :
                        card.querySelector('.card-title').textContent.includes('Ayollar') ? 'women' :
                        card.querySelector('.card-title').textContent.includes('Bolalar') ? 'kids' : 'all';
        if (filter === 'all' || filter === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
});

// 101-150 qatorlar: Slayder funksiyasi (Swiper.js bilan)
const swiper = new Swiper('.swiper-container', {
    slidesPerView: 3,
    spaceBetween: 30,
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    breakpoints: {
        320: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
    },
});

// Navbar sticky effekt
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('bg-white', 'shadow-lg');
    } else {
        navbar.classList.remove('bg-white', 'shadow-lg');
    }
});

// 151-200 qatorlar: Qo‘shimcha funksiyalar va validatsiyalar
function validateSearch(input) {
    if (input.value.length > 50) {
        alert('Qidiruv matni juda uzun!');
        input.value = input.value.substring(0, 50);
    }
}

searchInput.addEventListener('blur', () => validateSearch(searchInput));

const cartButton = document.querySelector('.nav-link[href="#cart"]');
cartButton.addEventListener('click', () => {
    const modal = new bootstrap.Modal(cartModal);
    modal.show();
    updateCart();
});

// Mahsulotlar sonini cheklash funksiyasi
function limitCartItems(maxItems = 10) {
    if (cart.length > maxItems) {
        alert(`Savatda maksimal ${maxItems} ta mahsulot bo‘lishi mumkin!`);
        cart = cart.slice(0, maxItems);
        updateCart();
    }
}

addToCartButtons.forEach(button => {
    button.addEventListener('click', () => limitCartItems(10));
});

// Foydalanuvchi interfeysini yangilash
function updateUI() {
    const totalItems = cart.length;
    cartButton.textContent = `Savat (${totalItems})`;
}

updateUI();

// Hodisa tinglovchilari uchun xatolarni boshqarish
window.addEventListener('error', (e) => {
    console.error('Xatolik yuz berdi:', e.message);
    alert('Ba’zi funksiyalar ishlamay qoldi. Iltimos, sahifani yangilang.');
});
