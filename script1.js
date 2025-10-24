const products = [
    { name: 'Rose Candle (Frangrance)', category: 'CANDLE', color: 'PINK', price: 45, img: 'pikcan.png', oldPrice: 60 },
    { name: 'Eucalyptus Candle (Frangrance)', category: 'CANDLE', color: 'GREEN', price: 45, img: 'grcan.jpg', oldPrice: 60 },
    { name: 'Wild Blossom Candle (Frangrance)', category: 'CANDLE', color: 'PURPLE', price: 45, img: 'pur can.jpg', oldPrice: 60 },
    { name: 'Pink Candle (Non Fragnented)', category: 'CANDLE', color: 'PINK', price: 35, img: 'pink.png', oldPrice: 50 },
    { name: 'Red Candle (Non Fragnented)', category: 'CANDLE', color: 'RED', price: 35, img: 'redcan.jpg', oldPrice: 50 },
    { name: 'Blue Candle (Non Fragnented)', category: 'CANDLE', color: 'BLUE', price: 35, img: 'blu.webp', oldPrice: 50 },
    { name: 'Yellow Candle (Non Fragnented)', category: 'CANDLE', color: 'YELLOW', price: 35, img:'yelcan.png', oldPrice: 50 },
    { name: 'Purple Candle (Non Fragnented)', category: 'CANDLE', color: 'PURPLE', price: 35, img: 'pur can.jpg', oldPrice: 50 },
    { name: 'French Green Clay Soap', category: 'SOAP', color: 'GREEN', price: 59, img: 'green soap.jpg', oldPrice: 99 },
    { name: 'Rose Clay Soap', category: 'SOAP', color: 'PINK', price: 59, img: 'rosesoap.png', oldPrice: 99 },
    { name: 'Red Moroccan Clay Soap', category: 'SOAP', color: 'RED', price: 59, img: 'redmor.webp', oldPrice: 99 },
    { name: 'Organic Accessories', category: 'ACCESSORIES', color: '', price: 849, img: 'combo.webp', oldPrice: 1050 }
];
let cartItems = [];
let activeCategory = 'All Products';
const filters = { price: 849, colors: [] };

// Render products to grid
function renderProducts(list) {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';
    list.forEach((product, i) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.img}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="price"><span class="old-price">₹${product.oldPrice}</span> ₹${product.price}
                <span class="discount">${Math.round((1 - (product.price/product.oldPrice))*100)}% OFF</span></p>
                <button class="add-cart-btn" data-index="${i}">Add to Cart</button>
            </div>
        `;
        grid.appendChild(card);
    });
}
function getFilteredProducts() {
    let filtered = products.filter(p => p.price <= filters.price);
    if (activeCategory !== 'All Products') {
        filtered = filtered.filter(p => p.category.toUpperCase() === activeCategory.toUpperCase());
    }
    if (filters.colors.length) {
        filtered = filtered.filter(p => filters.colors.includes(p.color));
    }
    return filtered;
}
document.getElementById('nav-menu').addEventListener('click', function(e) {
    if (e.target.tagName === 'A') {
        e.preventDefault();
        activeCategory = e.target.dataset.section;
        document.getElementById('section-title').innerText =
            activeCategory === "CANDLE"
                ? "Browse Our Fragrant Candles"
                : activeCategory === "SOAP"
                ? "Soap Collection"
                : activeCategory === "ACCESSORIES"
                ? "Explore Accessories"
                : "All Products";
        renderProducts(getFilteredProducts());
    }
});

document.body.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-cart-btn')) {
        const idx = Number(e.target.dataset.index);
        let found = cartItems.find(item => item.product.name === products[idx].name);
        if(found) found.qty++;
        else cartItems.push({product:products[idx],qty:1});
        updateCartDisplay();
        showCartMsg();
    }
});
document.getElementById('search-bar').addEventListener('input', function(e) {
    const val = e.target.value.trim().toLowerCase();
    let filtered = getFilteredProducts().filter(p => p.name.toLowerCase().includes(val));
    renderProducts(filtered);
});
document.getElementById('price-range').addEventListener('input', function(e) {
    filters.price = parseInt(e.target.value);
    document.getElementById('price-value').innerText = `Up to ₹${e.target.value}`;
    renderProducts(getFilteredProducts());
});
Array.from(document.getElementsByClassName('color-filter')).forEach(input => {
    input.addEventListener('change', function() {
        filters.colors = Array.from(document.getElementsByClassName('color-filter'))
            .filter(c => c.checked).map(c => c.value);
        renderProducts(getFilteredProducts());
    });
});
renderProducts(getFilteredProducts());

// --- Cart modal logic
function updateCartDisplay() {
    document.getElementById('cart-count').innerText = cartItems.reduce((sum, item)=>sum+item.qty,0);
    const list = document.getElementById('cart-list');
    list.innerHTML = '';
    let total = 0;
    cartItems.forEach((item, idx) => {
        total += item.product.price * item.qty;
        list.innerHTML += `<li>
          <img src="${item.product.img}" style="height:40px;vertical-align:middle;margin-right:5px;">
          ${item.product.name} × ${item.qty} = ₹${item.product.price*item.qty}
          <button onclick="removeFromCart(${idx})" style="background:#eee;border:none;color:#f00;cursor:pointer;">Remove</button>
        </li>`;
    });
    document.getElementById('cart-total').innerText = `Total: ₹${total}`;
}
window.removeFromCart = function(idx) {
    cartItems.splice(idx,1);updateCartDisplay();
}
document.getElementById('cart-icon').onclick = function(e) {
    e.preventDefault();
    document.getElementById('cart-modal').classList.add('show');
    updateCartDisplay();
};
document.querySelector('.close-cart-btn').onclick = function() {
    document.getElementById('cart-modal').classList.remove('show');
};
document.getElementById('order-form').onsubmit = function(e){
    e.preventDefault();
    if(cartItems.length===0) {
        document.getElementById('order-status').textContent = 'Cart is empty!';
        return;
    }
    const name = document.getElementById('user-name').value;
    const email = document.getElementById('user-email').value;
    let orderList = "";
    let total = 0;
    cartItems.forEach(item=>{
        orderList += `${item.product.name} × ${item.qty} = ₹${item.product.price*item.qty}\n`;
        total += item.product.price * item.qty;
    });
    const whatsappLink = `https://wa.me/918825838787?text=${encodeURIComponent(
      `Order from ${name} (${email})\n${orderList}Total: ₹${total}`
    )}`;
    window.open(whatsappLink, "_blank");
    setTimeout(() => {
      cartItems = [];
      updateCartDisplay();
      document.getElementById('cart-modal').classList.remove('show');
      document.getElementById('user-name').value = '';
      document.getElementById('user-email').value = '';
      document.getElementById('order-status').textContent = '';
    }, 2000);
};
document.getElementById('user-icon').onclick = () => alert('User page is under development!');
function showCartMsg() {
    const msg = document.getElementById('cart-msg');
    msg.style.display = 'block';
    setTimeout(() => { msg.style.display = 'none'; }, 1500);
}

