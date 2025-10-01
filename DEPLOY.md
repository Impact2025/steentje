# 🚀 Deployment Guide - Vercel + Supabase

## Stap 1: Vercel Account & Deployment

1. **Maak Vercel account aan**
   - Ga naar https://vercel.com
   - Klik op "Sign Up"
   - Kies "Continue with GitHub" (aangeraden)

2. **Deploy je website**

   **Optie A: Via Git (aangeraden)**
   - Maak GitHub repository aan
   - Upload je website bestanden naar GitHub
   - In Vercel: klik "Add New Project"
   - Importeer je GitHub repository
   - Klik "Deploy"
   - Klaar! Je website is live op `[jouw-project].vercel.app`

   **Optie B: Via Vercel CLI**
   ```bash
   npm i -g vercel
   cd C:\Users\v_mun\.claude\projects\Website Kimi
   vercel
   ```

## Stap 2: Supabase Database Setup

1. **Maak Supabase account aan**
   - Ga naar https://supabase.com
   - Klik "Start your project"
   - Sign up met GitHub

2. **Maak nieuw project**
   - Klik "New Project"
   - Project naam: `steentje-bij-steentje`
   - Database wachtwoord: (kies een sterk wachtwoord en bewaar het!)
   - Region: `Europe West (Frankfurt)` of `Europe Central (Frankfurt)`
   - Klik "Create new project"
   - ⏱️ Wacht 2-3 minuten tot database klaar is

3. **Maak blogs tabel**
   - Klik links op "Table Editor"
   - Klik "Create a new table"
   - Table name: `blogs`
   - Voeg deze kolommen toe:

     | Column name | Type      | Default value       | Extra settings        |
     |-------------|-----------|---------------------|-----------------------|
     | id          | uuid      | uuid_generate_v4()  | Primary key           |
     | title       | text      | -                   | Not null              |
     | slug        | text      | -                   | Not null, Unique      |
     | author      | text      | -                   | Not null              |
     | category    | text      | -                   | Not null              |
     | date        | date      | now()               | Not null              |
     | excerpt     | text      | -                   | Not null              |
     | content     | text      | -                   | Not null              |
     | image       | text      | -                   | Nullable              |
     | tags        | text[]    | '{}'                | Array of text         |
     | created_at  | timestamp | now()               | Default value: now()  |

   - Klik "Save"

4. **Schakel Row Level Security uit (voor development)**
   - Klik op je `blogs` tabel
   - Klik rechts op "RLS" tabblad
   - Klik "Disable RLS"

   ⚠️ **Let op:** Voor productie wil je RLS enabled met policies!

## Stap 3: Configureer Supabase in je Code

1. **Haal je Supabase credentials op**
   - In Supabase, klik links op het tandwiel ⚙️ (Settings)
   - Klik "API"
   - Kopieer:
     - **Project URL** (bijv. `https://abcdefghijk.supabase.co`)
     - **anon public** key (lange string)

2. **Update supabase-config.js**
   Open `supabase-config.js` en vervang:
   ```javascript
   const SUPABASE_URL = 'https://jouw-project-id.supabase.co';
   const SUPABASE_ANON_KEY = 'jouw-lange-anon-key-hier';
   ```

## Stap 4: Update HTML Bestanden

Update deze bestanden om Supabase te gebruiken:

**blogs.html** - Vervang:
```html
<script src="blog.js"></script>
```
Met:
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="supabase-config.js"></script>
<script src="blog-supabase.js"></script>
```

**blog-detail.html** - Vervang:
```html
<script src="blog-detail.js"></script>
```
Met:
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="supabase-config.js"></script>
<script src="blog-detail-supabase.js"></script>
```

**admin-blog.html** - Vervang:
```html
<script src="blog-admin.js"></script>
```
Met:
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="supabase-config.js"></script>
<script src="admin-blog-supabase.js"></script>
```

## Stap 5: Deploy naar Vercel

1. **Push je wijzigingen**
   ```bash
   git add .
   git commit -m "Add Supabase integration"
   git push
   ```

2. **Automatische deployment**
   - Vercel detecteert de wijzigingen
   - Bouwt en deployt automatisch
   - Je website is bijgewerkt!

## Stap 6: Custom Domain (steentjebijsteentje.nl)

1. **In Vercel**
   - Ga naar je project
   - Klik "Settings" → "Domains"
   - Voer in: `steentjebijsteentje.nl`
   - Klik "Add"

2. **DNS Instellingen bij je domain provider**
   - Vercel toont DNS instructies
   - Voeg deze records toe bij je domain provider:
     ```
     Type: A
     Name: @
     Value: 76.76.21.21

     Type: CNAME
     Name: www
     Value: cname.vercel-dns.com
     ```

3. **Wacht op propagatie**
   - DNS wijzigingen kunnen 24-48 uur duren
   - Vercel checkt automatisch
   - SSL certificaat wordt automatisch gegenereerd

## ✅ Checklist

- [ ] Vercel account aangemaakt
- [ ] Website gedeployed naar Vercel
- [ ] Supabase account aangemaakt
- [ ] Database project aangemaakt
- [ ] `blogs` tabel aangemaakt met juiste kolommen
- [ ] RLS uitgeschakeld (of policies ingesteld)
- [ ] Supabase credentials gekopieerd
- [ ] `supabase-config.js` bijgewerkt met echte credentials
- [ ] HTML bestanden bijgewerkt om Supabase scripts te gebruiken
- [ ] Wijzigingen gepushed naar GitHub
- [ ] Website automatisch gedeployed
- [ ] Custom domain geconfigureerd (optioneel)

## 🧪 Test je Setup

1. **Test blog overzicht**
   - Ga naar `[jouw-url].vercel.app/blogs.html`
   - Moet lege lijst tonen (nog geen blogs)

2. **Test blog admin**
   - Ga naar `[jouw-url].vercel.app/admin-blog.html`
   - Maak test blog aan
   - Controleer of het verschijnt in blog overzicht

3. **Test in Supabase**
   - Ga naar Supabase Table Editor
   - Open `blogs` tabel
   - Je test blog moet hier staan!

## 💰 Kosten

- ✅ Vercel: **€0/maand** (Hobby plan)
  - Unlimited websites
  - Automatic SSL
  - 100GB bandwidth/maand

- ✅ Supabase: **€0/maand** (Free plan)
  - 500MB database
  - 1GB file storage
  - 50,000 API requests/maand

**Totaal: €0/maand** 🎉

## 🆘 Hulp nodig?

- Vercel docs: https://vercel.com/docs
- Supabase docs: https://supabase.com/docs
- Supabase Table Editor: https://supabase.com/docs/guides/database/tables
