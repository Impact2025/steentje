// Safe version of main.js - works without external libraries
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Main script loaded successfully');

    // Only initialize functions that don't require external libraries
    safeInitMobileMenu();
    safeInitScrollReveal();
    safeInitSmoothScroll();
    safeInitParticleAnimation();
    safeLoadHomepageBlogs();

    // Try optional features with error handling
    tryInitTypewriter();
    tryInitCarousel();
    tryInitChart();
    tryInitAnimations();
});

// Mobile menu (no dependencies)
function safeInitMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });

        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
            });
        });
    }
}

// Scroll reveal (no dependencies)
function safeInitScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');

    if (!revealElements.length) return;

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
}

// Smooth scroll (no dependencies)
function safeInitSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            e.preventDefault();
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Particle animation (no dependencies)
function safeInitParticleAnimation() {
    const particles = document.querySelectorAll('.particle');

    particles.forEach((particle, index) => {
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
    });
}

// Load blogs (no dependencies)
async function safeLoadHomepageBlogs() {
    const blogGrid = document.getElementById('homepage-blog-grid');
    if (!blogGrid) return;

    try {
        let blogs = [];
        const storedBlogs = localStorage.getItem('steentje-blogs');

        if (storedBlogs) {
            blogs = JSON.parse(storedBlogs);
        } else {
            const response = await fetch('blogs.json');
            const data = await response.json();
            blogs = data.blogs;
        }

        if (blogs && blogs.length > 0) {
            const latestBlogs = blogs
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 3);

            blogGrid.innerHTML = '';

            latestBlogs.forEach(blog => {
                const card = createSafeBlogCard(blog);
                blogGrid.appendChild(card);
            });
        }
    } catch (error) {
        console.log('Using fallback blogs');
    }
}

function createSafeBlogCard(blog) {
    const card = document.createElement('div');
    card.className = 'blog-card-visible';
    card.onclick = () => window.location.href = `blog-detail.html?slug=${blog.slug}`;

    const categoryColors = {
        'Relatiecoaching': 'blog-card-header-orange',
        'Methode': 'blog-card-header-green',
        'Succesverhalen': 'blog-card-header-yellow',
        'Tips & Advies': 'blog-card-header-orange'
    };

    const headerClass = categoryColors[blog.category] || 'blog-card-header-orange';

    // Get image URL (handle localStorage keys)
    let imageUrl = blog.image;
    if (imageUrl && imageUrl.startsWith('blog-image-')) {
        const storedImage = localStorage.getItem(imageUrl);
        imageUrl = storedImage || 'resources/hero-lego-couple.jpg';
    }

    card.innerHTML = `
        <div class="${headerClass}">
            <svg style="width: 80px; height: 80px; color: white; opacity: 0.5;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
            <div style="position: absolute; top: 16px; right: 16px;">
                <span style="padding: 8px 16px; background: white; color: #D4A574; border-radius: 999px; font-size: 14px; font-weight: bold; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">${blog.category}</span>
            </div>
        </div>
        <div class="blog-card-body">
            <div style="display: flex; gap: 16px; font-size: 14px; color: #8B8680; opacity: 0.6; margin-bottom: 12px;">
                <span>📅 ${formatSafeDate(blog.date)}</span>
                <span>👤 ${blog.author}</span>
            </div>
            <h3 class="blog-card-title">${blog.title}</h3>
            <p class="blog-card-text">${blog.excerpt}</p>
            <div style="display: flex; align-items: center; color: #D4A574; font-weight: 600;">
                Lees meer →
            </div>
        </div>
    `;

    return card;
}

function formatSafeDate(dateString) {
    const date = new Date(dateString);
    const months = ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

// Try typewriter with error handling
function tryInitTypewriter() {
    try {
        if (typeof Typed !== 'undefined') {
            const typedElement = document.getElementById('typed-text');
            if (typedElement) {
                new Typed('#typed-text', {
                    strings: ['Bouw aan je relatie,', 'één steentje tegelijk.'],
                    typeSpeed: 60,
                    backSpeed: 30,
                    backDelay: 2000,
                    startDelay: 500,
                    loop: false,
                    showCursor: true,
                    cursorChar: '|',
                    onComplete: function() {
                        const cursor = document.querySelector('.typed-cursor');
                        if (cursor) cursor.style.display = 'none';
                    }
                });
            }
        } else {
            // Fallback: just show text
            const typedElement = document.getElementById('typed-text');
            if (typedElement) {
                typedElement.textContent = 'Bouw aan je relatie, één steentje tegelijk.';
            }
        }
    } catch (error) {
        console.log('Typewriter not available, using fallback');
        const typedElement = document.getElementById('typed-text');
        if (typedElement) {
            typedElement.textContent = 'Bouw aan je relatie, één steentje tegelijk.';
        }
    }
}

// Try carousel with error handling
function tryInitCarousel() {
    try {
        if (typeof Splide !== 'undefined') {
            const carousel = document.getElementById('testimonial-carousel');
            if (carousel) {
                new Splide('#testimonial-carousel', {
                    type: 'loop',
                    perPage: 1,
                    autoplay: true,
                    interval: 5000,
                    pauseOnHover: true
                }).mount();
            }
        }
    } catch (error) {
        console.log('Carousel not available');
    }
}

// Try chart with error handling
function tryInitChart() {
    try {
        if (typeof echarts !== 'undefined') {
            const chartContainer = document.getElementById('results-chart');
            if (chartContainer) {
                const chart = echarts.init(chartContainer);
                chart.setOption({
                    title: { text: 'Resultaten na 3 maanden', left: 'center' },
                    xAxis: {
                        type: 'category',
                        data: ['Communicatie', 'Vertrouwen', 'Intimiteit', 'Conflict\nresolutie', 'Gemeenschappelijke\ndoelen']
                    },
                    yAxis: { type: 'value', max: 100 },
                    series: [
                        { name: 'Voor', type: 'bar', data: [45, 52, 48, 38, 41], itemStyle: { color: '#E8B86D' } },
                        { name: 'Na', type: 'bar', data: [78, 85, 82, 74, 79], itemStyle: { color: '#4A5D23' } }
                    ],
                    legend: { data: ['Voor', 'Na'], bottom: 0 }
                });
            }
        }
    } catch (error) {
        console.log('Chart not available');
    }
}

// Try animations with error handling
function tryInitAnimations() {
    try {
        if (typeof anime !== 'undefined') {
            const buttons = document.querySelectorAll('.btn-primary, .hover-lift');
            buttons.forEach(button => {
                button.addEventListener('mouseenter', function() {
                    anime({ targets: this, scale: 1.05, duration: 200, easing: 'easeOutQuad' });
                });
                button.addEventListener('mouseleave', function() {
                    anime({ targets: this, scale: 1, duration: 200, easing: 'easeOutQuad' });
                });
            });
        }
    } catch (error) {
        console.log('Animations not available');
    }
}

console.log('✅ Safe main script fully loaded');
