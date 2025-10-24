const products = [
    { name: 'Rose Candle (Frangrance)', category: 'CANDLE', color: 'PINK', price: 45, img: 'img/pikcan.png', oldPrice: 60 },
    { name: 'Eucalyptus Candle (Frangrance)', category: 'CANDLE', color: 'GREEN', price: 45, img: 'img/grcan.jpg', oldPrice: 60 },
    { name: 'Wild Blossom Candle (Frangrance)', category: 'CANDLE', color: 'PURPLE', price: 45, img: 'img/pur can.jpg', oldPrice: 60 },
    { name: 'Pink Candle (Non Fragnented)', category: 'CANDLE', color: 'PINK', price: 35, img: 'img/pink.png', oldPrice: 50 },
    { name: 'Red Candle (Non Fragnented)', category: 'CANDLE', color: 'RED', price: 35, img: 'img/redcan.jpg', oldPrice: 50 },
    { name: 'Blue Candle (Non Fragnented)', category: 'CANDLE', color: 'BLUE', price: 35, img: 'img/blu.webp', oldPrice: 50 },
    { name: 'Yellow Candle (Non Fragnented)', category: 'CANDLE', color: 'YELLOW', price: 35, img:'img/yelcan.png', oldPrice: 50 },
    { name: 'Purple Candle (Non Fragnented)', category: 'CANDLE', color: 'PURPLE', price: 35, img: 'img/pur can.jpg', oldPrice: 50 },
    { name: 'French Green Clay Soap', category: 'SOAP', color: 'GREEN', price: 59, img: 'img/green soap.jpg', oldPrice: 99 },
    { name: 'Rose Clay Soap', category: 'SOAP', color: 'PINK', price: 59, img: 'img/rosesoap.png', oldPrice: 99 },
    { name: 'Red Moroccan Clay Soap', category: 'SOAP', color: 'RED', price: 59, img: 'img/redmor.webp', oldPrice: 99 },
    { name: 'Organic Accessories', category: 'ACCESSORIES', color: '', price: 849, img: 'img/combo.webp', oldPrice:    1050 }
];
// FILTER STATE
let activeCategory = 'All Products';
const filters = { price: 3000, colors: [] };

// RENDER PRODUCTS
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

// FILTER LOGIC
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
        document.getElementById('section-title').innerText = (
            activeCategory === "CANDLE"
                ? "Browse Our Fragrant Candles"
                : activeCategory === "SOAP"
                ? "Soap Collection"
                : activeCategory === "ACCESSORIES"
                ? "Explore Accessories"
                : "All Products"
        );
        renderProducts(getFilteredProducts());
    }
});
// CART (simple counter)
let cartCount = 0;
function showCartMsg() {
    const msg = document.getElementById('cart-msg');
    msg.style.display = 'block';
    setTimeout(() => { msg.style.display = 'none'; }, 1500);
}
document.body.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-cart-btn')) {
        cartCount++;
        document.getElementById('cart-count').innerText = cartCount;
        showCartMsg();
    }
});
// SEARCH
document.getElementById('search-bar').addEventListener('input', function(e) {
    const val = e.target.value.trim().toLowerCase();
    let filtered = getFilteredProducts().filter(p => p.name.toLowerCase().includes(val));
    renderProducts(filtered);
});
// PRICE
document.getElementById('price-range').addEventListener('input', function(e) {
    filters.price = parseInt(e.target.value);
    document.getElementById('price-value').innerText = `Up to ₹${e.target.value}`;
    renderProducts(getFilteredProducts());
});
// COLOR
Array.from(document.getElementsByClassName('color-filter')).forEach(input => {
    input.addEventListener('change', function() {
        filters.colors = Array.from(document.getElementsByClassName('color-filter'))
            .filter(c => c.checked).map(c => c.value);
        renderProducts(getFilteredProducts());
    });
});
// INITIAL RENDER
renderProducts(getFilteredProducts());

// ICON STUBS
document.getElementById('cart-icon').onclick = () => alert('Cart is under development!');
document.getElementById('user-icon').onclick = () => alert('User page is under development!');

document.getElementById('cart-icon').onclick = function(e) {
    e.preventDefault();  // Prevents link navigation
    document.getElementById('cart-modal').classList.add('show');
};
// Replace with your actual EmailJS public key!
emailjs.init("6f4rd0FRUfOgpoQYv");

document.getElementById('order-form').onsubmit = function(e){
    e.preventDefault();
    // Build cart data
    let orderList = "";
    let total = 0;
    cartItems.forEach(item => {
        orderList += `${item.product.name} × ${item.qty} = ₹${item.product.price*item.qty}\n`;
        total += item.product.price * item.qty;
    });
    // Get name & email from form fields
    const name = document.getElementById('user-name').value;
    const email = document.getElementById('user-email').value;
    // Params to match EmailJS template variables
    const params = {
        to_email: 'tharunkishore96@gmail.com',
        from_name: name,
        reply_to: email,
        order_list: orderList,
        total: `₹${total}`
    };
    // Show sending message
    document.getElementById('order-status').textContent = 'Sending order...';
    // Replace with your actual service & template IDs from EmailJS dashboard
    emailjs.send("service_17802oa", "template_x0gerco", params)
      .then(() => {
          document.getElementById('order-status').textContent = 'Order placed! Confirmation sent.';
          // Optionally clear cart and UI
      }, (err) => {
          document.getElementById('order-status').textContent = 'Order failed. Try again.';
          console.log('EmailJS error:', err);
      });
};
// --- EmailJS ---
emailjs.init("6f4rd0FRUfOgpoQYv");

// --- Cart management ---
let cartItems = [];
function updateCartDisplay() {
    document.getElementById('cart-count').innerText = cartItems.reduce((sum, item)=>sum+item.qty,0);
    const list = document.getElementById('cart-list');
    list.innerHTML = '';
    let total = 0;
    cartItems.forEach((item, idx)=>{
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

// --- Add products to cart ---
document.body.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-cart-btn')) {
        const prodIdx = Number(e.target.dataset.index);
        const found = cartItems.find(item=>item.product.name===products[prodIdx].name);
        if(found) found.qty++;
        else cartItems.push({product:products[prodIdx],qty:1});
        updateCartDisplay();
        showCartMsg && showCartMsg();
    }
});

// --- Cart Modal Logic ---
const cartModal = document.getElementById('cart-modal');
document.getElementById('cart-icon').onclick = (e) => {
    e.preventDefault();
    cartModal.classList.add('show');
    updateCartDisplay();
};
document.querySelector('.close-cart-btn').onclick = () => cartModal.classList.remove('show');

// --- EmailJS order placement handler ---
document.getElementById('order-form').onsubmit = function(e){
    e.preventDefault();
    if(cartItems.length===0) {
        document.getElementById('order-status').textContent = 'Cart is empty!';
        return;
    }
    const name = document.getElementById('user-name').value;
    const email = document.getElementById('user-email').value;
    let orderList = "";
    cartItems.forEach(item=>{
      orderList += `${item.product.name} × ${item.qty} = ₹${item.product.price*item.qty}\n`;
    });
    const params = {
      to_email: 'tharunkishore96@gmail.com',
      from_name: name,
      reply_to: email,
      order_list: orderList,
      total: document.getElementById('cart-total').innerText
    };
    document.getElementById('order-status').textContent = 'Sending order...';
    emailjs.send("service_17802oa", "template_x0gerco", params)
     .then(() => {
         document.getElementById('order-status').textContent = 'Order placed! Confirmation sent.';
         cartItems = [];
         updateCartDisplay();
         setTimeout(()=> {
            cartModal.classList.remove('show');
            document.getElementById('order-status').textContent='';
         }, 2000);
      }, (err) => {
         document.getElementById('order-status').textContent = 'Order failed. Try again.';
      });
};
