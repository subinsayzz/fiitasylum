document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header Transformation ---
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Mobile Menu Toggle ---
    const menuBtn = document.getElementById('menuBtn');
    const navLinks = document.getElementById('navLinks');

    menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        
        // Toggle Icon state
        const icon = menuBtn.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close menu when a link is clicked
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navLinks.classList.remove('active');
                menuBtn.querySelector('i').classList.remove('fa-times');
                menuBtn.querySelector('i').classList.add('fa-bars');
            }
        });
    });

    // --- Active Link Switching on Scroll ---
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        links.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href') === `#${current}`) {
                a.classList.add('active');
            }
        });
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
                // Optional: Stop observing once visible if you only want it to animate once
                // observer.unobserve(entry.target); 
            } else {
                // Remove the class when not intersecting if you want it to trigger every scroll
                // entry.target.classList.remove('is-visible');
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach(el => observer.observe(el));


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
