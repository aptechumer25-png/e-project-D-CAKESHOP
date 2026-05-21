function zoomImage(imageSrc) {
    let newWindow = window.open("", "Zoom", "width=600,height=600");
    newWindow.document.write("<img src='" + imageSrc + "' width='100%'>");
}

// 1. Sab data ko ek jagah map karein
const categoryDataMap = {
    "Birthday": typeof productBirthay !== 'undefined' ? productBirthay.productBday : [],
    "Anniversary": typeof productAnniversary !== 'undefined' ? productAnniversary.productAnniversary : [],
    "Engagement": typeof productEngagement !== 'undefined' ? productEngagement.productEngagement : [],
    "Marriage": typeof productMarriage !== 'undefined' ? productMarriage.productMarriage : [],
    "Eid": typeof productEid !== 'undefined' ? productEid.productEid : [],
    "FathersDay": typeof productFathersDay !== 'undefined' ? productFathersDay.productFathersDay : []
};

// 2. Function jo automatic aur limit ke mutabiq products load karega
function displayProducts() {
    const containers = document.querySelectorAll(".dynamic-product-container");

    containers.forEach(container => {
        const categoryKey = container.getAttribute("data-category");
        let products = categoryDataMap[categoryKey];

        if (!products || products.length === 0) {
            console.error("Data not found for category:", categoryKey);
            return;
        }

        // --- LIMIT LOGIC HERE ---
        const limit = container.getAttribute("data-limit");
        if (limit) {
            products = products.slice(0, parseInt(limit));
        }

        container.innerHTML = ""; // Purana content clear karein

        products.forEach(pro => {
            let title = pro.product_title || "Special Cake";
            let imgSrc = pro.image || "Images/placeholder.jpg";

            // FIXED TEMPLATE: heart-btn is now properly structured outside <ul>
            let card = `
            <div class="col-md-6 col-lg-4 col-xl-3 mb-4">
              <div class="single-product">
                <div class="part-1">
                  <button class="heart-btn"><i class="fa-regular fa-heart"></i></button>
                  <img src="${imgSrc}" class="product-img" style="cursor:pointer;" onclick="zoomImage('${imgSrc}')">
                  <span class="badge-type">${pro.type}</span>
                  <ul>
                    <li><a href="#" class="add-to-cart-btn" data-category="${categoryKey}" data-code="${pro.item_code}"><i class="fas fa-shopping-cart"></i></a></li>
             <li><a href="#" onclick="zoomImage('${imgSrc}'); return false;"><i class="fas fa-expand"></i></a></li>
                  </ul>
                </div>
                <div class="part-2">
                  <h5 class="item_code">${pro.item_code}</h5>
                  <h3 class="product-title">${title}</h3>
                  <h4 class="product-old-price">Rs. ${pro.old_price}</h4>
                  <h4 class="product-price">Rs. ${pro.price}</h4>
                </div>
              </div>
            </div>`;
            container.innerHTML += card;
        });
    });
}

// 3. Page load hote hi function chalao
document.addEventListener("DOMContentLoaded", () => {
    displayProducts();
    updateCartCount();
});

// 4. Universal Add to Cart Click Listener
document.addEventListener("click", function (e) {
    let btn = e.target.closest(".add-to-cart-btn");
    if (btn) {
        e.preventDefault();
        let category = btn.getAttribute("data-category");
        let code = btn.getAttribute("data-code");
        addToCart(category, code);
    }
});

// Cart variable initialization
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// 5. Universal Add to Cart function
function addToCart(category, itemCode) {
    let productsList = categoryDataMap[category];
    if (!productsList) return;

    let product = productsList.find(p => p.item_code === itemCode);
    if (!product) return;

    let existing = cart.find(p => p.item_code === itemCode);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    alert(`${product.product_title || 'Product'} added to cart!`);
}

// Update cart count in navbar
function updateCartCount() {
    let count = cart.reduce((sum, item) => sum + item.qty, 0);
    let el = document.getElementById("cart-count");
    if (el) el.innerText = count;
}

// Render Cart page
function renderCart() {
    let container = document.getElementById("cart-items");
    if (!container) return;

    container.innerHTML = "";
    if (cart.length === 0) {
        container.innerHTML = "<p>Your cart is empty.</p>";
        document.getElementById("cart-total").innerText = "0";
        return;
    }

    let total = 0;

    cart.forEach((item, index) => {
        let price = parseInt(item.price.replace(/,/g, '').trim()) || 0;
        total += price * item.qty;
        let imgSrc = item.image || "Images/default-placeholder.png";

        let div = document.createElement("div");
        div.className = "row cart-item align-items-center mb-3";
        div.innerHTML = `
            <div class="col-md-2"><img src="${imgSrc}" class="cart-img img-fluid"></div>
            <div class="col-md-3"><h5>${item.product_title}</h5><small>${item.category}</small></div>
            <div class="col-md-2">Rs. ${price}</div>
            <div class="col-md-3">
                <button class="btn btn-sm btn-secondary minus-btn">-</button>
                <input type="text" class="qty-input" value="${item.qty}" readonly>
                <button class="btn btn-sm btn-secondary plus-btn">+</button>
            </div>
            <div class="col-md-2"><span class="remove-btn"><i class="fas fa-trash"></i></span></div>
        `;

        div.querySelector(".plus-btn").addEventListener("click", () => { item.qty++; saveCartRender(); });
        div.querySelector(".minus-btn").addEventListener("click", () => { if (item.qty > 1) { item.qty--; saveCartRender(); } });
        div.querySelector(".remove-btn").addEventListener("click", () => { cart.splice(index, 1); saveCartRender(); });

        container.appendChild(div);
    });

    document.getElementById("cart-total").innerText = total;
}

function saveCartRender() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    renderCart();
}

// Checkout button
function setupCheckout() {
    let btn = document.getElementById("checkout-btn");
    if (btn) {
        btn.addEventListener("click", () => {
            localStorage.setItem("cart", JSON.stringify(cart));
            window.location.href = "checkout.html";
        });
    }
}

// Initialize Cart page
function initCartPage() {
    renderCart();
    setupCheckout();
}

// Heart Button Toggle State Listener
document.addEventListener("click", function (e) {
    let heartBtn = e.target.closest(".heart-btn");

    if (heartBtn) {
        e.preventDefault();
        heartBtn.classList.toggle("active");
        let icon = heartBtn.querySelector("i");

        if (heartBtn.classList.contains("active")) {
            icon.classList.remove("fa-regular");
            icon.classList.add("fa-solid");
        } else {
            icon.classList.remove("fa-solid");
            icon.classList.add("fa-regular");
        }
    }
});