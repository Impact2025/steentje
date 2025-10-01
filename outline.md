# Project Overzicht - Steentje bij Steentje Website

## Bestandsstructuur
```
/mnt/okcomputer/output/
├── index.html                 # Homepage met hero, intro, hoe het werkt
├── over-ons.html             # Over ons pagina met team informatie
├── werkwijze.html            # Gedetailleerde uitleg werkwijze
├── ervaringen.html           # Testimonials en ervaringen
├── plan-sessie.html          # Boekingsformulier en contact
├── main.js                   # Hoofd JavaScript file
├── resources/                # Assets folder
│   ├── hero-lego-couple.jpg  # Hero afbeelding LEGO en koppel
│   ├── logo-steentje.png     # Logo Steentje bij Steentje
│   ├── step1-bouwen.jpg      # Visual stap 1: Bouwen
│   ├── step2-vertellen.jpg   # Visual stap 2: Vertellen
│   ├── step3-verbinden.jpg   # Visual stap 3: Verbinden
│   ├── testimonial-1.jpg     # Foto testimonial koppel 1
│   ├── testimonial-2.jpg     # Foto testimonial koppel 2
│   ├── testimonial-3.jpg     # Foto testimonial koppel 3
│   ├── lego-blocks.jpg       # LEGO blokjes voor waarom LEGO sectie
│   └── coach-portrait.jpg    # Portret van de coach
├── interaction.md            # Interactief ontwerpplan
├── design.md                 # Design plan en stijlrichtlijnen
└── outline.md               # Dit project overzicht
```

## Pagina Structuur

### Index.html - Homepage
**Secties:**
1. **Navigation Bar** - Sticky header met logo en menu
2. **Hero Section** - Grote hero foto met LEGO en koppel, logo, slogan, CTA button
3. **Introductie Sectie** - Korte uitleg over Steentje bij Steentje
4. **Hoe het werkt** - 3 stappen met visuals: Bouwen → Vertellen → Verbinden
5. **Waarom LEGO® Serious Play** - Speelse uitleg met iconen/blokjes
6. **Ervaringen Carousel** - Testimonials van koppels met foto's
7. **Call-to-Action** - "Zet de eerste stap, plan een sessie vandaag nog"
8. **Footer** - Contactgegevens, locatie, social media, LEGO disclaimer

### Over-ons.html - Over ons
**Inhoud:**
- Persoonlijk verhaal van de coach
- Visie en missie
- Achtergrond en certificeringen
- Foto van de coach
- Waarom LEGO® Serious Play werkt

### Werkwijze.html - Gedetailleerde werkwijze
**Inhoud:**
- Uitgebreide uitleg van de 3-stappen methode
- Wat te verwachten tijdens een sessie
- Duur en opzet van trajecten
- Voorbereiding en nazorg
- Veelgestelde vragen

### Ervaringen.html - Testimonials
**Inhoud:**
- Uitgebreide verhalen van koppels
- Video testimonials (placeholder)
- Resultaten en transformaties
- Reviews en ratings
- Before/after verhalen

### Plan-sessie.html - Boekingsformulier
**Inhoud:**
- Interactieve boekingsplanner
- Kalender widget voor beschikbare data
- Contactformulier
- Prijsinformatie
- Locatie details
- Voorbereiding tips

## Technische Implementatie

### Core Libraries
- **Anime.js**: Smooth animations and transitions
- **Splide.js**: Testimonial carousel
- **ECharts.js**: Data visualization for results
- **p5.js**: LEGO building simulator
- **Typed.js**: Typewriter effect for hero slogan
- **Splitting.js**: Text reveal animations

### Interactive Features
1. **LEGO Building Simulator**: 3D interactive LEGO building experience
2. **Testimonial Carousel**: Video testimonials with smooth transitions
3. **Booking Planner**: Multi-step booking form with progress indicator
4. **Animated Counters**: Statistics and results visualization
5. **Smooth Scroll**: Navigation with section highlighting
6. **Mobile Menu**: Slide-out navigation for mobile

### Responsive Design
- Mobile-first approach
- Breakpoints: 320px, 768px, 1024px, 1440px
- Touch-friendly interactions
- Optimized images for different screen sizes
- Flexible grid layouts

### Performance Optimization
- Lazy loading for images
- Minified CSS and JavaScript
- Optimized animations (60fps)
- Progressive enhancement
- Fast loading times

## Content Strategy

### Tone of Voice
- Warm en uitnodigend
- Professioneel maar toegankelijk
- Positief en hoopvol
- Focus op verbinding en groei

### Visual Storytelling
- Emotionele hero afbeelding
- Before/after verhalen
- Proces visualisaties
- Echte foto's van koppels
- LEGO metaforen

### Call-to-Actions
- "Plan een sessie" (primair)
- "Lees meer ervaringen" (secundair)
- "Ontdek de werkwijze" (tertiair)
- "Neem contact op" (footer)

## SEO en Toegankelijkheid

### SEO
- Semantische HTML structuur
- Meta descriptions
- Alt teksten voor afbeeldingen
- Schema.org markup
- Snelle laadtijden

### Toegankelijkheid
- WCAG 2.1 AA compliant
- Keyboard navigatie
- Screen reader vriendelijk
- Hoge contrast ratio's
- Focus indicators

## Deployment
- Static website hosting
- CDN voor afbeeldingen
- HTTPS beveiliging
- Performance monitoring
- Regular updates en maintenance