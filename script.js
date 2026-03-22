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

// Dynamic Service Rendering
async function loadServices() {
    try {
        const res = await fetch('/api/services');
        const data = await res.json();
        
        // Render Top-Up (Memberships)
        const topupContainer = document.getElementById('topup-container');
        if (topupContainer && data.topup) {
            topupContainer.innerHTML = data.topup.map(item => `
                <div class="package-card glass-card p-8 rounded-3xl text-center border-l-4 border-purple-500 cursor-pointer ${item.popular ? 'scale-105 bg-purple-900/10' : ''}" data-package="${item.name}" data-price="${item.price}" data-type="topup">
                    ${item.popular ? '<div class="bg-purple-600 text-white text-[10px] font-bold uppercase tracking-widest py-1 px-3 rounded-full inline-block mb-4">Most Popular</div>' : ''}
                    <h3 class="text-2xl font-black mb-2">${item.name}</h3>
                    <p class="text-4xl font-black text-brand-purple mb-4">LKR ${item.price}</p>
                    <ul class="text-gray-400 text-sm mb-6 space-y-2">
                        ${item.features.map(f => `<li><i class="fa-solid fa-check text-green-500 mr-2"></i> ${f}</li>`).join('')}
                    </ul>
                    <button class="w-full py-3 rounded-xl bg-purple-600 font-bold hover:bg-purple-700 transition-colors">Select</button>
                </div>
            `).join('');
        }

        // Render Boost
        const boostContainer = document.getElementById('boost-container');
        if (boostContainer && data.boost) {
            boostContainer.innerHTML = data.boost.map(item => `
                <div class="package-card glass-card p-8 rounded-3xl text-center border-l-4 border-purple-500 cursor-pointer" data-package="${item.name}" data-price="${item.price}" data-type="boost">
                    <h3 class="text-2xl font-black mb-2">${item.name}</h3>
                    <p class="text-4xl font-black text-brand-purple mb-4">LKR ${item.price}</p>
                    <ul class="text-gray-400 text-sm mb-6 space-y-2">
                        ${item.features.map(f => `<li><i class="fa-solid fa-check text-green-500 mr-2"></i> ${f}</li>`).join('')}
                    </ul>
                    <button class="w-full py-3 rounded-xl bg-purple-600 font-bold hover:bg-purple-700 transition-colors">Select</button>
                </div>
            `).join('');
        }

        // Render Panel
        const panelContainer = document.getElementById('panel-container');
        if (panelContainer && data.panel) {
            panelContainer.innerHTML = data.panel.map(item => `
                <div class="package-card glass-card p-8 rounded-3xl text-center border-l-4 border-purple-500 cursor-pointer" data-package="${item.name}" data-price="${item.price}" data-type="panel">
                    <h3 class="text-2xl font-black mb-2">${item.name}</h3>
                    <p class="text-4xl font-black text-brand-purple mb-4">LKR ${item.price}</p>
                    <ul class="text-gray-400 text-sm mb-6 space-y-2">
                        ${item.features.map(f => `<li><i class="fa-solid fa-check text-green-500 mr-2"></i> ${f}</li>`).join('')}
                    </ul>
                    <button class="w-full py-3 rounded-xl bg-purple-600 font-bold hover:bg-purple-700 transition-colors">Select</button>
                </div>
            `).join('');
        }

        // Render TikTok
        const tiktokContainer = document.getElementById('tiktok-container');
        if (tiktokContainer && data.tiktok) {
            tiktokContainer.innerHTML = data.tiktok.map(item => `
                <div class="package-card glass-card p-8 rounded-3xl text-center border-l-4 border-purple-500 cursor-pointer" data-package="${item.name}" data-price="${item.price}" data-type="tiktok">
                    <h3 class="text-2xl font-black mb-2">${item.name}</h3>
                    <p class="text-4xl font-black text-brand-purple mb-4">LKR ${item.price}</p>
                    <ul class="text-gray-400 text-sm mb-6 space-y-2">
                        ${item.features.map(f => `<li><i class="fa-solid fa-check text-green-500 mr-2"></i> ${f}</li>`).join('')}
                    </ul>
                    <button class="w-full py-3 rounded-xl bg-purple-600 font-bold hover:bg-purple-700 transition-colors">Select</button>
                </div>
            `).join('');
        }

        // Render WebDev
        const webdevContainer = document.getElementById('webdev-container');
        if (webdevContainer && data.webdev) {
            webdevContainer.innerHTML = data.webdev.map(item => `
                <div class="package-card glass-card p-8 rounded-3xl text-center border-l-4 border-indigo-500 cursor-pointer" data-package="${item.name}" data-price="${item.price}" data-type="webdev">
                    <h3 class="text-2xl font-black mb-2">${item.name}</h3>
                    <p class="text-4xl font-black text-brand-indigo mb-4">LKR ${item.price}</p>
                    <ul class="text-gray-400 text-sm mb-6 space-y-2">
                        ${item.features.map(f => `<li><i class="fa-solid fa-check text-indigo-500 mr-2"></i> ${f}</li>`).join('')}
                    </ul>
                    <button class="w-full py-3 rounded-xl bg-indigo-600 font-bold hover:bg-indigo-700 transition-colors">Select</button>
                </div>
            `).join('');
        }

        // Re-attach event listeners to new elements
        attachEventListeners();

    } catch (error) {
        console.error('Failed to load services:', error);
    }
}

function attachEventListeners() {
    const packageCards = document.querySelectorAll('.package-card');
    packageCards.forEach(card => {
        card.addEventListener('click', () => {
            const pkgName = card.dataset.package;
            const pkgPrice = card.dataset.price;
            const type = card.dataset.type || 'topup';
            openModal(pkgName, pkgPrice, type);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadServices();
    
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
            
            const uidInput = document.getElementById('modal-uid');
            const playerNameInput = document.getElementById('modal-player-name');
            const guildNameInput = document.getElementById('modal-guild-name');
            const platformInput = document.getElementById('modal-platform');
            const tiktokLinkInput = document.getElementById('modal-tiktok-link');
            const webDescInput = document.getElementById('modal-web-desc');

            let message = `*NEW ORDER - ${generateOrderId()}*\n`;
            message += `*──────────────────*\n`;
            message += `*📦 Package  :* ${pkg}\n`;
            message += `*💳 Method   :* ${method}\n`;
            
            if (uidInput) message += `*🆔 UID      :* ${uidInput.value}\n`;
            if (playerNameInput) message += `*👤 Name     :* ${playerNameInput.value}\n`;
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
});
