document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header Transformation ---
    const header = document.getElementById('header');
    let ticking = false;

    // --- Mobile Menu Toggle ---
    const menuBtn = document.getElementById('menuBtn');
    const navLinks = document.getElementById('navLinks');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');

            // Toggle Icon state
            const icon = menuBtn.querySelector('i');
            if (!icon) return;
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Close menu when a link is clicked
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768 && navLinks && menuBtn) {
                navLinks.classList.remove('active');
                const icon = menuBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    });

    // --- Active Link Switching on Scroll (rAF optimized) ---
    const sections = document.querySelectorAll('section');
    let sectionOffsets = [];
    let activeLink = null;

    const recalcSectionOffsets = () => {
        sectionOffsets = Array.from(sections)
            .filter((section) => section.id)
            .map((section) => ({
                id: section.id,
                top: section.offsetTop
            }));
    };

    const setActiveNav = (sectionId) => {
        if (!sectionId) return;
        const nextActive = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
        if (nextActive === activeLink) return;

        if (activeLink) {
            activeLink.classList.remove('active');
        }
        if (nextActive) {
            nextActive.classList.add('active');
            activeLink = nextActive;
        }
    };

    const onScrollUpdate = () => {
        ticking = false;

        const y = window.scrollY || window.pageYOffset;
        if (header) {
            header.classList.toggle('scrolled', y > 50);
        }

        let currentId = '';
        for (let i = 0; i < sectionOffsets.length; i += 1) {
            if (y >= (sectionOffsets[i].top - 200)) {
                currentId = sectionOffsets[i].id;
            } else {
                break;
            }
        }
        setActiveNav(currentId);
    };

    const requestScrollUpdate = () => {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(onScrollUpdate);
    };

    recalcSectionOffsets();
    onScrollUpdate();
    window.addEventListener('scroll', requestScrollUpdate, { passive: true });
    window.addEventListener('resize', () => {
        recalcSectionOffsets();
        requestScrollUpdate();
    });
    window.addEventListener('orientationchange', () => {
        recalcSectionOffsets();
        requestScrollUpdate();
    });

    // --- Smooth Scroll Animation (Intersection Observer) ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // One-time reveal to cut observer work while scrolling.
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach(el => observer.observe(el));

    // --- About Section Video Popup ---
    const aboutVideoTrigger = document.getElementById('aboutVideoTrigger');
    const aboutVideoModal = document.getElementById('aboutVideoModal');
    const aboutVideoFrame = document.getElementById('aboutVideoFrame');
    const aboutVideoClose = document.getElementById('aboutVideoClose');
    const aboutVideoEmbedUrl = 'https://www.youtube.com/embed/eEvBAFc9vDE?autoplay=1&rel=0&modestbranding=1&playsinline=1';

    const openAboutVideo = () => {
        if (!aboutVideoModal || !aboutVideoFrame) return;
        aboutVideoModal.classList.add('is-open');
        aboutVideoModal.setAttribute('aria-hidden', 'false');
        aboutVideoFrame.src = aboutVideoEmbedUrl;
        document.body.style.overflow = 'hidden';
    };

    const closeAboutVideo = () => {
        if (!aboutVideoModal || !aboutVideoFrame) return;
        aboutVideoModal.classList.remove('is-open');
        aboutVideoModal.setAttribute('aria-hidden', 'true');
        aboutVideoFrame.src = '';
        document.body.style.overflow = '';
    };

    if (aboutVideoTrigger) {
        aboutVideoTrigger.addEventListener('click', openAboutVideo);
        aboutVideoTrigger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openAboutVideo();
            }
        });
    }

    if (aboutVideoClose) {
        aboutVideoClose.addEventListener('click', closeAboutVideo);
    }

    if (aboutVideoModal) {
        aboutVideoModal.addEventListener('click', (e) => {
            if (e.target === aboutVideoModal || e.target.closest('[data-close="true"]')) {
                closeAboutVideo();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && aboutVideoModal && aboutVideoModal.classList.contains('is-open')) {
            closeAboutVideo();
        }
    });

    // --- Premium Location Gallery Popup ---
    const openPremiumGalleryBtn = document.getElementById('openPremiumGallery');
    const premiumGalleryModal = document.getElementById('premiumGalleryModal');
    const closePremiumGalleryBtn = document.getElementById('closePremiumGallery');
    const premiumGalleryImage = document.getElementById('premiumGalleryImage');
    const premiumGalleryCounter = document.getElementById('premiumGalleryCounter');
    const premiumGalleryPrev = document.getElementById('premiumGalleryPrev');
    const premiumGalleryNext = document.getElementById('premiumGalleryNext');
    const premiumGalleryImages = [
        'assets/premium-gallery-original/01.jpg?v=1',
        'assets/premium-gallery-original/02.jpg?v=1',
        'assets/premium-gallery-original/03.jpg?v=1',
        'assets/premium-gallery-original/04.jpg?v=1',
        'assets/premium-gallery-original/05.jpg?v=1',
        'assets/premium-gallery-original/06.jpg?v=1',
        'assets/premium-gallery-original/07.jpg?v=1',
        'assets/premium-gallery-original/08.jpg?v=1',
        'assets/premium-gallery-original/09.jpg?v=1',
        'assets/premium-gallery-original/10.jpg?v=1',
        'assets/premium-gallery-original/11.jpg?v=1'
    ];
    let premiumGalleryIndex = 0;

    const renderPremiumGallery = () => {
        if (!premiumGalleryImage || !premiumGalleryCounter) return;
        premiumGalleryImage.src = premiumGalleryImages[premiumGalleryIndex];
        premiumGalleryImage.alt = `Zak's Gym Master Premium Gallery Image ${premiumGalleryIndex + 1}`;
        premiumGalleryCounter.textContent = `${premiumGalleryIndex + 1} / ${premiumGalleryImages.length}`;
    };

    const openPremiumGallery = () => {
        if (!premiumGalleryModal) return;
        renderPremiumGallery();
        premiumGalleryModal.classList.add('is-open');
        premiumGalleryModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const closePremiumGallery = () => {
        if (!premiumGalleryModal) return;
        premiumGalleryModal.classList.remove('is-open');
        premiumGalleryModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    if (openPremiumGalleryBtn) {
        openPremiumGalleryBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openPremiumGallery();
        });
    }

    if (premiumGalleryPrev) {
        premiumGalleryPrev.addEventListener('click', () => {
            premiumGalleryIndex = (premiumGalleryIndex - 1 + premiumGalleryImages.length) % premiumGalleryImages.length;
            renderPremiumGallery();
        });
    }

    if (premiumGalleryNext) {
        premiumGalleryNext.addEventListener('click', () => {
            premiumGalleryIndex = (premiumGalleryIndex + 1) % premiumGalleryImages.length;
            renderPremiumGallery();
        });
    }

    if (closePremiumGalleryBtn) {
        closePremiumGalleryBtn.addEventListener('click', closePremiumGallery);
    }

    if (premiumGalleryModal) {
        premiumGalleryModal.addEventListener('click', (e) => {
            if (e.target === premiumGalleryModal || e.target.closest('[data-close-gallery="true"]')) {
                closePremiumGallery();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && premiumGalleryModal && premiumGalleryModal.classList.contains('is-open')) {
            closePremiumGallery();
            return;
        }

        if (premiumGalleryModal && premiumGalleryModal.classList.contains('is-open')) {
            if (e.key === 'ArrowLeft') {
                premiumGalleryIndex = (premiumGalleryIndex - 1 + premiumGalleryImages.length) % premiumGalleryImages.length;
                renderPremiumGallery();
            }
            if (e.key === 'ArrowRight') {
                premiumGalleryIndex = (premiumGalleryIndex + 1) % premiumGalleryImages.length;
                renderPremiumGallery();
            }
        }
    });

    // --- Original Location 360 Motion Forwarding ---
    const pano_iframe_name = 'tour-embeded';

    window.addEventListener('devicemotion', function (e) {
        var iframe = document.getElementById(pano_iframe_name);
        if (!iframe || !iframe.contentWindow) return;

        iframe.contentWindow.postMessage({
            type: 'devicemotion',
            deviceMotionEvent: {
                acceleration: {
                    x: e.acceleration ? e.acceleration.x : null,
                    y: e.acceleration ? e.acceleration.y : null,
                    z: e.acceleration ? e.acceleration.z : null
                },
                accelerationIncludingGravity: {
                    x: e.accelerationIncludingGravity ? e.accelerationIncludingGravity.x : null,
                    y: e.accelerationIncludingGravity ? e.accelerationIncludingGravity.y : null,
                    z: e.accelerationIncludingGravity ? e.accelerationIncludingGravity.z : null
                },
                rotationRate: {
                    alpha: e.rotationRate ? e.rotationRate.alpha : null,
                    beta: e.rotationRate ? e.rotationRate.beta : null,
                    gamma: e.rotationRate ? e.rotationRate.gamma : null
                },
                interval: e.interval,
                timeStamp: e.timeStamp
            }
        }, '*');
    });


    // --- Form Submission Prevention ---
    const leadForm = document.getElementById('leadForm');
    if (leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = leadForm.querySelector('button[type="submit"]');
            btn.innerHTML = '<i class="fas fa-check"></i> Package Plan Sent!';
            btn.style.backgroundColor = '#28a745'; // Green success color
            btn.style.borderColor = '#28a745';
            btn.style.color = '#fff';
            
            setTimeout(() => {
                leadForm.reset();
                btn.innerHTML = 'Get My Custom Plan';
                btn.style.backgroundColor = 'var(--primary-red)';
                btn.style.borderColor = 'var(--primary-red)';
            }, 3000);
        });
    }

});
