(function () {
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var header = document.querySelector(".site-header");
    function onScroll() { header.classList.toggle("scrolled", window.scrollY > 8); }
    window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

    var items = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window && !reduce) {
        var io = new IntersectionObserver(function (es) {
            es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
        }, { threshold: 0.12 });
        items.forEach(function (el) { io.observe(el); });
    } else { items.forEach(function (el) { el.classList.add("in"); }); }

    var counters = document.querySelectorAll("[data-count]");
    function run(el) {
        var end = +el.dataset.count, t0 = null;
        function step(t) { if (!t0) t0 = t; var p = Math.min((t - t0) / 1200, 1); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); }
        requestAnimationFrame(step);
    }
    if (!reduce && "IntersectionObserver" in window) {
        var co = new IntersectionObserver(function (es) {
            es.forEach(function (e) { if (e.isIntersecting) { run(e.target); co.unobserve(e.target); } });
        }, { threshold: 0.6 });
        counters.forEach(function (el) { el.textContent = "0"; co.observe(el); });
    }

    var typed = document.getElementById("typed");
    if (typed && !reduce) {
        var words = typed.dataset.words.split("|"), w = 0, c = 0, del = false;
        (function tick() {
            var word = words[w];
            typed.textContent = word.slice(0, c);
            if (!del && c === word.length) { del = true; return setTimeout(tick, 1600); }
            if (del && c === 0) { del = false; w = (w + 1) % words.length; }
            c += del ? -1 : 1;
            setTimeout(tick, del ? 35 : 70);
        })();
    }
})();
