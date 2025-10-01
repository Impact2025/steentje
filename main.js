// Main JavaScript file for Steentje bij Steentje website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initTypewriter();
    initScrollReveal();
    initMobileMenu();
    initTestimonialCarousel();
    initLegoSimulator();
    initResultsChart();
    initSmoothScroll();
    initParticleAnimation();
    loadHomepageBlogs();
});

// Typewriter effect for hero slogan
function initTypewriter() {
    const typed = new Typed('#typed-text', {
        strings: [
            'Bouw aan je relatie,',
            'één steentje tegelijk.'
        ],
        typeSpeed: 60,
        backSpeed: 30,
        backDelay: 2000,
        startDelay: 500,
        loop: false,
        showCursor: true,
        cursorChar: '|',
        onComplete: function() {
            document.querySelector('.typed-cursor').style.display = 'none';
        }
    });
}

// Scroll reveal animations
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    
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

// Mobile menu functionality
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
        
        // Close mobile menu when clicking on a link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
            });
        });
    }
}

// Testimonial carousel
function initTestimonialCarousel() {
    const carousel = document.getElementById('testimonial-carousel');
    if (carousel) {
        new Splide('#testimonial-carousel', {
            type: 'loop',
            perPage: 1,
            perMove: 1,
            gap: '2rem',
            autoplay: true,
            interval: 5000,
            pauseOnHover: true,
            arrows: true,
            pagination: true,
            breakpoints: {
                768: {
                    perPage: 1,
                    gap: '1rem'
                }
            }
        }).mount();
    }
}

// LEGO Simulator using p5.js
function initLegoSimulator() {
    const simulatorContainer = document.getElementById('lego-simulator');
    if (!simulatorContainer) return;
    
    let legoSketch = function(p) {
        let blocks = [];
        let selectedBlock = null;
        let gridSize = 40;
        let cols, rows;
        
        p.setup = function() {
            let canvas = p.createCanvas(simulatorContainer.offsetWidth, 256);
            canvas.parent('lego-simulator');
            
            cols = p.width / gridSize;
            rows = p.height / gridSize;
            
            // Create some initial blocks
            for (let i = 0; i < 5; i++) {
                blocks.push({
                    x: p.random(cols - 2) * gridSize,
                    y: p.random(rows - 1) * gridSize,
                    width: gridSize * p.floor(p.random(1, 4)),
                    height: gridSize,
                    color: p.color(p.random(100, 255), p.random(100, 255), p.random(100, 255)),
                    placed: false
                });
            }
        };
        
        p.draw = function() {
            p.background(254, 252, 248);
            
            // Draw grid
            p.stroke(212, 165, 116, 100);
            p.strokeWeight(1);
            for (let i = 0; i <= cols; i++) {
                p.line(i * gridSize, 0, i * gridSize, p.height);
            }
            for (let i = 0; i <= rows; i++) {
                p.line(0, i * gridSize, p.width, i * gridSize);
            }
            
            // Draw blocks
            blocks.forEach((block, index) => {
                p.fill(block.color);
                p.stroke(0);
                p.strokeWeight(2);
                
                if (block.placed) {
                    // Draw placed blocks with studs
                    p.rect(block.x, block.y, block.width, block.height);
                    
                    // Draw studs
                    p.fill(255, 255, 255, 150);
                    p.noStroke();
                    for (let x = block.x + gridSize/4; x < block.x + block.width; x += gridSize) {
                        p.ellipse(x, block.y + gridSize/4, gridSize/3, gridSize/3);
                    }
                } else {
                    // Draw floating blocks
                    let floatY = block.y + p.sin(p.frameCount * 0.02 + index) * 3;
                    p.rect(block.x, floatY, block.width, block.height);
                }
            });
            
            // Instructions
            p.fill(139, 134, 128);
            p.noStroke();
            p.textAlign(p.CENTER);
            p.textSize(14);
            p.text('Klik op de blokjes om ze te plaatsen!', p.width/2, p.height - 20);
        };
        
        p.mousePressed = function() {
            if (p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height) {
                // Check if clicking on a floating block
                for (let block of blocks) {
                    if (!block.placed && 
                        p.mouseX >= block.x && p.mouseX <= block.x + block.width &&
                        p.mouseY >= block.y && p.mouseY <= block.y + block.height) {
                        
                        // Snap to grid
                        block.x = p.round(p.mouseX / gridSize) * gridSize;
                        block.y = p.round(p.mouseY / gridSize) * gridSize;
                        block.placed = true;
                        
                        // Add a new floating block
                        blocks.push({
                            x: p.random(cols - 2) * gridSize,
                            y: p.random(rows - 1) * gridSize,
                            width: gridSize * p.floor(p.random(1, 4)),
                            height: gridSize,
                            color: p.color(p.random(100, 255), p.random(100, 255), p.random(100, 255)),
                            placed: false
                        });
                        break;
                    }
                }
            }
        };
        
        p.windowResized = function() {
            p.resizeCanvas(simulatorContainer.offsetWidth, 256);
            cols = p.width / gridSize;
            rows = p.height / gridSize;
        };
    };
    
    new p5(legoSketch);
}

// Results chart using ECharts
function initResultsChart() {
    const chartContainer = document.getElementById('results-chart');
    if (!chartContainer) return;
    
    const chart = echarts.init(chartContainer);
    
    const option = {
        title: {
            text: 'Resultaten na 3 maanden',
            left: 'center',
            textStyle: {
                color: '#8B8680',
                fontSize: 16,
                fontWeight: 'normal'
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['Communicatie', 'Vertrouwen', 'Intimiteit', 'Conflict\nresolutie', 'Gemeenschappelijke\ndoelen'],
            axisLabel: {
                color: '#8B8680',
                fontSize: 10
            }
        },
        yAxis: {
            type: 'value',
            max: 100,
            axisLabel: {
                color: '#8B8680',
                formatter: '{value}%'
            }
        },
        series: [
            {
                name: 'Voor coaching',
                type: 'bar',
                data: [45, 52, 48, 38, 41],
                itemStyle: {
                    color: '#E8B86D',
                    borderRadius: [4, 4, 0, 0]
                }
            },
            {
                name: 'Na coaching',
                type: 'bar',
                data: [78, 85, 82, 74, 79],
                itemStyle: {
                    color: '#4A5D23',
                    borderRadius: [4, 4, 0, 0]
                }
            }
        ],
        legend: {
            data: ['Voor coaching', 'Na coaching'],
            bottom: 0,
            textStyle: {
                color: '#8B8680'
            }
        }
    };
    
    chart.setOption(option);
    
    // Resize chart on window resize
    window.addEventListener('resize', function() {
        chart.resize();
    });
}

// Smooth scroll for navigation links
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed nav
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Enhanced particle animation
function initParticleAnimation() {
    const particles = document.querySelectorAll('.particle');
    
    particles.forEach((particle, index) => {
        // Random size between 2-6px
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // Random horizontal position
        particle.style.left = Math.random() * 100 + '%';
        
        // Random animation delay
        particle.style.animationDelay = Math.random() * 6 + 's';
        
        // Random animation duration
        particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
    });
}

// Button hover effects
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.btn-primary, .hover-lift');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            anime({
                targets: this,
                scale: 1.05,
                duration: 200,
                easing: 'easeOutQuad'
            });
        });
        
        button.addEventListener('mouseleave', function() {
            anime({
                targets: this,
                scale: 1,
                duration: 200,
                easing: 'easeOutQuad'
            });
        });
    });
});

// Counter animation for statistics
function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = target + (counter.getAttribute('data-suffix') || '');
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current) + (counter.getAttribute('data-suffix') || '');
            }
        }, 16);
    });
}

// Initialize counter animation when CTA section is visible
const ctaSection = document.getElementById('cta');
if (ctaSection) {
    const ctaObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                ctaObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    ctaObserver.observe(ctaSection);
}

// Add loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Animate hero elements
    anime({
        targets: '.hero-bg .reveal',
        opacity: [0, 1],
        translateY: [50, 0],
        duration: 1000,
        delay: anime.stagger(200),
        easing: 'easeOutQuad'
    });
});

// Navigation highlight on scroll
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('text-warm-terracotta');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('text-warm-terracotta');
        }
    });
});

// Form validation (for future forms)
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('border-red-500');
            isValid = false;
        } else {
            input.classList.remove('border-red-500');
        }
    });
    
    return isValid;
}

// Show success message
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
    successDiv.textContent = message;
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.classList.remove('translate-x-full');
    }, 100);
    
    setTimeout(() => {
        successDiv.classList.add('translate-x-full');
        setTimeout(() => {
            document.body.removeChild(successDiv);
        }, 300);
    }, 3000);
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimized scroll handler
const optimizedScrollHandler = debounce(function() {
    // Handle scroll-based animations here
}, 16);

window.addEventListener('scroll', optimizedScrollHandler);

// Load latest blogs for homepage
async function loadHomepageBlogs() {
    const blogGrid = document.getElementById('homepage-blog-grid');
    if (!blogGrid) return;

    try {
        // Try to load from localStorage first
        let blogs = [];
        const storedBlogs = localStorage.getItem('steentje-blogs');
        if (storedBlogs) {
            blogs = JSON.parse(storedBlogs);
        } else {
            // Load from JSON file
            const response = await fetch('blogs.json');
            const data = await response.json();
            blogs = data.blogs;
        }

        // Only replace if we have blogs
        if (blogs && blogs.length > 0) {
            // Sort by date (newest first) and take first 3
            const latestBlogs = blogs
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 3);

            // Clear existing content
            blogGrid.innerHTML = '';

            // Add dynamic blogs
            latestBlogs.forEach(blog => {
                const card = createHomepageBlogCard(blog);
                blogGrid.appendChild(card);
            });
        }
        // If no blogs, keep the fallback blogs visible

    } catch (error) {
        console.error('Error loading blogs:', error);
        // Keep fallback blogs on error
    }
}

// Create blog card for homepage
function createHomepageBlogCard(blog) {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-2xl shadow-lg overflow-hidden hover-lift cursor-pointer reveal';
    card.onclick = () => window.location.href = `blog-detail.html?slug=${blog.slug}`;

    card.innerHTML = `
        <div class="relative h-48 overflow-hidden">
            <img src="${blog.image}" alt="${blog.title}" class="w-full h-full object-cover" onerror="this.src='resources/hero-lego-couple.jpg'">
            <div class="absolute top-4 right-4">
                <span class="px-3 py-1 bg-warm-terracotta text-white rounded-full text-sm font-semibold">
                    ${blog.category}
                </span>
            </div>
        </div>
        <div class="p-6">
            <div class="flex items-center gap-4 text-sm text-warm-gray/60 mb-3">
                <span class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    ${formatBlogDate(blog.date)}
                </span>
                <span class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    ${blog.author}
                </span>
            </div>
            <h3 class="font-playfair text-2xl font-bold text-warm-gray mb-3 line-clamp-2">
                ${blog.title}
            </h3>
            <p class="text-warm-gray/70 mb-4 line-clamp-3">
                ${blog.excerpt}
            </p>
            <div class="flex items-center text-warm-terracotta font-semibold">
                Lees meer
                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
            </div>
        </div>
    `;

    return card;
}

// Format date for blog cards
function formatBlogDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('nl-NL', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}