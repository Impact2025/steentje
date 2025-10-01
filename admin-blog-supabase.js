// Admin Blog met Supabase
let editingBlogId = null;

// Load existing blogs
async function loadExistingBlogs() {
    try {
        const { data, error } = await supabaseClient
            .from('blogs')
            .select('*')
            .order('date', { ascending: false });

        if (error) throw error;

        const tableBody = document.getElementById('existing-blogs-body');
        tableBody.innerHTML = '';

        if (data.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="px-6 py-8 text-center text-warm-gray/50">
                        Nog geen blogs gepubliceerd
                    </td>
                </tr>
            `;
            return;
        }

        data.forEach(blog => {
            const row = document.createElement('tr');
            row.className = 'border-b border-warm-gray/10 hover:bg-soft-beige/30 transition-colors';
            row.innerHTML = `
                <td class="px-6 py-4">
                    <div class="font-semibold text-warm-gray">${blog.title}</div>
                    <div class="text-sm text-warm-gray/60">${blog.slug}</div>
                </td>
                <td class="px-6 py-4">
                    <span class="px-2 py-1 bg-warm-terracotta/10 text-warm-terracotta rounded text-sm">
                        ${blog.category}
                    </span>
                </td>
                <td class="px-6 py-4 text-warm-gray/70">${blog.author}</td>
                <td class="px-6 py-4 text-warm-gray/70">${formatDate(blog.date)}</td>
                <td class="px-6 py-4">
                    <div class="flex gap-2">
                        <button onclick="editBlog('${blog.id}')"
                                class="px-3 py-1 bg-warm-terracotta text-white rounded hover:bg-warm-terracotta/90">
                            Bewerk
                        </button>
                        <button onclick="deleteBlog('${blog.id}')"
                                class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                            Verwijder
                        </button>
                    </div>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading blogs:', error);
        alert('Fout bij het laden van blogs');
    }
}

// Edit blog
async function editBlog(id) {
    try {
        const { data, error } = await supabaseClient
            .from('blogs')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        editingBlogId = id;
        document.getElementById('form-title').textContent = 'Blog Bewerken';
        document.getElementById('blog-title').value = data.title;
        document.getElementById('blog-slug').value = data.slug;
        document.getElementById('blog-author').value = data.author;
        document.getElementById('blog-category').value = data.category;
        document.getElementById('blog-date').value = data.date;
        document.getElementById('blog-excerpt').value = data.excerpt;
        document.getElementById('blog-content').value = data.content;
        document.getElementById('blog-image').value = data.image || '';

        // Tags
        const tagsContainer = document.getElementById('tags-container');
        tagsContainer.innerHTML = '';
        (data.tags || []).forEach(tag => addTag(tag));

        // Scroll to form
        document.getElementById('blog-form').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Error loading blog:', error);
        alert('Fout bij het laden van blog');
    }
}

// Delete blog
async function deleteBlog(id) {
    if (!confirm('Weet je zeker dat je deze blog wilt verwijderen?')) return;

    try {
        const { error } = await supabaseClient
            .from('blogs')
            .delete()
            .eq('id', id);

        if (error) throw error;

        alert('Blog succesvol verwijderd!');
        loadExistingBlogs();
    } catch (error) {
        console.error('Error deleting blog:', error);
        alert('Fout bij het verwijderen van blog');
    }
}

// Submit blog
async function submitBlog(event) {
    event.preventDefault();

    const blogData = {
        title: document.getElementById('blog-title').value,
        slug: document.getElementById('blog-slug').value,
        author: document.getElementById('blog-author').value,
        category: document.getElementById('blog-category').value,
        date: document.getElementById('blog-date').value,
        excerpt: document.getElementById('blog-excerpt').value,
        content: document.getElementById('blog-content').value,
        image: document.getElementById('blog-image').value || null,
        tags: Array.from(document.querySelectorAll('.tag-item')).map(el => el.textContent.replace('×', '').trim())
    };

    try {
        if (editingBlogId) {
            // Update existing blog
            const { error } = await supabaseClient
                .from('blogs')
                .update(blogData)
                .eq('id', editingBlogId);

            if (error) throw error;
            alert('Blog succesvol bijgewerkt!');
        } else {
            // Create new blog
            const { error } = await supabaseClient
                .from('blogs')
                .insert([blogData]);

            if (error) throw error;
            alert('Blog succesvol gepubliceerd!');
        }

        // Reset form
        document.getElementById('blog-form').reset();
        document.getElementById('tags-container').innerHTML = '';
        document.getElementById('form-title').textContent = 'Nieuwe Blog';
        editingBlogId = null;

        // Reload blogs
        loadExistingBlogs();
    } catch (error) {
        console.error('Error saving blog:', error);
        alert('Fout bij het opslaan van blog: ' + error.message);
    }
}

// Generate slug from title
function generateSlug() {
    const title = document.getElementById('blog-title').value;
    const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    document.getElementById('blog-slug').value = slug;
}

// Tags
function addTag(tagText = null) {
    const tagInput = document.getElementById('tag-input');
    const tag = tagText || tagInput.value.trim();

    if (!tag) return;

    const tagsContainer = document.getElementById('tags-container');
    const tagElement = document.createElement('span');
    tagElement.className = 'tag-item inline-flex items-center gap-1 px-3 py-1 bg-warm-terracotta text-white rounded-full text-sm';
    tagElement.innerHTML = `
        ${tag}
        <button type="button" onclick="this.parentElement.remove()" class="hover:text-warm-terracotta/70">×</button>
    `;
    tagsContainer.appendChild(tagElement);

    if (!tagText) {
        tagInput.value = '';
    }
}

// Image upload
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        alert('Alleen JPEG, PNG, GIF en WebP afbeeldingen zijn toegestaan');
        return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
        alert('Afbeelding mag maximaal 5MB zijn');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        // Store in localStorage as fallback (temporary until Supabase Storage is configured)
        const imageKey = `blog-image-${Date.now()}`;
        localStorage.setItem(imageKey, e.target.result);
        document.getElementById('blog-image').value = imageKey;

        // Show preview
        showImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
}

function showImagePreview(src) {
    const preview = document.getElementById('image-preview');
    if (preview) {
        preview.innerHTML = `<img src="${src}" alt="Preview" class="max-w-full h-48 object-cover rounded-lg">`;
    }
}

// AI Generator
async function generateWithAI() {
    const topic = document.getElementById('ai-topic').value;
    const category = document.getElementById('ai-category').value;

    if (!topic) {
        alert('Vul een onderwerp in');
        return;
    }

    const generateBtn = document.getElementById('generate-btn');
    generateBtn.disabled = true;
    generateBtn.textContent = '🤖 Genereren...';

    // Simulate AI generation (replace with actual API call)
    setTimeout(() => {
        const date = new Date().toISOString().split('T')[0];

        document.getElementById('blog-title').value = topic;
        document.getElementById('blog-slug').value = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        document.getElementById('blog-author').value = 'Kim & Jeroen';
        document.getElementById('blog-category').value = category;
        document.getElementById('blog-date').value = date;
        document.getElementById('blog-excerpt').value = `Ontdek hoe ${topic.toLowerCase()} kan helpen bij het versterken van jullie relatie.`;
        document.getElementById('blog-content').value = `<h2>Inleiding</h2>\n<p>In deze blog bespreken we ${topic.toLowerCase()}...</p>\n\n<h2>Waarom is dit belangrijk?</h2>\n<p>Voor relaties is ${topic.toLowerCase()} essentieel omdat...</p>\n\n<h2>Hoe LEGO® Serious Play kan helpen</h2>\n<p>Met LEGO® Serious Play kunnen we ${topic.toLowerCase()} visualiseren en bespreekbaar maken...</p>`;

        generateBtn.disabled = false;
        generateBtn.textContent = '🤖 Genereer met AI';

        alert('AI content gegenereerd! Pas het aan naar wens en publiceer.');
    }, 2000);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('nl-NL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Load existing blogs
    loadExistingBlogs();

    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('blog-date').value = today;

    // Tag input enter key
    document.getElementById('tag-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag();
        }
    });
});
