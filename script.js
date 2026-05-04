// Efeito de brilho do cursor seguindo o mouse
const cursorGlow = document.querySelector('.cursor-glow');

document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
});

// Suaviza o scroll para links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Efeito de fade-in ao scroll para os cards do portfólio
const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.glass-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out, box-shadow 0.4s ease, border-color 0.4s ease';
    observer.observe(card);
});

// Custom Video Modal Logic
const videoModal = document.getElementById('video-modal');
const modalIframeContainer = document.getElementById('modal-iframe-container');
const closeModalBtn = document.querySelector('.close-modal');
const modalOverlay = document.querySelector('.video-modal-overlay');

document.querySelectorAll('.custom-lightbox-trigger').forEach(trigger => {
    trigger.addEventListener('click', function () {
        const videoSrc = this.getAttribute('data-src');
        const isYouTube = videoSrc.includes('youtube.com') || videoSrc.includes('youtube-nocookie.com');

        videoModal.classList.add('active');
        document.body.style.overflow = 'hidden';

        const allowAttr = isYouTube
            ? 'autoplay; encrypted-media; picture-in-picture; fullscreen; accelerometer; gyroscope'
            : 'autoplay; clipboard-write; encrypted-media; picture-in-picture';

        modalIframeContainer.innerHTML = `<iframe src="${videoSrc}" allowfullscreen loading="lazy" frameborder="0" allow="${allowAttr}" referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
    });
});

function closeModal() {
    videoModal.classList.remove('active');
    modalIframeContainer.innerHTML = '';
    document.body.style.overflow = '';
}

if (closeModalBtn && modalOverlay) {
    closeModalBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal.classList.contains('active')) {
        closeModal();
    }
});