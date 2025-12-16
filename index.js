// Product data
const products = [
    {
        id: 1,
        name: "Classic white Hoodie",
        price: 19.99,
        image: "2 (1).png",
        colors: ["black", "gray", "navy"],
        category: "men"
    },
    {
        id: 2,
        name: "Classic Blue Hoodie",
        price: 25.5,
        image: "2 (2).png",
        colors: ["gray", "black", "white"],
        category: "men"
    },
    {
        id: 3,
        name: "Premium Navy Hoodie",
        price: 21.99,
        image: "2 (4).png",
        colors: ["navy", "black", "gray"],
        category: "women and men"
    },
    {
        id: 4,
        name: "Limited Edition Red",
        price: 59.99,
        image: "2 (7).png",
        colors: ["red", "black"],
        category: "limited",
        badge: "Limited"
    },
    {
        id: 5,
        name: "Vintage red Hoodie",
        price: 23.99,
        image: "2 (6).png",
        colors: ["white", "gray", "black"],
        category: "women"
    },
    {
        id: 6,
        name: "Street Green Hoodie",
        price: 14.99,
        image: "2 (5).png",
        colors: ["green", "black", "gray"],
        category: "men"
    }
];

// Cart functionality
let cart = [];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    loadCartFromStorage();
    setupEventListeners();
    updateCartCount();
});

function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
    }
    
    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleNewsletterSignup();
        });
    }
    
    // Mobile menu
    const hamburger = document.querySelector('.hamburger');
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }
}

function loadProducts() {
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;
    
    productGrid.innerHTML = products.map(product => `
        <div class="product-card" data-id="${product.id}" data-name="${product.name.toLowerCase()}" data-category="${product.category}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                ${product.badge ? `<span class="badge">${product.badge}</span>` : ''}
                <div class="product-overlay">
                    <button class="quick-view" onclick="showQuickView(${product.id})">Quick View</button>
                    <button class="add-to-cart" onclick="addToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                </div>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="price">$${product.price.toFixed(2)}</p>
                <div class="product-colors">
                    ${product.colors.map(color => `<span class="color-dot ${color}"></span>`).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartCount();
    saveCartToStorage();
    showNotification(`${product.name} added to cart!`);
}

function updateCartCount() {
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.textContent = count;
        
        // Animate the count update
        cartCountElement.style.animation = 'bounce 0.3s ease';
        setTimeout(() => {
            cartCountElement.style.animation = '';
        }, 300);
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    saveCartToStorage();
    if (window.location.pathname.includes('cart.html')) {
        loadCartPage();
    }
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartCount();
            saveCartToStorage();
            if (window.location.pathname.includes('cart.html')) {
                loadCartPage();
            }
        }
    }
}

function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const searchResultsGrid = document.getElementById('searchResultsGrid');
    const productGrid = document.getElementById('productGrid');
    
    if (!searchInput || !searchResults || !searchResultsGrid || !productGrid) return;
    
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        searchResults.style.display = 'none';
        productGrid.style.display = 'grid';
        return;
    }
    
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
    
    if (filteredProducts.length > 0) {
        searchResultsGrid.innerHTML = filteredProducts.map(product => `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                    ${product.badge ? `<span class="badge">${product.badge}</span>` : ''}
                    <div class="product-overlay">
                        <button class="quick-view" onclick="showQuickView(${product.id})">Quick View</button>
                        <button class="add-to-cart" onclick="addToCart(${product.id})">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                    </div>
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="price">$${product.price.toFixed(2)}</p>
                    <div class="product-colors">
                        ${product.colors.map(color => `<span class="color-dot ${color}"></span>`).join('')}
                    </div>
                </div>
            </div>
        `).join('');
        
        searchResults.style.display = 'block';
        productGrid.style.display = 'none';
    } else {
        searchResultsGrid.innerHTML = '<p style="text-align: center; padding: 2rem; color: #999;">No products found matching your search.</p>';
        searchResults.style.display = 'block';
        productGrid.style.display = 'none';
    }
}

function showQuickView(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.createElement('div');
    modal.className = 'quick-view-modal';
    modal.innerHTML = `
        <div class="quick-view-content">
            <span class="close" onclick="this.closest('.quick-view-modal').remove()">&times;</span>
            <div class="quick-view-body">
                <div class="quick-view-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="quick-view-info">
                    <h2>${product.name}</h2>
                    <p class="price">$${product.price.toFixed(2)}</p>
                    <p class="description">Premium quality hoodie made from 100% organic cotton. Features a comfortable regular fit, kangaroo pocket, and adjustable drawstring hood.</p>
                    <div class="quick-view-options">
                        <div class="option-group">
                            <label>Size:</label>
                            <select>
                                <option>S</option>
                                <option>M</option>
                                <option>L</option>
                                <option>XL</option>
                                <option>XXL</option>
                            </select>
                        </div>
                        <div class="option-group">
                            <label>Color:</label>
                            <div class="product-colors">
                                ${product.colors.map(color => `<span class="color-dot ${color}"></span>`).join('')}
                            </div>
                        </div>
                    </div>
                    <button class="btn-primary" onclick="addToCart(${product.id}); this.closest('.quick-view-modal').remove();">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function handleNewsletterSignup() {
    showNotification('Thank you for subscribing! Check your email for confirmation.');
    document.querySelector('.newsletter-form').reset();
}

function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        navMenu.classList.toggle('active');
    }
}

// CSS for new elements
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    .search-container {
        position: relative;
        display: flex;
        align-items: center;
    }
    
    .search-input {
        padding: 8px 35px 8px 12px;
        border: 1px solid #ddd;
        border-radius: 20px;
        width: 200px;
        transition: width 0.3s ease;
    }
    
    .search-input:focus {
        width: 250px;
        outline: none;
        border-color: var(--secondary-color);
    }
    
    .search-icon {
        position: absolute;
        right: 12px;
        cursor: pointer;
        color: #666;
    }
    
    .icon-link {
        color: white;
        text-decoration: none;
        transition: color 0.3s ease;
    }
    
    .icon-link:hover {
        color: var(--secondary-color);
    }
    
    .search-results {
        padding: 2rem 0;
        background: var(--gray-light);
    }
    
    .notification {
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--secondary-color);
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 4000;
        animation: slideIn 0.3s ease;
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes bounce {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
    }
    
    .quick-view-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        z-index: 3000;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .quick-view-content {
        background: white;
        border-radius: 10px;
        max-width: 800px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        position: relative;
    }
    
    .quick-view-body {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        padding: 2rem;
    }
    
    .quick-view-image img {
        width: 100%;
        border-radius: 10px;
    }
    
    .quick-view-info h2 {
        color: var(--primary-color);
        margin-bottom: 1rem;
    }
    
    .quick-view-info .price {
        font-size: 1.5rem;
        color: var(--secondary-color);
        font-weight: bold;
        margin-bottom: 1rem;
    }
    
    .quick-view-info .description {
        margin-bottom: 2rem;
        color: #666;
        line-height: 1.6;
    }
    
    .quick-view-options {
        margin-bottom: 2rem;
    }
    
    .option-group {
        margin-bottom: 1rem;
    }
    
    .option-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
    }
    
    .option-group select {
        padding: 8px 12px;
        border: 1px solid #ddd;
        border-radius: 5px;
        font-size: 1rem;
    }
    
    @media (max-width: 768px) {
        .quick-view-body {
            grid-template-columns: 1fr;
        }
        
        .search-input {
            width: 150px;
        }
        
        .search-input:focus {
            width: 200px;
        }
    }
`;

document.head.appendChild(additionalStyles);
