(function () {
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav__toggle");
  const menu = document.querySelector(".nav__list");

  if (!toggle || !menu) return;

  function closeMenu() {
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  }

  function openMenu() {
    menu.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
  }

  toggle.addEventListener("click", function () {
    if (menu.classList.contains("is-open")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  menu.querySelectorAll("a[href^='#']").forEach(function (link) {
    link.addEventListener("click", function () {
      if (window.matchMedia("(max-width: 900px)").matches) {
        closeMenu();
      }
    });
  });

  document.addEventListener("click", function (e) {
    if (nav && !nav.contains(e.target)) {
      closeMenu();
    }
  });

  window.addEventListener("resize", function () {
    if (window.matchMedia("(min-width: 901px)").matches) {
      closeMenu();
    }
  });
})();

(function () {
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.querySelector(".lightbox__img");
  var lightboxCaption = document.getElementById("lightbox-caption");
  var closeBtn = document.querySelector(".lightbox__close");
  var backdrop = document.querySelector(".lightbox__backdrop");
  var triggers = document.querySelectorAll(".image-gallery__trigger");
  var lastFocused = null;

  if (!lightbox || !lightboxImg || !triggers.length) return;

  function openLightbox(src, alt, caption) {
    lastFocused = document.activeElement;
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    lightboxCaption.textContent = caption;
    lightbox.hidden = false;
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImg.removeAttribute("src");
    document.body.style.overflow = "";
    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
  }

  triggers.forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      var img = trigger.querySelector("img");
      var src = trigger.getAttribute("data-fullsrc") || (img && img.getAttribute("src"));
      var alt = img ? img.getAttribute("alt") : "";
      var captionEl = trigger.closest(".image-gallery__item");
      var captionNode = captionEl && captionEl.querySelector(".image-gallery__caption");
      var caption = captionNode ? captionNode.textContent : alt;
      if (src) openLightbox(src, alt, caption);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", closeLightbox);
  }

  if (backdrop) {
    backdrop.addEventListener("click", closeLightbox);
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !lightbox.hidden) {
      closeLightbox();
    }
  });
})();

(function () {
  document.querySelectorAll("[data-carousel]").forEach(function (carousel) {
    var track = carousel.querySelector(".carousel__track");
    var slides = carousel.querySelectorAll(".carousel__slide");
    var captionEl = carousel.querySelector(".carousel__caption");
    var prevBtn = carousel.querySelector(".carousel__arrow--prev");
    var nextBtn = carousel.querySelector(".carousel__arrow--next");
    var dots = carousel.querySelectorAll(".carousel__dot");
    var viewport = carousel.querySelector(".carousel__viewport");
    var index = 0;
    var total = slides.length;
    var touchStartX = 0;

    if (!track || !total) return;

    function goTo(nextIndex) {
      index = (nextIndex + total) % total;

      track.style.transform = "translate3d(-" + index * 100 + "%, 0, 0)";

      slides.forEach(function (slide, i) {
        var isActive = i === index;
        slide.setAttribute("aria-hidden", isActive ? "false" : "true");
        slide.querySelectorAll("button, a").forEach(function (el) {
          el.tabIndex = isActive ? 0 : -1;
        });
      });

      dots.forEach(function (dot, i) {
        var isActive = i === index;
        dot.classList.toggle("is-active", isActive);
        dot.setAttribute("aria-selected", isActive ? "true" : "false");
      });

      if (captionEl && slides[index]) {
        captionEl.textContent = slides[index].getAttribute("data-caption") || "";
      }
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        goTo(index - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        goTo(index + 1);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        var slideIndex = parseInt(dot.getAttribute("data-slide"), 10);
        if (!isNaN(slideIndex)) goTo(slideIndex);
      });
    });

    carousel.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goTo(index - 1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goTo(index + 1);
      }
    });

    if (viewport) {
      viewport.addEventListener(
        "touchstart",
        function (e) {
          touchStartX = e.changedTouches[0].screenX;
        },
        { passive: true }
      );

      viewport.addEventListener(
        "touchend",
        function (e) {
          var delta = e.changedTouches[0].screenX - touchStartX;
          if (Math.abs(delta) < 40) return;
          if (delta > 0) goTo(index - 1);
          else goTo(index + 1);
        },
        { passive: true }
      );
    }

    goTo(0);
  });
})();
