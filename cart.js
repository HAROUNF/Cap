// Cart page functionality
document.addEventListener('DOMContentLoaded', function() {
    loadCartPage();
});

function loadCartPage() {
    const cartItemsContainer = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    const cartSummary = document.getElementById('cartSummary');
    
    if (!cartItemsContainer || !emptyCart || !cartSummary) return;
    
    // Load cart from storage
    const savedCart = localStorage.getItem('cart');
    const cart = savedCart ? JSON.parse(savedCart) : [];
    
    if (cart.length === 0) {
        cartItemsContainer.style.display = 'none';
        emptyCart.style.display = 'block';
        cartSummary.style.display = 'none';
    } else {
        cartItemsContainer.style.display = 'block';
        emptyCart.style.display = 'none';
        cartSummary.style.display = 'block';
        
        // Display cart items
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                    <div class="cart-item-quantity">
                        <span>Quantity:</span>
                        <div class="quantity-controls">
                            <button class="quantity-btn" onclick="updateCartItem(${item.id}, -1)">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn" onclick="updateCartItem(${item.id}, 1)">+</button>
                        </div>
                    </div>
                </div>
                <div class="cart-item-actions">
                    <button class="remove-item" onclick="removeCartItem(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
        
        // Calculate totals
        updateCartTotals(cart);
    }
}

function updateCartItem(productId, change) {
    const savedCart = localStorage.getItem('cart');
    let cart = savedCart ? JSON.parse(savedCart) : [];
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeCartItem(productId);
            return;
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCartPage();
        updateParentCartCount();
    }
}

function removeCartItem(productId) {
    if (confirm('Remove this item from your cart?')) {
        const savedCart = localStorage.getItem('cart');
        let cart = savedCart ? JSON.parse(savedCart) : [];
        
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        
        loadCartPage();
        updateParentCartCount();
    }
}

function updateCartTotals(cart) {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = 10.00;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;
    
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = `$${shipping.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

function updateParentCartCount() {
    // Update cart count on parent page (if it's open)
    if (window.opener && !window.opener.closed) {
        window.opener.updateCartCount();
    }
}

function proceedToCheckout() {
    const savedCart = localStorage.getItem('cart');
    const cart = savedCart ? JSON.parse(savedCart) : [];
    
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // Here you would typically redirect to payment processing
    alert('Redirecting to checkout...');
    console.log('Proceeding to checkout with:', cart);
}

// Add some styles for the cart page
const cartPageStyles = document.createElement('style');
cartPageStyles.textContent = `
    .cart-item-details {
        flex: 1;
    }
    
    .cart-item-actions {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 1rem;
    }
    
    @media (max-width: 768px) {
        .cart-item-actions {
            flex-direction: row;
            justify-content: space-between;
            grid-column: 1 / -1;
        }
    }
`;
document.head.appendChild(cartPageStyles);