// Cart data
let cart = [];
let productDescription = "";

// Initialize on page load
document.addEventListener("DOMContentLoaded", function() {
    // Load product description
    loadProductDescription();

    // Update cart count
    updateCartDisplay();
});

// Toggle Sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar.style.right === "0px") {
        sidebar.style.right = "-250px";
    } else {
        sidebar.style.right = "0px";
    }
}

// Toggle overlay
function toggleOverlay() {
    const overlay = document.getElementById('tiled-overlay');
    const toggle = document.getElementById('overlayToggle');
    
    if (overlay.style.display === "none") {
        overlay.style.display = "block";
        toggle.classList.add('active');
        logToConsole("Overlay enabled");
    } else {
        overlay.style.display = "none";
        toggle.classList.remove('active');
        logToConsole("Overlay disabled");
    }
}

// Log messages to console
function logToConsole(message) {
    const console = document.getElementById('console');
    console.textContent = message;
    
    // Clear console after 3 seconds
    setTimeout(() => {
        console.textContent = "console";
    }, 3000);
}

// Load product description
function loadProductDescription() {
    // This could fetch from a file or API
    // For now we'll use a hardcoded description
    fetch('assets/product-description.txt')
        .then(response => {
            if (!response.ok) {
                throw new Error('Product description file not found');
            }
            return response.text();
        })
        .then(text => {
            productDescription = text;
            document.getElementById('productDescription').textContent = text;
        })
        .catch(error => {
            // Fallback description if file not found
            const fallbackDesc = "Original SKIPTSKOOL t-shirt. 100% cotton, premium quality. The perfect statement piece for any occasion.";
            productDescription = fallbackDesc;
            document.getElementById('productDescription').textContent = fallbackDesc;
            logToConsole("Using default product description");
        });
}

// Add to cart functionality
function addToCart() {
    const size = document.getElementById('productSize').value;
    const quantity = parseInt(document.getElementById('productQuantity').value);
    
    if (quantity <= 0) {
        logToConsole("Please select a valid quantity");
        return;
    }
    
    // Create product object
    const product = {
        id: 1, // For now we only have one product
        name: "SKIPTSKOOL T-shirt",
        price: 25.00,
        size: size,
        quantity: quantity
    };
    
    // Check if product with same size already exists in cart
    const existingProductIndex = cart.findIndex(item => 
        item.id === product.id && item.size === product.size
    );
    
    if (existingProductIndex !== -1) {
        // Update quantity if product already exists
        cart[existingProductIndex].quantity += quantity;
        logToConsole(`Updated quantity of ${product.name} (${size})`);
    } else {
        // Add new product to cart
        cart.push(product);
        logToConsole(`Added ${product.name} (${size}) to cart`);
    }
    
    // Update cart display
    updateCartDisplay();
}

// Update cart display
function updateCartDisplay() {
    const cartItemsElement = document.getElementById('cartItems');
    const cartCountElement = document.querySelector('.cart-count');
    const cartTotalElement = document.getElementById('cartTotal');
    
    // Clear current cart display
    cartItemsElement.innerHTML = '';
    
    // Calculate total items and price
    let totalItems = 0;
    let totalPrice = 0;
    
    // Add each item to the cart display
    cart.forEach(item => {
        totalItems += item.quantity;
        totalPrice += item.price * item.quantity;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-size">Size: ${item.size}</div>
            </div>
            <div class="cart-item-quantity">
                <button onclick="decreaseQuantity(${cart.indexOf(item)})">-</button>
                <span>${item.quantity}</span>
                <button onclick="increaseQuantity(${cart.indexOf(item)})">+</button>
            </div>
            <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
            <button onclick="removeFromCart(${cart.indexOf(item)})">×</button>
        `;
        
        cartItemsElement.appendChild(itemElement);
    });
    
    // Update count and total
    cartCountElement.textContent = `${totalItems} item${totalItems !== 1 ? 's' : ''}`;
    cartTotalElement.textContent = `$${totalPrice.toFixed(2)}`;
}

// Increase item quantity
function increaseQuantity(index) {
    cart[index].quantity++;
    updateCartDisplay();
    logToConsole(`Increased quantity of ${cart[index].name}`);
}

// Decrease item quantity
function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity--;
        updateCartDisplay();
        logToConsole(`Decreased quantity of ${cart[index].name}`);
    } else {
        removeFromCart(index);
    }
}

// Remove item from cart
function removeFromCart(index) {
    const removed = cart.splice(index, 1);
    updateCartDisplay();
    logToConsole(`Removed ${removed[0].name} from cart`);
}