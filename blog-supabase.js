// Blog JavaScript met Supabase
let allBlogs = [];
let currentFilter = 'all';

// Load blogs from Supabase
async function loadBlogs() {
    try {
        const { data, error } = await supabaseClient
            .from('blogs')
            .select('*')
            .order('date', { ascending: false });

        if (error) throw error;

        allBlogs = data;
        renderBlogs();
    } catch (error) {
        console.error('Error loading blogs:', error);
        showNoBlogs();
    }
}

// Render blogs
function renderBlogs() {
    const blogGrid = document.getElementById('blog-grid');
    const noBlogs = document.getElementById('no-blogs');

    // Filter blogs
    let filteredBlogs = currentFilter === 'all'
        ? allBlogs
        : allBlogs.filter(blog => blog.category === currentFilter);

    if (filteredBlogs.length === 0) {
        blogGrid.innerHTML = '';
        noBlogs.classList.remove('hidden');
        return;
    }

    noBlogs.classList.add('hidden');
    blogGrid.innerHTML = '';

    filteredBlogs.forEach(blog => {
        const blogCard = createBlogCard(blog);
        blogGrid.appendChild(blogCard);
    });
}

// Helper function to get image URL
function getImageUrl(imageValue) {
    if (!imageValue) return 'resources/hero-lego-couple.jpg';

    // Check if it's a localStorage key (legacy)
    if (imageValue.startsWith('blog-image-')) {
        const storedImage = localStorage.getItem(imageValue);
        return storedImage || 'resources/hero-lego-couple.jpg';
    }

    // Otherwise it's a URL
    return imageValue;
}

// Create blog card
function createBlogCard(blog) {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-2xl shadow-lg overflow-hidden hover-lift cursor-pointer';
    card.onclick = () => window.location.href = `blog-detail.html?slug=${blog.slug}`;

    const imageUrl = getImageUrl(blog.image);

    card.innerHTML = `
        <div class="relative h-48 overflow-hidden">
            <img src="${imageUrl}" alt="${blog.title}" class="w-full h-full object-cover" onerror="this.src='resources/hero-lego-couple.jpg'">
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
                    ${formatDate(blog.date)}
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
            <div class="flex flex-wrap gap-2 mb-4">
                ${(blog.tags || []).slice(0, 3).map(tag => `
                    <span class="px-2 py-1 bg-soft-beige text-warm-gray text-xs rounded">
                        ${tag}
                    </span>
                `).join('')}
            </div>
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

// Show no blogs message
function showNoBlogs() {
    const blogGrid = document.getElementById('blog-grid');
    const noBlogs = document.getElementById('no-blogs');

    blogGrid.innerHTML = '';
    noBlogs.classList.remove('hidden');
}

// Filter functionality
function filterBlogs(category) {
    currentFilter = category;

    // Update filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        }
    });

    renderBlogs();
}

// Mobile menu
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Load blogs
    loadBlogs();
});
