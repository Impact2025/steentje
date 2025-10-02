// Admin Blog met Supabase
let editingBlogId = null;

// Load existing blogs
async function loadExistingBlogs() {
    console.log('🔍 Loading blogs...');
    console.log('Supabase client:', typeof window.supabaseClient);

    if (!window.supabaseClient) {
        alert('Supabase client niet beschikbaar. Herlaad de pagina.');
        return;
    }

    try {
        const { data, error } = await window.supabaseClient
            .from('blogs')
            .select('*')
            .order('date', { ascending: false });

        console.log('📊 Supabase response:', { data, error });

        if (error) throw error;

        const tableBody = document.getElementById('existing-blogs-body') || document.getElementById('blog-table-body');

        if (!tableBody) {
            console.error('❌ Table body element not found!');
            return;
        }

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
        console.error('❌ Error loading blogs:', error);
        console.error('Error details:', error.message, error.stack);
        alert('Fout bij het laden van blogs: ' + error.message);
    }
}

// Edit blog
async function editBlog(id) {
    try {
        const { data, error } = await window.supabaseClient
            .from('blogs')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        console.log('📝 Editing blog:', data);

        editingBlogId = id;

        // Safely set form values
        const setValueIfExists = (id, value) => {
            const el = document.getElementById(id);
            if (el) el.value = value;
        };

        const setTextIfExists = (id, text) => {
            const el = document.getElementById(id);
            if (el) el.textContent = text;
        };

        setTextIfExists('form-title', 'Blog Bewerken');
        setValueIfExists('blog-id', id);
        setValueIfExists('blog-title', data.title || '');
        setValueIfExists('blog-slug', data.slug || '');
        setValueIfExists('blog-author', data.author || 'Kimi van der Berg');
        setValueIfExists('blog-category', data.category || 'Relatiecoaching');
        setValueIfExists('blog-date', data.date ? data.date.split('T')[0] : new Date().toISOString().split('T')[0]);
        setValueIfExists('blog-excerpt', data.excerpt || '');
        setValueIfExists('blog-content', data.content || '');
        setValueIfExists('blog-image', data.image || '');
        setValueIfExists('blog-tags', (data.tags || []).join(', '));
        setValueIfExists('blog-meta-description', data.excerpt || '');
        setValueIfExists('blog-meta-keywords', (data.tags || []).join(', '));

        // Show modal if it exists
        const modal = document.getElementById('blog-modal');
        if (modal) {
            modal.classList.remove('hidden');
        }

        // Scroll to form
        const form = document.getElementById('blog-form');
        if (form) {
            form.scrollIntoView({ behavior: 'smooth' });
        }
    } catch (error) {
        console.error('❌ Error loading blog:', error);
        console.error('Error details:', error.message);
        alert('Fout bij het laden van blog: ' + error.message);
    }
}

// Delete blog
async function deleteBlog(id) {
    if (!confirm('Weet je zeker dat je deze blog wilt verwijderen?')) return;

    try {
        const { error } = await window.supabaseClient
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

    console.log('📝 Submitting blog...');

    // Get tags from input field or tag items
    let tags = [];
    const blogTagsInput = document.getElementById('blog-tags');
    if (blogTagsInput && blogTagsInput.value) {
        tags = blogTagsInput.value.split(',').map(t => t.trim()).filter(t => t);
    } else {
        const tagItems = document.querySelectorAll('.tag-item');
        if (tagItems.length > 0) {
            tags = Array.from(tagItems).map(el => el.textContent.replace('×', '').trim());
        }
    }

    const blogData = {
        title: document.getElementById('blog-title').value,
        slug: document.getElementById('blog-slug').value,
        author: document.getElementById('blog-author').value,
        category: document.getElementById('blog-category').value,
        date: document.getElementById('blog-date').value,
        excerpt: document.getElementById('blog-excerpt').value,
        content: document.getElementById('blog-content').value,
        image: document.getElementById('blog-image').value || null,
        tags: tags
    };

    console.log('Blog data:', blogData);

    try {
        if (editingBlogId) {
            // Update existing blog
            const { error } = await window.supabaseClient
                .from('blogs')
                .update(blogData)
                .eq('id', editingBlogId);

            if (error) throw error;
            alert('Blog succesvol bijgewerkt!');
        } else {
            // Create new blog
            const { error } = await window.supabaseClient
                .from('blogs')
                .insert([blogData]);

            if (error) throw error;
            alert('Blog succesvol gepubliceerd!');
        }

        // Close modal
        closeBlogModal();

        // Reset editing state
        editingBlogId = null;

        // Reload blogs
        loadExistingBlogs();
    } catch (error) {
        console.error('❌ Error saving blog:', error);
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

function handleAIImageUpload(event) {
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
        document.getElementById('ai-image').value = imageKey;

        // Show preview
        const preview = document.getElementById('ai-image-preview');
        const previewImg = document.getElementById('ai-preview-img');
        if (preview && previewImg) {
            preview.classList.remove('hidden');
            previewImg.src = e.target.result;
        }
    };
    reader.readAsDataURL(file);
}

// AI Generator
async function generateWithAI() {
    const keyword = document.getElementById('ai-keyword')?.value;
    const title = document.getElementById('ai-title')?.value;
    const category = document.getElementById('ai-category')?.value;

    if (!keyword) {
        alert('Vul een primair keyword in');
        return;
    }

    if (!category) {
        alert('Kies een categorie');
        return;
    }

    const topic = title || keyword;

    const generateBtn = document.getElementById('generate-btn');
    generateBtn.disabled = true;
    generateBtn.textContent = '🤖 Genereren...';

    // Simulate AI generation (replace with actual API call)
    setTimeout(() => {
        const date = new Date().toISOString().split('T')[0];
        const slug = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        generateBtn.disabled = false;
        generateBtn.textContent = '🤖 Genereer met AI';

        // Close AI modal first
        closeAIModal();

        // Wait a bit for modal transition, then open blog modal and fill fields
        setTimeout(() => {
            openBlogModal();

            // Wait for modal to be fully visible, then fill fields
            setTimeout(() => {
                const setValueIfExists = (id, value) => {
                    const el = document.getElementById(id);
                    if (el) {
                        el.value = value;
                        console.log(`Set ${id} to:`, value);
                    } else {
                        console.error(`Element ${id} not found!`);
                    }
                };

                console.log('📝 Filling AI generated content...');

                setValueIfExists('blog-title', topic);
                setValueIfExists('blog-slug', slug);
                setValueIfExists('blog-author', 'Kimi van der Berg');
                setValueIfExists('blog-category', category);
                setValueIfExists('blog-date', date);
                setValueIfExists('blog-excerpt', `Ontdek hoe ${topic.toLowerCase()} essentieel is voor een sterke en gezonde relatie. In deze blog delen we concrete inzichten en praktische tips om samen te groeien.`);

                // Generate comprehensive blog content
                const content = `
<h2>Inleiding</h2>
<p>In de dynamiek van een relatie speelt ${topic.toLowerCase()} een cruciale rol. Of je nu aan het begin staat van jullie gezamenlijke reis of al jaren samen bent, het blijft een onderwerp waar bewuste aandacht voor nodig is. In deze blog nemen we je mee in waarom ${topic.toLowerCase()} zo belangrijk is en hoe je dit samen kunt versterken.</p>

<p>Veel koppels worstelen met dit thema zonder het direct te beseffen. Door hier bewust mee aan de slag te gaan, leg je een stevige basis voor een duurzame en liefdevolle relatie.</p>

<h2>Waarom is ${topic} belangrijk voor jullie relatie?</h2>
<p>Voor relaties is ${topic.toLowerCase()} essentieel omdat het direct invloed heeft op hoe jullie met elkaar omgaan, communiceren en samen groeien. Wanneer dit aspect in balans is, ervaren partners meer verbondenheid, vertrouwen en tevredenheid in de relatie.</p>

<p>Onderzoek toont aan dat koppels die bewust werken aan ${topic.toLowerCase()} significant meer relatietevredenheid ervaren. Ze rapporteren betere communicatie, meer intimiteit en een dieper gevoel van partnerschap.</p>

<h3>De impact op jullie dagelijks leven</h3>
<p>In het dagelijks leven uit ${topic.toLowerCase()} zich op verschillende manieren:</p>
<ul>
    <li><strong>Communicatie:</strong> Hoe jullie met elkaar praten en naar elkaar luisteren</li>
    <li><strong>Besluitvorming:</strong> De manier waarop jullie samen keuzes maken</li>
    <li><strong>Conflicthantering:</strong> Hoe jullie omgaan met meningsverschillen</li>
    <li><strong>Emotionele verbinding:</strong> De diepte van jullie emotionele band</li>
    <li><strong>Toekomstvisie:</strong> Hoe jullie gezamenlijke doelen vormgeven</li>
</ul>

<h2>Veelvoorkomende uitdagingen</h2>
<p>Veel koppels ervaren uitdagingen rond ${topic.toLowerCase()}. Dit is volkomen normaal en betekent niet dat er iets mis is met jullie relatie. Herkenbare uitdagingen zijn:</p>

<ul>
    <li>Moeilijk onder woorden kunnen brengen wat je echt voelt of bedoelt</li>
    <li>Verschillende verwachtingen die niet expliciet zijn uitgesproken</li>
    <li>Patronen uit het verleden die blijven terugkeren</li>
    <li>Aannames over wat de ander denkt of voelt</li>
    <li>Drukke levens waardoor er te weinig tijd is voor echt contact</li>
</ul>

<p>Het goede nieuws? Al deze uitdagingen zijn bespreekbaar en bewerkbaar wanneer je de juiste tools en ruimte creëert.</p>

<h2>Hoe LEGO® Serious Play kan helpen</h2>
<p>Met LEGO® Serious Play kunnen we ${topic.toLowerCase()} op een unieke en toegankelijke manier visualiseren en bespreekbaar maken. Deze methodiek doorbreekt de traditionele gesprekspatronen en opent nieuwe mogelijkheden voor begrip en verbinding.</p>

<h3>De kracht van bouwen met je handen</h3>
<p>Wanneer je met LEGO-stenen bouwt, gebruik je niet alleen je verstand maar ook je handen en je gevoel. Dit activeert andere delen van je brein en maakt diepere inzichten toegankelijk. Partners bouwen letterlijk hun perspectief, waardoor het zichtbaar en tastbaar wordt voor de ander.</p>

<h3>Veilige ruimte voor open gesprek</h3>
<p>De LEGO-stenen fungeren als een 'tussenpersoon' - je praat niet rechtstreeks over gevoelige onderwerpen, maar laat je bouwsel het verhaal vertellen. Dit creëert psychologische veiligheid en maakt het gemakkelijker om kwetsbaar te zijn.</p>

<h3>Concrete resultaten</h3>
<p>Na een LEGO® Serious Play sessie over ${topic.toLowerCase()} hebben koppels:</p>
<ul>
    <li>Een beter begrip van elkaars perspectief en behoeften</li>
    <li>Concrete handvatten om mee aan de slag te gaan</li>
    <li>Nieuwe inzichten in patronen en dynamieken</li>
    <li>Een gezamenlijk beeld van waar jullie naartoe willen</li>
    <li>Hernieuwde motivatie en verbinding</li>
</ul>

<h2>Praktische tips om vandaag te starten</h2>
<p>Je hoeft niet te wachten op een workshop om met ${topic.toLowerCase()} aan de slag te gaan. Hier zijn concrete stappen die je vandaag kunt zetten:</p>

<ol>
    <li><strong>Maak tijd voor elkaar:</strong> Plan wekelijks een vast moment waarop jullie echt met elkaar in gesprek gaan, zonder afleidingen.</li>
    <li><strong>Stel open vragen:</strong> Vraag naar gedachten, gevoelens en dromen in plaats van feiten.</li>
    <li><strong>Luister actief:</strong> Probeer eerst echt te begrijpen voordat je reageert of oplossingen aandraagt.</li>
    <li><strong>Wees kwetsbaar:</strong> Deel ook je onzekerheden en twijfels, niet alleen je sterktes.</li>
    <li><strong>Vier kleine successen:</strong> Erken en waardeer de stappen die jullie samen zetten.</li>
</ol>

<h2>De volgende stap</h2>
<p>Ben je klaar om dieper in te gaan op ${topic.toLowerCase()} in jullie relatie? Een LEGO® Serious Play sessie biedt jullie een veilige, speelse en effectieve manier om samen aan de slag te gaan. Of het nu gaat om preventief werken aan een sterke basis of om specifieke uitdagingen aan te pakken - de methodiek past zich aan jullie situatie aan.</p>

<p>Ik begeleid koppels met zorg, humor en professionele expertise. Geen standaard praatsessie, maar een hands-on ervaring die jullie blijft bijstaan lang nadat de sessie voorbij is.</p>

<p><strong>Nieuwsgierig wat LEGO® Serious Play voor jullie kan betekenen?</strong> Plan vrijblijvend een kennismakingsgesprek en ontdek hoe we ${topic.toLowerCase()} in jullie relatie kunnen versterken.</p>

<div class="cta-box" style="background: #f8f4f0; padding: 2rem; margin: 2rem 0; border-radius: 8px; border-left: 4px solid #c17a5f;">
    <h3 style="margin-top: 0;">Klaar voor de volgende stap?</h3>
    <p>Ontdek hoe LEGO® Serious Play jullie relatie kan versterken. Plan een vrijblijvend kennismakingsgesprek.</p>
    <a href="/contact.html" style="display: inline-block; background: #c17a5f; color: white; padding: 0.75rem 2rem; text-decoration: none; border-radius: 4px; font-weight: bold; margin-top: 1rem;">Plan een sessie</a>
</div>
`;

                setValueIfExists('blog-content', content.trim());

                console.log('✅ AI content filled');

                // Auto-save the AI generated blog
                setTimeout(async () => {
                    console.log('💾 Auto-saving AI generated blog...');

                    // Generate the same comprehensive content for auto-save
                    const fullContent = `
<h2>Inleiding</h2>
<p>In de dynamiek van een relatie speelt ${topic.toLowerCase()} een cruciale rol. Of je nu aan het begin staat van jullie gezamenlijke reis of al jaren samen bent, het blijft een onderwerp waar bewuste aandacht voor nodig is. In deze blog nemen we je mee in waarom ${topic.toLowerCase()} zo belangrijk is en hoe je dit samen kunt versterken.</p>

<p>Veel koppels worstelen met dit thema zonder het direct te beseffen. Door hier bewust mee aan de slag te gaan, leg je een stevige basis voor een duurzame en liefdevolle relatie.</p>

<h2>Waarom is ${topic} belangrijk voor jullie relatie?</h2>
<p>Voor relaties is ${topic.toLowerCase()} essentieel omdat het direct invloed heeft op hoe jullie met elkaar omgaan, communiceren en samen groeien. Wanneer dit aspect in balans is, ervaren partners meer verbondenheid, vertrouwen en tevredenheid in de relatie.</p>

<p>Onderzoek toont aan dat koppels die bewust werken aan ${topic.toLowerCase()} significant meer relatietevredenheid ervaren. Ze rapporteren betere communicatie, meer intimiteit en een dieper gevoel van partnerschap.</p>

<h3>De impact op jullie dagelijks leven</h3>
<p>In het dagelijks leven uit ${topic.toLowerCase()} zich op verschillende manieren:</p>
<ul>
    <li><strong>Communicatie:</strong> Hoe jullie met elkaar praten en naar elkaar luisteren</li>
    <li><strong>Besluitvorming:</strong> De manier waarop jullie samen keuzes maken</li>
    <li><strong>Conflicthantering:</strong> Hoe jullie omgaan met meningsverschillen</li>
    <li><strong>Emotionele verbinding:</strong> De diepte van jullie emotionele band</li>
    <li><strong>Toekomstvisie:</strong> Hoe jullie gezamenlijke doelen vormgeven</li>
</ul>

<h2>Veelvoorkomende uitdagingen</h2>
<p>Veel koppels ervaren uitdagingen rond ${topic.toLowerCase()}. Dit is volkomen normaal en betekent niet dat er iets mis is met jullie relatie. Herkenbare uitdagingen zijn:</p>

<ul>
    <li>Moeilijk onder woorden kunnen brengen wat je echt voelt of bedoelt</li>
    <li>Verschillende verwachtingen die niet expliciet zijn uitgesproken</li>
    <li>Patronen uit het verleden die blijven terugkeren</li>
    <li>Aannames over wat de ander denkt of voelt</li>
    <li>Drukke levens waardoor er te weinig tijd is voor echt contact</li>
</ul>

<p>Het goede nieuws? Al deze uitdagingen zijn bespreekbaar en bewerkbaar wanneer je de juiste tools en ruimte creëert.</p>

<h2>Hoe LEGO® Serious Play kan helpen</h2>
<p>Met LEGO® Serious Play kunnen we ${topic.toLowerCase()} op een unieke en toegankelijke manier visualiseren en bespreekbaar maken. Deze methodiek doorbreekt de traditionele gesprekspatronen en opent nieuwe mogelijkheden voor begrip en verbinding.</p>

<h3>De kracht van bouwen met je handen</h3>
<p>Wanneer je met LEGO-stenen bouwt, gebruik je niet alleen je verstand maar ook je handen en je gevoel. Dit activeert andere delen van je brein en maakt diepere inzichten toegankelijk. Partners bouwen letterlijk hun perspectief, waardoor het zichtbaar en tastbaar wordt voor de ander.</p>

<h3>Veilige ruimte voor open gesprek</h3>
<p>De LEGO-stenen fungeren als een 'tussenpersoon' - je praat niet rechtstreeks over gevoelige onderwerpen, maar laat je bouwsel het verhaal vertellen. Dit creëert psychologische veiligheid en maakt het gemakkelijker om kwetsbaar te zijn.</p>

<h3>Concrete resultaten</h3>
<p>Na een LEGO® Serious Play sessie over ${topic.toLowerCase()} hebben koppels:</p>
<ul>
    <li>Een beter begrip van elkaars perspectief en behoeften</li>
    <li>Concrete handvatten om mee aan de slag te gaan</li>
    <li>Nieuwe inzichten in patronen en dynamieken</li>
    <li>Een gezamenlijk beeld van waar jullie naartoe willen</li>
    <li>Hernieuwde motivatie en verbinding</li>
</ul>

<h2>Praktische tips om vandaag te starten</h2>
<p>Je hoeft niet te wachten op een workshop om met ${topic.toLowerCase()} aan de slag te gaan. Hier zijn concrete stappen die je vandaag kunt zetten:</p>

<ol>
    <li><strong>Maak tijd voor elkaar:</strong> Plan wekelijks een vast moment waarop jullie echt met elkaar in gesprek gaan, zonder afleidingen.</li>
    <li><strong>Stel open vragen:</strong> Vraag naar gedachten, gevoelens en dromen in plaats van feiten.</li>
    <li><strong>Luister actief:</strong> Probeer eerst echt te begrijpen voordat je reageert of oplossingen aandraagt.</li>
    <li><strong>Wees kwetsbaar:</strong> Deel ook je onzekerheden en twijfels, niet alleen je sterktes.</li>
    <li><strong>Vier kleine successen:</strong> Erken en waardeer de stappen die jullie samen zetten.</li>
</ol>

<h2>De volgende stap</h2>
<p>Ben je klaar om dieper in te gaan op ${topic.toLowerCase()} in jullie relatie? Een LEGO® Serious Play sessie biedt jullie een veilige, speelse en effectieve manier om samen aan de slag te gaan. Of het nu gaat om preventief werken aan een sterke basis of om specifieke uitdagingen aan te pakken - de methodiek past zich aan jullie situatie aan.</p>

<p>Ik begeleid koppels met zorg, humor en professionele expertise. Geen standaard praatsessie, maar een hands-on ervaring die jullie blijft bijstaan lang nadat de sessie voorbij is.</p>

<p><strong>Nieuwsgierig wat LEGO® Serious Play voor jullie kan betekenen?</strong> Plan vrijblijvend een kennismakingsgesprek en ontdek hoe we ${topic.toLowerCase()} in jullie relatie kunnen versterken.</p>

<div class="cta-box" style="background: #f8f4f0; padding: 2rem; margin: 2rem 0; border-radius: 8px; border-left: 4px solid #c17a5f;">
    <h3 style="margin-top: 0;">Klaar voor de volgende stap?</h3>
    <p>Ontdek hoe LEGO® Serious Play jullie relatie kan versterken. Plan een vrijblijvend kennismakingsgesprek.</p>
    <a href="/contact.html" style="display: inline-block; background: #c17a5f; color: white; padding: 0.75rem 2rem; text-decoration: none; border-radius: 4px; font-weight: bold; margin-top: 1rem;">Plan een sessie</a>
</div>
`.trim();

                    // Get the uploaded image or use default
                    const uploadedImage = document.getElementById('ai-image')?.value;
                    const imageUrl = uploadedImage || 'resources/hero-lego-couple.jpg';

                    const blogData = {
                        title: topic,
                        slug: slug,
                        author: 'Kimi van der Berg',
                        category: category,
                        date: new Date(date).toISOString(),
                        excerpt: `Ontdek hoe ${topic.toLowerCase()} essentieel is voor een sterke en gezonde relatie. In deze blog delen we concrete inzichten en praktische tips om samen te groeien.`,
                        content: fullContent,
                        image: imageUrl,
                        tags: ['LEGO Serious Play', 'Relatiecoaching']
                    };

                    console.log('📤 Sending to Supabase:', blogData);

                    try {
                        const { data, error } = await window.supabaseClient
                            .from('blogs')
                            .insert([blogData])
                            .select(); // Get the inserted data back

                        console.log('📥 Supabase response:', { data, error });

                        if (error) throw error;

                        console.log('✅ AI blog saved successfully!');

                        // Close modal first
                        closeBlogModal();

                        // Reload blogs
                        loadExistingBlogs();

                        // Show success message after modal is closed
                        setTimeout(() => {
                            alert('AI blog succesvol opgeslagen!');
                        }, 300);
                    } catch (error) {
                        console.error('❌ Error saving AI blog:', error);
                        alert('Fout bij opslaan: ' + error.message + '\n\nJe kunt de blog handmatig aanpassen en opslaan.');
                    }
                }, 500);
            }, 100);
        }, 300);
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

// Close modals
function closeBlogModal() {
    const modal = document.getElementById('blog-modal');
    if (modal) {
        modal.classList.add('hidden');
    }

    // Reset form
    const form = document.getElementById('blog-form');
    if (form) {
        form.reset();
    }

    editingBlogId = null;
}

function closeAIModal() {
    const modal = document.getElementById('ai-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Open modals
function openBlogModal() {
    const modal = document.getElementById('blog-modal');
    if (modal) {
        modal.classList.remove('hidden');
    }

    // Reset for new blog
    editingBlogId = null;
    const form = document.getElementById('blog-form');
    if (form) {
        form.reset();
    }

    // Set default date
    const today = new Date().toISOString().split('T')[0];
    const dateField = document.getElementById('blog-date');
    if (dateField) {
        dateField.value = today;
    }
}

function openAIModal() {
    const modal = document.getElementById('ai-modal');
    if (modal) {
        modal.classList.remove('hidden');
    }
}

// Edit blog
async function editBlog(blogId) {
    try {
        console.log('📝 Loading blog for edit:', blogId);

        const { data, error } = await window.supabaseClient
            .from('blogs')
            .select('*')
            .eq('id', blogId)
            .single();

        if (error) throw error;

        if (!data) {
            alert('Blog niet gevonden');
            return;
        }

        // Set editing ID
        editingBlogId = blogId;

        // Open modal
        openBlogModal();

        // Fill form with blog data
        setTimeout(() => {
            const setValueIfExists = (id, value) => {
                const el = document.getElementById(id);
                if (el) el.value = value || '';
            };

            setValueIfExists('blog-title', data.title);
            setValueIfExists('blog-slug', data.slug);
            setValueIfExists('blog-author', data.author);
            setValueIfExists('blog-category', data.category);
            setValueIfExists('blog-date', data.date ? data.date.split('T')[0] : '');
            setValueIfExists('blog-excerpt', data.excerpt);
            setValueIfExists('blog-content', data.content);
            setValueIfExists('blog-image', data.image);

            if (data.tags && Array.isArray(data.tags)) {
                setValueIfExists('blog-tags', data.tags.join(', '));
            }

            // Update modal title
            const modalTitle = document.getElementById('modal-title');
            if (modalTitle) {
                modalTitle.textContent = 'Artikel bewerken';
            }
        }, 100);

    } catch (error) {
        console.error('Error loading blog:', error);
        alert('Fout bij laden: ' + error.message);
    }
}

// Delete blog
async function deleteBlog(blogId) {
    if (!confirm('Weet je zeker dat je dit artikel wilt verwijderen?')) {
        return;
    }

    try {
        console.log('🗑️ Deleting blog:', blogId);

        const { error } = await window.supabaseClient
            .from('blogs')
            .delete()
            .eq('id', blogId);

        if (error) throw error;

        console.log('✅ Blog deleted successfully');

        // Reload the list
        loadExistingBlogs();

        alert('Blog succesvol verwijderd!');
    } catch (error) {
        console.error('Error deleting blog:', error);
        alert('Fout bij verwijderen: ' + error.message);
    }
}

// Make functions globally available
window.closeBlogModal = closeBlogModal;
window.closeAIModal = closeAIModal;
window.openBlogModal = openBlogModal;
window.openAIModal = openAIModal;
window.handleImageUpload = handleImageUpload;
window.handleAIImageUpload = handleAIImageUpload;
window.editBlog = editBlog;
window.deleteBlog = deleteBlog;

// Aliases for HTML onclick handlers
window.showAddBlogForm = openBlogModal;
window.showAIGenerator = openAIModal;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Load existing blogs
    loadExistingBlogs();

    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    const dateField = document.getElementById('blog-date');
    if (dateField) {
        dateField.value = today;
    }

    // Blog form submit handler
    const blogForm = document.getElementById('blog-form');
    if (blogForm) {
        console.log('✅ Blog form found, attaching submit handler');
        blogForm.addEventListener('submit', submitBlog);
    } else {
        console.error('❌ Blog form NOT found!');
    }

    // AI form submit handler
    const aiForm = document.getElementById('ai-form');
    if (aiForm) {
        console.log('✅ AI form found, attaching submit handler');
        aiForm.addEventListener('submit', function(e) {
            e.preventDefault();
            generateWithAI();
        });
    } else {
        console.error('❌ AI form NOT found!');
    }

    // Also make functions globally available for debugging
    window.submitBlog = submitBlog;
    window.generateWithAI = generateWithAI;

    // Tag input enter key
    const tagInput = document.getElementById('tag-input');
    if (tagInput) {
        tagInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                addTag();
            }
        });
    }
});
