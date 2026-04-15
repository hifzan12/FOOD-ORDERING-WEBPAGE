// Restaurant Configuration
const RESTAURANT_NAME = 'Fake Restaurant';
const WHATSAPP_NUMBER = '917253984317'; // Include country code

// Sample Menu Data
const menuItems = [
    {
        id: 1,
        name: 'Margherita Pizza',
        price: 299,
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=400&fit=crop'
    },
    {
        id: 2,
        name: 'Chicken Tikka',
        price: 349,
        image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=400&fit=crop'
    },
    {
        id: 3,
        name: 'Paneer Butter Masala',
        price: 279,
        image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop'
    },
    {
        id: 4,
        name: 'Veg Biryani',
        price: 249,
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=400&fit=crop'
    },
    {
        id: 5,
        name: 'Garlic Naan',
        price: 49,
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=400&fit=crop'
    },
    {
        id: 6,
        name: 'Masala Dosa',
        price: 129,
        image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=400&fit=crop'
    },
    {
        id: 7,
        name: 'Gulab Jamun',
        price: 89,
        image: 'https://images.unsplash.com/photo-1645177628172-a94c30a5f0b2?w=400&h=400&fit=crop'
    },
    {
        id: 8,
        name: 'Mango Lassi',
        price: 79,
        image: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400&h=400&fit=crop'
    }
];

// State Management
let orderType = 'dine-in';
let tableNumber = '';
let cart = {}; // { itemId: quantity }

// DOM Elements
const orderTypeBtns = document.querySelectorAll('.order-type-btn');
const tableInputWrapper = document.getElementById('tableInputWrapper');
const tableNumberInput = document.getElementById('tableNumber');
const menuGrid = document.getElementById('menuGrid');
const cartPreview = document.getElementById('cartPreview');
const cartItems = document.getElementById('cartItems');
const totalAmount = document.getElementById('totalAmount');
const orderButtonWrapper = document.getElementById('orderButtonWrapper');
const orderBtn = document.getElementById('orderBtn');
const clearCartBtn = document.getElementById('clearCart');

// Initialize App
function init() {
    renderMenu();
    setupEventListeners();
    updateCartDisplay();
}

// Event Listeners
function setupEventListeners() {
    // Order Type Selection
    orderTypeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            orderTypeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            orderType = btn.dataset.type;
            
            // Show/hide table input
            if (orderType === 'dine-in') {
                tableInputWrapper.classList.add('show');
            } else {
                tableInputWrapper.classList.remove('show');
                tableNumberInput.value = '';
            }
        });
    });
    
    // Table Number Input
    tableNumberInput.addEventListener('input', (e) => {
        tableNumber = e.target.value;
    });
    
    // Clear Cart
    clearCartBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear your cart?')) {
            cart = {};
            updateCartDisplay();
        }
    });
    
    // Order Button
    orderBtn.addEventListener('click', handleOrderOnWhatsApp);
}

// Render Menu Items
function renderMenu() {
    menuGrid.innerHTML = '';
    
    menuItems.forEach(item => {
        const menuItemEl = document.createElement('div');
        menuItemEl.className = 'menu-item';
        menuItemEl.dataset.testid = `menu-item-${item.id}`;
        
        const quantity = cart[item.id] || 0;
        
        menuItemEl.innerHTML = `
            <div class="menu-item-content">
                <img src="${item.image}" alt="${item.name}" class="menu-item-image" loading="lazy">
                <div class="menu-item-details">
                    <div>
                        <h3 class="menu-item-name">${item.name}</h3>
                        <p class="menu-item-price">₹${item.price}</p>
                    </div>
                    <div class="quantity-controls">
                        ${quantity === 0 ? `
                            <button class="add-btn" data-testid="add-btn-${item.id}" onclick="addToCart(${item.id})">Add</button>
                        ` : `
                            <div class="quantity-selector">
                                <button class="qty-btn" data-testid="decrease-btn-${item.id}" onclick="decreaseQuantity(${item.id})">-</button>
                                <span class="qty-display" data-testid="qty-display-${item.id}">${quantity}</span>
                                <button class="qty-btn" data-testid="increase-btn-${item.id}" onclick="increaseQuantity(${item.id})">+</button>
                            </div>
                        `}
                    </div>
                </div>
            </div>
        `;
        
        menuGrid.appendChild(menuItemEl);
    });
}

// Cart Management Functions
function addToCart(itemId) {
    cart[itemId] = 1;
    renderMenu();
    updateCartDisplay();
}

function increaseQuantity(itemId) {
    cart[itemId] = (cart[itemId] || 0) + 1;
    renderMenu();
    updateCartDisplay();
}

function decreaseQuantity(itemId) {
    if (cart[itemId] > 1) {
        cart[itemId]--;
    } else {
        delete cart[itemId];
    }
    renderMenu();
    updateCartDisplay();
}

// Update Cart Display
function updateCartDisplay() {
    const cartItemsArray = Object.keys(cart);
    
    if (cartItemsArray.length === 0) {
        cartPreview.style.display = 'none';
        orderButtonWrapper.style.display = 'none';
        return;
    }
    
    cartPreview.style.display = 'block';
    orderButtonWrapper.style.display = 'block';
    
    // Render cart items
    cartItems.innerHTML = '';
    let total = 0;
    
    cartItemsArray.forEach(itemId => {
        const item = menuItems.find(i => i.id === parseInt(itemId));
        const quantity = cart[itemId];
        const itemTotal = item.price * quantity;
        total += itemTotal;
        
        const cartItemEl = document.createElement('div');
        cartItemEl.className = 'cart-item';
        cartItemEl.dataset.testid = `cart-item-${itemId}`;
        cartItemEl.innerHTML = `
            <span class="cart-item-name">${item.name}</span>
            <span class="cart-item-qty">x${quantity}</span>
            <span class="cart-item-price">₹${itemTotal}</span>
        `;
        cartItems.appendChild(cartItemEl);
    });
    
    totalAmount.textContent = `₹${total}`;
}

// Handle Order on WhatsApp
function handleOrderOnWhatsApp() {
    // Validate table number for dine-in
    if (orderType === 'dine-in' && !tableNumber) {
        alert('Please enter your table number');
        tableNumberInput.focus();
        return;
    }
    
    // Generate order message
    let message = `*Order from ${RESTAURANT_NAME}*\n\n`;
    message += `*Order Type:* ${orderType === 'dine-in' ? 'Dine-in' : 'Takeaway'}\n`;
    
    if (orderType === 'dine-in') {
        message += `*Table Number:* ${tableNumber}\n`;
    }
    
    message += `\n*Items:*\n`;
    
    let total = 0;
    Object.keys(cart).forEach(itemId => {
        const item = menuItems.find(i => i.id === parseInt(itemId));
        const quantity = cart[itemId];
        const itemTotal = item.price * quantity;
        total += itemTotal;
        message += `• ${item.name} x${quantity} - ₹${itemTotal}\n`;
    });
    
    message += `\n*Total: ₹${total}*`;
    
    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Open WhatsApp
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappURL, '_blank');
}

// Make functions globally accessible
window.addToCart = addToCart;
window.increaseQuantity = increaseQuantity;
window.decreaseQuantity = decreaseQuantity;

// Initialize on page load
init();