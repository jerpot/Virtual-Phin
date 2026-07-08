// Set active nav item based on current path
(function () {
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-link").forEach((a) => {
    const href = a.getAttribute("href");
    if (href === path) {
      a.classList.add("active");
    }
  });
})();

// Hide/show navbar on scroll
(function () {
  let lastScrollTop = 0;
  const navbar = document.querySelector(".navbar");
  const scrollThreshold = 10; // Minimum scroll distance to trigger hide/show

  if (!navbar) return;

  window.addEventListener(
    "scroll",
    function () {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      // Only trigger if scrolled enough to avoid jittery behavior
      if (Math.abs(scrollTop - lastScrollTop) < scrollThreshold) {
        return;
      }

      if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scrolling down - hide navbar
        navbar.classList.add("navbar-hidden");
      } else {
        // Scrolling up - show navbar
        navbar.classList.remove("navbar-hidden");
      }

      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    },
    { passive: true }
  );
})();
