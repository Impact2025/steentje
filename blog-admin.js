// Blog Admin JavaScript
let blogs = [];
let currentEditId = null;

// Load blogs from localStorage or JSON file
async function loadBlogs() {
    try {
        // Try to load from localStorage first
        const storedBlogs = localStorage.getItem('steentje-blogs');
        if (storedBlogs) {
            blogs = JSON.parse(storedBlogs);
        } else {
            // Load initial data from JSON file
            const response = await fetch('blogs.json');
            const data = await response.json();
            blogs = data.blogs;
            saveBlogs();
        }
        renderBlogTable();
    } catch (error) {
        console.error('Error loading blogs:', error);
        blogs = [];
    }
}

// Save blogs to localStorage
function saveBlogs() {
    localStorage.setItem('steentje-blogs', JSON.stringify(blogs));
}

// Render blog table
function renderBlogTable() {
    const tbody = document.getElementById('blog-table-body');
    tbody.innerHTML = '';

    if (blogs.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="px-6 py-8 text-center text-warm-gray/60">
                    Nog geen blogs. Klik op "Nieuw artikel" om te beginnen.
                </td>
            </tr>
        `;
        return;
    }

    // Sort blogs by date (newest first)
    const sortedBlogs = [...blogs].sort((a, b) => new Date(b.date) - new Date(a.date));

    sortedBlogs.forEach(blog => {
        const row = document.createElement('tr');
        row.className = 'border-b border-warm-terracotta/10 hover:bg-soft-beige/50 transition-colors';
        row.innerHTML = `
            <td class="px-6 py-4">
                <div class="font-semibold text-warm-gray">${blog.title}</div>
                <div class="text-sm text-warm-gray/60">${blog.slug}</div>
            </td>
            <td class="px-6 py-4">
                <span class="px-3 py-1 bg-warm-terracotta/20 text-warm-terracotta rounded-full text-sm">
                    ${blog.category}
                </span>
            </td>
            <td class="px-6 py-4 text-warm-gray/70">
                ${formatDate(blog.date)}
            </td>
            <td class="px-6 py-4">
                <div class="flex gap-2">
                    <button onclick="editBlog(${blog.id})"
                            class="px-4 py-2 bg-deep-green text-white rounded-lg hover:bg-deep-green/80 transition-colors text-sm">
                        Bewerken
                    </button>
                    <button onclick="deleteBlog(${blog.id})"
                            class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm">
                        Verwijderen
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
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

// Show add blog form
function showAddBlogForm() {
    currentEditId = null;
    document.getElementById('modal-title').textContent = 'Nieuw artikel';
    document.getElementById('blog-form').reset();
    document.getElementById('blog-id').value = '';

    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('blog-date').value = today;

    document.getElementById('blog-modal').classList.remove('hidden');
}

// Edit blog
function editBlog(id) {
    const blog = blogs.find(b => b.id === id);
    if (!blog) return;

    currentEditId = id;
    document.getElementById('modal-title').textContent = 'Artikel bewerken';

    document.getElementById('blog-id').value = blog.id;
    document.getElementById('blog-title').value = blog.title;
    document.getElementById('blog-slug').value = blog.slug;
    document.getElementById('blog-excerpt').value = blog.excerpt;
    document.getElementById('blog-content').value = blog.content;
    document.getElementById('blog-category').value = blog.category;
    document.getElementById('blog-author').value = blog.author;
    document.getElementById('blog-image').value = blog.image;
    document.getElementById('blog-date').value = blog.date;
    document.getElementById('blog-tags').value = blog.tags.join(', ');
    document.getElementById('blog-meta-description').value = blog.metaDescription;
    document.getElementById('blog-meta-keywords').value = blog.metaKeywords;

    document.getElementById('blog-modal').classList.remove('hidden');
}

// Delete blog
function deleteBlog(id) {
    if (!confirm('Weet je zeker dat je dit artikel wilt verwijderen?')) return;

    blogs = blogs.filter(b => b.id !== id);
    saveBlogs();
    renderBlogTable();
}

// Close modal
function closeBlogModal() {
    document.getElementById('blog-modal').classList.add('hidden');
    document.getElementById('blog-form').reset();
    currentEditId = null;
}

// Handle form submission
document.getElementById('blog-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = {
        title: document.getElementById('blog-title').value,
        slug: document.getElementById('blog-slug').value,
        excerpt: document.getElementById('blog-excerpt').value,
        content: document.getElementById('blog-content').value,
        category: document.getElementById('blog-category').value,
        author: document.getElementById('blog-author').value,
        image: document.getElementById('blog-image').value,
        date: document.getElementById('blog-date').value,
        tags: document.getElementById('blog-tags').value.split(',').map(t => t.trim()).filter(t => t),
        metaDescription: document.getElementById('blog-meta-description').value,
        metaKeywords: document.getElementById('blog-meta-keywords').value
    };

    if (currentEditId) {
        // Update existing blog
        const index = blogs.findIndex(b => b.id === currentEditId);
        if (index !== -1) {
            blogs[index] = { ...blogs[index], ...formData };
        }
    } else {
        // Create new blog
        const newId = blogs.length > 0 ? Math.max(...blogs.map(b => b.id)) + 1 : 1;
        blogs.push({ id: newId, ...formData });
    }

    saveBlogs();
    renderBlogTable();
    closeBlogModal();

    // Show success message
    showNotification(currentEditId ? 'Artikel bijgewerkt!' : 'Artikel toegevoegd!');
});

// Auto-generate slug from title
document.getElementById('blog-title').addEventListener('blur', function() {
    const slugInput = document.getElementById('blog-slug');
    if (!slugInput.value) {
        const slug = this.value
            .toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove accents
            .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
            .trim()
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-'); // Remove duplicate hyphens
        slugInput.value = slug;
    }
});

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-20 right-4 bg-deep-green text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);

    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Handle image upload
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        alert('Alleen afbeelding bestanden zijn toegestaan (JPG, PNG, GIF, WebP)');
        return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
        alert('Bestand is te groot. Maximale grootte is 5MB.');
        return;
    }

    // Read file and convert to base64
    const reader = new FileReader();
    reader.onload = function(e) {
        const imageData = e.target.result;

        // Store in localStorage with unique key
        const imageKey = `blog-image-${Date.now()}`;
        try {
            localStorage.setItem(imageKey, imageData);

            // Set the image URL in the input field
            document.getElementById('blog-image').value = imageKey;

            // Show preview
            const previewDiv = document.getElementById('image-preview');
            const previewImg = document.getElementById('preview-img');
            previewImg.src = imageData;
            previewDiv.classList.remove('hidden');

            showNotification('Afbeelding succesvol geüpload!');
        } catch (error) {
            alert('Fout bij opslaan van afbeelding. Mogelijk is het bestand te groot voor localStorage.');
            console.error('LocalStorage error:', error);
        }
    };

    reader.onerror = function() {
        alert('Fout bij lezen van bestand');
    };

    reader.readAsDataURL(file);
}

// Helper function to get image URL (either from localStorage or direct URL)
function getImageUrl(imageValue) {
    if (!imageValue) return '';

    // Check if it's a localStorage key
    if (imageValue.startsWith('blog-image-')) {
        const storedImage = localStorage.getItem(imageValue);
        return storedImage || imageValue;
    }

    // Otherwise it's a direct URL
    return imageValue;
}

// Handle AI image upload
function handleAIImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        alert('Alleen afbeelding bestanden zijn toegestaan (JPG, PNG, GIF, WebP)');
        return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
        alert('Bestand is te groot. Maximale grootte is 5MB.');
        return;
    }

    // Read file and convert to base64
    const reader = new FileReader();
    reader.onload = function(e) {
        const imageData = e.target.result;

        // Store in localStorage with unique key
        const imageKey = `blog-image-${Date.now()}`;
        try {
            localStorage.setItem(imageKey, imageData);

            // Set the image URL in the input field
            document.getElementById('ai-image').value = imageKey;

            // Show preview
            const previewDiv = document.getElementById('ai-image-preview');
            const previewImg = document.getElementById('ai-preview-img');
            previewImg.src = imageData;
            previewDiv.classList.remove('hidden');

            showNotification('Afbeelding succesvol geüpload!');
        } catch (error) {
            alert('Fout bij opslaan van afbeelding. Mogelijk is het bestand te groot voor localStorage.');
            console.error('LocalStorage error:', error);
        }
    };

    reader.onerror = function() {
        alert('Fout bij lezen van bestand');
    };

    reader.readAsDataURL(file);
}

// Show AI Generator Modal
function showAIGenerator() {
    document.getElementById('ai-modal').classList.remove('hidden');
}

// Close AI Generator Modal
function closeAIModal() {
    document.getElementById('ai-modal').classList.add('hidden');
    document.getElementById('ai-form').reset();
    document.getElementById('ai-status').classList.add('hidden');

    // Reset image preview
    const aiPreviewDiv = document.getElementById('ai-image-preview');
    if (aiPreviewDiv) {
        aiPreviewDiv.classList.add('hidden');
    }

    // Clear file input
    const aiImageUpload = document.getElementById('ai-image-upload');
    if (aiImageUpload) {
        aiImageUpload.value = '';
    }
}

// Handle AI Generation (wrapped in DOMContentLoaded to ensure form exists)
function initAIForm() {
    const aiForm = document.getElementById('ai-form');
    if (!aiForm) return;

    aiForm.addEventListener('submit', async function(e) {
        e.preventDefault();

    const generateBtn = document.getElementById('generate-btn');
    const statusDiv = document.getElementById('ai-status');
    const originalBtnText = generateBtn.innerHTML;

    // Show loading state
    generateBtn.disabled = true;
    generateBtn.innerHTML = `
        <svg class="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        AI genereert artikel...
    `;

    statusDiv.classList.remove('hidden');
    statusDiv.className = 'mt-4 p-4 rounded-lg bg-blue-50 border border-blue-200 text-blue-800';
    statusDiv.innerHTML = '🤖 AI aan het werk... Dit kan 10-30 seconden duren.';

    try {
        const formData = {
            keyword: document.getElementById('ai-keyword').value,
            title: document.getElementById('ai-title').value,
            category: document.getElementById('ai-category').value,
            extraKeywords: document.getElementById('ai-extra-keywords').value,
            tone: document.getElementById('ai-tone').value,
            audience: document.getElementById('ai-audience').value,
            length: document.getElementById('ai-length').value,
            image: document.getElementById('ai-image').value
        };

        // Generate article using AI
        const article = await generateAIArticle(formData);

        // Create new blog with generated content
        const newId = blogs.length > 0 ? Math.max(...blogs.map(b => b.id)) + 1 : 1;
        blogs.push({ id: newId, ...article });

        saveBlogs();
        renderBlogTable();

        // Show success message
        statusDiv.className = 'mt-4 p-4 rounded-lg bg-green-50 border border-green-200 text-green-800';
        statusDiv.innerHTML = `
            ✅ <strong>Artikel succesvol gegenereerd!</strong><br>
            <span class="text-sm">Het artikel is toegevoegd aan je blog lijst.</span>
        `;

        setTimeout(() => {
            closeAIModal();
            showNotification('AI artikel succesvol aangemaakt!');
        }, 2000);

    } catch (error) {
        console.error('AI Generation Error:', error);
        statusDiv.className = 'mt-4 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800';
        statusDiv.innerHTML = `
            ❌ <strong>Fout bij genereren:</strong><br>
            <span class="text-sm">${error.message}</span>
        `;
    } finally {
        generateBtn.disabled = false;
        generateBtn.innerHTML = originalBtnText;
    }
    });
}

// AI Article Generation Function
async function generateAIArticle(formData) {
    // This is a demonstration function that generates a structured article
    // In a real production environment, you would call an AI API (like Claude API or OpenAI)

    const keyword = formData.keyword;
    const title = formData.title || `Hoe ${keyword} Jouw Relatie Versterkt in 2025`;
    const slug = createSlug(title);
    const category = formData.category;
    const extraKeywords = formData.extraKeywords.split(',').map(k => k.trim()).filter(k => k);

    // Generate article content based on keyword and settings
    const content = generateArticleContent(keyword, formData);
    const excerpt = generateExcerpt(keyword, formData);
    const metaDescription = `Ontdek hoe ${keyword} je relatie versterkt. Praktische tips en professionele begeleiding van Steentje bij Steentje. Creatief, effectief en bewezen resultaten.`;

    // Use uploaded image if available, otherwise use default
    const image = formData.image || 'resources/blog-communication.jpg';

    return {
        title: title,
        slug: slug,
        excerpt: excerpt,
        content: content,
        image: image,
        author: 'Kimi van der Berg',
        date: new Date().toISOString().split('T')[0],
        category: category,
        tags: [keyword, ...extraKeywords, 'LEGO Serious Play', 'relatiecoaching'].slice(0, 5),
        metaDescription: metaDescription,
        metaKeywords: [keyword, ...extraKeywords, 'relatiecoaching', 'LEGO Serious Play', 'relatietherapie'].join(', ')
    };
}

// Generate article content with proper SEO structure
function generateArticleContent(keyword, formData) {
    const tone = getToneDescription(formData.tone);
    const audience = getAudienceDescription(formData.audience);

    return `<p>In 2025 is het belangrijker dan ooit om bewust te werken aan je relatie. Met de drukte van het dagelijks leven, toenemende schermtijd en stress op werk, verdient jullie relatie extra aandacht. Gelukkig zijn er creatieve en effectieve manieren om ${keyword.toLowerCase()}.</p>

<h2>Waarom Relaties in 2025 Extra Aandacht Verdienen</h2>

<p>Het moderne leven stelt hoge eisen aan koppels. Tussen werk, sociale verplichtingen en digitale afleiding door, verliezen we soms het contact met onze partner. Onderzoek toont aan dat koppels die actief werken aan hun relatie significant gelukkiger zijn en minder conflicten ervaren.</p>

<h3>De Uitdagingen van Moderne Relaties</h3>

<p>Veel koppels herkennen de volgende uitdagingen:</p>

<ul>
<li>Te weinig quality time samen door drukke agenda's</li>
<li>Oppervlakkige gesprekken over alleen praktische zaken</li>
<li>Schermtijd die ten koste gaat van echte verbinding</li>
<li>Moeite om gevoelens en behoeften te uiten</li>
<li>Steeds dezelfde conflicten zonder oplossing</li>
</ul>

<h2>Praktische Stappen om ${keyword}</h2>

<p>Bij <a href="werkwijze.html">Steentje bij Steentje</a> geloven we in een creatieve, praktische aanpak. Hier zijn concrete stappen die je vandaag kunt zetten:</p>

<h3>1. Maak Bewust Tijd Vrij voor Elkaar</h3>

<p>Plan wekelijks een vast moment waarop jullie echt aanwezig zijn voor elkaar. Leg de telefoons weg en geef elkaar volle aandacht. Dit hoeft geen uren te duren - zelfs 30 minuten van echte verbinding maakt verschil.</p>

<h3>2. Kies voor een Creatieve Werkvorm</h3>

<p>Traditionele gesprekken lopen soms vast. Een <a href="over-ons.html">creatieve relatiecoaching</a> aanpak zoals LEGO® Serious Play zorgt voor nieuwe inzichten. Door te bouwen in plaats van alleen te praten, kom je op een andere manier in contact met je gevoelens en gedachten.</p>

<h3>3. Gebruik LEGO® Serious Play om te Communiceren</h3>

<p>Bij Steentje bij Steentje werken we met LEGO® Serious Play - een wetenschappelijk onderbouwde methode waarbij je letterlijk <a href="werkwijze.html">samen bouwt</a> aan je relatie. Het bouwen met je handen activeert andere hersendelen dan alleen praten, waardoor je toegang krijgt tot diepere inzichten.</p>

<h3>4. Praten Via Bouwen</h3>

<p>In plaats van direct over moeilijke onderwerpen te praten, bouw je eerst een model. Dit creëert een veilige afstand waardoor je gemakkelijker kwetsbaar kunt zijn. Je praat via je LEGO® model, niet direct over jezelf, wat het makkelijker maakt om eerlijk te zijn.</p>

<h3>5. Terugblikken op Mooie Momenten</h3>

<p>Veel koppels focussen op problemen. Maar het is minstens zo belangrijk om stil te staan bij wat goed gaat. Bouw samen herinneringen aan mooie momenten en versterk zo jullie positieve band.</p>

<h2>Hoe Steentje bij Steentje Je Helpt</h2>

<p>Onze aanpak is ontworpen om ${keyword.toLowerCase()} op een manier die blijft hangen. Hier is hoe we dat doen:</p>

<h3>Vrijblijvende Intake Sessie</h3>

<p>We beginnen altijd met een gratis kennismaking. Hierin ontdek je of LEGO® Serious Play bij jullie past en bespreken we jullie specifieke situatie en wensen.</p>

<h3>Gezamenlijke Coachingssessies</h3>

<p>In onze sessies werken we met <a href="werkwijze.html">praktische relatieopdrachten</a> waarbij jullie samen bouwen, vertellen en ontdekken. Elke sessie is afgestemd op jullie unieke situatie en doelen.</p>

<h3>Blijvende Resultaten</h3>

<p>Het krachtige van LEGO® Serious Play is dat je een fysiek bouwwerk overhoudt. Dit bouwwerk blijft zichtbaar in je huis en helpt je om de inzichten uit de sessie levend te houden.</p>

<h3>Professionele Begeleiding</h3>

<p>Als gecertificeerd LEGO® Serious Play facilitator en relatiecoach begeleidt Kimi jullie vakkundig door het proces. Met jarenlange ervaring weet zij precies hoe ze een veilige ruimte creëert waarin jullie kunnen groeien.</p>

<h2>Succesverhalen: Het Werkt Echt</h2>

<p>Meer dan 150 koppels gingen jullie al voor. Ze ontdekten dat ${keyword.toLowerCase()} niet alleen mogelijk is, maar ook verrassend leuk kan zijn. 95% van onze klanten beveelt ons aan bij vrienden en familie.</p>

<p><em>"We waren sceptisch over 'spelen met LEGO', maar het heeft onze relatie echt getransformeerd. We begrijpen elkaar nu zoveel beter,"</em> vertelt Sarah, die samen met haar partner Mark het traject volgde.</p>

<h2>Start Vandaag met ${keyword}</h2>

<p>Je relatie verdient het beste. Wacht niet tot problemen groter worden - investeer nu in jullie toekomst samen. Of je nu wilt werken aan betere communicatie, meer verbinding voelt, of preventief aan de slag wilt, wij staan klaar om jullie te helpen.</p>

<h3>Jouw Volgende Stap</h3>

<p>Klaar om te starten? <a href="plan-sessie.html">Plan een vrijblijvende kennismaking</a> en ontdek hoe Steentje bij Steentje jullie kan helpen. Je kunt ook eerst <a href="ervaringen.html">meer ervaringen lezen</a> van andere koppels die de stap al zetten.</p>

<p><strong>Bouw aan je relatie, één steentje tegelijk.</strong></p>

<p style="margin-top: 2rem; padding: 1.5rem; background: #F5F1EB; border-left: 4px solid #D4A574; border-radius: 8px;">
📞 <strong>Neem direct contact op:</strong><br>
Bel ons op 06-12345678 of mail naar info@steentjebijsteentje.nl<br>
Of <a href="plan-sessie.html" style="color: #D4A574; font-weight: 600;">plan direct een sessie via onze website</a>
</p>`;
}

// Generate excerpt
function generateExcerpt(keyword, formData) {
    return `Ontdek hoe je in 2025 ${keyword.toLowerCase()} met de creatieve aanpak van Steentje bij Steentje. Praktische tips en professionele LEGO® Serious Play begeleiding voor koppels.`;
}

// Helper: Create slug from title
function createSlug(title) {
    return title
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

// Helper functions for tone and audience
function getToneDescription(tone) {
    const tones = {
        'vriendelijk': 'warm, toegankelijk en motiverend',
        'professioneel': 'zakelijk, informatief en betrouwbaar',
        'inspirerend': 'emotioneel, aansprekend en motiverend',
        'praktisch': 'direct, concreet en to-the-point'
    };
    return tones[tone] || tones['vriendelijk'];
}

function getAudienceDescription(audience) {
    const audiences = {
        'algemeen': 'alle koppels',
        'starters': 'startende relaties',
        'gevestigd': 'gevestigde relaties',
        'lang': 'langdurige relaties',
        'ouders': 'koppels met kinderen'
    };
    return audiences[audience] || audiences['algemeen'];
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadBlogs();
    initAIForm();
});
