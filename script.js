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
    } else if (type === 'webdev' || type === 'other') {
        extraFields.innerHTML = `
            <div>
                <label class="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Project Description / Requirements</label>
                <textarea id="modal-web-desc" required placeholder="Describe your needs..." class="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors resize-none" rows="3"></textarea>
            </div>
        `;
    } else if (type === 'pro') {
        extraFields.innerHTML = `
            <div>
                <label class="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Your Email (for subscription)</label>
                <input type="email" id="modal-email" required placeholder="Enter your email" class="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors">
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
            const emailInput = document.getElementById('modal-email');

            if (uidInput) message += `*👤 UID      :* ${uidInput.value}\n`;
            if (playerNameInput) message += `*🏷️ Name     :* ${playerNameInput.value}\n`;
            if (guildNameInput) message += `*🏰 Guild    :* ${guildNameInput.value}\n`;
            if (platformInput) message += `*📱 Platform :* ${platformInput.value}\n`;
            if (tiktokLinkInput) message += `*🔗 TikTok   :* ${tiktokLinkInput.value}\n`;
            if (webDescInput) message += `*💻 Details  :* ${webDescInput.value}\n`;
            if (emailInput) message += `*📧 Email    :* ${emailInput.value}\n`;
            
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
});
