// Blog Detail met Supabase
async function loadBlogDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');

    if (!slug) {
        window.location.href = 'blogs.html';
        return;
    }

    try {
        const { data, error } = await window.supabaseClient
            .from('blogs')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error) throw error;

        if (!data) {
            window.location.href = 'blogs.html';
            return;
        }

        displayBlog(data);
    } catch (error) {
        console.error('Error loading blog:', error);
        window.location.href = 'blogs.html';
    }
}

function displayBlog(blog) {
    // Hero image
    const heroImage = document.getElementById('hero-image');
    if (heroImage) {
        const imageUrl = getImageUrl(blog.image);
        heroImage.src = imageUrl;
        heroImage.onerror = () => heroImage.src = 'resources/hero-lego-couple.jpg';
    }

    // Category badge
    const categoryBadge = document.getElementById('category-badge');
    if (categoryBadge) {
        categoryBadge.textContent = blog.category;
    }

    // Title
    const titleElement = document.getElementById('blog-title');
    if (titleElement) {
        titleElement.textContent = blog.title;
    }

    // Meta information
    const dateElement = document.getElementById('blog-date');
    if (dateElement) {
        dateElement.textContent = formatDate(blog.date);
    }

    const authorElement = document.getElementById('blog-author');
    if (authorElement) {
        authorElement.textContent = blog.author;
    }

    const readTimeElement = document.getElementById('read-time');
    if (readTimeElement) {
        readTimeElement.textContent = `${blog.readTime || 5} min leestijd`;
    }

    // Content
    const contentElement = document.getElementById('blog-content');
    if (contentElement) {
        contentElement.innerHTML = blog.content;
    }

    // Tags
    const tagsContainer = document.getElementById('blog-tags');
    if (tagsContainer && blog.tags && blog.tags.length > 0) {
        tagsContainer.innerHTML = blog.tags.map(tag => `
            <span class="px-3 py-1 bg-soft-beige text-warm-gray rounded-full text-sm">
                ${tag}
            </span>
        `).join('');
    }

    // Update page title
    document.title = `${blog.title} - Steentje bij Steentje`;
}

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

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('nl-NL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
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

    // Load blog
    loadBlogDetail();
});
