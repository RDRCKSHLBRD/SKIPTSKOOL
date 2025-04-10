const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

// Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Create assets directory if it doesn't exist
const assetsDir = path.join(__dirname, 'public', 'assets');
if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
    console.log('Created assets directory');
}

// Default product description
const defaultDescription = "Original SKIPTSKOOL t-shirt. 100% cotton, premium quality. The perfect statement piece for any occasion.";

// Try to read product description file or use default
let productDescription = defaultDescription;
const descriptionPath = path.join(assetsDir, 'product-description.txt');

try {
    if (fs.existsSync(descriptionPath)) {
        productDescription = fs.readFileSync(descriptionPath, 'utf8');
        console.log('Loaded product description from file');
    } else {
        // Create the description file with default text if it doesn't exist
        fs.writeFileSync(descriptionPath, defaultDescription);
        console.log('Created product description file with default text');
    }
} catch (error) {
    console.error('Error handling product description file:', error);
}

// Product data (simplified for now)
const products = [
    {
        id: 1,
        name: "SKIPTSKOOL T-shirt",
        price: 25.00,
        description: productDescription
    }
];

// Get product description
app.get('/api/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
});

// Handle cart operations
let carts = {}; // Using memory storage for simplicity

// Get cart
app.get('/api/cart/:cartId', (req, res) => {
    const cartId = req.params.cartId;
    const cart = carts[cartId] || [];
    res.json(cart);
});

// Add to cart
app.post('/api/cart/:cartId', (req, res) => {
    const cartId = req.params.cartId;
    const { productId, size, quantity } = req.body;
    
    if (!carts[cartId]) {
        carts[cartId] = [];
    }
    
    const product = products.find(p => p.id === parseInt(productId));
    
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if product already exists in cart
    const existingProductIndex = carts[cartId].findIndex(item => 
        item.id === parseInt(productId) && item.size === size
    );
    
    if (existingProductIndex !== -1) {
        // Update quantity
        carts[cartId][existingProductIndex].quantity += parseInt(quantity);
    } else {
        // Add new item
        carts[cartId].push({
            id: product.id,
            name: product.name,
            price: product.price,
            size: size,
            quantity: parseInt(quantity)
        });
    }
    
    res.json(carts[cartId]);
});

// Update cart item
app.put('/api/cart/:cartId/:itemIndex', (req, res) => {
    const cartId = req.params.cartId;
    const itemIndex = parseInt(req.params.itemIndex);
    const { quantity } = req.body;
    
    if (!carts[cartId] || !carts[cartId][itemIndex]) {
        return res.status(404).json({ message: 'Cart item not found' });
    }
    
    // Update quantity
    carts[cartId][itemIndex].quantity = parseInt(quantity);
    
    // Remove if quantity is 0
    if (carts[cartId][itemIndex].quantity <= 0) {
        carts[cartId].splice(itemIndex, 1);
    }
    
    res.json(carts[cartId]);
});

// Remove from cart
app.delete('/api/cart/:cartId/:itemIndex', (req, res) => {
    const cartId = req.params.cartId;
    const itemIndex = parseInt(req.params.itemIndex);
    
    if (!carts[cartId] || !carts[cartId][itemIndex]) {
        return res.status(404).json({ message: 'Cart item not found' });
    }
    
    // Remove item
    carts[cartId].splice(itemIndex, 1);
    
    res.json(carts[cartId]);
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});