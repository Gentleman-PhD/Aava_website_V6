document.addEventListener("DOMContentLoaded", () => {
  // Sticky Navbar Glassmorphism Effect
  const navbar = document.getElementById("navbar");
  const heroSection = document.getElementById("hero");
  const navLogo = document.querySelector(".nav-logo");
  const mainHeroLogo = document.querySelector(".main-hero-logo");

  window.addEventListener("scroll", () => {
    if (navbar) {
      // If on Home page, use the giant logo. If on subpages, trigger just before the video ends (window.innerHeight - 100px)
      let scrollThreshold = mainHeroLogo ? (mainHeroLogo.getBoundingClientRect().bottom + window.scrollY - 80) : (window.innerHeight - 100);

      if (window.scrollY > scrollThreshold) {
        navbar.classList.add("scrolled");
        if (navLogo) navLogo.classList.add("visible");
      } else {
        navbar.classList.remove("scrolled");
        // Only hide the logo when scrolling up IF we are on the home page
        if (navLogo && mainHeroLogo) navLogo.classList.remove("visible");
      }
    }
  });

  // Smooth Scrolling for anchored links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });

  // Dynamic Animated Stats for Step 4 (The Difference) - Resets on scroll out
  const counters = document.querySelectorAll('.counter-val');
  const speed = 60; // adjust for speed

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const counter = entry.target;
      const target = parseFloat(counter.getAttribute('data-target')) || 0;

      if (entry.isIntersecting) {
        let count = 0;
        let isFloat = target % 1 !== 0;

        const updateCount = () => {
          const inc = target / speed;

          if (count < target) {
            count += inc;
            counter.innerText = isFloat ? count.toFixed(1) : Math.ceil(count);
            counter.dataset.animationId = requestAnimationFrame(updateCount);
          } else {
            counter.innerText = target;
          }
        };

        if (counter.dataset.animationId) {
          cancelAnimationFrame(parseInt(counter.dataset.animationId));
        }
        updateCount();
      } else {
        if (counter.dataset.animationId) {
          cancelAnimationFrame(parseInt(counter.dataset.animationId));
          counter.dataset.animationId = "";
        }
        counter.innerText = "0";
      }
    });
  }, { threshold: 0.1 });

  counters.forEach(counter => {
    counterObserver.observe(counter);
  });

  // Dynamic Animated Stats for Step 2 (The Problem) - Resets on scroll out
  const problemStats = document.querySelectorAll('.problem-val');
  const problemSpeed = 60; // adjust for speed

  const problemObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const counter = entry.target;
      const target = parseFloat(counter.getAttribute('data-target')) || 0;

      if (entry.isIntersecting) {
        let count = 0;
        const updateCount = () => {
          const inc = target / problemSpeed;

          if (count < target) {
            count += inc;
            counter.innerText = Math.ceil(count);
            counter.dataset.animationId = requestAnimationFrame(updateCount);
          } else {
            counter.innerText = target;
          }
        };

        // Cancel any pending animation before starting a new one
        if (counter.dataset.animationId) {
          cancelAnimationFrame(parseInt(counter.dataset.animationId));
        }
        updateCount();
      } else {
        // Reset to 0 when scrolling away
        if (counter.dataset.animationId) {
          cancelAnimationFrame(parseInt(counter.dataset.animationId));
          counter.dataset.animationId = "";
        }
        counter.innerText = "0";
      }
    });
  }, { threshold: 0.1 });

  problemStats.forEach(stat => {
    problemObserver.observe(stat);
  });

  // Seamless Video Loop Trick
  const heroVideo = document.querySelector('.hero-video');
  const videoOverlay = document.createElement('div');
  videoOverlay.className = 'loop-overlay';
  Object.assign(videoOverlay.style, {
    position: 'absolute',
    top: '0', left: '0', width: '100%', height: '100%',
    backgroundColor: '#000',
    opacity: '0',
    transition: 'opacity 1s ease',
    pointerEvents: 'none',
    zIndex: '2'
  });

  if (heroVideo) {
    heroVideo.parentElement.insertBefore(videoOverlay, heroVideo.nextSibling);

    heroVideo.addEventListener('timeupdate', () => {
      const remainingTime = heroVideo.duration - heroVideo.currentTime;

      // Fade to black right before video ends
      if (remainingTime <= 1.5) {
        videoOverlay.style.opacity = '1';
      }
      // Fade back in when video resets
      else if (heroVideo.currentTime < 0.5) {
        videoOverlay.style.opacity = '0';
      }
    });
  }

  // UPDATED SCROLL SPY LOGIC (BUG FIX & EXECUTION ADDED)
  const tracker = document.getElementById('service-tracker');
  const allTargets = document.querySelectorAll('#audit, #strategy, #execution, #sales-audit, #revenue-audit, #excellence-audit, #investor-audit, #strat-market, #strat-icp, #strat-pricing, #strat-custom, #strat-sales, #strat-journey, #strat-capability, #strat-playbook, #strat-event, #strat-fund, #strat-transform, #strat-revenue, #strat-pipeline, #strat-partner, #exec-fractional, #exec-growth, #exec-coaching');
  const trackerItems = document.querySelectorAll('.tracker-item, .tracker-sub-item');

  if (tracker && allTargets.length > 0) {
      const trackerObserver = new IntersectionObserver((entries) => {
          let isAnyVisible = false;

          entries.forEach(entry => {
              const id = entry.target.id;
              const link = document.querySelector(`[data-target="${id}"]`);

              if (entry.isIntersecting) {
                  // UNIVERSAL CLEAR: Fixes the scroll-up bug by wiping ALL active classes first
                  trackerItems.forEach(item => item.classList.remove('active'));
                  document.querySelectorAll('.horizontal-audit-box, .horizontal-strategy-box, .horizontal-execution-box').forEach(box => box.classList.remove('active-box'));

                  if (link) link.classList.add('active');

                  // Keep Parent "Audit" Active
                  if (entry.target.classList.contains('horizontal-audit-box')) {
                      entry.target.classList.add('active-box');
                      document.querySelector('.tracker-item[data-target="audit"]').classList.add('active');
                  }
                  // Keep Parent "Strategy" Active
                  if (entry.target.classList.contains('horizontal-strategy-box')) {
                      entry.target.classList.add('active-box');
                      document.querySelector('.tracker-item[data-target="strategy"]').classList.add('active');
                  }
                  // Keep Parent "Execution" Active
                  if (entry.target.classList.contains('horizontal-execution-box')) {
                      entry.target.classList.add('active-box');
                      document.querySelector('.tracker-item[data-target="execution"]').classList.add('active');
                  }
              }
          });

        // STRICT CENTER VISIBILITY CHECK
        const serviceSections = document.querySelectorAll('#audit, #strategy, #execution');
        const screenCenter = window.innerHeight / 2;

        serviceSections.forEach(sec => {
            const rect = sec.getBoundingClientRect();
            // Only show the tracker if the physical center of the screen is over the section
            if (rect.top <= screenCenter && rect.bottom >= screenCenter) {
                isAnyVisible = true;
            }
        });

        if (isAnyVisible) {
            tracker.classList.add('visible');
        } else {
            tracker.classList.remove('visible');
        }

      }, { rootMargin: "-49% 0px -49% 0px" });

      allTargets.forEach(target => trackerObserver.observe(target));
  }

  // ABOUT PAGE SCROLL SPY LOGIC
  const aboutTracker = document.getElementById('about-tracker');
  const aboutTargets = document.querySelectorAll('#who-we-are, #our-mission, #our-vision, #philosophy, #our-partners');

  if (aboutTracker && aboutTargets.length > 0) {
      const aboutObserver = new IntersectionObserver((entries) => {
          let isAnyVisible = false;

          entries.forEach(entry => {
              const id = entry.target.id;
              const link = document.querySelector(`#about-tracker .tracker-item[data-target="${id}"]`);

              if (entry.isIntersecting) {
                  document.querySelectorAll('#about-tracker .tracker-item').forEach(item => item.classList.remove('active'));
                  if (link) link.classList.add('active');
              }
          });

          // STRICT CENTER VISIBILITY CHECK
          const screenCenter = window.innerHeight / 2;
          aboutTargets.forEach(sec => {
              const rect = sec.getBoundingClientRect();
              if (rect.top <= screenCenter && rect.bottom >= screenCenter) {
                  isAnyVisible = true;
              }
          });

          if (isAnyVisible) aboutTracker.classList.add('visible');
          else aboutTracker.classList.remove('visible');

      }, { rootMargin: "-49% 0px -49% 0px" });

      aboutTargets.forEach(target => aboutObserver.observe(target));
  }
});
