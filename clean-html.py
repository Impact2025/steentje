#!/usr/bin/env python3
"""
Clean HTML files - Remove problematic external JavaScript libraries
Keep only Tailwind CSS which works fine
"""

import os
import re

# Files to clean
FILES_TO_CLEAN = [
    'over-ons.html',
    'werkwijze.html',
    'ervaringen.html',
    'blogs.html',
    'blog-detail.html'
]

# Libraries to remove (keep Tailwind CSS)
LIBS_TO_REMOVE = [
    r'<script src="https://cdnjs\.cloudflare\.com/ajax/libs/animejs/.*?"></script>',
    r'<script src="https://cdnjs\.cloudflare\.com/ajax/libs/typed\.js/.*?"></script>',
    r'<script src="https://cdn\.jsdelivr\.net/npm/@splidejs/splide@.*?"></script>',
    r'<link href="https://cdn\.jsdelivr\.net/npm/@splidejs/splide@.*?" rel="stylesheet">',
    r'<script src="https://cdnjs\.cloudflare\.com/ajax/libs/echarts/.*?"></script>',
    r'<script src="https://cdnjs\.cloudflare\.com/ajax/libs/p5\.js/.*?"></script>',
    r'<script src="main\.js"></script>',
]

# Replace with safe version
SCRIPT_REPLACEMENT = '''    <script>
        // Mobile menu toggle
        document.addEventListener('DOMContentLoaded', function() {
            const mobileMenuBtn = document.getElementById('mobile-menu-btn');
            const mobileMenu = document.getElementById('mobile-menu');

            if (mobileMenuBtn && mobileMenu) {
                mobileMenuBtn.addEventListener('click', function() {
                    mobileMenu.classList.toggle('hidden');
                });
            }

            console.log('✅ Page loaded successfully');
        });
    </script>'''

def clean_html_file(filepath):
    """Remove problematic libraries from HTML file"""
    print(f"Cleaning {filepath}...")

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original_size = len(content)

        # Remove each library
        for pattern in LIBS_TO_REMOVE:
            content = re.sub(pattern, '', content, flags=re.MULTILINE)

        # Clean up extra whitespace/newlines
        content = re.sub(r'\n\s*\n\s*\n', '\n\n', content)

        # Add safe script before </body>
        if '<script src="main.js"></script>' not in content and SCRIPT_REPLACEMENT not in content:
            content = content.replace('</body>', f'{SCRIPT_REPLACEMENT}\n</body>')

        # Save cleaned version
        output_path = filepath.replace('.html', '-clean.html')
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(content)

        new_size = len(content)
        saved = original_size - new_size

        print(f"  ✅ Saved to {output_path}")
        print(f"  📉 Removed {saved} bytes ({saved/original_size*100:.1f}%)")

        return True

    except Exception as e:
        print(f"  ❌ Error: {e}")
        return False

def main():
    """Clean all HTML files"""
    print("🧹 Starting HTML cleanup...\n")

    base_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(base_dir)

    success_count = 0

    for filename in FILES_TO_CLEAN:
        if os.path.exists(filename):
            if clean_html_file(filename):
                success_count += 1
        else:
            print(f"⚠️  File not found: {filename}")

    print(f"\n✅ Cleaned {success_count}/{len(FILES_TO_CLEAN)} files")
    print("\nUpload the -clean.html files to your server!")

if __name__ == '__main__':
    main()
