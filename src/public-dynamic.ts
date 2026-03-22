import { db, collection, onSnapshot, query, orderBy, where } from './firebase';
import { Category, Package } from './types';

// Re-implement the existing script.js logic but with dynamic data
function generateOrderId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'BL-';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function openWhatsApp(message: string) {
    const phoneNumber = "94761731102";
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
}

function openModal(pkgName: string, pkgPrice: string | number, type: string = 'topup') {
    const modal = document.getElementById('order-modal');
    const modalTitle = document.getElementById('modal-title');
    const pkgInput = document.getElementById('modal-package') as HTMLInputElement;
    const extraFields = document.getElementById('extra-fields');
    
    if (!modal || !modalTitle || !pkgInput || !extraFields) return;

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

// Global scope for HTML onclick
(window as any).openWhatsApp = openWhatsApp;

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
    const modalForm = document.getElementById('modal-order-form') as HTMLFormElement;
    if (modalForm) {
        modalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const pkg = (document.getElementById('modal-package') as HTMLInputElement).value;
            const method = (document.getElementById('modal-payment-method') as HTMLSelectElement).value;
            const note = (document.getElementById('modal-note') as HTMLTextAreaElement).value;
            const orderId = generateOrderId();
            
            let message = `*╔══════════════════╗*\n`;
            message += `*   🕹️  BLACK LTZ ORDER  🕹️   *\n`;
            message += `*╚══════════════════╝*\n\n`;
            message += `*🆔 Order ID :* ${orderId}\n`;
            message += `*📦 Package  :* ${pkg}\n`;
            message += `*💳 Payment  :* ${method}\n`;
            message += `*──────────────────*\n`;

            const uidInput = document.getElementById('modal-uid') as HTMLInputElement;
            const playerNameInput = document.getElementById('modal-player-name') as HTMLInputElement;
            const guildNameInput = document.getElementById('modal-guild-name') as HTMLInputElement;
            const platformInput = document.getElementById('modal-platform') as HTMLInputElement;
            const tiktokLinkInput = document.getElementById('modal-tiktok-link') as HTMLInputElement;
            const webDescInput = document.getElementById('modal-web-desc') as HTMLTextAreaElement;

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

    // Dynamic Package Rendering
    const currentPath = window.location.pathname;
    const pageSlug = currentPath.split('/').pop()?.replace('.html', '') || 'index';

    if (pageSlug !== 'index' && pageSlug !== 'admin') {
        const packagesContainer = document.getElementById('packages-container');
        const iosContainer = document.getElementById('packages-container-ios');
        const androidContainer = document.getElementById('packages-container-android');

        if (packagesContainer || iosContainer || androidContainer) {
            // Fetch category first
            onSnapshot(query(collection(db, 'categories'), where('slug', '==', pageSlug)), (catSnapshot) => {
                if (!catSnapshot.empty) {
                    const category = { id: catSnapshot.docs[0].id, ...catSnapshot.docs[0].data() } as Category;
                    
                    // Fetch packages for this category
                    onSnapshot(query(collection(db, 'packages'), where('categoryId', '==', category.id), where('status', '==', 'active'), orderBy('displayOrder')), (pkgSnapshot) => {
                        const pkgs = pkgSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Package));
                        
                        if (packagesContainer) {
                            packagesContainer.innerHTML = pkgs.map(pkg => renderPackageCard(pkg, pageSlug)).join('');
                        }

                        if (iosContainer) {
                            const iosPkgs = pkgs.filter(p => p.name.toLowerCase().includes('ios') || (p.badge && p.badge.toLowerCase().includes('ios')));
                            iosContainer.innerHTML = iosPkgs.map(pkg => renderPackageCard(pkg, pageSlug)).join('');
                        }

                        if (androidContainer) {
                            const androidPkgs = pkgs.filter(p => p.name.toLowerCase().includes('android') || (p.badge && p.badge.toLowerCase().includes('android')) || (!p.name.toLowerCase().includes('ios') && !p.badge?.toLowerCase().includes('ios')));
                            androidContainer.innerHTML = androidPkgs.map(pkg => renderPackageCard(pkg, pageSlug)).join('');
                        }
                    });
                }
            });
        }
    }

    // Mobile Menu Toggle
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            const icon = menuBtn.querySelector('i');
            if (icon) {
                if (mobileMenu.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-xmark');
                } else {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            }
        });

        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                const icon = menuBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }
});

function renderPackageCard(pkg: Package, pageSlug: string) {
    if (pageSlug === 'topup') {
        return `
            <div class="package-card glass-card p-6 rounded-2xl text-center cursor-pointer diamond-shine group" 
                 onclick="window.openModal('${pkg.name}', '${pkg.price}', 'topup')">
                <div class="relative mb-4">
                    <span class="emoji-diamond-glow">💎</span>
                </div>
                <h3 class="font-black text-xl mb-1">${pkg.name}</h3>
                <p class="text-brand-yellow font-bold mb-4">LKR ${pkg.price}</p>
                <button class="w-full py-2 rounded-lg bg-cyan-600/20 border border-cyan-500/30 text-xs font-bold uppercase tracking-widest group-hover:bg-cyan-600 group-hover:text-white transition-all">
                    ${pkg.buttonText || 'Buy Now'}
                </button>
            </div>
        `;
    }

    if (pageSlug === 'tiktok') {
        return `
            <div class="package-card glass-card p-8 rounded-3xl text-center border-t-4 border-pink-500 cursor-pointer group" 
                 onclick="window.openModal('${pkg.name}', '${pkg.price}', 'tiktok')">
                <div class="mb-6">
                    <i class="fa-brands fa-tiktok text-5xl text-white group-hover:scale-110 transition-transform"></i>
                </div>
                <h3 class="text-xl font-black mb-2">${pkg.name}</h3>
                <p class="text-gray-400 mb-4">${pkg.description || ''}</p>
                <p class="text-3xl font-black text-brand-yellow mb-6">Rs. ${pkg.price}</p>
                <button class="w-full py-3 rounded-xl bg-pink-600 font-bold hover:bg-pink-700 transition-colors">
                    ${pkg.buttonText || 'Buy Now'}
                </button>
            </div>
        `;
    }

    if (pageSlug === 'panel') {
        const isIos = pkg.name.toLowerCase().includes('ios') || (pkg.badge && pkg.badge.toLowerCase().includes('ios'));
        return `
            <div class="glass-card p-6 rounded-2xl border-l-4 ${isIos ? 'border-purple-500' : 'border-cyan-500'}">
                <h3 class="font-bold text-lg mb-1">${pkg.name}</h3>
                <p class="${isIos ? 'text-brand-purple' : 'text-brand-cyan'} font-black text-xl mb-4">${pkg.price} LKR</p>
                <button class="w-full py-2 rounded-lg ${isIos ? 'bg-purple-600/20 border-purple-500/50 hover:bg-purple-600' : 'bg-cyan-600/20 border-cyan-500/50 hover:bg-cyan-600'} transition-all font-bold" 
                        onclick="window.openModal('${pkg.name}', '${pkg.price}', 'panel')">
                    ${pkg.buttonText || 'Order'}
                </button>
            </div>
        `;
    }

    if (pageSlug === 'boost') {
        return `
            <div class="glass-card px-6 py-3 rounded-full border-cyan-500/30 cursor-pointer hover:border-cyan-500 transition-all"
                 onclick="window.openModal('${pkg.name}', '${pkg.price}', 'boost')">
                <span class="text-cyan-400 font-black">${pkg.name}</span> - LKR ${pkg.price}
            </div>
        `;
    }

    if (pageSlug === 'webdev') {
        return `
            <div class="package-card group" onclick="window.openModal('${pkg.name}', '${pkg.price}', 'webdev')">
                <div class="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-3xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                <div class="relative h-full glass-card p-8 rounded-3xl border border-white/5 flex flex-col">
                    <div class="flex justify-between items-start mb-6">
                        <div class="w-12 h-12 bg-indigo-600/20 rounded-2xl flex items-center justify-center">
                            <i class="fa-solid fa-code text-2xl text-indigo-500"></i>
                        </div>
                        ${pkg.badge ? `<span class="text-xs font-bold bg-indigo-600/20 text-indigo-400 px-3 py-1 rounded-full uppercase tracking-widest">${pkg.badge}</span>` : ''}
                    </div>
                    <h3 class="text-xl font-bold mb-2">${pkg.name}</h3>
                    <p class="text-gray-500 text-sm mb-6">${pkg.description || ''}</p>
                    <div class="text-2xl font-black text-white mb-6">LKR ${pkg.price}<span class="text-sm font-normal text-gray-500"> / starting</span></div>
                    <button class="w-full py-4 rounded-2xl bg-indigo-600 text-white font-black uppercase tracking-widest text-xs hover:btn-glow-indigo transition-all">
                        ${pkg.buttonText || 'Order Now'}
                    </button>
                </div>
            </div>
        `;
    }

    // Default
    return `
        <div class="package-card glass-card p-6 rounded-2xl text-center cursor-pointer group" 
             onclick="window.openModal('${pkg.name}', '${pkg.price}', '${pageSlug}')">
            <h3 class="font-black text-xl mb-1">${pkg.name}</h3>
            <p class="text-brand-yellow font-bold mb-4">LKR ${pkg.price}</p>
            <button class="w-full py-2 rounded-lg bg-white/10 border border-white/20 group-hover:bg-white group-hover:text-black transition-all">
                ${pkg.buttonText || 'Order'}
            </button>
        </div>
    `;
}

(window as any).openModal = openModal;
