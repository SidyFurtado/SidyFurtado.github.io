/* ============================================================
   SIDY FURTADO — PELÍCULA
   ============================================================ */
(function () {
    'use strict';

    var $ = function (s, c) { return (c || document).querySelector(s); };
    var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    var hasGSAP = typeof window.gsap !== 'undefined';

    if (hasGSAP && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

    /* rede de segurança: sem GSAP, nada fica invisível */
    if (!hasGSAP || reduced) {
        $$('[data-reveal]').forEach(function (el) { el.style.opacity = 1; });
    }

    /* ------------------------------------------------------------
       1. ABERTURA DA JANELA + ENTRADA DO HERO
       ------------------------------------------------------------ */
    function openGate() {
        document.body.classList.add('gate-lifted');

        if (!hasGSAP || reduced) {
            $$('[data-hero-fade]').forEach(function (el) { el.style.opacity = 1; });
            return;
        }

        gsap.timeline({ delay: 0.3 })
            .from('.hero h1 .line > span', {
                yPercent: 112,
                duration: 1,
                ease: 'expo.out',
                stagger: 0.08
            })
            .from('.hero__eyebrow i', { scaleX: 0, duration: 0.8, ease: 'expo.out' }, 0.15)
            .fromTo('[data-hero-fade]',
                { opacity: 0, y: 14 },
                { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08 }, '-=0.55')
            .from('.site-head', { opacity: 0, duration: 0.7 }, 0.1);
    }

    if (document.readyState === 'complete') { openGate(); }
    else { window.addEventListener('load', openGate); }
    setTimeout(function () {
        if (!document.body.classList.contains('gate-lifted')) openGate();
    }, 2200);

    /* ------------------------------------------------------------
       2. SEQUÊNCIA DE FRAMES DO HERO
       ------------------------------------------------------------ */
    (function heroFrames() {
        var frames = $$('.hero__frame');
        if (frames.length < 2 || reduced) return;

        var now = $('[data-hero-now]');
        var i = 0;

        setInterval(function () {
            if (document.hidden) return;
            i = (i + 1) % frames.length;
            frames.forEach(function (f, k) { f.classList.toggle('is-live', k === i); });
            if (now) now.textContent = frames[i].getAttribute('data-title') || '';
        }, 6000);
    })();

    /* ------------------------------------------------------------
       3. CABEÇALHO
       ------------------------------------------------------------ */
    (function head() {
        var el = $('.site-head');
        var modal = $('#video-modal');
        if (!el) return;
        var last = 0;

        window.addEventListener('scroll', function () {
            var y = window.scrollY;
            el.classList.toggle('is-stuck', y > 40);
            el.classList.toggle('is-hidden', y > 420 && y > last && !modal.classList.contains('active'));
            last = y;
        }, { passive: true });
    })();

    /* ------------------------------------------------------------
       4. PELÍCULA LATERAL
       ------------------------------------------------------------ */
    (function gateRail() {
        var rail = $('.gate-rail');
        if (!rail) return;

        var sprockets = $('.gate-rail__sprockets', rail);
        var head = $('.gate-rail__head', rail);
        var label = $('.gate-rail__label', rail);

        var marks = [
            { id: 'topo', name: 'Início' },
            { id: 'trabalhos', name: 'Trabalhos' },
            { id: 'sobre', name: 'Sobre' },
            { id: 'contato', name: 'Contato' }
        ];
        var links = $$('.site-nav a');

        function paint() {
            var max = document.documentElement.scrollHeight - window.innerHeight;
            var y = window.scrollY;
            var p = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;

            if (sprockets) sprockets.style.backgroundPosition = 'center ' + (-y * 0.5) + 'px';
            if (head) head.style.transform = 'translateY(' + (p * (window.innerHeight - 2)) + 'px)';

            var mid = y + window.innerHeight * 0.42;
            var current = marks[0];
            marks.forEach(function (m) {
                var s = document.getElementById(m.id);
                if (s && s.offsetTop <= mid) current = m;
            });
            if (label && label.textContent !== current.name) label.textContent = current.name;

            links.forEach(function (a) {
                a.classList.toggle('is-current', a.getAttribute('href') === '#' + current.id);
            });
        }

        paint();
        window.addEventListener('scroll', paint, { passive: true });
        window.addEventListener('resize', paint);
    })();

    /* ------------------------------------------------------------
       5. CURSOR SOBRE O TRABALHO
       ------------------------------------------------------------ */
    (function reticle() {
        if (!fine || reduced || !hasGSAP) return;
        var el = $('.reticle');
        if (!el) return;

        var xTo = gsap.quickTo(el, 'x', { duration: 0.38, ease: 'power3' });
        var yTo = gsap.quickTo(el, 'y', { duration: 0.38, ease: 'power3' });

        window.addEventListener('mousemove', function (e) {
            document.body.classList.add('reticle-on');
            xTo(e.clientX);
            yTo(e.clientY);
        }, { passive: true });

        document.addEventListener('mouseleave', function () {
            document.body.classList.remove('reticle-on');
        });

        $$('[data-play]').forEach(function (t) {
            t.addEventListener('mouseenter', function () { el.classList.add('is-play'); });
            t.addEventListener('mouseleave', function () { el.classList.remove('is-play'); });
        });
    })();

    /* ------------------------------------------------------------
       6. REVELAÇÃO — uma entrada por bloco, discreta
       ------------------------------------------------------------ */
    (function reveals() {
        if (!hasGSAP || !window.ScrollTrigger || reduced) return;

        $$('[data-reveal]').forEach(function (el) {
            gsap.fromTo(el,
                { opacity: 0, y: 20 },
                {
                    opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
                    scrollTrigger: { trigger: el, start: 'top 90%', once: true }
                });
        });

        /* a imagem abre em letterbox: é a única citação de cinema na entrada */
        $$('.frame__gate, .vcard__gate').forEach(function (gate) {
            gsap.fromTo(gate,
                { clipPath: 'inset(32% 0% 32% 0%)' },
                {
                    clipPath: 'inset(0% 0% 0% 0%)',
                    duration: 1, ease: 'expo.out',
                    scrollTrigger: { trigger: gate, start: 'top 88%', once: true }
                });

            var img = $('img', gate);
            if (img) {
                gsap.fromTo(img,
                    { scale: 1.12 },
                    {
                        scale: 1, duration: 1.2, ease: 'expo.out',
                        scrollTrigger: { trigger: gate, start: 'top 88%', once: true }
                    });
            }
        });
    })();

    /* ------------------------------------------------------------
       7. MODAL DE VÍDEO
       ------------------------------------------------------------ */
    (function modal() {
        var box = $('#video-modal');
        if (!box) return;

        var frame = $('#modal-iframe-container', box);
        var title = $('#modal-title', box);
        var kind = $('[data-modal-kind]', box);
        var lastFocus = null;

        function open(btn) {
            var id = btn.getAttribute('data-video');
            /* só IDs de vídeo do YouTube (11 caracteres url-safe) chegam ao embed */
            if (!id || !/^[A-Za-z0-9_-]{11}$/.test(id)) return;

            lastFocus = btn;
            title.textContent = btn.getAttribute('data-title') || '';
            kind.textContent = btn.getAttribute('data-kind') || '';
            box.classList.toggle('is-portrait', btn.getAttribute('data-portrait') === 'true');
            box.classList.add('active');
            document.body.classList.add('is-locked');

            var iframe = document.createElement('iframe');
            iframe.src = 'https://www.youtube-nocookie.com/embed/' + id +
                '?autoplay=1&rel=0&modestbranding=1&playsinline=1';
            iframe.title = btn.getAttribute('data-title') || 'Vídeo';
            iframe.loading = 'lazy';
            iframe.setAttribute('allowfullscreen', '');
            iframe.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture; fullscreen');
            iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
            frame.textContent = '';
            frame.appendChild(iframe);

            $('.close-modal', box).focus();
        }

        function close() {
            box.classList.remove('active', 'is-portrait');
            frame.textContent = '';
            document.body.classList.remove('is-locked');
            if (lastFocus) lastFocus.focus();
        }

        $$('[data-play]').forEach(function (btn) {
            btn.addEventListener('click', function () { open(btn); });
        });

        $$('[data-close]', box).forEach(function (b) {
            b.addEventListener('click', close);
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && box.classList.contains('active')) close();
        });
    })();

    /* ------------------------------------------------------------
       8. NAVEGAÇÃO
       ------------------------------------------------------------ */
    $$('a[href^="#"]').forEach(function (a) {
        a.addEventListener('click', function (e) {
            var id = a.getAttribute('href');
            if (id === '#') return;
            var target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
        });
    });

    $$('[data-top]').forEach(function (b) {
        b.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
        });
    });

})();
