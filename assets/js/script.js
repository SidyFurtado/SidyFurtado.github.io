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

// Custom Video Modal Logic
const videoModal = document.getElementById('video-modal');
const modalIframeContainer = document.getElementById('modal-iframe-container');
const closeModalBtn = document.querySelector('.close-modal');
const modalOverlay = document.querySelector('.video-modal-overlay');

document.querySelectorAll('.custom-lightbox-trigger').forEach(trigger => {
    trigger.addEventListener('click', function () {
        const videoSrc = this.getAttribute('data-src');
        const isShorts = this.getAttribute('data-shorts') === 'true';
        const isYouTube = videoSrc.includes('youtube.com') || videoSrc.includes('youtube-nocookie.com');

        videoModal.classList.add('active');
        videoModal.classList.toggle('shorts-modal', isShorts);
        document.body.style.overflow = 'hidden';

        const allowAttr = isYouTube
            ? 'autoplay; encrypted-media; picture-in-picture; fullscreen; accelerometer; gyroscope'
            : 'autoplay; clipboard-write; encrypted-media; picture-in-picture';

        modalIframeContainer.innerHTML = `<iframe src="${videoSrc}" allowfullscreen loading="lazy" frameborder="0" allow="${allowAttr}" referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
    });
});

function closeModal() {
    videoModal.classList.remove('active');
    videoModal.classList.remove('shorts-modal');
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
