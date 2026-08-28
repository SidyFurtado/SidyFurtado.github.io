/* marca que há JS (a janela de projeção só fecha se puder reabrir)
   e garante a abertura mesmo se o script principal não carregar */
(function (d) {
    d.documentElement.className += ' js';
    setTimeout(function () { if (d.body) d.body.classList.add('gate-lifted'); }, 3000);
})(document);
