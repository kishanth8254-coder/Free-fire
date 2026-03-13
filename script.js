function openWhatsApp(message) {
    const phoneNumber = "94761731102";
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
}

document.addEventListener('DOMContentLoaded', () => {
    // Top-up Form Logic
    const topupForm = document.getElementById('topup-form');
    if (topupForm) {
        topupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const uid = document.getElementById('player-uid').value;
            const name = document.getElementById('player-name').value;
            const pkg = document.getElementById('package-select').value;
            const method = document.getElementById('payment-method').value;
            const note = document.getElementById('extra-note').value;

            const message = `Hi BLACK LTZ, I need Free Fire top-up.\nUID: ${uid}\nPlayer Name: ${name}\nPackage: ${pkg}\nPayment Method: ${method}\nNote: ${note}`;
            openWhatsApp(message);
        });
    }

    // Package Card Click Logic
    const packageCards = document.querySelectorAll('.package-card');
    packageCards.forEach(card => {
        card.addEventListener('click', () => {
            const pkgName = card.dataset.package;
            const pkgPrice = card.dataset.price;
            
            // If there's a form, populate it
            const select = document.getElementById('package-select');
            if (select) {
                select.value = pkgName;
                select.scrollIntoView({ behavior: 'smooth' });
            } else {
                // Direct order if on a page without a form
                const message = `Hi BLACK LTZ, I'm interested in the ${pkgName} package for LKR ${pkgPrice}.`;
                openWhatsApp(message);
            }
        });
    });

    // Guild Boost Logic
    const boostBtn = document.getElementById('boost-order-btn');
    if (boostBtn) {
        boostBtn.addEventListener('click', () => {
            openWhatsApp("Hi BLACK LTZ, I need Guild Boost Service");
        });
    }

    // Panel Store Logic
    const panelBtns = document.querySelectorAll('.panel-order-btn');
    panelBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const platform = btn.dataset.platform;
            const pkg = btn.dataset.package;
            const message = `Hi BLACK LTZ, I need Panel Store details.\nPlatform: ${platform}\nPackage: ${pkg}`;
            openWhatsApp(message);
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
