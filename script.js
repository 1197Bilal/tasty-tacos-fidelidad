// --- DATOS ---
const MENU = {
    tacos: [
        { name: "Taco Tender", priceSolo: 6.95, priceMenu: 8.95, img: "assets/taco_tender.jpg", desc: "Tenders de pollo, salsa queso.", badge: "🏆 TOP VENTAS" },
        { name: "Taco Cordon Bleu", priceSolo: 6.95, priceMenu: 8.95, img: "assets/taco_cordon_bleu.jpg", desc: "Cordon Bleu crujiente, salsa queso.", badge: "⭐ FAVORITO" },
        { name: "Taco Kifta", priceSolo: 5.95, priceMenu: 7.95, img: "assets/taco_kifta.jpg", desc: "Carne picada especiada, salsa queso." },
        { name: "Taco Pollo Curry", priceSolo: 5.95, priceMenu: 7.95, img: "assets/taco_pollo_curry.jpg", desc: "Pollo marinado al curry, salsa queso." },
        { name: "Taco Mixto", priceSolo: 6.95, priceMenu: 8.95, img: "assets/taco_mixto.jpg", desc: "Pollo + Ternera, salsa queso." }
    ],
    burgers: [
        { name: "Big Cabra", priceSolo: 7.50, priceMenu: 9.50, img: "assets/burger1.jpg", desc: "100g Ternera, Queso Cabra, Cebolla C.", badge: "⭐ FAVORITO" },
        { name: "Doble Cheese", priceSolo: 4.50, priceMenu: 6.50, img: "assets/burger1.jpg", desc: "Doble carne, Doble Cheddar." },
        { name: "Burger Pollo", priceSolo: 5.95, priceMenu: 7.95, img: "assets/burger2.jpg", desc: "Pollo crujiente, Lechuga, Mayo." }
    ],
    bowls: [
        { name: "Bowl Tenders", priceSolo: 7.95, noMenu: true, img: "assets/bowl.jpg", desc: "Base patatas, Tenders de Pollo, Salsa Queso.", badge: "🔥 TOP VENTAS" },
        { name: "Bowl Cordon Bleu", priceSolo: 7.95, noMenu: true, img: "assets/bowl.jpg", desc: "Base patatas, Cordon Bleu, Salsa Queso." },
        { name: "Kifta Bowl", priceSolo: 6.95, noMenu: true, img: "assets/bowl.jpg", desc: "Base patatas, Ternera, Bacon, Mozzarella." },
        { name: "Pollo Curry Bowl", priceSolo: 6.95, noMenu: true, img: "assets/bowl.jpg", desc: "Base patatas, Pollo Curry, Cheddar." }
    ],
    extras: [
        { name: "Nuggets x6", priceSolo: 3.90, noMenu: true, img: "assets/nuggets_balls.jpg" },
        { name: "Bacon Cheese Fries", priceSolo: 2.50, noMenu: true, img: "assets/bacon_cheese_fries.jpg", badge: "NUEVO" },
        { name: "Bebida Extra", priceSolo: 1.90, noMenu: true, isDrink: true, img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300" },
        { name: "Postre", priceSolo: 3.50, noMenu: true, img: "assets/dessert.jpg" }
    ]
};

const SALSAS = ["Pita", "Mahonesa", "Barbacoa", "Ketchup", "Andaluza", "Curry", "Samurai", "Tasty", "Biggy"];

const BEBIDAS = [
    // Nacionales
    { name: "Coca-Cola", type: "nac" },
    { name: "Coca-Cola Zero", type: "nac" },
    { name: "Aquarius Limón", type: "nac" },
    { name: "Aquarius Naranja", type: "nac" },
    { name: "Fanta Limón", type: "nac" },
    { name: "Fanta Naranja", type: "nac" },
    { name: "Nestea Limón", type: "nac" },
    { name: "Nestea Maracuyá", type: "nac" },
    { name: "SevenUp", type: "nac" },
    // Importadas
    { name: "Coca-Cola Cherry", type: "imp" },
    { name: "Orangina", type: "imp" },
    { name: "Oasis Tropical", type: "imp" },
    { name: "Oasis Frambuesa", type: "imp" },
    { name: "SevenUp Mojito", type: "imp" },
    { name: "Schweppes Agrum", type: "imp" },
    { name: "Lipton Melocotón", type: "imp" },
    { name: "Tropico", type: "imp" },
    { name: "Hawai", type: "imp" },
    { name: "Poms", type: "imp" },
    { name: "Red Bull", type: "imp", surcharge: 0.60 }
];

let cart = [];
let tempItem = {};
let currentDeliveryMode = 'delivery'; // 'pickup' | 'delivery'
let deliveryFee = 2.00;

// --- FIREBASE CONFIG ---
const firebaseConfig = {
    apiKey: "AIzaSyCu1hJhcWUSts2Mx5EEIJaSYHZvohnuXrc",
    authDomain: "tasty-tacos-villalba-app.firebaseapp.com",
    projectId: "tasty-tacos-villalba-app",
    storageBucket: "tasty-tacos-villalba-app.firebasestorage.app",
    messagingSenderId: "193111830606",
    appId: "1:193111830606:web:b529f2d5bd88de5974d31f"
};

// Start Firebase
let db;
try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    console.log("Firebase Conectado 🔥");
} catch (e) {
    console.error("Error Firebase:", e);
}

// --- INICIALIZAR ---
window.onload = function () {
    renderSection('tacos', MENU.tacos, 'tacos-container');
    renderSection('burgers', MENU.burgers, 'burgers-container');
    renderSection('bowls', MENU.bowls, 'bowls-container');

    // Render Extras
    const extraCont = document.getElementById('extras-container');
    MENU.extras.forEach(item => {
        const action = item.isDrink
            ? `onclick="openConfig('${item.name}', ${item.priceSolo}, 0)"`
            : `onclick="addSimple('${item.name}', ${item.priceSolo})"`;

        extraCont.innerHTML += `
            <div class="bg-card p-3 rounded-xl border border-white/5 text-center">
                <div class="h-24 bg-black rounded-lg mb-2 overflow-hidden"><img src="${item.img}" class="w-full h-full object-cover"></div>
                <h3 class="font-display font-bold text-sm text-white">${item.name}</h3>
                <div class="flex justify-between items-center mt-2">
                    <span class="text-secondary font-bold">${item.priceSolo.toFixed(2)}€</span>
                    <button ${action} class="bg-[#333] hover:bg-primary text-white w-7 h-7 rounded flex items-center justify-center">+</button>
                </div>
            </div>`;
    });

    // Forzar UI a modo Delivery por defecto
    setDeliveryMode('delivery');

    // Cargar datos usuario si existen
    loadUserData();
};

function loadUserData() {
    const savedName = localStorage.getItem('tasty_name');
    const savedPhone = localStorage.getItem('tasty_phone');
    const savedAddr = localStorage.getItem('tasty_address');
    const ordersCount = localStorage.getItem('tasty_orders') || 0;

    if (savedName) document.getElementById('cust-name').value = savedName;
    if (savedPhone) document.getElementById('cust-phone').value = savedPhone;
    if (savedAddr) document.getElementById('cust-address').value = savedAddr;

    // Sincronizar con la Nube (Si tenemos teléfono)
    if (savedPhone && db) {
        db.collection("users").doc(savedPhone).get().then((doc) => {
            if (doc.exists) {
                const data = doc.data();
                // Actualizar localmente si la nube tiene más datos
                const cloudCount = data.totalOrders || 0;
                localStorage.setItem('tasty_orders', cloudCount);
                renderLoyaltyBadge(cloudCount);
            } else {
                renderLoyaltyBadge(parseInt(ordersCount));
            }
        }).catch((error) => {
            console.log("Error sincronizando:", error);
            renderLoyaltyBadge(parseInt(ordersCount));
        });
    } else {
        renderLoyaltyBadge(parseInt(ordersCount));
    }
}

function renderLoyaltyBadge(count) {
    if (count > 0) {
        const level = getLoyaltyLevel(count);
        const loyaltyMsg = document.getElementById('loyalty-message');
        if (loyaltyMsg) {
            loyaltyMsg.innerHTML = `
                <div class="${level.color} border border-white/20 p-3 rounded-xl shadow-lg flex items-center justify-center gap-3 animate-pulse">
                    <span class="text-2xl">${level.icon}</span>
                    <div class="text-left">
                        <div class="text-[10px] uppercase font-bold tracking-widest text-white/70">Nivel Actual</div>
                        <div class="font-display font-bold text-lg text-white leading-none">${level.name}</div>
                        <div class="text-xs text-white/90">¡${count} pedidos completados!</div>
                    </div>
                </div>
            `;
            loyaltyMsg.classList.remove('hidden');
            loyaltyMsg.className = "mb-6";
        }
    }
}

function getLoyaltyLevel(count) {
    if (count >= 41) return { name: "LEYENDA PLATINO", icon: "💎", color: "bg-gradient-to-r from-slate-300 via-cyan-400 to-slate-300" };
    if (count >= 21) return { name: "ORO", icon: "🥇", color: "bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600" };
    if (count >= 11) return { name: "PLATA", icon: "🥈", color: "bg-gradient-to-r from-slate-600 via-slate-400 to-slate-600" };
    return { name: "BRONCE", icon: "🥉", color: "bg-gradient-to-r from-orange-700 via-orange-500 to-orange-700" };
}

function saveUserData() {
    const name = document.getElementById('cust-name').value;
    const phone = document.getElementById('cust-phone').value;
    const addr = document.getElementById('cust-address').value;

    localStorage.setItem('tasty_name', name);
    localStorage.setItem('tasty_phone', phone);
    localStorage.setItem('tasty_address', addr);

    // Incrementar contador pedidos
    let count = parseInt(localStorage.getItem('tasty_orders') || '0') + 1;
    localStorage.setItem('tasty_orders', count);

    // GUARDAR EN FIREBASE (NUBE) ☁️
    if (db && phone) {
        const userData = {
            name: name,
            phone: phone,
            address: addr,
            totalOrders: count,
            lastOrder: new Date().toISOString()
        };

        db.collection("users").doc(phone).set(userData, { merge: true })
            .then(() => console.log("Usuario guardado en nube ☁️"))
            .catch((e) => console.error("Error guardando:", e));

        // Registrar el pedido individual también
        db.collection("orders").add({
            userId: phone,
            items: cart,
            total: document.getElementById('checkout-total').innerText,
            date: new Date().toISOString()
        });
    }
}

function renderSection(type, items, containerId) {
    const container = document.getElementById(containerId);
    items.forEach(item => {
        // Bowls (y cualquier otro item de sección principal) deben poder personalizarse
        const isCustomizable = type === 'bowls' || !item.noMenu;

        const btn = !isCustomizable
            ? `<button onclick="addSimple('${item.name}', ${item.priceSolo})" class="bg-primary text-white w-9 h-9 rounded-lg flex items-center justify-center font-bold shadow-lg shadow-primary/30">+</button>`
            : `<button onclick="openConfig('${item.name}', ${item.priceSolo}, ${item.priceMenu || 0})" class="bg-primary text-white w-9 h-9 rounded-lg flex items-center justify-center font-bold shadow-lg shadow-primary/30">+</button>`;

        const badgeHtml = item.badge
            ? `<div class="absolute top-2 right-2 bg-yellow-500 text-black text-[10px] font-bold px-2 py-1 rounded shadow-lg z-10 animate-pulse">${item.badge}</div>`
            : '';

        container.innerHTML += `
            <div class="bg-card p-3 rounded-xl border border-white/5 flex gap-4 relative overflow-hidden group">
                ${badgeHtml}
                <div class="w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-black">
                    <img src="${item.img}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                </div>
                <div class="flex flex-col justify-center flex-1">
                    <h3 class="font-display text-lg font-bold text-white uppercase leading-tight">${item.name}</h3>
                    <p class="text-xs text-gray-400 mt-1 line-clamp-2">${item.desc}</p>
                    <div class="mt-3 flex items-center justify-between">
                        <span class="text-secondary font-bold text-lg">${item.priceSolo.toFixed(2)}€</span>
                        ${btn}
                    </div>
                </div>
            </div>`;
    });
}

// --- LÓGICA MODAL ---
function openConfig(name, pSolo, pMenu) {
    tempItem = { name, pSolo, pMenu };
    document.getElementById('modal-item-title').innerText = name;

    const isDrinkOnly = name === "Bebida Extra";

    if (isDrinkOnly) {
        document.getElementById('step-format').classList.add('hidden');
        document.getElementById('step-sauce').classList.add('hidden');
        document.getElementById('step-extras').classList.add('hidden');
        tempItem.format = "Solo";
    } else {
        // Si no tiene precio de menú (ej: Bowls), ocultamos el paso 1 (Formato)
        if (pMenu === 0) {
            document.getElementById('step-format').classList.add('hidden');
            tempItem.format = "Solo";
        } else {
            document.getElementById('step-format').classList.remove('hidden');
            document.querySelector('input[name="format"][value="Solo"]').checked = true;
        }

        document.getElementById('step-sauce').classList.remove('hidden');
        document.getElementById('step-extras').classList.remove('hidden');

        document.getElementById('price-solo-display').innerText = pSolo.toFixed(2) + '€';
        document.getElementById('price-menu-display').innerText = (pMenu || 0).toFixed(2) + '€';
    }

    // Renderizar Bebidas
    const dList = document.getElementById('drinks-list');
    dList.innerHTML = BEBIDAS.map((d, i) => {
        const surchargeText = d.surcharge ? ` (+${d.surcharge.toFixed(2)}€)` : '';
        return `
        <label class="cursor-pointer">
            <input type="radio" name="menuDrink" value="${d.name}" data-surcharge="${d.surcharge || 0}" class="drink-radio hidden" ${i === 0 ? 'checked' : ''} onchange="updateTotal()">
            <div class="bg-black border border-white/10 rounded-lg py-2 px-1 text-center text-xs font-bold text-gray-300 hover:border-secondary/50 peer-checked:bg-secondary peer-checked:text-black">
                ${d.name}${surchargeText}
            </div>
        </label>`;
    }).join('');

    // Renderizar Salsas
    const sList = document.getElementById('sauces-list');
    sList.innerHTML = SALSAS.map((s, i) => `
        <label class="cursor-pointer group">
            <input type="radio" name="mainSauce" value="${s}" class="peer hidden" ${i === 0 ? 'checked' : ''} onchange="updateTotal()">
            <div class="bg-black border border-white/10 rounded-lg py-3 text-center text-xs font-bold text-gray-300 transition-all peer-checked:bg-primary peer-checked:text-black peer-checked:border-primary group-hover:border-primary/50">
                ${s}
            </div>
        </label>`).join('');

    // Renderizar Extras
    const eList = document.getElementById('extras-list');
    eList.innerHTML = SALSAS.map(s => `
        <label class="cursor-pointer group">
            <input type="checkbox" name="extraSauce" value="${s}" class="peer hidden" onchange="updateTotal()">
            <div class="bg-black border border-white/10 rounded-lg py-3 text-center text-xs font-bold text-gray-500 transition-all peer-checked:bg-secondary peer-checked:text-black peer-checked:border-secondary group-hover:border-secondary/50">
                ${s}
            </div>
        </label>`).join('');

    // Resetear nota
    document.getElementById('item-note').value = "";

    updateTotal();
    document.getElementById('modal-config').classList.remove('hidden');
    document.getElementById('modal-config').classList.add('flex');
}

function updateTotal() {
    let format = "Solo";
    if (!document.getElementById('step-format').classList.contains('hidden')) {
        format = document.querySelector('input[name="format"]:checked').value;
    }

    const isDrinkOnly = tempItem.name === "Bebida Extra";
    const drinkSection = document.getElementById('step-drink');

    if (format === 'Menú' || isDrinkOnly) {
        drinkSection.classList.remove('hidden');
    } else {
        drinkSection.classList.add('hidden');
    }

    let base = (format === 'Solo') ? tempItem.pSolo : tempItem.pMenu;

    let extrasTotal = 0;
    if (!isDrinkOnly) {
        const extrasCount = document.querySelectorAll('input[name="extraSauce"]:checked').length;
        extrasTotal = extrasCount * 0.25;
    }

    let drinkSurcharge = 0;
    if (!drinkSection.classList.contains('hidden')) {
        const selectedDrink = document.querySelector('input[name="menuDrink"]:checked');
        if (selectedDrink) {
            drinkSurcharge = parseFloat(selectedDrink.getAttribute('data-surcharge'));
        }
    }

    let total = base + extrasTotal + drinkSurcharge;
    document.getElementById('modal-total').innerText = total.toFixed(2) + '€';
}

function closeModal() {
    document.getElementById('modal-config').classList.add('hidden');
    document.getElementById('modal-config').classList.remove('flex');
}

function addToCart() {
    let format = "Solo";
    if (!document.getElementById('step-format').classList.contains('hidden')) {
        format = document.querySelector('input[name="format"]:checked').value;
    }

    const isDrinkOnly = tempItem.name === "Bebida Extra";
    let detail = "";
    let total = parseFloat(document.getElementById('modal-total').innerText.replace('€', ''));

    if (isDrinkOnly) {
        const selectedDrink = document.querySelector('input[name="menuDrink"]:checked').value;
        detail = selectedDrink;
    } else {
        const mainSauce = document.querySelector('input[name="mainSauce"]:checked').value;
        const extras = Array.from(document.querySelectorAll('input[name="extraSauce"]:checked')).map(cb => cb.value);

        // Si el formato está oculto (Bowls), no ponemos "Solo • "
        const formatStr = document.getElementById('step-format').classList.contains('hidden') ? "" : `${format} ▪️ `;
        detail = `${formatStr}Salsa ${mainSauce}`;

        if (format === 'Menú' && !document.getElementById('step-drink').classList.contains('hidden')) {
            const selectedDrink = document.querySelector('input[name="menuDrink"]:checked').value;
            detail += ` ▪️ Bebida: ${selectedDrink}`;
        }
        if (extras.length > 0) detail += ` ▪️ Extras: ${extras.join(', ')}`;
    }

    const title = isDrinkOnly ? "Bebida Extra" : tempItem.name;
    const note = document.getElementById('item-note').value.trim();

    cart.push({ title: title, desc: detail, price: total, note: note });
    updateCartUI();
    closeModal();

    // Trigger Upsell if it's not an extra
    if (!isDrinkOnly) {
        showUpsell();
    }
}

function showUpsell() {
    const upsellModal = document.getElementById('modal-upsell');
    if (upsellModal) {
        upsellModal.classList.remove('hidden');
        upsellModal.classList.add('flex');
    }
}

function closeUpsell() {
    document.getElementById('modal-upsell').classList.add('hidden');
    document.getElementById('modal-upsell').classList.remove('flex');
}

function addUpsellItem(name, price) {
    cart.push({ title: name, desc: 'Extra Upsell', price: price });
    updateCartUI();
    closeUpsell();
}

function addSimple(name, price) {
    cart.push({ title: name, desc: '', price: price });
    updateCartUI();
}

function updateCartUI() {
    const count = cart.length;
    const subtotal = cart.reduce((a, b) => a + b.price, 0);
    let total = subtotal;

    if (currentDeliveryMode === 'delivery') {
        total += deliveryFee;
    }

    document.getElementById('cart-count').innerText = count;
    document.getElementById('float-total').innerText = total.toFixed(2) + '€';

    // Checkout Values
    document.getElementById('checkout-subtotal').innerText = subtotal.toFixed(2) + '€';
    document.getElementById('checkout-total').innerText = total.toFixed(2) + '€';

    const container = document.getElementById('cart-items-container');
    container.innerHTML = cart.map((item, i) => `
        <div class="flex justify-between items-start bg-black/40 p-3 rounded-lg border border-white/5">
            <div>
                <div class="font-bold text-white text-sm">${item.title}</div>
                <div class="text-xs text-gray-400">${item.desc}</div>
                ${item.note ? `<div class="text-[10px] text-yellow-500 mt-1">📝 ${item.note}</div>` : ''}
            </div>
            <div class="flex flex-col items-end">
                <span class="font-bold text-secondary text-sm">${item.price.toFixed(2)}€</span>
                <button onclick="remove(${i})" class="text-[10px] text-red-500 mt-1">Eliminar</button>
            </div>
        </div>`).join('');

    if (count > 0) document.getElementById('float-btn').classList.remove('hidden');
    else document.getElementById('float-btn').classList.add('hidden');
}

function remove(i) {
    cart.splice(i, 1);
    updateCartUI();
    if (cart.length === 0) closeCheckout();
}

function openCheckout() {
    document.getElementById('modal-checkout').classList.remove('hidden');
    document.getElementById('modal-checkout').classList.add('flex');
    validateCheckoutForm();
}

function closeCheckout() {
    document.getElementById('modal-checkout').classList.add('hidden');
    document.getElementById('modal-checkout').classList.remove('flex');
}

function openLoyaltyInfo() {
    const count = parseInt(localStorage.getItem('tasty_orders') || '0');
    const level = getLoyaltyLevel(count);
    let nextGoal = "";
    let remaining = 0;

    // Calcular siguiente meta
    if (count < 11) {
        remaining = 11 - count;
        nextGoal = "para Nivel Plata 🥈";
    } else if (count < 21) {
        remaining = 21 - count;
        nextGoal = "para Nivel Oro 🥇";
    } else if (count < 41) {
        remaining = 41 - count;
        nextGoal = "para Leyenda Platino 💎";
    } else {
        nextGoal = "¡Ya eres Leyenda!";
    }

    const statsContainer = document.getElementById('user-loyalty-stats');

    // Contenido dinámico
    let html = `
        <div class="font-display font-bold text-xl text-white mb-1">¡Hola${localStorage.getItem('tasty_name') ? ', ' + localStorage.getItem('tasty_name') : ''}!</div>
        <div class="text-3xl mb-2">${level.icon}</div>
        <div class="font-bold text-lg ${level.color.replace('bg-gradient-to-r', 'text-transparent bg-clip-text bg-gradient-to-r')}">${level.name}</div>
        <div class="text-white font-bold text-2xl mt-2">${count} <span class="text-sm font-normal text-gray-400">pedidos</span></div>
    `;

    if (remaining > 0) {
        html += `<div class="text-xs text-secondary mt-2 font-bold animate-pulse">Te faltan ${remaining} pedidos ${nextGoal}</div>`;
    } else {
        html += `<div class="text-xs text-cyan-400 mt-2 font-bold">¡Has alcanzado la cima! 🚀</div>`;
    }

    statsContainer.innerHTML = html;

    document.getElementById('modal-loyalty-info').classList.remove('hidden');
    document.getElementById('modal-loyalty-info').classList.add('flex');
}

function manualCheckLoyalty() {
    const phoneInput = document.getElementById('check-phone').value.trim();
    if (phoneInput.length < 9) {
        alert("Introduce un teléfono válido.");
        return;
    }

    if (!db) {
        alert("Error de conexión. Inténtalo luego.");
        return;
    }

    const btn = document.querySelector('#modal-loyalty-info button.bg-secondary');
    btn.innerText = "...";

    db.collection("users").doc(phoneInput).get().then((doc) => {
        if (doc.exists) {
            const data = doc.data();
            // Guardamos localmente para que la próxima vez sea auto
            localStorage.setItem('tasty_name', data.name);
            localStorage.setItem('tasty_phone', data.phone);
            localStorage.setItem('tasty_address', data.address);
            localStorage.setItem('tasty_orders', data.totalOrders);

            // Recargamos el modal con los datos nuevos
            openLoyaltyInfo();
            alert(`¡Te encontramos ${data.name}! Nivel actualizado.`);
        } else {
            alert("No encontramos pedidos con este teléfono. ¡Haz tu primer pedido hoy!");
        }
        btn.innerText = "BUSCAR";
    }).catch((e) => {
        console.error(e);
        alert("Error al buscar.");
        btn.innerText = "BUSCAR";
    });
}

function closeLoyaltyInfo() {
    document.getElementById('modal-loyalty-info').classList.add('hidden');
    document.getElementById('modal-loyalty-info').classList.remove('flex');
}

function togglePaymentDetails() {
    const val = document.getElementById('cust-payment').value;
    document.getElementById('bizum-details').style.display = val === 'Bizum' ? 'block' : 'none';
    document.getElementById('change-field').style.display = val === 'Efectivo' ? 'block' : 'none';
}

function setDeliveryMode(mode) {
    currentDeliveryMode = mode;
    const indicator = document.getElementById('delivery-indicator');
    const addrContainer = document.getElementById('address-container');
    const costRow = document.getElementById('delivery-cost-row');
    const btnPickup = document.getElementById('btn-pickup');
    const btnDelivery = document.getElementById('btn-delivery');

    if (mode === 'delivery') {
        indicator.style.transform = 'translateX(100%)';
        addrContainer.style.height = 'auto';
        addrContainer.style.opacity = '1';
        addrContainer.style.marginTop = '0';
        costRow.classList.remove('hidden');
        btnPickup.classList.remove('text-black');
        btnPickup.classList.add('text-white');
        btnDelivery.classList.add('text-black');
        btnDelivery.classList.remove('text-white');
    } else {
        indicator.style.transform = 'translateX(0)';
        addrContainer.style.height = '0';
        addrContainer.style.opacity = '0';
        addrContainer.style.marginTop = '-10px'; // Ajuste visual
        costRow.classList.add('hidden');
        btnPickup.classList.add('text-black');
        btnPickup.classList.remove('text-white');
        btnDelivery.classList.remove('text-black');
        btnDelivery.classList.add('text-white');
    }

    updateCartUI();
    validateCheckoutForm();
}

function fillInAddress() {
    // Cuando Google Maps Autocomplete rellena el campo, no salta el evento 'oninput'
    // Por eso forzamos la validación aquí
    setTimeout(validateCheckoutForm, 100);
}

function validateCheckoutForm() {
    const name = document.getElementById('cust-name').value.trim();
    const phone = document.getElementById('cust-phone').value.trim();
    const addr = document.getElementById('cust-address').value.trim();
    const btn = document.getElementById('btn-confirm-order');

    let isValid = false;
    if (currentDeliveryMode === 'delivery') {
        // En delivery, dirección obligatoria
        isValid = name.length >= 2 && phone.length >= 9 && addr.length >= 5;
    } else {
        // En pickup, dirección NO importa
        isValid = name.length >= 2 && phone.length >= 9;
    }

    if (isValid) {
        // ILUMINAR BOTÓN
        btn.disabled = false;
        btn.classList.remove('bg-gray-600', 'text-white/50', 'cursor-not-allowed', 'opacity-50');
        btn.classList.add('bg-[#25D366]', 'text-black', 'shadow-[0_0_25px_rgba(37,211,102,0.8)]', 'scale-[1.02]');
    } else {
        // APAGAR BOTÓN
        btn.disabled = true;
        btn.classList.add('bg-gray-600', 'text-white/50', 'cursor-not-allowed', 'opacity-50');
        btn.classList.remove('bg-[#25D366]', 'text-black', 'shadow-[0_0_25px_rgba(37,211,102,0.8)]', 'scale-[1.02]');
    }
}

// --- GOOGLE MAPS AUTOCOMPLETE ---
let autocomplete;

function initAutocomplete() {
    try {
        const input = document.getElementById("cust-address");
        if (!input) return;

        // Restringir a España
        const options = {
            componentRestrictions: { country: "es" },
            fields: ["address_components", "geometry", "icon", "name"],
            strictBounds: false,
        };

        if (typeof google !== 'undefined' && google.maps && google.maps.places) {
            autocomplete = new google.maps.places.Autocomplete(input, options);
            autocomplete.addListener("place_changed", fillInAddress);
        } else {
            console.warn("Google Maps API not loaded or invalid Key. Using manual input.");
        }
    } catch (e) {
        // Silenciar error en consola, no bloquear
        console.warn("Google Maps init warning:", e);
    }
}

// --- GENERAR PDF ---
function generateOrderPDF(name, addr, pay, cart, total) {
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Header Tasty Tacos
        doc.setFillColor(26, 24, 24); // #1a1818
        doc.rect(0, 0, 210, 40, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.text("TASTY TACOS", 105, 20, { align: "center" });

        doc.setFontSize(10);
        doc.text("TICKET DE PEDIDO - COLLADO VILLALBA", 105, 30, { align: "center" });

        // Datos Cliente
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.text("DATOS DEL PEDIDO:", 20, 55);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(`Cliente: ${name}`, 20, 65);
        doc.text(`Teléfono: ${phoneClient || 'No proporcionado'}`, 20, 72);
        doc.text(`Dirección: ${addr}`, 20, 79);
        doc.text(`Pago: ${pay}`, 20, 86);
        doc.text(`Fecha: ${new Date().toLocaleString()}`, 20, 93);

        doc.setDrawColor(200, 200, 200);
        doc.line(20, 100, 190, 100);

        // Productos
        doc.setFont("helvetica", "bold");
        doc.text("PRODUCTOS:", 20, 110);

        let y = 120;
        cart.forEach((item, i) => {
            doc.setFont("helvetica", "bold");
            doc.text(`${i + 1}. ${item.title}`, 20, y);
            doc.text(`${item.price.toFixed(2)}€`, 180, y, { align: "right" });

            y += 5;
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            doc.setTextColor(100, 100, 100);
            const lines = doc.splitTextToSize(item.desc || "Unidad Individual", 160);
            doc.text(lines, 25, y);

            y += (lines.length * 4) + 6;
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(10);
            if (y > 270) { doc.addPage(); y = 20; }
        });

        // Total
        doc.setDrawColor(166, 30, 30);
        doc.setLineWidth(1);
        doc.line(20, y, 190, y);

        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text(`TOTAL: ${total}€`, 190, y + 15, { align: "right" });

        doc.save(`Ticket_Tasty_${name.replace(/\s/g, '_')}.pdf`);
    } catch (e) {
        console.error("PDF Error:", e);
        alert("Error al generar el PDF, pero el pedido se enviará por WhatsApp.");
    }
}

// --- GENERAR NOTEPAD (.txt) ---
function generateNotepad(name, phone, addr, pay, cart, total) {
    let content = `TASTY TACOS - TICKET DE PEDIDO\n`;
    content += `==============================\n\n`;
    content += `CLIENTE: ${name}\n`;
    content += `TELÉFONO: ${phone}\n`;
    content += `DIRECCIÓN: ${addr}\n`;
    content += `PAGO: ${pay}\n`;
    content += `FECHA: ${new Date().toLocaleString()}\n\n`;
    content += `PRODUCTOS:\n`;
    content += `----------\n`;

    cart.forEach((item, i) => {
        content += `${i + 1}. ${item.title.toUpperCase()} - ${item.price.toFixed(2)}€\n`;
        content += `   [${item.desc || 'Individual'}]\n\n`;
    });

    content += `----------\n`;
    content += `TOTAL A PAGAR: ${total}€\n\n`;
    content += `¡Gracias por tu pedido! 🔥`;

    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Ticket_Tasty_${name.replace(/\s/g, '_')}.txt`;
    link.click();
}

// --- ENVIAR PEDIDO ---
// --- ENVIAR PEDIDO ---
function sendOrder() {
    const name = document.getElementById('cust-name').value;
    const phoneClient = document.getElementById('cust-phone').value;
    const addr = document.getElementById('cust-address').value;
    const pay = document.getElementById('cust-payment').value;
    const change = document.getElementById('cust-change').value;

    if (!name || !phoneClient) {
        alert("⚠️ Faltan datos: Nombre y Teléfono son obligatorios");
        return;
    }

    if (currentDeliveryMode === 'delivery' && !addr) {
        alert("⚠️ Para envío a domicilio la dirección es obligatoria");
        return;
    }

    // VALIDACIÓN DE DIRECCIÓN
    const lowerAddr = addr.toLowerCase();
    const isValidLocation = lowerAddr.includes("villalba") || lowerAddr.includes("28400");

    if (!isValidLocation) {
        const confirm = window.confirm("📍 ¿Seguro el pedido es Collado Villalba?\n\nSi tu destino no es Collado Villalba no se confirmará el pedido.\n\nPulsa ACEPTAR solo si la dirección es correcta.");
        if (!confirm) return;
    }

    const itemsStr = cart.map(i => {
        let txt = `▪️ ${i.title.toUpperCase()} (${i.price.toFixed(2)}€)\n   └ ${i.desc}`;
        if (i.note) txt += `\n   📝 NOTA: ${i.note}`;
        return txt;
    }).join('\n\n');
    const totalValue = cart.reduce((a, b) => a + b.price, 0).toFixed(2);
    const phoneRestaurant = "34642708622"; // TU NÚMERO

    // 1. Minificar datos para URL corta
    const shortCart = cart.map(i => ({
        t: i.title,
        p: i.price,
        d: i.desc,
        n: i.note
    }));

    const shipping = currentDeliveryMode === 'delivery' ? deliveryFee : 0;
    const finalTotal = (parseFloat(totalValue) + shipping).toFixed(2);

    const orderData = {
        n: name,
        ph: phoneClient,
        a: addr,
        p: pay,
        ch: change,
        dm: currentDeliveryMode,
        shp: shipping,
        c: shortCart,
        t: finalTotal
    };

    // Codificación Robusta UTF-8 + Base64 (URL Safe)
    const jsonStr = JSON.stringify(orderData);
    let base64Data = window.btoa(unescape(encodeURIComponent(jsonStr)));
    // Hacerla segura para URL (WhatsApp no se marea con + o /)
    base64Data = base64Data.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    // Generar enlace
    const currentUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/'));
    const ticketUrl = `${currentUrl}/ticket.html?data=${base64Data}`;

    // 2. Texto WhatsApp (Ticket Monoespaciado)
    let waText = `\`\`\`\n`;
    waText += `TASTY TACOS - PEDIDO\n`;
    waText += `--------------------\n`;
    waText += `CLIENTE: ${name}\n`;
    waText += `TEL: ${phoneClient}\n`;
    waText += `DIR: ${addr}\n`;
    waText += `PAGO: ${pay}\n`;
    if (pay === 'Efectivo' && change) waText += `CAMBIO: ${change}€\n`;
    waText += `--------------------\n`;

    cart.forEach((item, i) => {
        waText += `${i + 1}. ${item.title} .. ${item.price.toFixed(2)}€\n`;
        if (item.note) waText += `   (Nota: ${item.note})\n`;
    });

    waText += `--------------------\n`;
    waText += `TOTAL: ${totalValue}€\n`;
    waText += `\`\`\`\n\n`;
    waText += `🖨️ *IMPRIMIR TICKET AQUÍ:*\n${ticketUrl}`;

    window.open(`https://wa.me/${phoneRestaurant}?text=${encodeURIComponent(waText)}`, '_blank');

    // Guardar datos para la próxima
    saveUserData();

    // Recargar página tras unos segundos para limpiar carrito
    setTimeout(() => location.reload(), 2000);
}
