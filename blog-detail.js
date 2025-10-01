// Blog Detail JavaScript
let currentBlog = null;
let allBlogs = [];

// Get URL parameter
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Load blog
async function loadBlog() {
    const slug = getUrlParameter('slug');
    if (!slug) {
        window.location.href = 'blogs.html';
        return;
    }

    try {
        // Try to load from localStorage first
        const storedBlogs = localStorage.getItem('steentje-blogs');
        if (storedBlogs) {
            allBlogs = JSON.parse(storedBlogs);
        } else {
            // Load from JSON file
            const response = await fetch('blogs.json');
            const data = await response.json();
            allBlogs = data.blogs;
        }

        currentBlog = allBlogs.find(blog => blog.slug === slug);

        if (!currentBlog) {
            window.location.href = 'blogs.html';
            return;
        }

        renderBlog();
        updateSEO();
        loadRelatedBlogs();

    } catch (error) {
        console.error('Error loading blog:', error);
        window.location.href = 'blogs.html';
    }
}

// Helper function to get image URL (either from localStorage or direct URL)
function getImageUrl(imageValue) {
    if (!imageValue) return 'resources/hero-lego-couple.jpg';

    // Check if it's a localStorage key
    if (imageValue.startsWith('blog-image-')) {
        const storedImage = localStorage.getItem(imageValue);
        return storedImage || 'resources/hero-lego-couple.jpg';
    }

    // Otherwise it's a direct URL
    return imageValue;
}

// Render blog
function renderBlog() {
    document.getElementById('blog-title').textContent = currentBlog.title;
    document.getElementById('blog-category').textContent = currentBlog.category;
    document.getElementById('blog-author').textContent = currentBlog.author;
    document.getElementById('blog-date').textContent = formatDate(currentBlog.date);

    const blogImage = document.getElementById('blog-image');
    const imageUrl = getImageUrl(currentBlog.image);
    blogImage.src = imageUrl;
    blogImage.alt = currentBlog.title;
    blogImage.onerror = function() {
        this.src = 'resources/hero-lego-couple.jpg';
    };

    document.getElementById('blog-content').innerHTML = currentBlog.content;

    // Render tags
    const tagsContainer = document.getElementById('blog-tags');
    tagsContainer.innerHTML = '<span class="text-warm-gray/70 font-semibold mr-4">Tags:</span>';
    currentBlog.tags.forEach(tag => {
        const tagSpan = document.createElement('span');
        tagSpan.className = 'px-3 py-1 bg-warm-terracotta/20 text-warm-terracotta rounded-full text-sm';
        tagSpan.textContent = tag;
        tagsContainer.appendChild(tagSpan);
    });
}

// Update SEO meta tags
function updateSEO() {
    // Update page title
    document.getElementById('page-title').textContent = `${currentBlog.title} - Steentje bij Steentje`;
    document.getElementById('page-description').setAttribute('content', currentBlog.metaDescription);
    document.getElementById('page-keywords').setAttribute('content', currentBlog.metaKeywords);

    // Update Open Graph tags
    document.getElementById('og-title').setAttribute('content', currentBlog.title);
    document.getElementById('og-description').setAttribute('content', currentBlog.metaDescription);
    document.getElementById('og-image').setAttribute('content', currentBlog.image);
    document.getElementById('og-url').setAttribute('content', window.location.href);

    // Update Twitter Card tags
    document.getElementById('twitter-title').setAttribute('content', currentBlog.title);
    document.getElementById('twitter-description').setAttribute('content', currentBlog.metaDescription);
    document.getElementById('twitter-image').setAttribute('content', currentBlog.image);

    // Update Schema.org structured data
    const schemaData = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": currentBlog.title,
        "image": currentBlog.image,
        "datePublished": currentBlog.date,
        "description": currentBlog.metaDescription,
        "author": {
            "@type": "Person",
            "name": currentBlog.author
        },
        "publisher": {
            "@type": "Organization",
            "name": "Steentje bij Steentje",
            "logo": {
                "@type": "ImageObject",
                "url": "resources/logo-steentje.png"
            }
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": window.location.href
        }
    };

    document.getElementById('schema-data').textContent = JSON.stringify(schemaData);
}

// Load related blogs
function loadRelatedBlogs() {
    // Get blogs from same category, excluding current blog
    let relatedBlogs = allBlogs
        .filter(blog => blog.category === currentBlog.category && blog.id !== currentBlog.id)
        .slice(0, 3);

    // If not enough related blogs, add from other categories
    if (relatedBlogs.length < 3) {
        const remaining = allBlogs
            .filter(blog => blog.id !== currentBlog.id && !relatedBlogs.includes(blog))
            .slice(0, 3 - relatedBlogs.length);
        relatedBlogs = [...relatedBlogs, ...remaining];
    }

    const relatedContainer = document.getElementById('related-blogs');
    relatedContainer.innerHTML = '';

    relatedBlogs.forEach(blog => {
        const card = createBlogCard(blog);
        relatedContainer.appendChild(card);
    });
}

// Create blog card
function createBlogCard(blog) {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-2xl shadow-lg overflow-hidden hover-lift cursor-pointer';
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
                <span>${formatDate(blog.date)}</span>
            </div>
            <h3 class="font-playfair text-xl font-bold text-warm-gray mb-3 line-clamp-2">
                ${blog.title}
            </h3>
            <p class="text-warm-gray/70 mb-4 line-clamp-2">
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

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('nl-NL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Mobile menu
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadBlog();
    initMobileMenu();
});
