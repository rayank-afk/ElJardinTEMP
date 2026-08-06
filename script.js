(() => {
  const siteHeader = document.querySelector("[data-site-header]");
  const headerBrandRow = document.querySelector(".header-brand-row");
  const headerNav = document.querySelector(".header-nav");

  const collapseTarget =
    document.querySelector("#parties-hero-image") ||
    document.querySelector("#contact-title") ||
    document.querySelector("#story-title") ||
    document.querySelector("#main-menu-heading") ||
    document.querySelector("#gallery-title") ||
    document.querySelector(".hero h1");

  const keepHeaderBackground =
    siteHeader?.classList.contains("is-past-hero-border") ?? false;

  if (siteHeader && headerBrandRow && headerNav && collapseTarget) {
    let collapsePoint = 0;
    let lastScrollY = window.scrollY;
    let scrollFrame = 0;

    const scrollBuffer = 8;

    function calculateCollapsePoint() {
      const wasCollapsed =
        siteHeader.classList.contains("is-collapsed");

      siteHeader.classList.remove("is-collapsed");

      const expandedHeaderHeight =
        headerBrandRow.offsetHeight + headerNav.offsetHeight;

      const targetTop =
        collapseTarget.getBoundingClientRect().top +
        window.scrollY;

      /*
       * Collapses when the chosen page heading reaches
       * the bottom of the expanded site header.
       */
      collapsePoint = Math.max(
        1,
        targetTop - expandedHeaderHeight
      );

      if (wasCollapsed && window.scrollY >= collapsePoint) {
        siteHeader.classList.add("is-collapsed");
      }
    }

    function updateHeaderState(force = false) {
      const currentScrollY = Math.max(0, window.scrollY);
      const scrollDifference = currentScrollY - lastScrollY;

      const hasReachedTarget =
        currentScrollY > 0 &&
        currentScrollY >= collapsePoint;

      siteHeader.classList.toggle(
        "is-past-hero-border",
        keepHeaderBackground || hasReachedTarget
      );

      if (!hasReachedTarget) {
        siteHeader.classList.remove("is-collapsed");
      } else if (force) {
        siteHeader.classList.add("is-collapsed");
      } else if (scrollDifference > scrollBuffer) {
        siteHeader.classList.add("is-collapsed");
      } else if (scrollDifference < -scrollBuffer) {
        siteHeader.classList.remove("is-collapsed");
      }

      lastScrollY = currentScrollY;
      scrollFrame = 0;
    }

    function requestHeaderUpdate() {
      if (scrollFrame) return;

      scrollFrame = window.requestAnimationFrame(() => {
        updateHeaderState();
      });
    }

    function initializeHeader() {
      calculateCollapsePoint();
      updateHeaderState(true);
    }

    window.addEventListener("load", initializeHeader);
    window.addEventListener("pageshow", initializeHeader);

    window.addEventListener("resize", () => {
      calculateCollapsePoint();
      updateHeaderState(true);
    });

    window.addEventListener("scroll", requestHeaderUpdate, {
      passive: true
    });

    initializeHeader();
  }

  const menuToggle = document.querySelector(".menu-toggle");
  const menuOverlay = document.querySelector(".menu-overlay");
  const menuClose = document.querySelector(".menu-close");
  const overlayLinks = Array.from(document.querySelectorAll(".overlay-nav a"));

  if (menuToggle && menuOverlay && menuClose) {
    let previouslyFocusedElement = null;

    function openMenu() {
      previouslyFocusedElement = document.activeElement;
      document.body.classList.add("menu-open");
      menuToggle.setAttribute("aria-expanded", "true");
      menuOverlay.setAttribute("aria-hidden", "false");

      window.requestAnimationFrame(() => menuClose.focus());
    }

    function closeMenu() {
      document.body.classList.remove("menu-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuOverlay.setAttribute("aria-hidden", "true");

      if (previouslyFocusedElement instanceof HTMLElement) {
        previouslyFocusedElement.focus();
      } else {
        menuToggle.focus();
      }
    }

    menuToggle.addEventListener("click", openMenu);
    menuClose.addEventListener("click", closeMenu);

    overlayLinks.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    menuOverlay.addEventListener("click", (event) => {
      if (event.target === menuOverlay) closeMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && document.body.classList.contains("menu-open")) {
        closeMenu();
      }
    });
  }

  /* Section reveal animations */
  const revealSections = Array.from(
    document.querySelectorAll("[data-reveal]")
  );
  const galleryPageFoodImages = Array.from(
    document.querySelectorAll(
      '.gallery-page [data-reveal="food-gallery"] .gallery-image'
    )
  );

  if (revealSections.length) {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isContactMobile = window.matchMedia("(max-width: 650px)").matches;

    const revealChildren = {
      featured: ".small-heading-row, .featured-card",
      welcome: ".editorial-copy, .editorial-image",
      celebration: ".editorial-image, .editorial-copy",
      "order-callout": ".photo-callout__image, .callout-card",
      "food-gallery": ".gallery-heading, .gallery-image",
      "drinks-gallery": ".gallery-heading, .gallery-image",
      "reserve-story": ".editorial-copy, .editorial-image",
      "catering-story": ".editorial-image, .editorial-copy",
      "celebrate-story": ".editorial-copy, .editorial-image",
      "everyone-story": ".editorial-image, .editorial-copy",
      visit: ".visit-copy, .hours",
      reviews: ".review-window, .review-controls",
      featuring: "h2, .featuring__grid > div",
      rewards: ".photo-callout__image, .callout-card",
      faq: "h2, .faq__list details",
      location: "h2, .location-map, .location-details",
      "contact-intro":
        ".contact-intro__copy h1, .contact-intro__copy p, .contact-mosaic",
      "contact-methods": ".contact-method",
      "parties-hero": ".parties-hero__copy, .parties-hero__media",
      "parties-celebrations":
        ".parties-section-title, .parties-celebration-card",
      "parties-hospitality":
        ".parties-hospitality__copy, .parties-hospitality__media",
      "parties-planning":
        ".parties-section-title, .parties-planning__item",
      "parties-cta": ".parties-cta",
      "story-hero": ".story-heading, .story-image, .story-card",
      "story-care": ".story-care__copy, .story-care__image",
      "story-special": ".story-care__image, .story-care__copy",
      "story-visit": "h2, p"
    };

    const revealTiming = {
      featured: { delay: 90, stagger: 75 },
      welcome: { delay: 110, stagger: 130 },
      celebration: { delay: 100, stagger: 145 },
      "order-callout": { delay: 150, stagger: 170 },
      "food-gallery": { delay: 90, stagger: 75 },
      "drinks-gallery": { delay: 100, stagger: 82 },
      "reserve-story": { delay: 100, stagger: 130 },
      "catering-story": { delay: 110, stagger: 145 },
      "celebrate-story": { delay: 95, stagger: 120 },
      "everyone-story": { delay: 120, stagger: 135 },
      visit: { delay: 120, stagger: 150 },
      reviews: { delay: 120, stagger: 150 },
      featuring: { delay: 90, stagger: 65 },
      rewards: { delay: 130, stagger: 170 },
      faq: { delay: 80, stagger: 70 },
      location: { delay: 100, stagger: 125 },
      "contact-intro": { delay: 50, stagger: 90 },
      "contact-methods": {
        delay: isContactMobile ? 160 : 500,
        stagger: 90
      },
      "parties-hero": { delay: 60, stagger: 140 },
      "parties-celebrations": { delay: 70, stagger: 70 },
      "parties-hospitality": { delay: 80, stagger: 130 },
      "parties-planning": { delay: 70, stagger: 70 },
      "parties-cta": { delay: 80, stagger: 0 },
      "story-hero": { delay: 70, stagger: 140 },
      "story-care": { delay: 100, stagger: 150 },
      "story-special": { delay: 100, stagger: 150 },
      "story-visit": { delay: 80, stagger: 120 }
    };

    revealSections.forEach((section) => {
      const revealName = section.dataset.reveal;
      const childSelector = revealChildren[revealName];

      if (!childSelector) return;

      const timing = revealTiming[revealName] || {
        delay: 100,
        stagger: 80
      };

      section.querySelectorAll(childSelector).forEach((child, index) => {
        child.classList.add("reveal-child");
        child.style.setProperty(
          "--reveal-child-delay",
          `${timing.delay + index * timing.stagger}ms`
        );
      });
    });

    galleryPageFoodImages.forEach((image) => {
      image.classList.add("reveal-by-item");
      image.style.removeProperty("--reveal-child-delay");
    });

    function revealSection(section) {
      section.classList.add("is-revealed");
    }

    if (reducedMotion || !("IntersectionObserver" in window)) {
      revealSections.forEach(revealSection);
      galleryPageFoodImages.forEach(revealSection);
    } else {
      document.documentElement.classList.add("reveal-ready");

      const revealObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            window.requestAnimationFrame(() => {
              revealSection(entry.target);
            });

            observer.unobserve(entry.target);
          });
        },
        {
          threshold: 0.12,
          rootMargin: "0px 0px -8% 0px"
        }
      );

      revealSections.forEach((section) => {
        revealObserver.observe(section);
      });

      if (galleryPageFoodImages.length) {
        const galleryImageObserver = new IntersectionObserver(
          (entries, observer) => {
            const visibleEntries = entries
              .filter((entry) => entry.isIntersecting)
              .sort((firstEntry, secondEntry) => {
                const firstRect = firstEntry.boundingClientRect;
                const secondRect = secondEntry.boundingClientRect;
                const verticalDifference = firstRect.top - secondRect.top;

                if (Math.abs(verticalDifference) > 1) {
                  return verticalDifference;
                }

                return firstRect.left - secondRect.left;
              });

            if (!visibleEntries.length) return;

            window.requestAnimationFrame(() => {
              visibleEntries.forEach((entry, index) => {
                entry.target.style.setProperty(
                  "--reveal-child-delay",
                  `${60 + index * 80}ms`
                );
                revealSection(entry.target);
                observer.unobserve(entry.target);
              });
            });
          },
          {
            threshold: 0.18,
            rootMargin: "0px 0px -6% 0px"
          }
        );

        galleryPageFoodImages.forEach((image) => {
          galleryImageObserver.observe(image);
        });
      }
    }
  }

  const heroSlides = Array.from(
    document.querySelectorAll(".hero__slide")
  );

  if (heroSlides.length > 1) {
    const heroMotionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );
    let activeHeroSlide = Math.max(
      0,
      heroSlides.findIndex((slide) => slide.classList.contains("is-active"))
    );
    let heroCycleTimer = 0;

    function showHeroSlide(index) {
      heroSlides.forEach((slide, slideIndex) => {
        slide.classList.toggle("is-active", slideIndex === index);
      });
      activeHeroSlide = index;
    }

    function stopHeroCycle() {
      window.clearInterval(heroCycleTimer);
      heroCycleTimer = 0;
    }

    function startHeroCycle() {
      stopHeroCycle();

      if (heroMotionPreference.matches || document.hidden) return;

      heroCycleTimer = window.setInterval(() => {
        showHeroSlide((activeHeroSlide + 1) % heroSlides.length);
      }, 5500);
    }

    function updateHeroMotion() {
      if (heroMotionPreference.matches) {
        stopHeroCycle();
        showHeroSlide(0);
      } else {
        startHeroCycle();
      }
    }

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        stopHeroCycle();
      } else {
        startHeroCycle();
      }
    });

    if ("addEventListener" in heroMotionPreference) {
      heroMotionPreference.addEventListener("change", updateHeroMotion);
    } else {
      heroMotionPreference.addListener(updateHeroMotion);
    }

    window.addEventListener("pagehide", stopHeroCycle);
    updateHeroMotion();
  }

  const faqItems = Array.from(
    document.querySelectorAll(".faq details")
  );

  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;

      faqItems.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.removeAttribute("open");
        }
      });
    });
  });

  const year = document.querySelector("[data-year]");

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  const reviewWindow = document.querySelector(".review-window");
  const reviewTrack = document.querySelector(".review-track");
  const reviewPrev = document.querySelector(".review-prev");
  const reviewNext = document.querySelector(".review-next");
  const reviewControls = document.querySelector(".review-controls");

  if (reviewTrack && reviewPrev && reviewNext) {
    const originalSlides = Array.from(reviewTrack.children);

    let currentReview = 0;
    let reviewIsMoving = false;
    let movementFallback;

    function updateReviewAccessibility() {
      Array.from(reviewTrack.children).forEach((slide, index) => {
        slide.setAttribute(
          "aria-hidden",
          String(index !== currentReview)
        );
      });
    }

    function moveReviewSlider(animate = true) {
      if (!animate) {
        reviewTrack.style.transition = "none";
      }

      reviewTrack.style.transform =
        `translateX(-${currentReview * 100}%)`;

      updateReviewAccessibility();

      if (!animate) {
        void reviewTrack.offsetHeight;
        reviewTrack.style.transition = "";
      }
    }

    function finishReviewMove() {
      if (currentReview === originalSlides.length + 1) {
        currentReview = 1;
        moveReviewSlider(false);
      } else if (currentReview === 0) {
        currentReview = originalSlides.length;
        moveReviewSlider(false);
      }

      window.clearTimeout(movementFallback);
      reviewIsMoving = false;
    }

    function changeReview(direction) {
      if (reviewIsMoving || originalSlides.length < 2) {
        return;
      }

      reviewIsMoving = true;
      currentReview += direction;
      moveReviewSlider();

      movementFallback = window.setTimeout(
        finishReviewMove,
        900
      );
    }

    if (originalSlides.length > 1) {
      const firstClone = originalSlides[0].cloneNode(true);
      const lastClone =
        originalSlides[originalSlides.length - 1].cloneNode(true);

      firstClone.dataset.reviewClone = "true";
      lastClone.dataset.reviewClone = "true";

      reviewTrack.prepend(lastClone);
      reviewTrack.append(firstClone);

      currentReview = 1;

      reviewNext.addEventListener("click", () => {
        changeReview(1);
      });

      reviewPrev.addEventListener("click", () => {
        changeReview(-1);
      });

      reviewTrack.addEventListener(
        "transitionend",
        (event) => {
          if (
            event.target !== reviewTrack ||
            event.propertyName !== "transform"
          ) {
            return;
          }

          finishReviewMove();
        }
      );

      reviewWindow?.addEventListener("keydown", (event) => {
        if (event.key === "ArrowRight") {
          event.preventDefault();
          changeReview(1);
        } else if (event.key === "ArrowLeft") {
          event.preventDefault();
          changeReview(-1);
        }
      });

      moveReviewSlider(false);
    } else {
      reviewControls?.setAttribute("hidden", "");
      updateReviewAccessibility();
    }
  }
})();