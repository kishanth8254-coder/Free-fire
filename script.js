// Dynamic Service Loading
async function loadServices() {
    const path = window.location.pathname;
    let category = '';
    
    if (path.includes('topup.html')) category = 'topup';
    else if (path.includes('boost.html')) category = 'boost';
    else if (path.includes('panel.html')) category = 'panel';
    else if (path.includes('tiktok.html')) category = 'tiktok';
    else if (path.includes('webdev.html')) category = 'webdev';

    if (!category) return;

    try {
        const response = await fetch('/api/services');
        const data = await response.json();
        const services = data[category] || [];
        renderServices(category, services);
    } catch (err) {
        console.error('Failed to load services:', err);
    }
}

function renderServices(category, services) {
    if (category === 'topup') {
        const diamondContainer = document.getElementById('topup-diamonds-container');
        const membershipContainer = document.getElementById('topup-membership-container');
        
        if (diamondContainer) {
            diamondContainer.innerHTML = '';
            const diamonds = services.filter(s => s.name.toLowerCase().includes('diamond'));
            diamonds.forEach(s => diamondContainer.appendChild(createCard(s, category, 'cyan')));
        }
        
        if (membershipContainer) {
            membershipContainer.innerHTML = '';
            const memberships = services.filter(s => !s.name.toLowerCase().includes('diamond'));
            memberships.forEach(s => membershipContainer.appendChild(createCard(s, category, 'purple')));
        }
        return;
    }

    if (category === 'panel') {
        const iosContainer = document.getElementById('panel-ios-container');
        const androidContainer = document.getElementById('panel-android-container');
        
        if (iosContainer) {
            iosContainer.innerHTML = '';
            const ios = services.filter(s => s.name.toLowerCase().includes('ios'));
            ios.forEach(s => iosContainer.appendChild(createCard(s, category, 'purple')));
        }
        
        if (androidContainer) {
            androidContainer.innerHTML = '';
            const android = services.filter(s => s.name.toLowerCase().includes('android'));
            android.forEach(s => androidContainer.appendChild(createCard(s, category, 'cyan')));
        }
        return;
    }

    const container = document.getElementById(`${category}-container`);
    if (!container) return;

    container.innerHTML = '';
    services.forEach(service => {
        const themeColor = category === 'tiktok' ? 'pink' : (category === 'webdev' ? 'indigo' : 'blue');
        container.appendChild(createCard(service, category, themeColor));
    });
}

function createCard(service, category, themeColor) {
    const card = document.createElement('div');
    
    if (category === 'topup') {
        // Special styling for topup
        const isDiamond = service.name.toLowerCase().includes('diamond');
        if (isDiamond) {
            card.className = "package-card glass-card p-6 rounded-2xl text-center cursor-pointer diamond-shine group";
            card.innerHTML = `
                <div class="relative mb-4">
                    <span class="emoji-diamond-glow">💎</span>
                </div>
                <h3 class="font-black text-xl mb-1">${service.name.replace(' Diamonds', '')} <span class="text-cyan-400">💎</span></h3>
                <p class="text-brand-yellow font-bold mb-4">LKR ${service.price}</p>
                <button onclick="openModal('${service.name}', '${service.price}', '${category}')" class="w-full py-2 rounded-lg bg-cyan-600/20 border border-cyan-500/30 text-xs font-bold uppercase tracking-widest group-hover:bg-cyan-600 group-hover:text-white transition-all">Buy Now</button>
            `;
        } else {
            card.className = `package-card glass-card p-8 rounded-3xl text-center border-l-4 border-purple-500 cursor-pointer ${service.popular ? 'scale-105 bg-purple-900/10' : ''}`;
            const popularBadge = service.popular ? '<div class="bg-purple-600 text-white text-[10px] font-bold uppercase tracking-widest py-1 px-3 rounded-full inline-block mb-4">Most Popular</div>' : '';
            const featuresHtml = (service.features || []).map(f => `<li><i class="fa-solid fa-check text-green-500 mr-2"></i> ${f}</li>`).join('');
            
            card.innerHTML = `
                ${popularBadge}
                <h3 class="text-2xl font-black mb-2">${service.name}</h3>
                <p class="text-4xl font-black text-brand-purple mb-4">LKR ${service.price}</p>
                <ul class="text-gray-400 text-sm mb-6 space-y-2">
                    ${featuresHtml}
                </ul>
                <button onclick="openModal('${service.name}', '${service.price}', '${category}')" class="w-full py-3 rounded-xl bg-purple-600 font-bold hover:bg-purple-700 transition-colors">Select</button>
            `;
        }
    } else {
        // Default styling for other categories
        card.className = `package-card bg-[#1a1a1a] rounded-2xl p-6 border border-white/10 hover:border-${themeColor}-500/50 transition-all group relative overflow-hidden ${service.popular ? `border-${themeColor}-500/50` : ''}`;
        
        const popularBadge = service.popular ? `
            <div class="absolute top-0 right-0 bg-${themeColor}-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                Popular
            </div>
        ` : '';

        const featuresHtml = (service.features || []).map(f => `
            <li class="flex items-center gap-2 text-gray-400 text-sm">
                <i class="fas fa-check text-${themeColor}-500 text-xs"></i>
                ${f}
            </li>
        `).join('');

        card.innerHTML = `
            ${popularBadge}
            <div class="mb-4">
                <h3 class="text-xl font-bold mb-1">${service.name}</h3>
                <div class="flex items-baseline gap-1">
                    <span class="text-2xl font-bold text-${themeColor}-500">Rs. ${service.price}</span>
                </div>
            </div>
            <ul class="space-y-3 mb-6">
                ${featuresHtml}
            </ul>
            <button onclick="openModal('${service.name}', '${service.price}', '${category}')" class="w-full bg-white/5 hover:bg-${themeColor}-600 text-white font-bold py-3 rounded-xl transition-all border border-white/10 hover:border-${themeColor}-600 group-hover:shadow-lg group-hover:shadow-${themeColor}-600/20">
                Order Now
            </button>
        `;
    }
    return card;
}

function generateOrderId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'BL-';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function openWhatsApp(message) {
    const phoneNumber = "94761731102";
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
}

function openModal(pkgName, pkgPrice, type = 'topup') {
    const modal = document.getElementById('order-modal');
    const modalTitle = document.getElementById('modal-title');
    const pkgInput = document.getElementById('modal-package');
    const extraFields = document.getElementById('extra-fields');
    
    if (!modal) return;

    modalTitle.innerText = `ORDER: ${pkgName}`;
    pkgInput.value = pkgName;
    
    // Clear extra fields
    extraFields.innerHTML = '';

    if (type === 'topup') {
        extraFields.innerHTML = `
            <div class="grid grid-cols-1 gap-4">
                <div>
                    <label class="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Player UID</label>
                    <input type="text" id="modal-uid" required placeholder="Enter UID" class="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors">
                </div>
                <div>
                    <label class="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Player Name</label>
                    <input type="text" id="modal-player-name" required placeholder="Enter Name" class="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors">
                </div>
            </div>
        `;
    } else if (type === 'boost') {
        extraFields.innerHTML = `
            <div>
                <label class="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Guild Name</label>
                <input type="text" id="modal-guild-name" required placeholder="Enter Guild Name" class="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors">
            </div>
        `;
    } else if (type === 'panel') {
        extraFields.innerHTML = `
            <div>
                <label class="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Platform (iOS/Android)</label>
                <input type="text" id="modal-platform" required placeholder="Enter Platform" class="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors">
            </div>
        `;
    } else if (type === 'tiktok') {
        extraFields.innerHTML = `
            <div>
                <label class="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">TikTok Video Link / Username</label>
                <input type="text" id="modal-tiktok-link" required placeholder="Enter Link or Username" class="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors">
            </div>
        `;
    } else if (type === 'webdev') {
        extraFields.innerHTML = `
            <div>
                <label class="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Project Description / Requirements</label>
                <textarea id="modal-web-desc" required placeholder="Describe your website needs..." class="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors resize-none" rows="3"></textarea>
            </div>
        `;
    }

    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('order-modal');
    if (modal) modal.classList.remove('active');
}

document.addEventListener('DOMContentLoaded', () => {
    // Modal Close Logic
    const closeBtn = document.getElementById('close-modal');
    const modalOverlay = document.getElementById('order-modal');
    
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }

    // Modal Form Submission
    const modalForm = document.getElementById('modal-order-form');
    if (modalForm) {
        modalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const pkg = document.getElementById('modal-package').value;
            const method = document.getElementById('modal-payment-method').value;
            const note = document.getElementById('modal-note').value;
            const orderId = generateOrderId();
            
            let message = `*╔══════════════════╗*\n`;
            message += `*   🕹️  BLACK LTZ ORDER  🕹️   *\n`;
            message += `*╚══════════════════╝*\n\n`;
            message += `*🆔 Order ID :* ${orderId}\n`;
            message += `*📦 Package  :* ${pkg}\n`;
            message += `*💳 Payment  :* ${method}\n`;
            message += `*──────────────────*\n`;

            const uidInput = document.getElementById('modal-uid');
            const playerNameInput = document.getElementById('modal-player-name');
            const guildNameInput = document.getElementById('modal-guild-name');
            const platformInput = document.getElementById('modal-platform');
            const tiktokLinkInput = document.getElementById('modal-tiktok-link');
            const webDescInput = document.getElementById('modal-web-desc');

            if (uidInput) message += `*👤 UID      :* ${uidInput.value}\n`;
            if (playerNameInput) message += `*🏷️ Name     :* ${playerNameInput.value}\n`;
            if (guildNameInput) message += `*🏰 Guild    :* ${guildNameInput.value}\n`;
            if (platformInput) message += `*📱 Platform :* ${platformInput.value}\n`;
            if (tiktokLinkInput) message += `*🔗 TikTok   :* ${tiktokLinkInput.value}\n`;
            if (webDescInput) message += `*💻 Project  :* ${webDescInput.value}\n`;
            
            if (note) message += `*📝 Note     :* ${note}\n`;
            
            message += `*──────────────────*\n`;
            message += `\n*🚀 Please process my order!*`;

            openWhatsApp(message);
            closeModal();
        });
    }

    // Package Card Click Logic
    const packageCards = document.querySelectorAll('.package-card');
    packageCards.forEach(card => {
        card.addEventListener('click', () => {
            const pkgName = card.dataset.package;
            const pkgPrice = card.dataset.price;
            const type = card.dataset.type || 'topup';
            openModal(pkgName, pkgPrice, type);
        });
    });

    // Guild Boost Logic
    const boostBtn = document.getElementById('boost-order-btn');
    if (boostBtn) {
        boostBtn.addEventListener('click', () => {
            openModal("Guild Boost Service", "Contact for Price", 'boost');
        });
    }

    // Panel Store Logic
    const panelBtns = document.querySelectorAll('.panel-order-btn');
    panelBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const platform = btn.dataset.platform;
            const pkg = btn.dataset.package;
            openModal(`${platform} - ${pkg}`, "Contact for Price", 'panel');
        });
    });

    // Mobile Menu Toggle
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            const icon = menuBtn.querySelector('i');
            if (mobileMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when clicking a link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                const icon = menuBtn.querySelector('i');
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            });
        });
    }

    // Load dynamic services
    loadServices();
});
