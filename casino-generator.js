#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

class CasinoSiteGenerator {
    constructor(domain) {
        this.domain = domain;
        this.siteName = this.generateSiteName();
        this.config = this.generateSiteConfig();
        this.apiToken = '6neGxBm3O8L6Wy2ZbD0xykkFwtaDi653SH7RanMSLtEPDE1V5f';
        this.gameData = null;
        this.cssNaming = this.generateCSSNaming();
        this.domStructure = this.generateDOMStructure();
    }

    // Generate random site configuration
    generateSiteConfig() {
        const frameworks = [
            'tailwind', 'bootstrap', 'bulma', 'foundation', 
            'materialize', 'pure', 'semantic', 'uikit', 'skeleton', 'custom'
        ];
        
        const colorSchemes = [
            { name: 'vegas', primary: '#dc2626', secondary: '#1f2937', accent: '#fbbf24' },
            { name: 'neon', primary: '#8b5cf6', secondary: '#1e40af', accent: '#ec4899' },
            { name: 'royal', primary: '#6b21a8', secondary: '#1c1917', accent: '#fbbf24' },
            { name: 'digital', primary: '#0d9488', secondary: '#ea580c', accent: '#f8fafc' },
            { name: 'dark', primary: '#111827', secondary: '#4b5563', accent: '#06b6d4' }
        ];

        const navigationTypes = ['traditional', 'centered', 'sidebar', 'sticky', 'mega'];
        const heroTypes = ['fullscreen', 'split', 'centered', 'slider', 'interactive'];
        const featuredGameLayouts = ['card-grid', 'carousel', 'masonry', 'list', 'hexagonal'];
        const newGameLayouts = ['ribbon', 'spotlight', 'ticker', 'grid-dates', 'timeline'];
        const aboutSectionTypes = ['text-icons', 'video', 'statistics', 'testimonials', 'interactive'];
        const footerTypes = ['mega', 'minimal', 'accordion', 'map-style', 'dark'];
        const gamesPageLayouts = ['grid', 'list', 'card-flip', 'magazine', 'masonry'];
        const gamePageLayouts = ['centered', 'sidebar', 'tabbed', 'fullscreen', 'hero'];
        const aboutPageLayouts = ['timeline', 'team-grid', 'split-screen', 'story', 'video-bg'];
        const contactPageLayouts = ['contact-form', 'email-display', 'split-layout', 'faq-contact', 'map-integration'];
        const legalPageLayouts = ['sidebar-toc', 'accordion', 'single-column', 'tab-navigation', 'floating-toc'];

        return {
            framework: frameworks[Math.floor(Math.random() * frameworks.length)],
            colorScheme: colorSchemes[Math.floor(Math.random() * colorSchemes.length)],
            navigation: navigationTypes[Math.floor(Math.random() * navigationTypes.length)],
            hero: heroTypes[Math.floor(Math.random() * heroTypes.length)],
            featuredGamesLayout: featuredGameLayouts[Math.floor(Math.random() * featuredGameLayouts.length)],
            newGamesLayout: newGameLayouts[Math.floor(Math.random() * newGameLayouts.length)],
            aboutSection: aboutSectionTypes[Math.floor(Math.random() * aboutSectionTypes.length)],
            footer: footerTypes[Math.floor(Math.random() * footerTypes.length)],
            gamesPageLayout: gamesPageLayouts[Math.floor(Math.random() * gamesPageLayouts.length)],
            gamePageLayout: gamePageLayouts[Math.floor(Math.random() * gamePageLayouts.length)],
            aboutPageLayout: aboutPageLayouts[Math.floor(Math.random() * aboutPageLayouts.length)],
            contactPageLayout: contactPageLayouts[Math.floor(Math.random() * contactPageLayouts.length)],
            legalPageLayout: legalPageLayouts[Math.floor(Math.random() * legalPageLayouts.length)],
            inlineCSS: Math.random() > 0.5,
            useWebP: Math.random() > 0.3,
            stylingApproach: Math.floor(Math.random() * 5) + 1 // 1-5 for different styling approaches
        };
    }

    // Generate CSS naming convention
    generateCSSNaming() {
        const conventions = ['bem', 'atomic', 'semantic', 'abbreviated', 'prefixed'];
        const prefixes = ['sc', 'casino', 'game', 'slot', 'ui'];
        
        return {
            type: conventions[Math.floor(Math.random() * conventions.length)],
            prefix: prefixes[Math.floor(Math.random() * prefixes.length)]
        };
    }

    // Generate DOM structure type
    generateDOMStructure() {
        return Math.random() > 0.5 ? 'semantic' : 'generic';
    }

    // Generate class names based on naming convention
    generateClassName(base, modifier = '') {
        const { type, prefix } = this.cssNaming;
        
        switch (type) {
            case 'bem':
                return modifier ? `${base}__${modifier}` : base;
            case 'atomic':
                return `${prefix}-${base}${modifier ? '-' + modifier : ''}`;
            case 'semantic':
                return `${base}${modifier ? '-' + modifier : ''}`;
            case 'abbreviated':
                const abbrev = base.split('-').map(word => word.substring(0, 3)).join('');
                return `${abbrev}${modifier ? '-' + modifier.substring(0, 3) : ''}`;
            case 'prefixed':
                return `${prefix}-${base}${modifier ? '-' + modifier : ''}`;
            default:
                return base;
        }
    }

    // Generate random site name
    generateSiteName() {
        const adjectives = ['Lucky', 'Golden', 'Royal', 'Diamond', 'Vegas', 'Supreme', 'Elite', 'Premium', 'Silver', 'Mega'];
        const terms = ['Spin', 'Dice', 'Flush', 'Slots', 'Dreams', 'Fortune', 'Jackpot', 'Palace', 'Crown', 'Win'];
        const suffixes = ['Casino', 'Games', 'Club', 'Palace', 'Arena'];
        
        const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
        const term = terms[Math.floor(Math.random() * terms.length)];
        const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
        
        return `${adj} ${term} ${suffix}`;
    }

    // Fetch games from SlotsLaunch API
    async fetchGames() {
        return new Promise((resolve) => {
            const options = {
                hostname: 'slotslaunch.com',
                path: '/api/games?published=1&per_page=150',
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.apiToken}`,
                    'Origin': this.domain
                }
            };

            const req = https.request(options, (res) => {
                let data = '';
                res.on('data', (chunk) => data += chunk);
                res.on('end', () => {
                    console.log(`API Response status: ${res.statusCode}`);
                    
                    if (res.statusCode !== 200) {
                        console.error(`API Error: ${res.statusCode} - ${data}`);
                        this.gameData = this.getFallbackGames();
                        resolve(this.gameData);
                        return;
                    }
                    
                    try {
                        const response = JSON.parse(data);
                        console.log('API Response structure:', Object.keys(response));
                        
                        let games = response.data || response.games || response;
                        if (!Array.isArray(games)) {
                            console.log('Full response:', response);
                            games = [];
                        }
                        
                        this.gameData = games.filter(game => game.published === 1 || game.published === true);
                        console.log(`Loaded ${this.gameData.length} published games`);
                        
                        if (this.gameData.length === 0) {
                            console.log('No games from API, using fallback games');
                            this.gameData = this.getFallbackGames();
                        }
                        
                        resolve(this.gameData);
                    } catch (err) {
                        console.error('API parsing error:', err);
                        console.error('Raw response:', data.substring(0, 500));
                        this.gameData = this.getFallbackGames();
                        resolve(this.gameData);
                    }
                });
            });

            req.on('error', (err) => {
                console.error('API request error:', err.message);
                this.gameData = this.getFallbackGames();
                resolve(this.gameData);
            });
            req.end();
        });
    }

    // Fallback games data
    getFallbackGames() {
        return [
            {
                id: 1, name: "Starburst", slug: "starburst", provider: "NetEnt", type: "Slot", published: 1,
                thumb: "https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=Starburst",
                description: "Classic slot game with expanding wilds", updated_at: "2024-01-15T10:00:00Z"
            },
            {
                id: 2, name: "Book of Dead", slug: "book-of-dead", provider: "Play'n GO", type: "Slot", published: 1,
                thumb: "https://via.placeholder.com/300x200/4ECDC4/FFFFFF?text=Book+of+Dead",
                description: "Adventure-themed slot with free spins", updated_at: "2024-01-14T15:30:00Z"
            },
            {
                id: 3, name: "Gonzo's Quest", slug: "gonzos-quest", provider: "NetEnt", type: "Slot", published: 1,
                thumb: "https://via.placeholder.com/300x200/45B7D1/FFFFFF?text=Gonzo%27s+Quest",
                description: "Avalanche feature slot with multipliers", updated_at: "2024-01-13T09:45:00Z"
            },
            {
                id: 4, name: "Mega Moolah", slug: "mega-moolah", provider: "Microgaming", type: "Slot", published: 1,
                thumb: "https://via.placeholder.com/300x200/F7DC6F/FFFFFF?text=Mega+Moolah",
                description: "Progressive jackpot slot", updated_at: "2024-01-12T14:20:00Z"
            },
            {
                id: 5, name: "Reactoonz", slug: "reactoonz", provider: "Play'n GO", type: "Slot", published: 1,
                thumb: "https://via.placeholder.com/300x200/BB8FCE/FFFFFF?text=Reactoonz",
                description: "Cluster pays slot with cascading reels", updated_at: "2024-01-11T11:15:00Z"
            },
            {
                id: 6, name: "Dead or Alive 2", slug: "dead-or-alive-2", provider: "NetEnt", type: "Slot", published: 1,
                thumb: "https://via.placeholder.com/300x200/85C1E9/FFFFFF?text=Dead+or+Alive+2",
                description: "Western-themed high volatility slot", updated_at: "2024-01-10T16:00:00Z"
            },
            {
                id: 7, name: "Blackjack Classic", slug: "blackjack-classic", provider: "Evolution", type: "Table Game", published: 1,
                thumb: "https://via.placeholder.com/300x200/58D68D/FFFFFF?text=Blackjack",
                description: "Classic blackjack table game", updated_at: "2024-01-09T12:30:00Z"
            },
            {
                id: 8, name: "European Roulette", slug: "european-roulette", provider: "Evolution", type: "Table Game", published: 1,
                thumb: "https://via.placeholder.com/300x200/F1948A/FFFFFF?text=Roulette",
                description: "European roulette with single zero", updated_at: "2024-01-08T13:45:00Z"
            },
            {
                id: 9, name: "Immortal Romance", slug: "immortal-romance", provider: "Microgaming", type: "Slot", published: 1,
                thumb: "https://via.placeholder.com/300x200/D7BDE2/FFFFFF?text=Immortal+Romance",
                description: "Vampire-themed slot with multiple bonus features", updated_at: "2024-01-07T10:20:00Z"
            },
            {
                id: 10, name: "Thunderstruck II", slug: "thunderstruck-ii", provider: "Microgaming", type: "Slot", published: 1,
                thumb: "https://via.placeholder.com/300x200/AED6F1/FFFFFF?text=Thunderstruck+II",
                description: "Norse mythology themed slot", updated_at: "2024-01-06T14:10:00Z"
            }
        ];
    }

    // Get featured games (5 random)
    getFeaturedGames() {
        if (!this.gameData || this.gameData.length === 0) return [];
        const shuffled = [...this.gameData].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 5);
    }

    // Get new games (5 most recent)
    getNewGames() {
        if (!this.gameData || this.gameData.length === 0) return [];
        const sorted = [...this.gameData].sort((a, b) => 
            new Date(b.updated_at) - new Date(a.updated_at)
        );
        const featured = this.getFeaturedGames();
        const filtered = sorted.filter(game => !featured.some(f => f.id === game.id));
        return filtered.slice(0, 5);
    }

    // Create directory structure
    createDirectoryStructure(outputDir) {
        const dirs = [
            outputDir,
            path.join(outputDir, 'css'),
            path.join(outputDir, 'js'),
            path.join(outputDir, 'images'),
            path.join(outputDir, 'images', 'games')
        ];

        dirs.forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });
    }

    // Download game thumbnails
    async downloadThumbnail(game, outputDir) {
        if (!game.thumb) return null;

        const filename = `${game.slug}-${game.id}.jpg`;
        const filepath = path.join(outputDir, 'images', 'games', filename);

        return new Promise((resolve) => {
            https.get(game.thumb, (res) => {
                if (res.statusCode === 200) {
                    const fileStream = fs.createWriteStream(filepath);
                    res.pipe(fileStream);
                    fileStream.on('finish', () => {
                        fileStream.close();
                        resolve(filename);
                    });
                } else {
                    resolve(null);
                }
            }).on('error', () => resolve(null));
        });
    }

    // Generate enhanced CSS
    generateCSS() {
        const { framework, colorScheme } = this.config;
        const navClass = this.generateClassName('nav');
        const heroClass = this.generateClassName('hero');
        const cardClass = this.generateClassName('card');
        const btnClass = this.generateClassName('btn');
        
        if (framework === 'custom') {
            return `
/* Enhanced Custom CSS Framework */
* { margin: 0; padding: 0; box-sizing: border-box; }
body { 
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
    line-height: 1.6;
    color: #333;
}

/* Layout */
.${this.generateClassName('container')} { 
    max-width: 1200px; 
    margin: 0 auto; 
    padding: 0 20px; 
}
.${this.generateClassName('container', 'fluid')} { 
    max-width: 100%; 
    padding: 0 15px; 
}

/* Buttons */
.${btnClass} { 
    padding: 12px 24px; 
    border: none; 
    border-radius: 6px; 
    cursor: pointer; 
    font-weight: 600; 
    text-decoration: none;
    display: inline-block;
    transition: all 0.3s ease;
}
.${btnClass}:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
.${this.generateClassName('btn', 'primary')} { background: ${colorScheme.primary}; color: white; }
.${this.generateClassName('btn', 'secondary')} { background: ${colorScheme.secondary}; color: white; }
.${this.generateClassName('btn', 'accent')} { background: ${colorScheme.accent}; color: #333; }

/* Cards */
.${cardClass} { 
    background: white; 
    border-radius: 8px; 
    box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
    overflow: hidden; 
    transition: all 0.3s ease;
}
.${cardClass}:hover { 
    transform: translateY(-5px); 
    box-shadow: 0 8px 25px rgba(0,0,0,0.15); 
}

/* Grid Systems */
.${this.generateClassName('grid')} { display: grid; gap: 20px; }
.${this.generateClassName('grid', '3')} { grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); }
.${this.generateClassName('grid', '4')} { grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); }
.${this.generateClassName('grid', '5')} { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }

/* Flexbox */
.${this.generateClassName('flex')} { display: flex; }
.${this.generateClassName('flex', 'center')} { justify-content: center; align-items: center; }
.${this.generateClassName('flex', 'between')} { justify-content: space-between; align-items: center; }
.${this.generateClassName('flex', 'wrap')} { flex-wrap: wrap; }

/* Navigation */
.${navClass} { 
    background: ${colorScheme.secondary}; 
    padding: 1rem 0; 
    position: relative;
    z-index: 1000;
}
.${this.generateClassName('nav', 'sticky')} { 
    position: fixed; 
    top: 0; 
    width: 100%; 
    transition: all 0.3s ease; 
}
.${this.generateClassName('nav', 'list')} { 
    list-style: none; 
    display: flex; 
    gap: 2rem; 
    margin: 0; 
    padding: 0;
}
.${this.generateClassName('nav', 'link')} { 
    color: white; 
    text-decoration: none; 
    font-weight: 500; 
    transition: color 0.3s ease;
}
.${this.generateClassName('nav', 'link')}:hover { color: ${colorScheme.accent}; }

/* Hero Section */
.${heroClass} { 
    background: linear-gradient(135deg, ${colorScheme.primary}, ${colorScheme.secondary}); 
    color: white; 
    padding: 100px 0; 
    text-align: center; 
    position: relative;
    overflow: hidden;
}
.${this.generateClassName('hero', 'fullscreen')} { 
    min-height: 100vh; 
    display: flex; 
    align-items: center; 
}
.${this.generateClassName('hero', 'split')} { 
    display: grid; 
    grid-template-columns: 1fr 1fr; 
    gap: 2rem; 
    align-items: center; 
}

/* Game Cards */
.${this.generateClassName('game', 'card')} { 
    transition: transform 0.3s ease; 
    cursor: pointer;
}
.${this.generateClassName('game', 'card')}:hover { 
    transform: translateY(-8px); 
}
.${this.generateClassName('game', 'image')} { 
    width: 100%; 
    height: 200px; 
    object-fit: cover; 
}
.${this.generateClassName('game', 'info')} { 
    padding: 1rem; 
}
.${this.generateClassName('game', 'title')} { 
    font-size: 1.1rem; 
    font-weight: 600; 
    margin-bottom: 0.5rem; 
}
.${this.generateClassName('game', 'provider')} { 
    color: #666; 
    font-size: 0.9rem; 
    margin-bottom: 1rem; 
}

/* Footer */
.${this.generateClassName('footer')} { 
    background: ${colorScheme.secondary}; 
    color: white; 
    padding: 3rem 0; 
}
.${this.generateClassName('footer', 'mega')} { 
    padding: 4rem 0; 
}
.${this.generateClassName('footer', 'grid')} { 
    display: grid; 
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
    gap: 2rem; 
    margin-bottom: 2rem; 
}
.${this.generateClassName('footer', 'link')} { 
    color: #ccc; 
    text-decoration: none; 
    transition: color 0.3s ease;
}
.${this.generateClassName('footer', 'link')}:hover { color: ${colorScheme.accent}; }

/* Animations */
@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
}
@keyframes slideIn {
    from { transform: translateX(-100%); }
    to { transform: translateX(0); }
}
@keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-10px); }
    60% { transform: translateY(-5px); }
}

.${this.generateClassName('animate', 'fade-in')} { animation: fadeInUp 0.6s ease-out; }
.${this.generateClassName('animate', 'slide-in')} { animation: slideIn 0.5s ease-out; }
.${this.generateClassName('animate', 'bounce')} { animation: bounce 1s ease-in-out; }

/* Responsive Design */
@media (max-width: 768px) {
    .${this.generateClassName('container')} { padding: 0 15px; }
    .${heroClass} { padding: 60px 0; }
    .${this.generateClassName('hero', 'split')} { grid-template-columns: 1fr; }
    .${this.generateClassName('nav', 'list')} { flex-direction: column; gap: 1rem; }
    .${this.generateClassName('grid', '3')}, 
    .${this.generateClassName('grid', '4')}, 
    .${this.generateClassName('grid', '5')} { 
        grid-template-columns: 1fr; 
    }
}

@media (max-width: 480px) {
    .${heroClass} { padding: 40px 0; }
    .${heroClass} h1 { font-size: 2rem !important; }
    .${btnClass} { padding: 10px 20px; font-size: 0.9rem; }
}

/* Utility Classes */
.${this.generateClassName('text', 'center')} { text-align: center; }
.${this.generateClassName('text', 'left')} { text-align: left; }
.${this.generateClassName('text', 'right')} { text-align: right; }
.${this.generateClassName('mb', '1')} { margin-bottom: 0.5rem; }
.${this.generateClassName('mb', '2')} { margin-bottom: 1rem; }
.${this.generateClassName('mb', '3')} { margin-bottom: 1.5rem; }
.${this.generateClassName('mb', '4')} { margin-bottom: 2rem; }
.${this.generateClassName('mt', '1')} { margin-top: 0.5rem; }
.${this.generateClassName('mt', '2')} { margin-top: 1rem; }
.${this.generateClassName('mt', '3')} { margin-top: 1.5rem; }
.${this.generateClassName('mt', '4')} { margin-top: 2rem; }
.${this.generateClassName('p', '1')} { padding: 0.5rem; }
.${this.generateClassName('p', '2')} { padding: 1rem; }
.${this.generateClassName('p', '3')} { padding: 1.5rem; }
.${this.generateClassName('p', '4')} { padding: 2rem; }
`;
        }

        return '';
    }

    // Generate navigation HTML with variations
    generateNavigation() {
        const { navigation } = this.config;
        const navClass = this.generateClassName('nav');
        const containerClass = this.generateClassName('container');
        const navListClass = this.generateClassName('nav', 'list');
        const navLinkClass = this.generateClassName('nav', 'link');
        
        const navItems = [
            { text: 'Home', href: 'index.html' },
            { text: 'Games', href: 'games.html' },
            { text: 'About', href: 'about.html' },
            { text: 'Contact', href: 'contact.html' }
        ];

        const legalItems = [
            { text: 'Terms', href: 'terms.html' },
            { text: 'Privacy', href: 'privacy.html' },
            { text: 'Cookies', href: 'cookies.html' },
            { text: 'Responsible Gaming', href: 'responsible-gaming.html' }
        ];

        switch (navigation) {
            case 'traditional':
                if (this.domStructure === 'semantic') {
                    return `
<header>
    <nav class="${navClass}">
        <div class="${containerClass}">
            <div class="${this.generateClassName('flex', 'between')}">
                <h2 class="${this.generateClassName('logo')}">${this.siteName}</h2>
                <ul class="${navListClass}">
                    ${navItems.map(item => `<li><a href="${item.href}" class="${navLinkClass}">${item.text}</a></li>`).join('')}
                </ul>
            </div>
        </div>
    </nav>
</header>`;
                } else {
                    return `
<div class="${this.generateClassName('top', 'bar')}">
    <div class="${this.generateClassName('menu', 'wrapper')}">
        <div class="${this.generateClassName('flex', 'between')}">
            <div class="${this.generateClassName('site', 'title')}">${this.siteName}</div>
            <div class="${this.generateClassName('menu', 'list')}">
                ${navItems.map(item => `<div class="${this.generateClassName('menu', 'item')}"><a href="${item.href}">${item.text}</a></div>`).join('')}
            </div>
        </div>
    </div>
</div>`;
                }

            case 'centered':
                return `
<nav class="${navClass}">
    <div class="${containerClass} ${this.generateClassName('text', 'center')}">
        <h2 class="${this.generateClassName('mb', '2')}">${this.siteName}</h2>
        <ul class="${navListClass}" style="justify-content: center;">
            ${navItems.map(item => `<li><a href="${item.href}" class="${navLinkClass}">${item.text}</a></li>`).join('')}
        </ul>
    </div>
</nav>`;

            case 'sidebar':
                return `
<nav class="${navClass} ${this.generateClassName('nav', 'sidebar')}" id="sidebarNav">
    <div class="${this.generateClassName('sidebar', 'header')}">
        <h3>${this.siteName}</h3>
        <button onclick="toggleSidebar()" class="${this.generateClassName('sidebar', 'toggle')}">&times;</button>
    </div>
    <div class="${this.generateClassName('sidebar', 'content')}">
        <div class="${this.generateClassName('nav', 'group')}">
            <h4>Main Pages</h4>
            <ul class="${this.generateClassName('sidebar', 'list')}">
                ${navItems.map(item => `<li><a href="${item.href}" class="${navLinkClass}">${item.text}</a></li>`).join('')}
            </ul>
        </div>
        <div class="${this.generateClassName('nav', 'group')}">
            <h4>Legal</h4>
            <ul class="${this.generateClassName('sidebar', 'list')}">
                ${legalItems.map(item => `<li><a href="${item.href}" class="${navLinkClass}">${item.text}</a></li>`).join('')}
            </ul>
        </div>
    </div>
</nav>
<button class="${this.generateClassName('sidebar', 'toggle')} ${this.generateClassName('sidebar', 'mobile')}" onclick="toggleSidebar()">☰</button>
<style>
.${this.generateClassName('nav', 'sidebar')} {
    position: fixed;
    left: -300px;
    top: 0;
    width: 300px;
    height: 100vh;
    background: ${this.config.colorScheme.secondary};
    transition: left 0.3s ease;
    z-index: 1000;
    padding: 0;
}
.${this.generateClassName('nav', 'sidebar')}.active { left: 0; }
.${this.generateClassName('sidebar', 'mobile')} {
    position: fixed;
    top: 20px;
    left: 20px;
    z-index: 1001;
    background: ${this.config.colorScheme.primary};
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
}
</style>`;

            case 'sticky':
                return `
<nav class="${navClass} ${this.generateClassName('nav', 'sticky')}" id="stickyNav">
    <div class="${containerClass}">
        <div class="${this.generateClassName('flex', 'between')}">
            <h2 class="${this.generateClassName('logo')}">${this.siteName}</h2>
            <div class="${this.generateClassName('nav', 'content')}">
                <input type="search" placeholder="Search games..." class="${this.generateClassName('search', 'bar')}">
                <ul class="${navListClass}">
                    ${navItems.map(item => `<li><a href="${item.href}" class="${navLinkClass}">${item.text}</a></li>`).join('')}
                </ul>
            </div>
        </div>
    </div>
</nav>
<style>
.${this.generateClassName('search', 'bar')} {
    padding: 8px 12px;
    margin-right: 1rem;
    border: none;
    border-radius: 4px;
    background: rgba(255,255,255,0.1);
    color: white;
}
.${this.generateClassName('search', 'bar')}::placeholder { color: rgba(255,255,255,0.7); }
</style>`;

            case 'mega':
                return `
<nav class="${navClass}">
    <div class="${containerClass}">
        <div class="${this.generateClassName('flex', 'between')}">
            <h2 class="${this.generateClassName('logo')}">${this.siteName}</h2>
            <ul class="${navListClass}">
                <li class="${this.generateClassName('dropdown')}">
                    <a href="index.html" class="${navLinkClass}">Home</a>
                </li>
                <li class="${this.generateClassName('dropdown')}">
                    <a href="games.html" class="${navLinkClass}">Games ▼</a>
                    <div class="${this.generateClassName('dropdown', 'content')}">
                        <div class="${this.generateClassName('dropdown', 'grid')}">
                            <div>
                                <h4>Categories</h4>
                                <a href="games.html?type=slot">Slots</a>
                                <a href="games.html?type=table">Table Games</a>
                                <a href="games.html?type=poker">Video Poker</a>
                            </div>
                            <div>
                                <h4>Providers</h4>
                                <a href="games.html?provider=netent">NetEnt</a>
                                <a href="games.html?provider=microgaming">Microgaming</a>
                                <a href="games.html?provider=playngo">Play'n GO</a>
                            </div>
                        </div>
                    </div>
                </li>
                <li class="${this.generateClassName('dropdown')}">
                    <a href="about.html" class="${navLinkClass}">About ▼</a>
                    <div class="${this.generateClassName('dropdown', 'content')}">
                        <a href="about.html">About Us</a>
                        <a href="contact.html">Contact</a>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</nav>
<style>
.${this.generateClassName('dropdown')} { position: relative; }
.${this.generateClassName('dropdown', 'content')} {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    background: white;
    min-width: 300px;
    box-shadow: 0 8px 16px rgba(0,0,0,0.1);
    border-radius: 4px;
    padding: 1rem;
    z-index: 1000;
}
.${this.generateClassName('dropdown')}:hover .${this.generateClassName('dropdown', 'content')} { display: block; }
.${this.generateClassName('dropdown', 'grid')} { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.${this.generateClassName('dropdown', 'content')} a { display: block; padding: 0.5rem 0; color: #333; text-decoration: none; }
.${this.generateClassName('dropdown', 'content')} h4 { margin-bottom: 0.5rem; color: ${this.config.colorScheme.primary}; }
</style>`;

            default:
                return `
<nav class="${navClass}">
    <div class="${containerClass}">
        <div class="${this.generateClassName('flex', 'between')}">
            <h2>${this.siteName}</h2>
            <ul class="${navListClass}">
                ${navItems.map(item => `<li><a href="${item.href}" class="${navLinkClass}">${item.text}</a></li>`).join('')}
            </ul>
        </div>
    </div>
</nav>`;
        }
    }

    // Generate hero section with variations
    generateHero() {
        const { hero } = this.config;
        const heroClass = this.generateClassName('hero');
        const containerClass = this.generateClassName('container');
        const btnClass = this.generateClassName('btn', 'primary');
        
        const headlines = [
            `Welcome to ${this.siteName} - Play Free Casino Games!`,
            'Experience the Thrill of Vegas Online',
            'Your #1 Destination for Social Casino Fun',
            'Play, Win, Enjoy - No Download Required',
            'Discover 100+ Free Casino Games',
            'Spin, Play, Win - All for Fun!',
            'The Ultimate Social Casino Experience'
        ];

        const ctas = [
            'Play Now', 'Start Playing', 'Join the Fun', 'Explore Games',
            'Browse Collection', 'View All Games', 'Get Started', 'Play for Free',
            'Try Your Luck', 'Spin Now', 'Deal Me In', 'Roll the Dice'
        ];
        
        const headline = headlines[Math.floor(Math.random() * headlines.length)];
        const cta = ctas[Math.floor(Math.random() * ctas.length)];

        switch (hero) {
            case 'fullscreen':
                return `
<section class="${heroClass} ${this.generateClassName('hero', 'fullscreen')}" style="background-image: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1511193311914-0346f16efe90?w=1920&h=1080&fit=crop');">
    <div class="${containerClass}">
        <div class="${this.generateClassName('animate', 'fade-in')}">
            <h1 style="font-size: 4rem; margin-bottom: 1rem; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">${headline}</h1>
            <p style="font-size: 1.5rem; margin-bottom: 2rem; text-shadow: 1px 1px 2px rgba(0,0,0,0.5);">Experience premium casino entertainment with stunning graphics and immersive gameplay!</p>
            <div>
                <button class="${btnClass}" onclick="window.location.href='games.html'" style="margin-right: 1rem; font-size: 1.2rem; padding: 15px 30px;">${cta}</button>
                <button class="${this.generateClassName('btn', 'secondary')}" onclick="scrollToSection('featured')" style="font-size: 1.2rem; padding: 15px 30px;">Learn More</button>
            </div>
        </div>
    </div>
</section>`;

            case 'split':
                return `
<section class="${heroClass} ${this.generateClassName('hero', 'split')}">
    <div class="${containerClass}">
        <div class="${this.generateClassName('hero', 'split')}">
            <div class="${this.generateClassName('animate', 'slide-in')}">
                <h1 style="font-size: 3.5rem; margin-bottom: 1rem;">${headline}</h1>
                <p style="font-size: 1.25rem; margin-bottom: 2rem;">Join thousands of players enjoying our premium collection of casino games!</p>
                <button class="${btnClass}" onclick="window.location.href='games.html'" style="font-size: 1.1rem; padding: 15px 30px;">${cta}</button>
            </div>
            <div class="${this.generateClassName('hero', 'image')}">
                <img src="https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=600&h=400&fit=crop" alt="Casino Games" style="width: 100%; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
            </div>
        </div>
    </div>
</section>`;

            case 'centered':
                return `
<section class="${heroClass}" style="background: radial-gradient(circle at center, ${this.config.colorScheme.primary}, ${this.config.colorScheme.secondary});">
    <div class="${containerClass}">
        <div class="${this.generateClassName('animate', 'bounce')}">
            <h1 style="font-size: 3.5rem; margin-bottom: 1rem;">${headline}</h1>
            <p style="font-size: 1.25rem; margin-bottom: 2rem; max-width: 600px; margin-left: auto; margin-right: auto;">Discover hundreds of free casino games and play for unlimited fun!</p>
            <div class="${this.generateClassName('hero', 'floating-cards')}" style="margin: 2rem 0;">
                <div class="${this.generateClassName('floating', 'card')}" style="display: inline-block; margin: 0 10px; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 8px; animation: bounce 2s infinite;">🎰</div>
                <div class="${this.generateClassName('floating', 'card')}" style="display: inline-block; margin: 0 10px; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 8px; animation: bounce 2s infinite 0.5s;">🃏</div>
                <div class="${this.generateClassName('floating', 'card')}" style="display: inline-block; margin: 0 10px; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 8px; animation: bounce 2s infinite 1s;">🎲</div>
            </div>
            <button class="${btnClass}" onclick="window.location.href='games.html'" style="font-size: 1.2rem; padding: 15px 30px;">${cta}</button>
        </div>
    </div>
</section>`;

            case 'slider':
                return `
<section class="${heroClass}" style="padding: 0; height: 80vh; position: relative; overflow: hidden;">
    <div class="${this.generateClassName('hero', 'slider')}" id="heroSlider">
        <div class="${this.generateClassName('slide')} active" style="background: linear-gradient(135deg, #ff6b6b, #ee5a24); display: flex; align-items: center; justify-content: center; height: 100%; text-align: center;">
            <div>
                <h1 style="font-size: 3.5rem; margin-bottom: 1rem;">🎰 Slot Games</h1>
                <p style="font-size: 1.3rem; margin-bottom: 2rem;">Spin the reels and win big!</p>
                <button class="${btnClass}">Play Slots</button>
            </div>
        </div>
        <div class="${this.generateClassName('slide')}" style="background: linear-gradient(135deg, #4ecdc4, #44a08d); display: flex; align-items: center; justify-content: center; height: 100%; text-align: center;">
            <div>
                <h1 style="font-size: 3.5rem; margin-bottom: 1rem;">🃏 Table Games</h1>
                <p style="font-size: 1.3rem; margin-bottom: 2rem;">Classic casino table games!</p>
                <button class="${btnClass}">Play Tables</button>
            </div>
        </div>
        <div class="${this.generateClassName('slide')}" style="background: linear-gradient(135deg, #667eea, #764ba2); display: flex; align-items: center; justify-content: center; height: 100%; text-align: center;">
            <div>
                <h1 style="font-size: 3.5rem; margin-bottom: 1rem;">🎲 Live Games</h1>
                <p style="font-size: 1.3rem; margin-bottom: 2rem;">Real-time gaming action!</p>
                <button class="${btnClass}">Play Live</button>
            </div>
        </div>
    </div>
    <div class="${this.generateClassName('slider', 'controls')}">
        <button onclick="previousSlide()" class="${this.generateClassName('slider', 'btn')}">&lt;</button>
        <button onclick="nextSlide()" class="${this.generateClassName('slider', 'btn')}">&gt;</button>
    </div>
    <div class="${this.generateClassName('slider', 'dots')}">
        <span class="${this.generateClassName('dot')} active" onclick="currentSlide(1)"></span>
        <span class="${this.generateClassName('dot')}" onclick="currentSlide(2)"></span>
        <span class="${this.generateClassName('dot')}" onclick="currentSlide(3)"></span>
    </div>
</section>
<style>
.${this.generateClassName('slide')} { display: none; }
.${this.generateClassName('slide')}.active { display: flex; }
.${this.generateClassName('slider', 'controls')} { 
    position: absolute; 
    top: 50%; 
    width: 100%; 
    display: flex; 
    justify-content: space-between; 
    padding: 0 2rem; 
}
.${this.generateClassName('slider', 'btn')} { 
    background: rgba(255,255,255,0.3); 
    border: none; 
    color: white; 
    padding: 1rem; 
    border-radius: 50%; 
    cursor: pointer; 
    font-size: 1.5rem; 
}
.${this.generateClassName('slider', 'dots')} { 
    position: absolute; 
    bottom: 2rem; 
    left: 50%; 
    transform: translateX(-50%); 
}
.${this.generateClassName('dot')} { 
    display: inline-block; 
    width: 15px; 
    height: 15px; 
    margin: 0 5px; 
    background: rgba(255,255,255,0.5); 
    border-radius: 50%; 
    cursor: pointer; 
}
.${this.generateClassName('dot')}.active { background: white; }
</style>`;

            case 'interactive':
                return `
<section class="${heroClass}" style="position: relative; overflow: hidden;">
    <div id="particles-js" style="position: absolute; width: 100%; height: 100%;"></div>
    <div class="${containerClass}" style="position: relative; z-index: 2;">
        <div class="${this.generateClassName('animate', 'fade-in')}">
            <h1 style="font-size: 3.5rem; margin-bottom: 1rem;">${headline}</h1>
            <p style="font-size: 1.25rem; margin-bottom: 2rem;">Interactive casino experience with stunning animations!</p>
            <div class="${this.generateClassName('interactive', 'elements')}" style="margin: 2rem 0;">
                <div class="${this.generateClassName('casino', 'chip')}" style="display: inline-block; width: 60px; height: 60px; background: #ff6b6b; border-radius: 50%; margin: 0 10px; animation: spin 3s linear infinite;">💰</div>
                <div class="${this.generateClassName('casino', 'card')}" style="display: inline-block; width: 60px; height: 60px; background: #4ecdc4; border-radius: 8px; margin: 0 10px; animation: flip 2s ease-in-out infinite;">🃏</div>
                <div class="${this.generateClassName('casino', 'dice')}" style="display: inline-block; width: 60px; height: 60px; background: #45b7d1; border-radius: 8px; margin: 0 10px; animation: roll 2.5s ease-in-out infinite;">🎲</div>
            </div>
            <button class="${btnClass}" onclick="window.location.href='games.html'" style="font-size: 1.2rem; padding: 15px 30px;">${cta}</button>
        </div>
    </div>
</section>
<style>
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes flip { 0%, 100% { transform: rotateY(0deg); } 50% { transform: rotateY(180deg); } }
@keyframes roll { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(90deg); } 50% { transform: rotate(180deg); } 75% { transform: rotate(270deg); } }
</style>
<script src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"></script>
<script>
particlesJS('particles-js', {
    particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: "#ffffff" },
        shape: { type: "circle" },
        opacity: { value: 0.5, random: false },
        size: { value: 3, random: true },
        line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.4, width: 1 },
        move: { enable: true, speed: 6, direction: "none", random: false, straight: false, out_mode: "out", bounce: false }
    },
    interactivity: {
        detect_on: "canvas",
        events: { onhover: { enable: true, mode: "repulse" }, onclick: { enable: true, mode: "push" }, resize: true },
        modes: { grab: { distance: 400, line_linked: { opacity: 1 } }, bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 }, repulse: { distance: 200, duration: 0.4 }, push: { particles_nb: 4 }, remove: { particles_nb: 2 } }
    },
    retina_detect: true
});
</script>`;

            default:
                return `
<section class="${heroClass}">
    <div class="${containerClass}">
        <h1 style="font-size: 3rem; margin-bottom: 1rem;">${headline}</h1>
        <p style="font-size: 1.25rem; margin-bottom: 2rem;">Discover hundreds of free casino games and play for fun!</p>
        <button class="${btnClass}" onclick="window.location.href='games.html'">${cta}</button>
    </div>
</section>`;
        }
    }

    // Continue with other generation methods...
    // (Due to length limits, I'll provide the main structure. The full implementation would continue with all the variations)

    // Generate game cards with different layouts
    generateGameCards(games, title, section = 'featured') {
        if (!games || games.length === 0) return '';

        const layout = section === 'featured' ? this.config.featuredGamesLayout : this.config.newGamesLayout;
        const containerClass = this.generateClassName('container');
        const gameCardClass = this.generateClassName('game', 'card');
        const cardClass = this.generateClassName('card');
        
        const sectionHTML = `
<section class="${this.generateClassName('section')}" id="${section}" style="padding: 4rem 0;">
    <div class="${containerClass}">
        <h2 class="${this.generateClassName('text', 'center')} ${this.generateClassName('mb', '4')}" style="font-size: 2.5rem;">${title}</h2>
        ${this.generateGameLayoutHTML(games, layout)}
    </div>
</section>`;

        return sectionHTML;
    }

    generateGameLayoutHTML(games, layout) {
        const gameCardClass = this.generateClassName('game', 'card');
        const cardClass = this.generateClassName('card');
        
        switch (layout) {
            case 'card-grid':
                return `
<div class="${this.generateClassName('grid', '5')}">
    ${games.map(game => `
        <div class="${cardClass} ${gameCardClass}">
            <img src="images/games/${game.slug}-${game.id}.jpg" alt="${game.name}" class="${this.generateClassName('game', 'image')}">
            <div class="${this.generateClassName('game', 'info')}">
                <h3 class="${this.generateClassName('game', 'title')}">${game.name}</h3>
                <p class="${this.generateClassName('game', 'provider')}">${game.provider}</p>
                <a href="game.html?slug=${game.slug}" class="${this.generateClassName('btn', 'primary')}" style="width: 100%; text-align: center; text-decoration: none; display: block;">Play Game</a>
            </div>
        </div>
    `).join('')}
</div>`;

            case 'carousel':
                return `
<div class="${this.generateClassName('carousel', 'container')}" style="position: relative; overflow: hidden;">
    <div class="${this.generateClassName('carousel', 'track')}" style="display: flex; transition: transform 0.3s ease;">
        ${games.map(game => `
            <div class="${cardClass} ${gameCardClass}" style="min-width: 250px; margin-right: 20px;">
                <img src="images/games/${game.slug}-${game.id}.jpg" alt="${game.name}" class="${this.generateClassName('game', 'image')}">
                <div class="${this.generateClassName('game', 'info')}">
                    <h3 class="${this.generateClassName('game', 'title')}">${game.name}</h3>
                    <p class="${this.generateClassName('game', 'provider')}">${game.provider}</p>
                    <a href="game.html?slug=${game.slug}" class="${this.generateClassName('btn', 'primary')}">Play</a>
                </div>
            </div>
        `).join('')}
    </div>
    <button class="${this.generateClassName('carousel', 'btn')} ${this.generateClassName('carousel', 'prev')}" onclick="moveCarousel(-1)" style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); background: ${this.config.colorScheme.primary}; color: white; border: none; padding: 10px; border-radius: 50%; cursor: pointer;">&lt;</button>
    <button class="${this.generateClassName('carousel', 'btn')} ${this.generateClassName('carousel', 'next')}" onclick="moveCarousel(1)" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: ${this.config.colorScheme.primary}; color: white; border: none; padding: 10px; border-radius: 50%; cursor: pointer;">&gt;</button>
</div>`;

            case 'masonry':
                return `
<div class="${this.generateClassName('masonry', 'grid')}" style="column-count: 3; column-gap: 20px; column-fill: balance;">
    ${games.map((game, index) => {
                    const heights = ['200px', '250px', '300px', '220px', '280px'];
                    const height = heights[index % heights.length];
                    return `
        <div class="${cardClass} ${gameCardClass}" style="break-inside: avoid; margin-bottom: 20px; display: inline-block; width: 100%;">
            <img src="images/games/${game.slug}-${game.id}.jpg" alt="${game.name}" style="width: 100%; height: ${height}; object-fit: cover;">
            <div class="${this.generateClassName('game', 'info')}">
                <h3 class="${this.generateClassName('game', 'title')}">${game.name}</h3>
                <p class="${this.generateClassName('game', 'provider')}">${game.provider}</p>
                <a href="game.html?slug=${game.slug}" class="${this.generateClassName('btn', 'primary')}" style="width: 100%; text-align: center; text-decoration: none; display: block;">Play Game</a>
            </div>
        </div>
    `;
                }).join('')}
</div>
<style>
@media (max-width: 768px) {
    .${this.generateClassName('masonry', 'grid')} { column-count: 2; }
}
@media (max-width: 480px) {
    .${this.generateClassName('masonry', 'grid')} { column-count: 1; }
}
</style>`;

            case 'list':
                return `
<div class="${this.generateClassName('games', 'list')}">
    ${games.map(game => `
        <div class="${cardClass} ${gameCardClass}" style="display: flex; align-items: center; margin-bottom: 15px; padding: 1rem;">
            <img src="images/games/${game.slug}-${game.id}.jpg" alt="${game.name}" style="width: 120px; height: 80px; object-fit: cover; border-radius: 8px; margin-right: 1rem;">
            <div style="flex: 1;">
                <h3 class="${this.generateClassName('game', 'title')}" style="margin-bottom: 0.5rem;">${game.name}</h3>
                <p class="${this.generateClassName('game', 'provider')}" style="margin-bottom: 0.5rem; color: #666;">${game.provider}</p>
                <p style="color: #888; font-size: 0.9rem;">${game.description || 'Experience this exciting casino game!'}</p>
            </div>
            <div style="margin-left: 1rem;">
                <a href="game.html?slug=${game.slug}" class="${this.generateClassName('btn', 'primary')}">Play Game</a>
            </div>
        </div>
    `).join('')}
</div>`;

            case 'hexagonal':
                return `
<div class="${this.generateClassName('hexagon', 'grid')}" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 15px;">
    ${games.map(game => `
        <div class="${this.generateClassName('hexagon', 'wrapper')}" style="position: relative; width: 200px; height: 173px; margin: 20px;">
            <div class="${this.generateClassName('hexagon', 'inner')}" style="
                width: 200px;
                height: 115px;
                background: url('images/games/${game.slug}-${game.id}.jpg') center/cover;
                position: relative;
                margin: 29px 0;
                clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
                transition: transform 0.3s ease;
            "></div>
            <div class="${this.generateClassName('hexagon', 'overlay')}" style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                text-align: center;
                color: white;
                background: rgba(0,0,0,0.8);
                padding: 15px;
                border-radius: 8px;
                opacity: 0;
                transition: opacity 0.3s ease;
                width: 150px;
            ">
                <h4 style="margin-bottom: 8px; font-size: 0.9rem;">${game.name}</h4>
                <p style="margin-bottom: 10px; font-size: 0.8rem;">${game.provider}</p>
                <a href="game.html?slug=${game.slug}" class="${this.generateClassName('btn', 'accent')}" style="font-size: 0.8rem; padding: 8px 16px;">Play</a>
            </div>
        </div>
    `).join('')}
</div>
<style>
.${this.generateClassName('hexagon', 'wrapper')}:hover .${this.generateClassName('hexagon', 'overlay')} {
    opacity: 1;
}
.${this.generateClassName('hexagon', 'wrapper')}:hover .${this.generateClassName('hexagon', 'inner')} {
    transform: scale(1.1);
}
@media (max-width: 768px) {
    .${this.generateClassName('hexagon', 'wrapper')} {
        width: 150px;
        height: 130px;
    }
    .${this.generateClassName('hexagon', 'inner')} {
        width: 150px;
        height: 86px;
    }
    .${this.generateClassName('hexagon', 'overlay')} {
        width: 120px;
    }
}
</style>`;

            // New Games Layouts
            case 'ribbon':
                return `
<div class="${this.generateClassName('ribbon', 'container')}" style="background: linear-gradient(45deg, ${this.config.colorScheme.primary}, ${this.config.colorScheme.secondary}); padding: 2rem 0; overflow: hidden; margin: 0 -20px;">
    <div class="${this.generateClassName('ribbon', 'track')}" style="display: flex; animation: scrollRibbon 25s linear infinite;">
        ${games.concat(games).map(game => `
            <div class="${this.generateClassName('ribbon', 'item')}" style="flex: none; margin-right: 2rem; position: relative;">
                <div class="${this.generateClassName('new', 'badge')}" style="position: absolute; top: -8px; right: -8px; background: #ff6b6b; color: white; padding: 4px 12px; border-radius: 15px; font-size: 0.75rem; font-weight: bold; z-index: 2; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">NEW</div>
                <div class="${cardClass}" style="width: 220px; background: rgba(255,255,255,0.95); backdrop-filter: blur(10px);">
                    <img src="images/games/${game.slug}-${game.id}.jpg" alt="${game.name}" style="width: 100%; height: 140px; object-fit: cover;">
                    <div style="padding: 1rem;">
                        <h4 style="margin-bottom: 0.5rem; color: ${this.config.colorScheme.secondary}; font-size: 1rem;">${game.name}</h4>
                        <p style="color: #666; font-size: 0.9rem; margin-bottom: 1rem;">${game.provider}</p>
                        <a href="game.html?slug=${game.slug}" class="${this.generateClassName('btn', 'primary')}" style="width: 100%; text-align: center; padding: 8px;">Play Now</a>
                    </div>
                </div>
            </div>
        `).join('')}
    </div>
</div>
<style>
@keyframes scrollRibbon {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
}
.${this.generateClassName('ribbon', 'container')}:hover .${this.generateClassName('ribbon', 'track')} {
    animation-play-state: paused;
}
</style>`;

            case 'spotlight':
                return `
<div class="${this.generateClassName('spotlight', 'grid')}" style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 20px; height: 450px;">
    ${games.map((game, index) => {
                    if (index === 0) {
                        return `
            <div class="${cardClass} ${this.generateClassName('spotlight', 'main')}" style="position: relative; overflow: hidden; border-radius: 12px;">
                <img src="images/games/${game.slug}-${game.id}.jpg" alt="${game.name}" style="width: 100%; height: 100%; object-fit: cover;">
                <div class="${this.generateClassName('spotlight', 'overlay')}" style="position: absolute; inset: 0; background: linear-gradient(45deg, rgba(0,0,0,0.3), transparent, rgba(0,0,0,0.7)); display: flex; flex-direction: column; justify-content: flex-end; padding: 2rem;">
                    <div class="${this.generateClassName('new', 'badge')}" style="background: linear-gradient(45deg, #ff6b6b, #ff8e8e); padding: 8px 20px; border-radius: 25px; font-size: 0.9rem; margin-bottom: 1rem; align-self: flex-start; color: white; font-weight: bold; box-shadow: 0 4px 15px rgba(255,107,107,0.4);">🆕 LATEST RELEASE</div>
                    <h2 style="margin-bottom: 0.5rem; color: white; font-size: 2rem; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">${game.name}</h2>
                    <p style="margin-bottom: 1.5rem; opacity: 0.95; color: white; font-size: 1.1rem;">${game.provider} • ${game.type}</p>
                    <a href="game.html?slug=${game.slug}" class="${this.generateClassName('btn', 'primary')}" style="padding: 15px 35px; font-size: 1.1rem; align-self: flex-start; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">Play Now</a>
                </div>
            </div>
        `;
                    } else {
                        return `
            <div class="${cardClass} ${this.generateClassName('spotlight', 'side')}" style="position: relative; overflow: hidden; border-radius: 8px;">
                <img src="images/games/${game.slug}-${game.id}.jpg" alt="${game.name}" style="width: 100%; height: 100%; object-fit: cover;">
                <div class="${this.generateClassName('spotlight', 'overlay')}" style="position: absolute; inset: 0; background: linear-gradient(transparent 40%, rgba(0,0,0,0.9)); display: flex; flex-direction: column; justify-content: flex-end; padding: 1.5rem;">
                    <div class="${this.generateClassName('new', 'badge')}" style="background: #4ecdc4; padding: 4px 12px; border-radius: 12px; font-size: 0.75rem; margin-bottom: 0.8rem; align-self: flex-start; color: white; font-weight: bold;">NEW</div>
                    <h4 style="margin-bottom: 0.5rem; font-size: 1.1rem; color: white; line-height: 1.2;">${game.name}</h4>
                    <p style="margin-bottom: 1rem; font-size: 0.85rem; opacity: 0.9; color: white;">${game.provider}</p>
                    <a href="game.html?slug=${game.slug}" class="${this.generateClassName('btn', 'accent')}" style="padding: 10px 20px; font-size: 0.9rem; align-self: flex-start;">Play</a>
                </div>
            </div>
        `;
                    }
                }).join('')}
</div>
<style>
@media (max-width: 768px) {
    .${this.generateClassName('spotlight', 'grid')} {
        grid-template-columns: 1fr;
        height: auto;
    }
    .${this.generateClassName('spotlight', 'main')}, .${this.generateClassName('spotlight', 'side')} {
        height: 300px;
    }
}
</style>`;

            case 'ticker':
                return `
<div class="${this.generateClassName('ticker', 'container')}" style="background: ${this.config.colorScheme.secondary}; color: white; padding: 1.5rem 0; overflow: hidden; position: relative; border-top: 3px solid ${this.config.colorScheme.primary}; border-bottom: 3px solid ${this.config.colorScheme.primary};">
    <div class="${this.generateClassName('ticker', 'label')}" style="position: absolute; left: 0; top: 0; bottom: 0; background: linear-gradient(45deg, ${this.config.colorScheme.primary}, ${this.config.colorScheme.accent}); padding: 1.5rem; display: flex; align-items: center; font-weight: bold; z-index: 2; box-shadow: 5px 0 15px rgba(0,0,0,0.2);">
        🆕 LATEST GAMES
    </div>
    <div class="${this.generateClassName('ticker', 'content')}" style="margin-left: 200px; white-space: nowrap; animation: ticker 35s linear infinite;">
        ${games.concat(games, games).map(game => `
            <span class="${this.generateClassName('ticker', 'item')}" style="display: inline-block; margin-right: 4rem; padding: 0.5rem 1rem; background: rgba(255,255,255,0.1); border-radius: 25px; backdrop-filter: blur(5px);">
                <span style="font-weight: bold; color: ${this.config.colorScheme.accent};">✨ ${game.name}</span> 
                <span style="opacity: 0.8;">by ${game.provider}</span>
                <a href="game.html?slug=${game.slug}" class="${this.generateClassName('btn', 'accent')}" style="margin-left: 1rem; padding: 6px 18px; font-size: 0.9rem; border-radius: 20px;">Play Now</a>
            </span>
        `).join('')}
    </div>
</div>
<style>
@keyframes ticker {
    0% { transform: translateX(100%); }
    100% { transform: translateX(-100%); }
}
.${this.generateClassName('ticker', 'container')}:hover .${this.generateClassName('ticker', 'content')} {
    animation-play-state: paused;
}
@media (max-width: 768px) {
    .${this.generateClassName('ticker', 'label')} { padding: 1rem; font-size: 0.9rem; }
    .${this.generateClassName('ticker', 'content')} { margin-left: 150px; }
}
</style>`;

            case 'grid-dates':
                return `
<div class="${this.generateClassName('grid', '3')}" style="gap: 25px;">
    ${games.map((game, index) => {
                    const daysAgo = Math.floor(Math.random() * 7);
                    const dateLabel = daysAgo === 0 ? 'Added Today' : daysAgo === 1 ? 'Added Yesterday' : `Added ${daysAgo} days ago`;
                    const timeAgo = daysAgo === 0 ? 'Just now' : daysAgo === 1 ? '1 day ago' : `${daysAgo} days ago`;
                    return `
        <div class="${cardClass} ${gameCardClass}" style="position: relative; border: 2px solid ${daysAgo === 0 ? this.config.colorScheme.primary : '#e5e7eb'}; transition: all 0.3s ease;">
            <div class="${this.generateClassName('date', 'badge')}" style="position: absolute; top: -10px; left: 15px; background: ${daysAgo === 0 ? this.config.colorScheme.primary : this.config.colorScheme.secondary}; color: white; padding: 6px 15px; border-radius: 20px; font-size: 0.8rem; font-weight: bold; z-index: 2; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">${dateLabel}</div>
            <img src="images/games/${game.slug}-${game.id}.jpg" alt="${game.name}" class="${this.generateClassName('game', 'image')}">
            <div class="${this.generateClassName('game', 'info')}">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                    <h3 class="${this.generateClassName('game', 'title')}" style="flex: 1; margin: 0;">${game.name}</h3>
                    ${daysAgo === 0 ? '<span style="color: #10b981; font-size: 0.8rem; font-weight: bold;">🔥 HOT</span>' : ''}
                </div>
                <p class="${this.generateClassName('game', 'provider')}" style="margin-bottom: 0.5rem;">${game.provider}</p>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem;">
                    <div style="display: flex; flex-direction: column;">
                        <span style="color: #888; font-size: 0.85rem;">🎮 ${game.type}</span>
                        <span style="color: #666; font-size: 0.75rem; margin-top: 2px;">⏰ ${timeAgo}</span>
                    </div>
                    <a href="game.html?slug=${game.slug}" class="${this.generateClassName('btn', 'primary')}" style="padding: 8px 20px;">Play</a>
                </div>
            </div>
        </div>
    `;
                }).join('')}
</div>
<style>
.${gameCardClass}:hover {
    border-color: ${this.config.colorScheme.primary} !important;
    transform: translateY(-5px);
}
</style>`;

            case 'timeline':
                return `
<div class="${this.generateClassName('timeline', 'container')}" style="position: relative; max-width: 900px; margin: 0 auto;">
    <div class="${this.generateClassName('timeline', 'line')}" style="position: absolute; left: 50%; transform: translateX(-50%); width: 4px; height: 100%; background: linear-gradient(to bottom, ${this.config.colorScheme.primary}, ${this.config.colorScheme.secondary}); z-index: 1; border-radius: 2px;"></div>
    ${games.map((game, index) => {
                    const isLeft = index % 2 === 0;
                    const daysAgo = index;
                    const dateLabel = daysAgo === 0 ? 'Released Today' : daysAgo === 1 ? 'Released Yesterday' : `Released ${daysAgo} days ago`;
                    return `
        <div class="${this.generateClassName('timeline', 'item')}" style="position: relative; margin: 3rem 0; ${isLeft ? 'margin-right: 52%; text-align: right;' : 'margin-left: 52%; text-align: left;'}">
            <div class="${this.generateClassName('timeline', 'dot')}" style="position: absolute; ${isLeft ? 'right: -42px;' : 'left: -42px;'} top: 30px; width: 24px; height: 24px; background: ${this.config.colorScheme.primary}; border-radius: 50%; border: 4px solid white; z-index: 2; box-shadow: 0 0 0 4px ${this.config.colorScheme.primary}40;"></div>
            <div class="${cardClass}" style="position: relative; overflow: hidden; border-radius: 12px; box-shadow: 0 8px 25px rgba(0,0,0,0.1); transition: all 0.3s ease;">
                <div class="${this.generateClassName('timeline', 'date')}" style="position: absolute; top: 15px; ${isLeft ? 'right: 15px;' : 'left: 15px;'} background: linear-gradient(45deg, ${this.config.colorScheme.accent}, ${this.config.colorScheme.primary}); color: white; padding: 6px 15px; border-radius: 20px; font-size: 0.8rem; font-weight: bold; z-index: 2; box-shadow: 0 3px 10px rgba(0,0,0,0.2);">${dateLabel}</div>
                <img src="images/games/${game.slug}-${game.id}.jpg" alt="${game.name}" style="width: 100%; height: 180px; object-fit: cover;">
                <div style="padding: 1.5rem;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                        <div>
                            <h4 style="margin-bottom: 0.5rem; font-size: 1.2rem; color: ${this.config.colorScheme.secondary};">${game.name}</h4>
                            <p style="color: #666; margin-bottom: 0.5rem; font-weight: 500;">${game.provider}</p>
                            <span style="color: ${this.config.colorScheme.primary}; font-size: 0.9rem; background: ${this.config.colorScheme.primary}20; padding: 4px 12px; border-radius: 15px;">${game.type}</span>
                        </div>
                    </div>
                    <a href="game.html?slug=${game.slug}" class="${this.generateClassName('btn', 'primary')}" style="width: 100%; text-align: center; padding: 12px; border-radius: 8px; font-weight: 600;">Play Game Now</a>
                </div>
            </div>
        </div>
    `;
                }).join('')}
</div>
<style>
.${this.generateClassName('timeline', 'item')}:hover .${cardClass} {
    transform: translateY(-8px);
    box-shadow: 0 15px 35px rgba(0,0,0,0.15);
}
@media (max-width: 768px) {
    .${this.generateClassName('timeline', 'item')} {
        margin-left: 3rem !important;
        margin-right: 0 !important;
        text-align: left !important;
    }
    .${this.generateClassName('timeline', 'dot')} {
        left: -42px !important;
        right: auto !important;
    }
    .${this.generateClassName('timeline', 'date')} {
        left: 15px !important;
        right: auto !important;
    }
}
</style>`;

            default:
                return this.generateGameLayoutHTML(games, 'card-grid');
        }
    }

    // Generate complete HTML page with enhanced structure
    generateHTML(title, content, additionalCSS = '', additionalJS = '') {
        const css = this.generateCSS();
        const frameworkLink = this.getFrameworkLink();
        const schemaMarkup = this.generateSchemaMarkup();
        const metaTags = this.generateMetaTags(title);
        
        const htmlStructure = this.domStructure === 'semantic' ? 
            `${this.generateNavigation()}
            <main>
                ${content}
            </main>
            ${this.generateFooter()}` :
            `${this.generateNavigation()}
            <div class="${this.generateClassName('content', 'wrapper')}">
                ${content}
            </div>
            ${this.generateFooter()}`;

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${metaTags}
    ${frameworkLink}
    ${this.config.inlineCSS ? `<style>${css}${additionalCSS}</style>` : ''}
    ${schemaMarkup}
</head>
<body>
    ${htmlStructure}
    ${this.generateJavaScript()}
    ${additionalJS}
</body>
</html>`;
    }

    // Generate meta tags with variations
    generateMetaTags(title) {
        const variations = [
            `<title>${title} | ${this.siteName}</title>
            <meta name="description" content="Play free casino games at ${this.siteName}. No download required!">`,
            `<title>Free Casino Games | ${this.siteName}</title>
            <meta name="description" content="Enjoy 100+ casino games at ${this.siteName}. Play slots, table games and more!">`,
            `<title>${this.siteName} – ${title}</title>
            <meta name="description" content="Experience premium casino entertainment at ${this.siteName}. Free to play!">`
        ];
        
        return variations[Math.floor(Math.random() * variations.length)];
    }

    // Generate schema markup
    generateSchemaMarkup() {
        return `
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "${this.siteName}",
    "url": "https://${this.domain}",
    "description": "Social casino games for entertainment"
}
</script>
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "${this.siteName}",
    "url": "https://${this.domain}"
}
</script>`;
    }

    // Get framework CDN link
    getFrameworkLink() {
        const { framework } = this.config;
        
        const links = {
            tailwind: '<script src="https://cdn.tailwindcss.com"></script>',
            bootstrap: '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">',
            bulma: '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css">',
            foundation: '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/foundation-sites@6.7.5/dist/css/foundation-float.min.css">',
            materialize: '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">',
            pure: '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/purecss@3.0.0/build/pure-min.css">',
            semantic: '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/semantic-ui@2.5.0/dist/semantic.min.css">',
            uikit: '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/uikit@3.17.11/dist/css/uikit.min.css">',
            skeleton: '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/skeleton/2.0.4/skeleton.min.css">'
        };

        return links[framework] || '';
    }

    // Generate enhanced footer with variations
    generateFooter() {
        const { footer } = this.config;
        const footerClass = this.generateClassName('footer');
        const containerClass = this.generateClassName('container');
        
        switch (footer) {
            case 'mega':
                return `
<footer class="${footerClass} ${this.generateClassName('footer', 'mega')}">
    <div class="${containerClass}">
        <div class="${this.generateClassName('footer', 'grid')}">
            <div>
                <h4>${this.siteName}</h4>
                <p>Your favorite social casino destination with hundreds of free games.</p>
                <div class="${this.generateClassName('social', 'icons')}" style="margin-top: 1rem;">
                    <a href="#" style="margin-right: 1rem; color: #ccc;">📘</a>
                    <a href="#" style="margin-right: 1rem; color: #ccc;">🐦</a>
                    <a href="#" style="margin-right: 1rem; color: #ccc;">📷</a>
                </div>
            </div>
            <div>
                <h5>Quick Links</h5>
                <ul style="list-style: none; padding: 0;">
                    <li><a href="games.html" class="${this.generateClassName('footer', 'link')}">All Games</a></li>
                    <li><a href="about.html" class="${this.generateClassName('footer', 'link')}">About Us</a></li>
                    <li><a href="contact.html" class="${this.generateClassName('footer', 'link')}">Contact</a></li>
                </ul>
            </div>
            <div>
                <h5>Game Categories</h5>
                <ul style="list-style: none; padding: 0;">
                    <li><a href="games.html?type=slot" class="${this.generateClassName('footer', 'link')}">Slot Games</a></li>
                    <li><a href="games.html?type=table" class="${this.generateClassName('footer', 'link')}">Table Games</a></li>
                    <li><a href="games.html?type=poker" class="${this.generateClassName('footer', 'link')}">Video Poker</a></li>
                </ul>
            </div>
            <div>
                <h5>Legal</h5>
                <ul style="list-style: none; padding: 0;">
                    <li><a href="terms.html" class="${this.generateClassName('footer', 'link')}">Terms & Conditions</a></li>
                    <li><a href="privacy.html" class="${this.generateClassName('footer', 'link')}">Privacy Policy</a></li>
                    <li><a href="cookies.html" class="${this.generateClassName('footer', 'link')}">Cookie Policy</a></li>
                    <li><a href="responsible-gaming.html" class="${this.generateClassName('footer', 'link')}">Responsible Gaming</a></li>
                </ul>
            </div>
            <div>
                <h5>Newsletter</h5>
                <p>Get updates on new games and features!</p>
                <form style="margin-top: 1rem;">
                    <input type="email" placeholder="Your email" style="padding: 0.5rem; width: 100%; margin-bottom: 0.5rem; border: 1px solid #666; border-radius: 4px;">
                    <button type="submit" class="${this.generateClassName('btn', 'accent')}" style="width: 100%;">Subscribe</button>
                </form>
            </div>
        </div>
        <div style="text-align: center; padding-top: 2rem; border-top: 1px solid #444; margin-top: 2rem;">
            <p>&copy; 2024 ${this.siteName}. All rights reserved. | Social casino games for entertainment only.</p>
        </div>
    </div>
</footer>`;

            case 'minimal':
                return `
<footer class="${footerClass} ${this.generateClassName('footer', 'minimal')}" style="background: ${this.config.colorScheme.secondary}; color: white; padding: 2rem 0; text-align: center;">
    <div class="${containerClass}">
        <div style="margin-bottom: 1.5rem;">
            <h3 style="margin-bottom: 1rem; color: ${this.config.colorScheme.accent};">${this.siteName}</h3>
            <div style="display: flex; justify-content: center; gap: 2rem; margin-bottom: 1rem; flex-wrap: wrap;">
                <a href="about.html" class="${this.generateClassName('footer', 'link')}" style="color: #ccc; text-decoration: none; transition: color 0.3s ease;">About</a>
                <a href="contact.html" class="${this.generateClassName('footer', 'link')}" style="color: #ccc; text-decoration: none; transition: color 0.3s ease;">Contact</a>
                <a href="games.html" class="${this.generateClassName('footer', 'link')}" style="color: #ccc; text-decoration: none; transition: color 0.3s ease;">Games</a>
                <a href="terms.html" class="${this.generateClassName('footer', 'link')}" style="color: #ccc; text-decoration: none; transition: color 0.3s ease;">Terms</a>
                <a href="privacy.html" class="${this.generateClassName('footer', 'link')}" style="color: #ccc; text-decoration: none; transition: color 0.3s ease;">Privacy</a>
            </div>
            <div class="${this.generateClassName('social', 'icons')}" style="display: flex; justify-content: center; gap: 1rem; margin-bottom: 1rem;">
                <a href="#" style="color: #ccc; font-size: 1.5rem; transition: color 0.3s ease;">📘</a>
                <a href="#" style="color: #ccc; font-size: 1.5rem; transition: color 0.3s ease;">🐦</a>
                <a href="#" style="color: #ccc; font-size: 1.5rem; transition: color 0.3s ease;">📷</a>
                <a href="#" style="color: #ccc; font-size: 1.5rem; transition: color 0.3s ease;">📺</a>
            </div>
        </div>
        <div style="border-top: 1px solid #555; padding-top: 1rem;">
            <p style="margin: 0; color: #aaa; font-size: 0.9rem;">&copy; 2024 ${this.siteName}. All rights reserved. | Social casino games for entertainment only.</p>
        </div>
    </div>
</footer>
<style>
.${this.generateClassName('footer', 'link')}:hover {
    color: ${this.config.colorScheme.accent} !important;
}
</style>`;

            case 'accordion':
                return `
<footer class="${footerClass} ${this.generateClassName('footer', 'accordion')}" style="background: ${this.config.colorScheme.secondary}; color: white; padding: 3rem 0;">
    <div class="${containerClass}">
        <div class="${this.generateClassName('footer', 'mobile')}" style="display: none;">
            <div class="${this.generateClassName('accordion', 'item')}">
                <button class="${this.generateClassName('accordion', 'toggle')}" onclick="toggleAccordion('quick-links')" style="width: 100%; text-align: left; background: none; border: none; color: white; padding: 1rem 0; font-size: 1.1rem; font-weight: bold; cursor: pointer; border-bottom: 1px solid #555;">
                    Quick Links <span id="quick-links-icon">+</span>
                </button>
                <div id="quick-links" class="${this.generateClassName('accordion', 'content')}" style="display: none; padding: 1rem 0;">
                    <a href="games.html" class="${this.generateClassName('footer', 'link')}" style="display: block; color: #ccc; padding: 0.5rem 0; text-decoration: none;">All Games</a>
                    <a href="about.html" class="${this.generateClassName('footer', 'link')}" style="display: block; color: #ccc; padding: 0.5rem 0; text-decoration: none;">About Us</a>
                    <a href="contact.html" class="${this.generateClassName('footer', 'link')}" style="display: block; color: #ccc; padding: 0.5rem 0; text-decoration: none;">Contact</a>
                </div>
            </div>
            <div class="${this.generateClassName('accordion', 'item')}">
                <button class="${this.generateClassName('accordion', 'toggle')}" onclick="toggleAccordion('game-categories')" style="width: 100%; text-align: left; background: none; border: none; color: white; padding: 1rem 0; font-size: 1.1rem; font-weight: bold; cursor: pointer; border-bottom: 1px solid #555;">
                    Game Categories <span id="game-categories-icon">+</span>
                </button>
                <div id="game-categories" class="${this.generateClassName('accordion', 'content')}" style="display: none; padding: 1rem 0;">
                    <a href="games.html?type=slot" class="${this.generateClassName('footer', 'link')}" style="display: block; color: #ccc; padding: 0.5rem 0; text-decoration: none;">Slot Games</a>
                    <a href="games.html?type=table" class="${this.generateClassName('footer', 'link')}" style="display: block; color: #ccc; padding: 0.5rem 0; text-decoration: none;">Table Games</a>
                    <a href="games.html?type=poker" class="${this.generateClassName('footer', 'link')}" style="display: block; color: #ccc; padding: 0.5rem 0; text-decoration: none;">Video Poker</a>
                </div>
            </div>
            <div class="${this.generateClassName('accordion', 'item')}">
                <button class="${this.generateClassName('accordion', 'toggle')}" onclick="toggleAccordion('legal-info')" style="width: 100%; text-align: left; background: none; border: none; color: white; padding: 1rem 0; font-size: 1.1rem; font-weight: bold; cursor: pointer; border-bottom: 1px solid #555;">
                    Legal Information <span id="legal-info-icon">+</span>
                </button>
                <div id="legal-info" class="${this.generateClassName('accordion', 'content')}" style="display: none; padding: 1rem 0;">
                    <a href="terms.html" class="${this.generateClassName('footer', 'link')}" style="display: block; color: #ccc; padding: 0.5rem 0; text-decoration: none;">Terms & Conditions</a>
                    <a href="privacy.html" class="${this.generateClassName('footer', 'link')}" style="display: block; color: #ccc; padding: 0.5rem 0; text-decoration: none;">Privacy Policy</a>
                    <a href="cookies.html" class="${this.generateClassName('footer', 'link')}" style="display: block; color: #ccc; padding: 0.5rem 0; text-decoration: none;">Cookie Policy</a>
                    <a href="responsible-gaming.html" class="${this.generateClassName('footer', 'link')}" style="display: block; color: #ccc; padding: 0.5rem 0; text-decoration: none;">Responsible Gaming</a>
                </div>
            </div>
        </div>
        <div class="${this.generateClassName('footer', 'desktop')}" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem;">
            <div>
                <h4 style="margin-bottom: 1rem; color: ${this.config.colorScheme.accent};">${this.siteName}</h4>
                <p style="margin-bottom: 1rem; color: #ccc;">Your favorite social casino destination with hundreds of free games.</p>
                <div class="${this.generateClassName('social', 'icons')}" style="display: flex; gap: 1rem;">
                    <a href="#" style="color: #ccc; font-size: 1.5rem;">📘</a>
                    <a href="#" style="color: #ccc; font-size: 1.5rem;">🐦</a>
                    <a href="#" style="color: #ccc; font-size: 1.5rem;">📷</a>
                </div>
            </div>
            <div>
                <h5 style="margin-bottom: 1rem;">Quick Links</h5>
                <ul style="list-style: none; padding: 0;">
                    <li style="margin-bottom: 0.5rem;"><a href="games.html" class="${this.generateClassName('footer', 'link')}" style="color: #ccc; text-decoration: none;">All Games</a></li>
                    <li style="margin-bottom: 0.5rem;"><a href="about.html" class="${this.generateClassName('footer', 'link')}" style="color: #ccc; text-decoration: none;">About Us</a></li>
                    <li style="margin-bottom: 0.5rem;"><a href="contact.html" class="${this.generateClassName('footer', 'link')}" style="color: #ccc; text-decoration: none;">Contact</a></li>
                </ul>
            </div>
            <div>
                <h5 style="margin-bottom: 1rem;">Legal</h5>
                <ul style="list-style: none; padding: 0;">
                    <li style="margin-bottom: 0.5rem;"><a href="terms.html" class="${this.generateClassName('footer', 'link')}" style="color: #ccc; text-decoration: none;">Terms & Conditions</a></li>
                    <li style="margin-bottom: 0.5rem;"><a href="privacy.html" class="${this.generateClassName('footer', 'link')}" style="color: #ccc; text-decoration: none;">Privacy Policy</a></li>
                    <li style="margin-bottom: 0.5rem;"><a href="cookies.html" class="${this.generateClassName('footer', 'link')}" style="color: #ccc; text-decoration: none;">Cookie Policy</a></li>
                    <li style="margin-bottom: 0.5rem;"><a href="responsible-gaming.html" class="${this.generateClassName('footer', 'link')}" style="color: #ccc; text-decoration: none;">Responsible Gaming</a></li>
                </ul>
            </div>
        </div>
        <div style="text-align: center; padding-top: 2rem; border-top: 1px solid #555; margin-top: 2rem;">
            <p style="margin: 0; color: #aaa;">&copy; 2024 ${this.siteName}. All rights reserved. | Social casino games for entertainment only.</p>
        </div>
    </div>
</footer>
<style>
@media (max-width: 768px) {
    .${this.generateClassName('footer', 'desktop')} { display: none !important; }
    .${this.generateClassName('footer', 'mobile')} { display: block !important; }
}
.${this.generateClassName('footer', 'link')}:hover {
    color: ${this.config.colorScheme.accent} !important;
}
</style>
<script>
function toggleAccordion(id) {
    const content = document.getElementById(id);
    const icon = document.getElementById(id + '-icon');
    if (content.style.display === 'none' || content.style.display === '') {
        content.style.display = 'block';
        icon.textContent = '-';
    } else {
        content.style.display = 'none';
        icon.textContent = '+';
    }
}
</script>`;

            case 'map-style':
                return `
<footer class="${footerClass} ${this.generateClassName('footer', 'map-style')}" style="background: linear-gradient(135deg, ${this.config.colorScheme.secondary}, ${this.config.colorScheme.primary}); color: white; padding: 4rem 0;">
    <div class="${containerClass}">
        <div style="text-align: center; margin-bottom: 3rem;">
            <h3 style="font-size: 2rem; margin-bottom: 1rem; color: ${this.config.colorScheme.accent};">${this.siteName}</h3>
            <p style="font-size: 1.1rem; opacity: 0.9;">Navigate Your Gaming Experience</p>
        </div>
        <div class="${this.generateClassName('sitemap', 'grid')}" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; margin-bottom: 3rem;">
            <div class="${this.generateClassName('sitemap', 'section')}" style="text-align: center; padding: 1.5rem; background: rgba(255,255,255,0.1); border-radius: 12px; backdrop-filter: blur(10px);">
                <div style="font-size: 2rem; margin-bottom: 1rem;">🏠</div>
                <h4 style="margin-bottom: 1rem; color: ${this.config.colorScheme.accent};">Main Hub</h4>
                <ul style="list-style: none; padding: 0;">
                    <li style="margin-bottom: 0.5rem;"><a href="index.html" class="${this.generateClassName('footer', 'link')}" style="color: white; text-decoration: none; opacity: 0.8; transition: opacity 0.3s ease;">Home</a></li>
                    <li style="margin-bottom: 0.5rem;"><a href="about.html" class="${this.generateClassName('footer', 'link')}" style="color: white; text-decoration: none; opacity: 0.8; transition: opacity 0.3s ease;">About Us</a></li>
                    <li style="margin-bottom: 0.5rem;"><a href="contact.html" class="${this.generateClassName('footer', 'link')}" style="color: white; text-decoration: none; opacity: 0.8; transition: opacity 0.3s ease;">Contact</a></li>
                </ul>
            </div>
            <div class="${this.generateClassName('sitemap', 'section')}" style="text-align: center; padding: 1.5rem; background: rgba(255,255,255,0.1); border-radius: 12px; backdrop-filter: blur(10px);">
                <div style="font-size: 2rem; margin-bottom: 1rem;">🎮</div>
                <h4 style="margin-bottom: 1rem; color: ${this.config.colorScheme.accent};">Gaming Zone</h4>
                <ul style="list-style: none; padding: 0;">
                    <li style="margin-bottom: 0.5rem;"><a href="games.html" class="${this.generateClassName('footer', 'link')}" style="color: white; text-decoration: none; opacity: 0.8; transition: opacity 0.3s ease;">All Games</a></li>
                    <li style="margin-bottom: 0.5rem;"><a href="games.html?type=slot" class="${this.generateClassName('footer', 'link')}" style="color: white; text-decoration: none; opacity: 0.8; transition: opacity 0.3s ease;">Slot Games</a></li>
                    <li style="margin-bottom: 0.5rem;"><a href="games.html?type=table" class="${this.generateClassName('footer', 'link')}" style="color: white; text-decoration: none; opacity: 0.8; transition: opacity 0.3s ease;">Table Games</a></li>
                    <li style="margin-bottom: 0.5rem;"><a href="games.html?type=poker" class="${this.generateClassName('footer', 'link')}" style="color: white; text-decoration: none; opacity: 0.8; transition: opacity 0.3s ease;">Video Poker</a></li>
                </ul>
            </div>
            <div class="${this.generateClassName('sitemap', 'section')}" style="text-align: center; padding: 1.5rem; background: rgba(255,255,255,0.1); border-radius: 12px; backdrop-filter: blur(10px);">
                <div style="font-size: 2rem; margin-bottom: 1rem;">⚖️</div>
                <h4 style="margin-bottom: 1rem; color: ${this.config.colorScheme.accent};">Legal Center</h4>
                <ul style="list-style: none; padding: 0;">
                    <li style="margin-bottom: 0.5rem;"><a href="terms.html" class="${this.generateClassName('footer', 'link')}" style="color: white; text-decoration: none; opacity: 0.8; transition: opacity 0.3s ease;">Terms & Conditions</a></li>
                    <li style="margin-bottom: 0.5rem;"><a href="privacy.html" class="${this.generateClassName('footer', 'link')}" style="color: white; text-decoration: none; opacity: 0.8; transition: opacity 0.3s ease;">Privacy Policy</a></li>
                    <li style="margin-bottom: 0.5rem;"><a href="cookies.html" class="${this.generateClassName('footer', 'link')}" style="color: white; text-decoration: none; opacity: 0.8; transition: opacity 0.3s ease;">Cookie Policy</a></li>
                    <li style="margin-bottom: 0.5rem;"><a href="responsible-gaming.html" class="${this.generateClassName('footer', 'link')}" style="color: white; text-decoration: none; opacity: 0.8; transition: opacity 0.3s ease;">Responsible Gaming</a></li>
                </ul>
            </div>
            <div class="${this.generateClassName('sitemap', 'section')}" style="text-align: center; padding: 1.5rem; background: rgba(255,255,255,0.1); border-radius: 12px; backdrop-filter: blur(10px);">
                <div style="font-size: 2rem; margin-bottom: 1rem;">🌐</div>
                <h4 style="margin-bottom: 1rem; color: ${this.config.colorScheme.accent};">Connect</h4>
                <div class="${this.generateClassName('social', 'icons')}" style="display: flex; justify-content: center; gap: 1rem; margin-bottom: 1rem;">
                    <a href="#" style="color: white; font-size: 1.5rem; opacity: 0.8; transition: opacity 0.3s ease;">📘</a>
                    <a href="#" style="color: white; font-size: 1.5rem; opacity: 0.8; transition: opacity 0.3s ease;">🐦</a>
                    <a href="#" style="color: white; font-size: 1.5rem; opacity: 0.8; transition: opacity 0.3s ease;">📷</a>
                </div>
                <p style="font-size: 0.9rem; opacity: 0.8;">Follow us for updates and new games!</p>
            </div>
        </div>
        <div style="text-align: center; padding-top: 2rem; border-top: 1px solid rgba(255,255,255,0.2);">
            <p style="margin: 0; opacity: 0.8;">&copy; 2024 ${this.siteName}. All rights reserved. | Social casino games for entertainment only.</p>
        </div>
    </div>
</footer>
<style>
.${this.generateClassName('footer', 'link')}:hover,
.${this.generateClassName('social', 'icons')} a:hover {
    opacity: 1 !important;
    color: ${this.config.colorScheme.accent} !important;
}
.${this.generateClassName('sitemap', 'section')}:hover {
    transform: translateY(-5px);
    transition: transform 0.3s ease;
}
</style>`;

            case 'dark':
                return `
<footer class="${footerClass} ${this.generateClassName('footer', 'dark')}" style="background: linear-gradient(180deg, #0a0a0a, #1a1a1a); color: white; padding: 4rem 0; position: relative; overflow: hidden;">
    <div style="position: absolute; inset: 0; background: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1000 1000\"><defs><radialGradient id=\"grad\" cx=\"50%\" cy=\"50%\" r=\"50%\"><stop offset=\"0%\" style=\"stop-color:${this.config.colorScheme.primary.replace('#', '%23')};stop-opacity:0.1\" /><stop offset=\"100%\" style=\"stop-color:transparent;stop-opacity:0\" /></radialGradient></defs><circle cx=\"200\" cy=\"200\" r=\"300\" fill=\"url(%23grad)\" /><circle cx=\"800\" cy=\"800\" r=\"400\" fill=\"url(%23grad)\" /></svg>') center/cover; opacity: 0.3;"></div>
    <div class="${containerClass}" style="position: relative; z-index: 2;">
        <div style="text-align: center; margin-bottom: 3rem;">
            <h2 style="font-size: 2.5rem; margin-bottom: 0.5rem; background: linear-gradient(45deg, ${this.config.colorScheme.primary}, ${this.config.colorScheme.accent}); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">${this.siteName}</h2>
            <p style="font-size: 1.2rem; opacity: 0.8; margin-bottom: 2rem;">Premium Social Casino Experience</p>
            <div class="${this.generateClassName('social', 'icons')}" style="display: flex; justify-content: center; gap: 1.5rem;">
                <a href="#" style="color: white; font-size: 2rem; opacity: 0.7; transition: all 0.3s ease; padding: 10px; border-radius: 50%; background: rgba(255,255,255,0.1); backdrop-filter: blur(10px);">📘</a>
                <a href="#" style="color: white; font-size: 2rem; opacity: 0.7; transition: all 0.3s ease; padding: 10px; border-radius: 50%; background: rgba(255,255,255,0.1); backdrop-filter: blur(10px);">🐦</a>
                <a href="#" style="color: white; font-size: 2rem; opacity: 0.7; transition: all 0.3s ease; padding: 10px; border-radius: 50%; background: rgba(255,255,255,0.1); backdrop-filter: blur(10px);">📷</a>
                <a href="#" style="color: white; font-size: 2rem; opacity: 0.7; transition: all 0.3s ease; padding: 10px; border-radius: 50%; background: rgba(255,255,255,0.1); backdrop-filter: blur(10px);">📺</a>
            </div>
        </div>
        <div class="${this.generateClassName('footer', 'content')}" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 3rem; margin-bottom: 3rem;">
            <div>
                <h4 style="margin-bottom: 1.5rem; color: ${this.config.colorScheme.accent}; font-size: 1.2rem;">Navigation</h4>
                <ul style="list-style: none; padding: 0; line-height: 2;">
                    <li><a href="index.html" class="${this.generateClassName('footer', 'link')}" style="color: #ccc; text-decoration: none; transition: all 0.3s ease; position: relative;">🏠 Home</a></li>
                    <li><a href="games.html" class="${this.generateClassName('footer', 'link')}" style="color: #ccc; text-decoration: none; transition: all 0.3s ease; position: relative;">🎮 All Games</a></li>
                    <li><a href="about.html" class="${this.generateClassName('footer', 'link')}" style="color: #ccc; text-decoration: none; transition: all 0.3s ease; position: relative;">ℹ️ About Us</a></li>
                    <li><a href="contact.html" class="${this.generateClassName('footer', 'link')}" style="color: #ccc; text-decoration: none; transition: all 0.3s ease; position: relative;">📧 Contact</a></li>
                </ul>
            </div>
            <div>
                <h4 style="margin-bottom: 1.5rem; color: ${this.config.colorScheme.accent}; font-size: 1.2rem;">Game Categories</h4>
                <ul style="list-style: none; padding: 0; line-height: 2;">
                    <li><a href="games.html?type=slot" class="${this.generateClassName('footer', 'link')}" style="color: #ccc; text-decoration: none; transition: all 0.3s ease; position: relative;">🎰 Slot Games</a></li>
                    <li><a href="games.html?type=table" class="${this.generateClassName('footer', 'link')}" style="color: #ccc; text-decoration: none; transition: all 0.3s ease; position: relative;">🃏 Table Games</a></li>
                    <li><a href="games.html?type=poker" class="${this.generateClassName('footer', 'link')}" style="color: #ccc; text-decoration: none; transition: all 0.3s ease; position: relative;">🂡 Video Poker</a></li>
                    <li><a href="games.html?type=live" class="${this.generateClassName('footer', 'link')}" style="color: #ccc; text-decoration: none; transition: all 0.3s ease; position: relative;">📺 Live Games</a></li>
                </ul>
            </div>
            <div>
                <h4 style="margin-bottom: 1.5rem; color: ${this.config.colorScheme.accent}; font-size: 1.2rem;">Legal & Support</h4>
                <ul style="list-style: none; padding: 0; line-height: 2;">
                    <li><a href="terms.html" class="${this.generateClassName('footer', 'link')}" style="color: #ccc; text-decoration: none; transition: all 0.3s ease; position: relative;">📄 Terms & Conditions</a></li>
                    <li><a href="privacy.html" class="${this.generateClassName('footer', 'link')}" style="color: #ccc; text-decoration: none; transition: all 0.3s ease; position: relative;">🔒 Privacy Policy</a></li>
                    <li><a href="cookies.html" class="${this.generateClassName('footer', 'link')}" style="color: #ccc; text-decoration: none; transition: all 0.3s ease; position: relative;">🍪 Cookie Policy</a></li>
                    <li><a href="responsible-gaming.html" class="${this.generateClassName('footer', 'link')}" style="color: #ccc; text-decoration: none; transition: all 0.3s ease; position: relative;">🛡️ Responsible Gaming</a></li>
                </ul>
            </div>
            <div>
                <h4 style="margin-bottom: 1.5rem; color: ${this.config.colorScheme.accent}; font-size: 1.2rem;">Language & Currency</h4>
                <select style="width: 100%; padding: 0.8rem; margin-bottom: 1rem; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; color: white; backdrop-filter: blur(10px);">
                    <option>🌍 English (US)</option>
                    <option>🇪🇸 Español</option>
                    <option>🇫🇷 Français</option>
                    <option>🇩🇪 Deutsch</option>
                </select>
                <select style="width: 100%; padding: 0.8rem; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; color: white; backdrop-filter: blur(10px);">
                    <option>💵 USD</option>
                    <option>💶 EUR</option>
                    <option>💷 GBP</option>
                    <option>💴 JPY</option>
                </select>
            </div>
        </div>
        <div style="text-align: center; padding-top: 2rem; border-top: 1px solid rgba(255,255,255,0.1);">
            <div style="display: flex; justify-content: center; gap: 2rem; margin-bottom: 1rem; flex-wrap: wrap;">
                <span style="color: #888; font-size: 0.9rem;">🔒 SSL Secured</span>
                <span style="color: #888; font-size: 0.9rem;">🛡️ RNG Certified</span>
                <span style="color: #888; font-size: 0.9rem;">🎯 Fair Play</span>
                <span style="color: #888; font-size: 0.9rem;">🔞 18+ Only</span>
            </div>
            <p style="margin: 0; color: #888; font-size: 0.9rem;">&copy; 2024 ${this.siteName}. All rights reserved. | Social casino games for entertainment only.</p>
        </div>
    </div>
</footer>
<style>
.${this.generateClassName('footer', 'link')}:hover {
    color: ${this.config.colorScheme.accent} !important;
    transform: translateX(5px);
}
.${this.generateClassName('social', 'icons')} a:hover {
    opacity: 1 !important;
    background: ${this.config.colorScheme.primary} !important;
    transform: translateY(-5px);
}
</style>`;

            default:
                return `
<footer class="${footerClass}">
    <div class="${containerClass}">
        <div class="${this.generateClassName('footer', 'grid')}">
            <div>
                <h4>${this.siteName}</h4>
                <p>Your favorite social casino destination</p>
            </div>
            <div>
                <h5>Quick Links</h5>
                <ul style="list-style: none;">
                    <li><a href="about.html" class="${this.generateClassName('footer', 'link')}">About Us</a></li>
                    <li><a href="contact.html" class="${this.generateClassName('footer', 'link')}">Contact</a></li>
                    <li><a href="games.html" class="${this.generateClassName('footer', 'link')}">All Games</a></li>
                </ul>
            </div>
            <div>
                <h5>Legal</h5>
                <ul style="list-style: none;">
                    <li><a href="terms.html" class="${this.generateClassName('footer', 'link')}">Terms & Conditions</a></li>
                    <li><a href="privacy.html" class="${this.generateClassName('footer', 'link')}">Privacy Policy</a></li>
                    <li><a href="cookies.html" class="${this.generateClassName('footer', 'link')}">Cookie Policy</a></li>
                    <li><a href="responsible-gaming.html" class="${this.generateClassName('footer', 'link')}">Responsible Gaming</a></li>
                </ul>
            </div>
        </div>
        <div style="text-align: center; padding-top: 2rem; border-top: 1px solid #444;">
            <p>&copy; 2024 ${this.siteName}. All rights reserved. | Social casino games for entertainment only.</p>
        </div>
    </div>
</footer>`;
        }
    }

    // Generate enhanced JavaScript
    generateJavaScript() {
        return `
<script>
// Enhanced JavaScript for ${this.siteName}

// Initialize site
document.addEventListener('DOMContentLoaded', function() {
    console.log('${this.siteName} loaded');
    initializeAnimations();
    initializeCarousel();
    initializeSlider();
    initializeSidebar();
});

// Animation utilities
function initializeAnimations() {
    const animatedElements = document.querySelectorAll('.${this.generateClassName('animate', 'fade-in')}');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });
    
    animatedElements.forEach(el => observer.observe(el));
}

// Carousel functionality
let carouselIndex = 0;
function initializeCarousel() {
    const track = document.querySelector('.${this.generateClassName('carousel', 'track')}');
    if (!track) return;
    
    setInterval(() => {
        moveCarousel(1);
    }, 5000);
}

function moveCarousel(direction) {
    const track = document.querySelector('.${this.generateClassName('carousel', 'track')}');
    const cards = track.querySelectorAll('.${this.generateClassName('game', 'card')}');
    if (!track || cards.length === 0) return;
    
    carouselIndex += direction;
    if (carouselIndex >= cards.length) carouselIndex = 0;
    if (carouselIndex < 0) carouselIndex = cards.length - 1;
    
    const cardWidth = cards[0].offsetWidth + 20;
    track.style.transform = \`translateX(-\${carouselIndex * cardWidth}px)\`;
}

// Hero slider functionality
let slideIndex = 0;
function initializeSlider() {
    const slides = document.querySelectorAll('.${this.generateClassName('slide')}');
    if (slides.length === 0) return;
    
    setInterval(() => {
        nextSlide();
    }, 4000);
}

function nextSlide() {
    const slides = document.querySelectorAll('.${this.generateClassName('slide')}');
    const dots = document.querySelectorAll('.${this.generateClassName('dot')}');
    
    slides[slideIndex].classList.remove('active');
    dots[slideIndex].classList.remove('active');
    
    slideIndex = (slideIndex + 1) % slides.length;
    
    slides[slideIndex].classList.add('active');
    dots[slideIndex].classList.add('active');
}

function previousSlide() {
    const slides = document.querySelectorAll('.${this.generateClassName('slide')}');
    const dots = document.querySelectorAll('.${this.generateClassName('dot')}');
    
    slides[slideIndex].classList.remove('active');
    dots[slideIndex].classList.remove('active');
    
    slideIndex = slideIndex === 0 ? slides.length - 1 : slideIndex - 1;
    
    slides[slideIndex].classList.add('active');
    dots[slideIndex].classList.add('active');
}

function currentSlide(n) {
    const slides = document.querySelectorAll('.${this.generateClassName('slide')}');
    const dots = document.querySelectorAll('.${this.generateClassName('dot')}');
    
    slides[slideIndex].classList.remove('active');
    dots[slideIndex].classList.remove('active');
    
    slideIndex = n - 1;
    
    slides[slideIndex].classList.add('active');
    dots[slideIndex].classList.add('active');
}

// Sidebar functionality
function initializeSidebar() {
    const sidebar = document.getElementById('sidebarNav');
    if (!sidebar) return;
    
    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && !e.target.classList.contains('${this.generateClassName('sidebar', 'toggle')}')) {
            sidebar.classList.remove('active');
        }
    });
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebarNav');
    if (sidebar) {
        sidebar.classList.toggle('active');
    }
}

// Smooth scrolling
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Game card hover effects
document.addEventListener('DOMContentLoaded', function() {
    const gameCards = document.querySelectorAll('.${this.generateClassName('game', 'card')}');
    gameCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Sticky navigation
window.addEventListener('scroll', function() {
    const stickyNav = document.getElementById('stickyNav');
    if (stickyNav) {
        if (window.scrollY > 100) {
            stickyNav.style.padding = '0.5rem 0';
            stickyNav.style.backgroundColor = '${this.config.colorScheme.secondary}ee';
        } else {
            stickyNav.style.padding = '1rem 0';
            stickyNav.style.backgroundColor = '${this.config.colorScheme.secondary}';
        }
    }
});

// Search functionality
function searchGames(query) {
    // This would integrate with the games data
    console.log('Searching for:', query);
}

// Newsletter subscription
function subscribeNewsletter(email) {
    console.log('Newsletter subscription:', email);
    alert('Thank you for subscribing!');
}
</script>`;
    }

    // Generate all pages with enhanced functionality
    async generateSite(outputDir) {
        console.log(`Generating ${this.siteName} for domain: ${this.domain}`);
        console.log(`Configuration: ${JSON.stringify(this.config, null, 2)}`);
        
        // Create directory structure
        this.createDirectoryStructure(outputDir);
        
        // Fetch game data
        console.log('Fetching game data...');
        await this.fetchGames();
        
        // Download thumbnails
        console.log('Downloading game thumbnails...');
        const featuredGames = this.getFeaturedGames();
        const newGames = this.getNewGames();
        const allGames = [...featuredGames, ...newGames];
        
        for (const game of allGames) {
            await this.downloadThumbnail(game, outputDir);
        }
        
        // Generate pages
        console.log('Generating enhanced HTML pages...');
        
        // Homepage with all sections
        const homeContent = `
            ${this.generateHero()}
            ${this.generateGameCards(featuredGames, 'Featured Games', 'featured')}
            ${this.generateGameCards(newGames, 'New Games', 'new')}
            ${this.generateAboutSection()}
        `;
        fs.writeFileSync(
            path.join(outputDir, 'index.html'),
            this.generateHTML('Home', homeContent)
        );
        
        // Enhanced games page
        const gamesContent = this.generateEnhancedGamesPage();
        fs.writeFileSync(
            path.join(outputDir, 'games.html'),
            this.generateHTML('Games', gamesContent)
        );
        
        // Enhanced individual game page
        fs.writeFileSync(
            path.join(outputDir, 'game.html'),
            this.generateEnhancedGamePage()
        );
        
        // Enhanced static pages
        this.generateEnhancedStaticPages(outputDir);
        
        // Generate CSS file if not inline
        if (!this.config.inlineCSS) {
            fs.writeFileSync(
                path.join(outputDir, 'css', 'style.css'),
                this.generateCSS()
            );
        }
        
        // Generate enhanced JavaScript file
        fs.writeFileSync(
            path.join(outputDir, 'js', 'main.js'),
            this.generateJavaScript()
        );
        
        console.log(`Enhanced site generated successfully in: ${outputDir}`);
        console.log(`Site features: ${Object.keys(this.config).map(k => `${k}: ${this.config[k]}`).join(', ')}`);
    }

    // Additional methods for enhanced functionality would continue here...
    // (generateAboutSection, generateEnhancedGamesPage, etc.)
    
    generateAboutSection() {
        const { aboutSection } = this.config;
        const containerClass = this.generateClassName('container');
        
        switch (aboutSection) {
            case 'statistics':
                return `
<section class="${this.generateClassName('section')} ${this.generateClassName('about', 'section')}" style="padding: 4rem 0; background: #f8f9fa;">
    <div class="${containerClass}">
        <h2 class="${this.generateClassName('text', 'center')} ${this.generateClassName('mb', '4')}">Why Choose ${this.siteName}?</h2>
        <div class="${this.generateClassName('grid', '3')}">
            <div class="${this.generateClassName('stat', 'card')} ${this.generateClassName('text', 'center')}">
                <div class="${this.generateClassName('stat', 'number')}" style="font-size: 3rem; font-weight: bold; color: ${this.config.colorScheme.primary};">500+</div>
                <h3>Free Games</h3>
                <p>Huge collection of casino games to play</p>
            </div>
            <div class="${this.generateClassName('stat', 'card')} ${this.generateClassName('text', 'center')}">
                <div class="${this.generateClassName('stat', 'number')}" style="font-size: 3rem; font-weight: bold; color: ${this.config.colorScheme.primary};">1M+</div>
                <h3>Happy Players</h3>
                <p>Join our community of casino game enthusiasts</p>
            </div>
            <div class="${this.generateClassName('stat', 'card')} ${this.generateClassName('text', 'center')}">
                <div class="${this.generateClassName('stat', 'number')}" style="font-size: 3rem; font-weight: bold; color: ${this.config.colorScheme.primary};">24/7</div>
                <h3>Always Open</h3>
                <p>Play anytime, anywhere, completely free</p>
            </div>
        </div>
    </div>
</section>`;

            case 'video':
                return `
<section class="${this.generateClassName('section')} ${this.generateClassName('about', 'section')}" style="padding: 4rem 0; background: linear-gradient(135deg, ${this.config.colorScheme.primary}20, ${this.config.colorScheme.secondary}20);">
    <div class="${containerClass}">
        <h2 class="${this.generateClassName('text', 'center')} ${this.generateClassName('mb', '4')}" style="font-size: 2.5rem;">Welcome to ${this.siteName}</h2>
        <div class="${this.generateClassName('video', 'container')}" style="position: relative; max-width: 800px; margin: 0 auto 3rem auto; border-radius: 15px; overflow: hidden; box-shadow: 0 15px 35px rgba(0,0,0,0.2);">
            <div style="position: relative; padding-bottom: 56.25%; height: 0; background: linear-gradient(45deg, ${this.config.colorScheme.primary}, ${this.config.colorScheme.secondary}); display: flex; align-items: center; justify-content: center;">
                <div class="${this.generateClassName('video', 'placeholder')}" style="text-align: center; color: white;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">🎬</div>
                    <h3 style="margin-bottom: 1rem;">Welcome Video</h3>
                    <p style="margin-bottom: 2rem; opacity: 0.9;">Discover the excitement of ${this.siteName}</p>
                    <button class="${this.generateClassName('btn', 'accent')}" onclick="playWelcomeVideo()" style="padding: 12px 30px; font-size: 1.1rem; border-radius: 25px;">▶️ Play Introduction</button>
                </div>
            </div>
        </div>
        <div class="${this.generateClassName('video', 'description')}" style="text-align: center; max-width: 700px; margin: 0 auto;">
            <p style="font-size: 1.2rem; line-height: 1.7; margin-bottom: 2rem; color: ${this.config.colorScheme.secondary};">
                Experience the thrill of premium casino gaming with our extensive collection of free games. 
                From classic slots to modern table games, we bring you the best of casino entertainment.
            </p>
            <div class="${this.generateClassName('features', 'grid')}" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; margin-top: 3rem;">
                <div style="text-align: center; padding: 1.5rem; background: white; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                    <div style="font-size: 2.5rem; margin-bottom: 1rem;">🎰</div>
                    <h4 style="margin-bottom: 0.5rem; color: ${this.config.colorScheme.primary};">Premium Slots</h4>
                    <p style="color: #666;">Latest slot games from top providers</p>
                </div>
                <div style="text-align: center; padding: 1.5rem; background: white; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                    <div style="font-size: 2.5rem; margin-bottom: 1rem;">🃏</div>
                    <h4 style="margin-bottom: 0.5rem; color: ${this.config.colorScheme.primary};">Table Games</h4>
                    <p style="color: #666;">Classic casino table games</p>
                </div>
                <div style="text-align: center; padding: 1.5rem; background: white; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                    <div style="font-size: 2.5rem; margin-bottom: 1rem;">📱</div>
                    <h4 style="margin-bottom: 0.5rem; color: ${this.config.colorScheme.primary};">Mobile Ready</h4>
                    <p style="color: #666;">Play anywhere, anytime</p>
                </div>
            </div>
        </div>
    </div>
</section>
<script>
function playWelcomeVideo() {
    const placeholder = document.querySelector('.${this.generateClassName('video', 'placeholder')}');
    placeholder.innerHTML = \`
        <iframe width="100%" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
                frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe>
    \`;
}
</script>`;

            case 'testimonials':
                return `
<section class="${this.generateClassName('section')} ${this.generateClassName('about', 'section')}" style="padding: 4rem 0; background: #f8f9fa;">
    <div class="${containerClass}">
        <h2 class="${this.generateClassName('text', 'center')} ${this.generateClassName('mb', '4')}" style="font-size: 2.5rem;">What Our Players Say</h2>
        <div class="${this.generateClassName('testimonials', 'carousel')}" style="position: relative; max-width: 1000px; margin: 0 auto;">
            <div class="${this.generateClassName('testimonials', 'track')}" style="display: flex; transition: transform 0.5s ease;" id="testimonialsTrack">
                <div class="${this.generateClassName('testimonial', 'slide')}" style="min-width: 100%; padding: 0 2rem;">
                    <div style="background: white; padding: 3rem; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); text-align: center; position: relative;">
                        <div style="position: absolute; top: -20px; left: 50%; transform: translateX(-50%); width: 80px; height: 80px; border-radius: 50%; background: url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face') center/cover; border: 4px solid white; box-shadow: 0 5px 15px rgba(0,0,0,0.2);"></div>
                        <div style="margin-top: 2rem;">
                            <div style="color: ${this.config.colorScheme.primary}; font-size: 3rem; margin-bottom: 1rem;">"</div>
                            <p style="font-size: 1.2rem; line-height: 1.6; margin-bottom: 2rem; color: #555; font-style: italic;">
                                ${this.siteName} offers an incredible selection of games! The graphics are amazing and I love that I can play for free. 
                                It's become my go-to site for casino entertainment.
                            </p>
                            <div class="${this.generateClassName('rating')}" style="margin-bottom: 1rem;">
                                <span style="color: #fbbf24; font-size: 1.5rem;">⭐⭐⭐⭐⭐</span>
                            </div>
                            <h4 style="color: ${this.config.colorScheme.primary}; margin-bottom: 0.5rem;">Alex Thompson</h4>
                            <p style="color: #888;">Slot Enthusiast</p>
                        </div>
                    </div>
                </div>
                <div class="${this.generateClassName('testimonial', 'slide')}" style="min-width: 100%; padding: 0 2rem;">
                    <div style="background: white; padding: 3rem; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); text-align: center; position: relative;">
                        <div style="position: absolute; top: -20px; left: 50%; transform: translateX(-50%); width: 80px; height: 80px; border-radius: 50%; background: url('https://images.unsplash.com/photo-1494790108755-2616b8b2c02?w=80&h=80&fit=crop&crop=face') center/cover; border: 4px solid white; box-shadow: 0 5px 15px rgba(0,0,0,0.2);"></div>
                        <div style="margin-top: 2rem;">
                            <div style="color: ${this.config.colorScheme.primary}; font-size: 3rem; margin-bottom: 1rem;">"</div>
                            <p style="font-size: 1.2rem; line-height: 1.6; margin-bottom: 2rem; color: #555; font-style: italic;">
                                The table games here are fantastic! The interface is smooth and the variety is impressive. 
                                I particularly enjoy the blackjack and roulette games.
                            </p>
                            <div class="${this.generateClassName('rating')}" style="margin-bottom: 1rem;">
                                <span style="color: #fbbf24; font-size: 1.5rem;">⭐⭐⭐⭐⭐</span>
                            </div>
                            <h4 style="color: ${this.config.colorScheme.primary}; margin-bottom: 0.5rem;">Sarah Martinez</h4>
                            <p style="color: #888;">Table Games Player</p>
                        </div>
                    </div>
                </div>
                <div class="${this.generateClassName('testimonial', 'slide')}" style="min-width: 100%; padding: 0 2rem;">
                    <div style="background: white; padding: 3rem; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); text-align: center; position: relative;">
                        <div style="position: absolute; top: -20px; left: 50%; transform: translateX(-50%); width: 80px; height: 80px; border-radius: 50%; background: url('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face') center/cover; border: 4px solid white; box-shadow: 0 5px 15px rgba(0,0,0,0.2);"></div>
                        <div style="margin-top: 2rem;">
                            <div style="color: ${this.config.colorScheme.primary}; font-size: 3rem; margin-bottom: 1rem;">"</div>
                            <p style="font-size: 1.2rem; line-height: 1.6; margin-bottom: 2rem; color: #555; font-style: italic;">
                                Perfect for mobile gaming! I can enjoy my favorite casino games during my commute. 
                                The site works flawlessly on my phone.
                            </p>
                            <div class="${this.generateClassName('rating')}" style="margin-bottom: 1rem;">
                                <span style="color: #fbbf24; font-size: 1.5rem;">⭐⭐⭐⭐⭐</span>
                            </div>
                            <h4 style="color: ${this.config.colorScheme.primary}; margin-bottom: 0.5rem;">Mike Johnson</h4>
                            <p style="color: #888;">Mobile Gamer</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="${this.generateClassName('testimonials', 'controls')}" style="display: flex; justify-content: center; gap: 1rem; margin-top: 2rem;">
                <button onclick="moveTestimonial(-1)" class="${this.generateClassName('btn', 'secondary')}" style="padding: 10px 20px; border-radius: 25px;">‹ Previous</button>
                <button onclick="moveTestimonial(1)" class="${this.generateClassName('btn', 'primary')}" style="padding: 10px 20px; border-radius: 25px;">Next ›</button>
            </div>
            <div class="${this.generateClassName('testimonials', 'dots')}" style="display: flex; justify-content: center; gap: 0.5rem; margin-top: 1rem;">
                <span class="${this.generateClassName('dot')} active" onclick="goToTestimonial(0)" style="width: 12px; height: 12px; border-radius: 50%; background: ${this.config.colorScheme.primary}; cursor: pointer; transition: all 0.3s ease;"></span>
                <span class="${this.generateClassName('dot')}" onclick="goToTestimonial(1)" style="width: 12px; height: 12px; border-radius: 50%; background: #ddd; cursor: pointer; transition: all 0.3s ease;"></span>
                <span class="${this.generateClassName('dot')}" onclick="goToTestimonial(2)" style="width: 12px; height: 12px; border-radius: 50%; background: #ddd; cursor: pointer; transition: all 0.3s ease;"></span>
            </div>
        </div>
    </div>
</section>
<script>
let currentTestimonial = 0;
function moveTestimonial(direction) {
    const track = document.getElementById('testimonialsTrack');
    const dots = document.querySelectorAll('.${this.generateClassName('dot')}');
    const totalSlides = 3;
    
    currentTestimonial += direction;
    if (currentTestimonial >= totalSlides) currentTestimonial = 0;
    if (currentTestimonial < 0) currentTestimonial = totalSlides - 1;
    
    track.style.transform = \`translateX(-\${currentTestimonial * 100}%)\`;
    
    dots.forEach((dot, index) => {
        if (index === currentTestimonial) {
            dot.style.background = '${this.config.colorScheme.primary}';
            dot.classList.add('active');
        } else {
            dot.style.background = '#ddd';
            dot.classList.remove('active');
        }
    });
}

function goToTestimonial(index) {
    currentTestimonial = index;
    moveTestimonial(0);
}

// Auto-rotate testimonials
setInterval(() => moveTestimonial(1), 5000);
</script>`;

            case 'interactive':
                return `
<section class="${this.generateClassName('section')} ${this.generateClassName('about', 'section')}" style="padding: 4rem 0; background: linear-gradient(135deg, ${this.config.colorScheme.primary}, ${this.config.colorScheme.secondary}); color: white; position: relative; overflow: hidden;">
    <div style="position: absolute; inset: 0; background: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1000 1000\"><circle cx=\"200\" cy=\"300\" r=\"2\" fill=\"white\" opacity=\"0.3\"><animate attributeName=\"r\" values=\"2;20;2\" dur=\"3s\" repeatCount=\"indefinite\"/></circle><circle cx=\"800\" cy=\"200\" r=\"3\" fill=\"white\" opacity=\"0.4\"><animate attributeName=\"r\" values=\"3;25;3\" dur=\"4s\" repeatCount=\"indefinite\"/></circle><circle cx=\"400\" cy=\"700\" r=\"2\" fill=\"white\" opacity=\"0.2\"><animate attributeName=\"r\" values=\"2;15;2\" dur=\"5s\" repeatCount=\"indefinite\"/></circle></svg>') center/cover;"></div>
    <div class="${containerClass}" style="position: relative; z-index: 2;">
        <h2 class="${this.generateClassName('text', 'center')} ${this.generateClassName('mb', '4')}" style="font-size: 2.5rem;">Discover ${this.siteName}</h2>
        <div class="${this.generateClassName('interactive', 'features')}" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-bottom: 3rem;">
            <div class="${this.generateClassName('feature', 'card')}" style="background: rgba(255,255,255,0.1); padding: 2rem; border-radius: 15px; text-align: center; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2); transition: all 0.3s ease; cursor: pointer;" onmouseover="animateCard(this)" onmouseout="resetCard(this)">
                <div class="${this.generateClassName('feature', 'icon')}" style="font-size: 3rem; margin-bottom: 1rem; transition: transform 0.3s ease;">🎰</div>
                <h3 style="margin-bottom: 1rem; color: ${this.config.colorScheme.accent};">500+ Slot Games</h3>
                <p style="opacity: 0.9; line-height: 1.6;">From classic fruit machines to modern video slots with stunning graphics and exciting bonus features.</p>
                <div class="${this.generateClassName('progress', 'bar')}" style="width: 100%; height: 4px; background: rgba(255,255,255,0.2); border-radius: 2px; margin-top: 1rem; overflow: hidden;">
                    <div class="${this.generateClassName('progress', 'fill')}" style="width: 0%; height: 100%; background: ${this.config.colorScheme.accent}; transition: width 1s ease;"></div>
                </div>
            </div>
            <div class="${this.generateClassName('feature', 'card')}" style="background: rgba(255,255,255,0.1); padding: 2rem; border-radius: 15px; text-align: center; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2); transition: all 0.3s ease; cursor: pointer;" onmouseover="animateCard(this)" onmouseout="resetCard(this)">
                <div class="${this.generateClassName('feature', 'icon')}" style="font-size: 3rem; margin-bottom: 1rem; transition: transform 0.3s ease;">🃏</div>
                <h3 style="margin-bottom: 1rem; color: ${this.config.colorScheme.accent};">Classic Table Games</h3>
                <p style="opacity: 0.9; line-height: 1.6;">Experience the elegance of blackjack, roulette, baccarat, and poker in our premium table game collection.</p>
                <div class="${this.generateClassName('progress', 'bar')}" style="width: 100%; height: 4px; background: rgba(255,255,255,0.2); border-radius: 2px; margin-top: 1rem; overflow: hidden;">
                    <div class="${this.generateClassName('progress', 'fill')}" style="width: 0%; height: 100%; background: ${this.config.colorScheme.accent}; transition: width 1s ease;"></div>
                </div>
            </div>
            <div class="${this.generateClassName('feature', 'card')}" style="background: rgba(255,255,255,0.1); padding: 2rem; border-radius: 15px; text-align: center; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2); transition: all 0.3s ease; cursor: pointer;" onmouseover="animateCard(this)" onmouseout="resetCard(this)">
                <div class="${this.generateClassName('feature', 'icon')}" style="font-size: 3rem; margin-bottom: 1rem; transition: transform 0.3s ease;">📱</div>
                <h3 style="margin-bottom: 1rem; color: ${this.config.colorScheme.accent};">Mobile Optimized</h3>
                <p style="opacity: 0.9; line-height: 1.6;">Play seamlessly across all devices with our responsive design and mobile-first approach.</p>
                <div class="${this.generateClassName('progress', 'bar')}" style="width: 100%; height: 4px; background: rgba(255,255,255,0.2); border-radius: 2px; margin-top: 1rem; overflow: hidden;">
                    <div class="${this.generateClassName('progress', 'fill')}" style="width: 0%; height: 100%; background: ${this.config.colorScheme.accent}; transition: width 1s ease;"></div>
                </div>
            </div>
        </div>
        <div class="${this.generateClassName('interactive', 'stats')}" style="display: flex; justify-content: center; gap: 3rem; flex-wrap: wrap;">
            <div class="${this.generateClassName('stat', 'counter')}" style="text-align: center;">
                <div class="${this.generateClassName('counter', 'number')}" style="font-size: 3rem; font-weight: bold; color: ${this.config.colorScheme.accent};" data-target="1000000">0</div>
                <p style="opacity: 0.9;">Games Played</p>
            </div>
            <div class="${this.generateClassName('stat', 'counter')}" style="text-align: center;">
                <div class="${this.generateClassName('counter', 'number')}" style="font-size: 3rem; font-weight: bold; color: ${this.config.colorScheme.accent};" data-target="50000">0</div>
                <p style="opacity: 0.9;">Active Players</p>
            </div>
            <div class="${this.generateClassName('stat', 'counter')}" style="text-align: center;">
                <div class="${this.generateClassName('counter', 'number')}" style="font-size: 3rem; font-weight: bold; color: ${this.config.colorScheme.accent};" data-target="500">0</div>
                <p style="opacity: 0.9;">Available Games</p>
            </div>
        </div>
    </div>
</section>
<script>
function animateCard(card) {
    const icon = card.querySelector('.${this.generateClassName('feature', 'icon')}');
    const progressFill = card.querySelector('.${this.generateClassName('progress', 'fill')}');
    
    card.style.transform = 'translateY(-10px) scale(1.02)';
    card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
    icon.style.transform = 'scale(1.2) rotateY(180deg)';
    progressFill.style.width = '100%';
}

function resetCard(card) {
    const icon = card.querySelector('.${this.generateClassName('feature', 'icon')}');
    const progressFill = card.querySelector('.${this.generateClassName('progress', 'fill')}');
    
    card.style.transform = 'translateY(0) scale(1)';
    card.style.boxShadow = 'none';
    icon.style.transform = 'scale(1) rotateY(0deg)';
    progressFill.style.width = '0%';
}

// Animate counters when in view
function animateCounters() {
    const counters = document.querySelectorAll('.${this.generateClassName('counter', 'number')}');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = Math.floor(current).toLocaleString();
        }, 16);
    });
}

// Trigger animations when section is visible
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            observer.unobserve(entry.target);
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const section = document.querySelector('.${this.generateClassName('about', 'section')}');
    if (section) observer.observe(section);
});
</script>`;

            case 'text-icons':
                return `
<section class="${this.generateClassName('section')} ${this.generateClassName('about', 'section')}" style="padding: 4rem 0; background: #f8f9fa;">
    <div class="${containerClass}">
        <h2 class="${this.generateClassName('text', 'center')} ${this.generateClassName('mb', '4')}" style="font-size: 2.5rem;">Why Choose ${this.siteName}?</h2>
        <div class="${this.generateClassName('features', 'grid')}" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem;">
            <div class="${this.generateClassName('feature', 'item')}" style="text-align: center; padding: 2rem; background: white; border-radius: 12px; box-shadow: 0 5px 15px rgba(0,0,0,0.08); transition: all 0.3s ease;">
                <div class="${this.generateClassName('feature', 'icon')}" style="width: 80px; height: 80px; margin: 0 auto 1.5rem auto; background: linear-gradient(45deg, ${this.config.colorScheme.primary}, ${this.config.colorScheme.secondary}); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem;">🎰</div>
                <h3 style="margin-bottom: 1rem; color: ${this.config.colorScheme.primary};">Premium Games</h3>
                <p style="color: #666; line-height: 1.6;">Access hundreds of high-quality casino games from top providers worldwide.</p>
            </div>
            <div class="${this.generateClassName('feature', 'item')}" style="text-align: center; padding: 2rem; background: white; border-radius: 12px; box-shadow: 0 5px 15px rgba(0,0,0,0.08); transition: all 0.3s ease;">
                <div class="${this.generateClassName('feature', 'icon')}" style="width: 80px; height: 80px; margin: 0 auto 1.5rem auto; background: linear-gradient(45deg, ${this.config.colorScheme.primary}, ${this.config.colorScheme.secondary}); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem;">🔒</div>
                <h3 style="margin-bottom: 1rem; color: ${this.config.colorScheme.primary};">100% Safe</h3>
                <p style="color: #666; line-height: 1.6;">Secure platform with SSL encryption and responsible gaming practices.</p>
            </div>
            <div class="${this.generateClassName('feature', 'item')}" style="text-align: center; padding: 2rem; background: white; border-radius: 12px; box-shadow: 0 5px 15px rgba(0,0,0,0.08); transition: all 0.3s ease;">
                <div class="${this.generateClassName('feature', 'icon')}" style="width: 80px; height: 80px; margin: 0 auto 1.5rem auto; background: linear-gradient(45deg, ${this.config.colorScheme.primary}, ${this.config.colorScheme.secondary}); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem;">⚡</div>
                <h3 style="margin-bottom: 1rem; color: ${this.config.colorScheme.primary};">Instant Play</h3>
                <p style="color: #666; line-height: 1.6;">No downloads or registration required. Start playing immediately in your browser.</p>
            </div>
            <div class="${this.generateClassName('feature', 'item')}" style="text-align: center; padding: 2rem; background: white; border-radius: 12px; box-shadow: 0 5px 15px rgba(0,0,0,0.08); transition: all 0.3s ease;">
                <div class="${this.generateClassName('feature', 'icon')}" style="width: 80px; height: 80px; margin: 0 auto 1.5rem auto; background: linear-gradient(45deg, ${this.config.colorScheme.primary}, ${this.config.colorScheme.secondary}); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem;">📱</div>
                <h3 style="margin-bottom: 1rem; color: ${this.config.colorScheme.primary};">Mobile Ready</h3>
                <p style="color: #666; line-height: 1.6;">Optimized for all devices with responsive design and touch controls.</p>
            </div>
            <div class="${this.generateClassName('feature', 'item')}" style="text-align: center; padding: 2rem; background: white; border-radius: 12px; box-shadow: 0 5px 15px rgba(0,0,0,0.08); transition: all 0.3s ease;">
                <div class="${this.generateClassName('feature', 'icon')}" style="width: 80px; height: 80px; margin: 0 auto 1.5rem auto; background: linear-gradient(45deg, ${this.config.colorScheme.primary}, ${this.config.colorScheme.secondary}); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem;">🎯</div>
                <h3 style="margin-bottom: 1rem; color: ${this.config.colorScheme.primary};">Free Forever</h3>
                <p style="color: #666; line-height: 1.6;">All games are completely free to play with no hidden costs or limitations.</p>
            </div>
            <div class="${this.generateClassName('feature', 'item')}" style="text-align: center; padding: 2rem; background: white; border-radius: 12px; box-shadow: 0 5px 15px rgba(0,0,0,0.08); transition: all 0.3s ease;">
                <div class="${this.generateClassName('feature', 'icon')}" style="width: 80px; height: 80px; margin: 0 auto 1.5rem auto; background: linear-gradient(45deg, ${this.config.colorScheme.primary}, ${this.config.colorScheme.secondary}); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem;">🌟</div>
                <h3 style="margin-bottom: 1rem; color: ${this.config.colorScheme.primary};">Regular Updates</h3>
                <p style="color: #666; line-height: 1.6;">New games added regularly to keep your gaming experience fresh and exciting.</p>
            </div>
        </div>
    </div>
</section>
<style>
.${this.generateClassName('feature', 'item')}:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 35px rgba(0,0,0,0.15);
}
.${this.generateClassName('feature', 'item')}:hover .${this.generateClassName('feature', 'icon')} {
    transform: scale(1.1);
}
</style>`;

            default:
                return `
<section class="${this.generateClassName('section')} ${this.generateClassName('about', 'section')}" style="padding: 4rem 0; background: #f8f9fa;">
    <div class="${containerClass}">
        <div class="${this.generateClassName('grid', '2')}" style="align-items: center; gap: 3rem;">
            <div>
                <h2 style="margin-bottom: 1.5rem;">About ${this.siteName}</h2>
                <p style="font-size: 1.1rem; line-height: 1.6; margin-bottom: 1.5rem;">
                    Welcome to the ultimate social casino experience! We offer hundreds of free casino games 
                    that you can play instantly in your browser. No downloads, no registration required.
                </p>
                <ul style="list-style: none; padding: 0;">
                    <li style="margin-bottom: 0.5rem;">✅ 100% Free to Play</li>
                    <li style="margin-bottom: 0.5rem;">✅ No Download Required</li>
                    <li style="margin-bottom: 0.5rem;">✅ Instant Play</li>
                    <li style="margin-bottom: 0.5rem;">✅ Mobile Friendly</li>
                </ul>
            </div>
            <div>
                <img src="https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=300&fit=crop" alt="About Us" style="width: 100%; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
            </div>
        </div>
    </div>
</section>`;
        }
    }

    generateEnhancedGamesPage() {
        const containerClass = this.generateClassName('container');
        const { gamesPageLayout } = this.config;
        
        return `
<div class="${containerClass}" style="padding: 4rem 0;">
    <h1 class="${this.generateClassName('text', 'center')} ${this.generateClassName('mb', '4')}" style="font-size: 3rem;">All Casino Games</h1>
    
    <div class="${this.generateClassName('games', 'filters')} ${this.generateClassName('mb', '4')}" style="background: #f8f9fa; padding: 2rem; border-radius: 10px;">
        <div class="${this.generateClassName('flex', 'wrap')}" style="gap: 1rem; justify-content: center;">
            <input type="search" id="gameSearch" placeholder="Search games..." class="${this.generateClassName('search', 'input')}" style="padding: 0.75rem; border: 1px solid #ddd; border-radius: 5px; min-width: 300px;">
            <select id="providerFilter" class="${this.generateClassName('filter', 'select')}" style="padding: 0.75rem; border: 1px solid #ddd; border-radius: 5px;">
                <option value="">All Providers</option>
                <option value="netent">NetEnt</option>
                <option value="microgaming">Microgaming</option>
                <option value="playngo">Play'n GO</option>
                <option value="evolution">Evolution</option>
            </select>
            <select id="typeFilter" class="${this.generateClassName('filter', 'select')}" style="padding: 0.75rem; border: 1px solid #ddd; border-radius: 5px;">
                <option value="">All Types</option>
                <option value="slot">Slots</option>
                <option value="table">Table Games</option>
                <option value="poker">Video Poker</option>
            </select>
        </div>
    </div>
    
    <div id="games-grid" class="${this.generateClassName('grid', '4')}">
        <!-- Games will be loaded here by JavaScript -->
    </div>
    
    <div id="pagination" class="${this.generateClassName('text', 'center')} ${this.generateClassName('mt', '4')}">
        <!-- Pagination will be added here -->
    </div>
</div>

<script>
// Enhanced games page functionality
let allGames = ${JSON.stringify(this.gameData || [])};
let currentPage = 1;
let gamesPerPage = 20;
let filteredGames = [...allGames];

function loadAllGames() {
    const gamesGrid = document.getElementById('games-grid');
    const startIndex = (currentPage - 1) * gamesPerPage;
    const endIndex = startIndex + gamesPerPage;
    const gamesToShow = filteredGames.slice(startIndex, endIndex);
    
    gamesGrid.innerHTML = gamesToShow.map(game => \`
        <div class="${this.generateClassName('card')} ${this.generateClassName('game', 'card')}">
            <img src="images/games/\${game.slug}-\${game.id}.jpg" alt="\${game.name}" class="${this.generateClassName('game', 'image')}" loading="lazy">
            <div class="${this.generateClassName('game', 'info')}">
                <h3 class="${this.generateClassName('game', 'title')}">\${game.name}</h3>
                <p class="${this.generateClassName('game', 'provider')}">\${game.provider}</p>
                <p class="${this.generateClassName('game', 'type')}" style="color: #888; font-size: 0.9rem; margin-bottom: 1rem;">\${game.type}</p>
                <a href="game.html?slug=\${game.slug}" class="${this.generateClassName('btn', 'primary')}" style="width: 100%; text-align: center; text-decoration: none; display: block;">Play Game</a>
            </div>
        </div>
    \`).join('');
    
    updatePagination();
}

function updatePagination() {
    const totalPages = Math.ceil(filteredGames.length / gamesPerPage);
    const pagination = document.getElementById('pagination');
    
    let paginationHTML = '';
    
    if (currentPage > 1) {
        paginationHTML += \`<button onclick="changePage(\${currentPage - 1})" class="${this.generateClassName('btn', 'secondary')}" style="margin: 0 5px;">Previous</button>\`;
    }
    
    for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
        const isActive = i === currentPage ? 'active' : '';
        paginationHTML += \`<button onclick="changePage(\${i})" class="${this.generateClassName('btn', 'primary')} \${isActive}" style="margin: 0 5px;">\${i}</button>\`;
    }
    
    if (currentPage < totalPages) {
        paginationHTML += \`<button onclick="changePage(\${currentPage + 1})" class="${this.generateClassName('btn', 'secondary')}" style="margin: 0 5px;">Next</button>\`;
    }
    
    pagination.innerHTML = paginationHTML;
}

function changePage(page) {
    currentPage = page;
    loadAllGames();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function filterGames() {
    const searchTerm = document.getElementById('gameSearch').value.toLowerCase();
    const providerFilter = document.getElementById('providerFilter').value.toLowerCase();
    const typeFilter = document.getElementById('typeFilter').value.toLowerCase();
    
    filteredGames = allGames.filter(game => {
        const matchesSearch = game.name.toLowerCase().includes(searchTerm);
        const matchesProvider = !providerFilter || game.provider.toLowerCase().includes(providerFilter);
        const matchesType = !typeFilter || game.type.toLowerCase().includes(typeFilter);
        
        return matchesSearch && matchesProvider && matchesType;
    });
    
    currentPage = 1;
    loadAllGames();
}

// Event listeners
document.getElementById('gameSearch').addEventListener('input', filterGames);
document.getElementById('providerFilter').addEventListener('change', filterGames);
document.getElementById('typeFilter').addEventListener('change', filterGames);

// Initial load
loadAllGames();
</script>`;
    }

    generateEnhancedGamePage() {
        const containerClass = this.generateClassName('container');
        const { gamePageLayout } = this.config;
        
        return this.generateHTML('Game', `
<div class="${containerClass}" style="padding: 2rem 0;">
    <div id="game-container">
        <div class="${this.generateClassName('text', 'center')} ${this.generateClassName('mb', '3')}">
            <button onclick="history.back()" class="${this.generateClassName('btn', 'secondary')}">← Back to Games</button>
        </div>
        
        <div id="game-content" style="display: none;">
            <!-- Game content will be loaded here -->
        </div>
        
        <div id="loading" class="${this.generateClassName('text', 'center')}" style="padding: 4rem 0;">
            <div class="${this.generateClassName('loading', 'spinner')}" style="display: inline-block; width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid ${this.config.colorScheme.primary}; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            <p style="margin-top: 1rem;">Loading game...</p>
        </div>
    </div>
</div>

<style>
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>

<script>
// Enhanced individual game page
function loadGame() {
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');
    
    if (!slug) {
        document.getElementById('loading').innerHTML = '<p>Game not found</p>';
        return;
    }
    
    const games = ${JSON.stringify(this.gameData || [])};
    const game = games.find(g => g.slug === slug);
    
    if (!game) {
        document.getElementById('loading').innerHTML = '<p>Game not found</p>';
        return;
    }
    
    // Update page title
    document.title = \`\${game.name} | ${this.siteName}\`;
    
    setTimeout(() => {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('game-content').style.display = 'block';
        document.getElementById('game-content').innerHTML = generateGameContent(game);
    }, 1000);
}

function generateGameContent(game) {
    const relatedGames = ${JSON.stringify(this.gameData || [])}.filter(g => 
        g.provider === game.provider && g.id !== game.id
    ).slice(0, 4);
    
    return \`
        <div class="${this.generateClassName('text', 'center')} ${this.generateClassName('mb', '3')}">
            <h1 style="font-size: 2.5rem; margin-bottom: 0.5rem;">\${game.name}</h1>
            <p style="color: #666; font-size: 1.1rem;">by \${game.provider}</p>
        </div>
        
        <div class="${this.generateClassName('game', 'player')} ${this.generateClassName('mb', '4')}" style="background: #f5f5f5; padding: 2rem; border-radius: 8px; position: relative;">
            <iframe 
                id="game-iframe"
                src="https://slotslaunch.com/iframe/\${game.id}?token=${this.apiToken}"
                width="100%" 
                height="600" 
                frameborder="0"
                style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"
                onload="gameLoaded()">
            </iframe>
            <div class="${this.generateClassName('game', 'controls')} ${this.generateClassName('text', 'center')}" style="margin-top: 1rem;">
                <button onclick="toggleFullscreen()" class="${this.generateClassName('btn', 'primary')}" style="margin-right: 1rem;">Toggle Fullscreen</button>
                <button onclick="refreshGame()" class="${this.generateClassName('btn', 'secondary')}">Refresh Game</button>
            </div>
        </div>
        
        <div class="${this.generateClassName('grid', '2')}" style="gap: 2rem; margin-bottom: 3rem;">
            <div class="${this.generateClassName('card')}">
                <div class="${this.generateClassName('p', '3')}">
                    <h3 class="${this.generateClassName('mb', '2')}">Game Information</h3>
                    <div class="${this.generateClassName('game', 'meta')}">
                        <p><strong>Provider:</strong> \${game.provider}</p>
                        <p><strong>Type:</strong> \${game.type}</p>
                        <p><strong>Description:</strong> \${game.description || 'Experience this exciting casino game!'}</p>
                    </div>
                </div>
            </div>
            <div class="${this.generateClassName('card')}">
                <div class="${this.generateClassName('p', '3')}">
                    <h3 class="${this.generateClassName('mb', '2')}">How to Play</h3>
                    <ul style="padding-left: 1.5rem;">
                        <li>Click the spin button to start playing</li>
                        <li>Adjust your bet size using the controls</li>
                        <li>Watch for winning combinations</li>
                        <li>Enjoy the bonus features!</li>
                    </ul>
                </div>
            </div>
        </div>
        
        \${relatedGames.length > 0 ? \`
        <div class="${this.generateClassName('related', 'games')}">
            <h3 class="${this.generateClassName('text', 'center')} ${this.generateClassName('mb', '3')}">More Games from \${game.provider}</h3>
            <div class="${this.generateClassName('grid', '4')}">
                \${relatedGames.map(relatedGame => \`
                    <div class="${this.generateClassName('card')} ${this.generateClassName('game', 'card')}">
                        <img src="images/games/\${relatedGame.slug}-\${relatedGame.id}.jpg" alt="\${relatedGame.name}" class="${this.generateClassName('game', 'image')}" loading="lazy">
                        <div class="${this.generateClassName('game', 'info')}">
                            <h4 class="${this.generateClassName('game', 'title')}">\${relatedGame.name}</h4>
                            <p class="${this.generateClassName('game', 'provider')}">\${relatedGame.provider}</p>
                            <a href="game.html?slug=\${relatedGame.slug}" class="${this.generateClassName('btn', 'primary')}" style="width: 100%; text-align: center; text-decoration: none; display: block;">Play Game</a>
                        </div>
                    </div>
                \`).join('')}
            </div>
        </div>
        \` : ''}
    \`;
}

function toggleFullscreen() {
    const iframe = document.getElementById('game-iframe');
    if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
    } else if (iframe.webkitRequestFullscreen) {
        iframe.webkitRequestFullscreen();
    } else if (iframe.msRequestFullscreen) {
        iframe.msRequestFullscreen();
    }
}

function refreshGame() {
    const iframe = document.getElementById('game-iframe');
    iframe.src = iframe.src;
}

function gameLoaded() {
    console.log('Game loaded successfully');
}

// Load game on page load
loadGame();
</script>`);
    }

    generateEnhancedStaticPages(outputDir) {
        // Enhanced about page with variations
        const aboutContent = this.generateEnhancedAboutPage();
        fs.writeFileSync(
            path.join(outputDir, 'about.html'),
            this.generateHTML('About Us', aboutContent)
        );
        
        // Enhanced contact page with variations
        const contactContent = this.generateEnhancedContactPage();
        fs.writeFileSync(
            path.join(outputDir, 'contact.html'),
            this.generateHTML('Contact Us', contactContent)
        );
        
        // Enhanced legal pages
        this.generateEnhancedLegalPages(outputDir);
    }

    generateEnhancedAboutPage() {
        const { aboutPageLayout } = this.config;
        const containerClass = this.generateClassName('container');
        
        switch (aboutPageLayout) {
            case 'timeline':
                return `
<div class="${containerClass}" style="padding: 4rem 0;">
    <h1 class="${this.generateClassName('text', 'center')} ${this.generateClassName('mb', '4')}" style="font-size: 3rem;">About ${this.siteName}</h1>
    
    <div class="${this.generateClassName('timeline')}" style="position: relative; max-width: 800px; margin: 0 auto;">
        <div class="${this.generateClassName('timeline', 'line')}" style="position: absolute; left: 50%; transform: translateX(-50%); width: 2px; height: 100%; background: ${this.config.colorScheme.primary};"></div>
        
        <div class="${this.generateClassName('timeline', 'item')}" style="position: relative; padding: 2rem; margin-bottom: 2rem;">
            <div class="${this.generateClassName('timeline', 'content')} ${this.generateClassName('card')}" style="padding: 2rem; margin-left: 60%;">
                <h3>2020 - Founded</h3>
                <p>Started as a passion project to bring quality casino entertainment to everyone.</p>
            </div>
        </div>
        
        <div class="${this.generateClassName('timeline', 'item')}" style="position: relative; padding: 2rem; margin-bottom: 2rem;">
            <div class="${this.generateClassName('timeline', 'content')} ${this.generateClassName('card')}" style="padding: 2rem; margin-right: 60%;">
                <h3>2021 - Growth</h3>
                <p>Expanded our game library to include hundreds of premium casino games.</p>
            </div>
        </div>
        
        <div class="${this.generateClassName('timeline', 'item')}" style="position: relative; padding: 2rem; margin-bottom: 2rem;">
            <div class="${this.generateClassName('timeline', 'content')} ${this.generateClassName('card')}" style="padding: 2rem; margin-left: 60%;">
                <h3>2022 - Innovation</h3>
                <p>Introduced mobile-first design and enhanced user experience.</p>
            </div>
        </div>
        
        <div class="${this.generateClassName('timeline', 'item')}" style="position: relative; padding: 2rem;">
            <div class="${this.generateClassName('timeline', 'content')} ${this.generateClassName('card')}" style="padding: 2rem; margin-right: 60%;">
                <h3>2024 - Today</h3>
                <p>Serving over 1 million players worldwide with the best casino gaming experience.</p>
            </div>
        </div>
    </div>
</div>`;

            case 'team-grid':
                return `
<div class="${containerClass}" style="padding: 4rem 0;">
    <h1 class="${this.generateClassName('text', 'center')} ${this.generateClassName('mb', '4')}" style="font-size: 3rem;">About ${this.siteName}</h1>
    
    <div class="${this.generateClassName('about', 'intro')}" style="text-align: center; max-width: 800px; margin: 0 auto 4rem auto;">
        <p style="font-size: 1.2rem; line-height: 1.7; color: #666;">
            Our passionate team is dedicated to providing the best social casino gaming experience. 
            Meet the people behind ${this.siteName} who work tirelessly to bring you entertainment and joy.
        </p>
    </div>
    
    <div class="${this.generateClassName('team', 'grid')}" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; margin-bottom: 4rem;">
        <div class="${this.generateClassName('team', 'member')}" style="text-align: center; padding: 2rem; background: white; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); transition: transform 0.3s ease;">
            <div class="${this.generateClassName('member', 'avatar')}" style="width: 120px; height: 120px; border-radius: 50%; background: url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face') center/cover; margin: 0 auto 1.5rem auto; border: 4px solid ${this.config.colorScheme.primary};"></div>
            <h3 style="margin-bottom: 0.5rem; color: ${this.config.colorScheme.primary};">Alex Thompson</h3>
            <p style="color: ${this.config.colorScheme.secondary}; margin-bottom: 1rem; font-weight: 600;">Founder & CEO</p>
            <p style="color: #666; line-height: 1.6; margin-bottom: 1.5rem;">
                Passionate about creating the best gaming experiences. Over 10 years in the casino industry.
            </p>
            <div class="${this.generateClassName('social', 'links')}" style="display: flex; justify-content: center; gap: 1rem;">
                <a href="#" style="color: ${this.config.colorScheme.primary}; font-size: 1.5rem;">📧</a>
                <a href="#" style="color: ${this.config.colorScheme.primary}; font-size: 1.5rem;">💼</a>
                <a href="#" style="color: ${this.config.colorScheme.primary}; font-size: 1.5rem;">🐦</a>
            </div>
        </div>
        
        <div class="${this.generateClassName('team', 'member')}" style="text-align: center; padding: 2rem; background: white; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); transition: transform 0.3s ease;">
            <div class="${this.generateClassName('member', 'avatar')}" style="width: 120px; height: 120px; border-radius: 50%; background: url('https://images.unsplash.com/photo-1494790108755-2616b8b2c02d?w=120&h=120&fit=crop&crop=face') center/cover; margin: 0 auto 1.5rem auto; border: 4px solid ${this.config.colorScheme.primary};"></div>
            <h3 style="margin-bottom: 0.5rem; color: ${this.config.colorScheme.primary};">Sarah Martinez</h3>
            <p style="color: ${this.config.colorScheme.secondary}; margin-bottom: 1rem; font-weight: 600;">CTO & Lead Developer</p>
            <p style="color: #666; line-height: 1.6; margin-bottom: 1.5rem;">
                Technical genius behind our platform. Specializes in gaming technology and user experience.
            </p>
            <div class="${this.generateClassName('social', 'links')}" style="display: flex; justify-content: center; gap: 1rem;">
                <a href="#" style="color: ${this.config.colorScheme.primary}; font-size: 1.5rem;">📧</a>
                <a href="#" style="color: ${this.config.colorScheme.primary}; font-size: 1.5rem;">💻</a>
                <a href="#" style="color: ${this.config.colorScheme.primary}; font-size: 1.5rem;">🐙</a>
            </div>
        </div>
        
        <div class="${this.generateClassName('team', 'member')}" style="text-align: center; padding: 2rem; background: white; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); transition: transform 0.3s ease;">
            <div class="${this.generateClassName('member', 'avatar')}" style="width: 120px; height: 120px; border-radius: 50%; background: url('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face') center/cover; margin: 0 auto 1.5rem auto; border: 4px solid ${this.config.colorScheme.primary};"></div>
            <h3 style="margin-bottom: 0.5rem; color: ${this.config.colorScheme.primary};">Mike Johnson</h3>
            <p style="color: ${this.config.colorScheme.secondary}; margin-bottom: 1rem; font-weight: 600;">Game Design Director</p>
            <p style="color: #666; line-height: 1.6; margin-bottom: 1.5rem;">
                Creative mastermind who ensures every game delivers maximum entertainment value.
            </p>
            <div class="${this.generateClassName('social', 'links')}" style="display: flex; justify-content: center; gap: 1rem;">
                <a href="#" style="color: ${this.config.colorScheme.primary}; font-size: 1.5rem;">📧</a>
                <a href="#" style="color: ${this.config.colorScheme.primary}; font-size: 1.5rem;">🎨</a>
                <a href="#" style="color: ${this.config.colorScheme.primary}; font-size: 1.5rem;">📸</a>
            </div>
        </div>
        
        <div class="${this.generateClassName('team', 'member')}" style="text-align: center; padding: 2rem; background: white; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); transition: transform 0.3s ease;">
            <div class="${this.generateClassName('member', 'avatar')}" style="width: 120px; height: 120px; border-radius: 50%; background: url('https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop&crop=face') center/cover; margin: 0 auto 1.5rem auto; border: 4px solid ${this.config.colorScheme.primary};"></div>
            <h3 style="margin-bottom: 0.5rem; color: ${this.config.colorScheme.primary};">Emma Wilson</h3>
            <p style="color: ${this.config.colorScheme.secondary}; margin-bottom: 1rem; font-weight: 600;">Community Manager</p>
            <p style="color: #666; line-height: 1.6; margin-bottom: 1.5rem;">
                Dedicated to building our amazing community and ensuring every player has a great experience.
            </p>
            <div class="${this.generateClassName('social', 'links')}" style="display: flex; justify-content: center; gap: 1rem;">
                <a href="#" style="color: ${this.config.colorScheme.primary}; font-size: 1.5rem;">📧</a>
                <a href="#" style="color: ${this.config.colorScheme.primary}; font-size: 1.5rem;">👥</a>
                <a href="#" style="color: ${this.config.colorScheme.primary}; font-size: 1.5rem;">📱</a>
            </div>
        </div>
    </div>
    
    <div class="${this.generateClassName('company', 'values')}" style="background: #f8f9fa; padding: 3rem; border-radius: 15px; text-align: center;">
        <h2 style="margin-bottom: 2rem; color: ${this.config.colorScheme.primary};">Our Values</h2>
        <div class="${this.generateClassName('values', 'grid')}" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem;">
            <div>
                <div style="font-size: 3rem; margin-bottom: 1rem;">🎯</div>
                <h4 style="margin-bottom: 1rem;">Excellence</h4>
                <p style="color: #666;">We strive for perfection in every game and feature we deliver.</p>
            </div>
            <div>
                <div style="font-size: 3rem; margin-bottom: 1rem;">🤝</div>
                <h4 style="margin-bottom: 1rem;">Community</h4>
                <p style="color: #666;">Building lasting relationships with our players is our priority.</p>
            </div>
            <div>
                <div style="font-size: 3rem; margin-bottom: 1rem;">⚡</div>
                <h4 style="margin-bottom: 1rem;">Innovation</h4>
                <p style="color: #666;">We constantly innovate to enhance your gaming experience.</p>
            </div>
            <div>
                <div style="font-size: 3rem; margin-bottom: 1rem;">🛡️</div>
                <h4 style="margin-bottom: 1rem;">Trust</h4>
                <p style="color: #666;">Your safety and privacy are our top concerns.</p>
            </div>
        </div>
    </div>
</div>
<style>
.${this.generateClassName('team', 'member')}:hover {
    transform: translateY(-10px);
}
</style>`;

            case 'split-screen':
                return `
<div class="${containerClass}" style="padding: 4rem 0;">
    <div class="${this.generateClassName('split', 'layout')}" style="display: grid; grid-template-columns: 1fr 1fr; min-height: 80vh; gap: 0;">
        <div class="${this.generateClassName('split', 'content')}" style="padding: 4rem; background: ${this.config.colorScheme.primary}; color: white; display: flex; flex-direction: column; justify-content: center;">
            <h1 style="font-size: 3.5rem; margin-bottom: 2rem; line-height: 1.2;">About ${this.siteName}</h1>
            <p style="font-size: 1.3rem; line-height: 1.6; margin-bottom: 2rem; opacity: 0.9;">
                We are passionate about creating the ultimate social casino experience. Our platform brings together 
                the excitement of casino gaming with the social aspect of online entertainment.
            </p>
            <div class="${this.generateClassName('stats', 'row')}" style="display: flex; gap: 2rem; margin-bottom: 2rem;">
                <div class="${this.generateClassName('stat', 'item')}" style="text-align: center;">
                    <div style="font-size: 2.5rem; font-weight: bold; color: ${this.config.colorScheme.accent};">500+</div>
                    <div style="opacity: 0.8;">Games</div>
                </div>
                <div class="${this.generateClassName('stat', 'item')}" style="text-align: center;">
                    <div style="font-size: 2.5rem; font-weight: bold; color: ${this.config.colorScheme.accent};">1M+</div>
                    <div style="opacity: 0.8;">Players</div>
                </div>
                <div class="${this.generateClassName('stat', 'item')}" style="text-align: center;">
                    <div style="font-size: 2.5rem; font-weight: bold; color: ${this.config.colorScheme.accent};">24/7</div>
                    <div style="opacity: 0.8;">Available</div>
                </div>
            </div>
            <button class="${this.generateClassName('btn', 'accent')}" onclick="window.location.href='games.html'" style="padding: 1rem 2rem; font-size: 1.2rem; border-radius: 25px; width: fit-content;">
                Start Playing Now
            </button>
        </div>
        
        <div class="${this.generateClassName('split', 'visual')}" style="background: linear-gradient(135deg, ${this.config.colorScheme.secondary}20, ${this.config.colorScheme.primary}20); position: relative; overflow: hidden; display: flex; flex-direction: column; justify-content: center; padding: 4rem;">
            <div class="${this.generateClassName('floating', 'elements')}" style="position: relative;">
                <div class="${this.generateClassName('game', 'icon')}" style="position: absolute; top: 10%; left: 20%; width: 80px; height: 80px; background: ${this.config.colorScheme.primary}; border-radius: 15px; display: flex; align-items: center; justify-content: center; font-size: 2rem; animation: float 3s ease-in-out infinite;">🎰</div>
                <div class="${this.generateClassName('game', 'icon')}" style="position: absolute; top: 30%; right: 15%; width: 80px; height: 80px; background: ${this.config.colorScheme.secondary}; border-radius: 15px; display: flex; align-items: center; justify-content: center; font-size: 2rem; animation: float 3s ease-in-out infinite 1s;">🃏</div>
                <div class="${this.generateClassName('game', 'icon')}" style="position: absolute; bottom: 40%; left: 30%; width: 80px; height: 80px; background: ${this.config.colorScheme.accent}; border-radius: 15px; display: flex; align-items: center; justify-content: center; font-size: 2rem; animation: float 3s ease-in-out infinite 2s;">🎲</div>
                <div class="${this.generateClassName('game', 'icon')}" style="position: absolute; bottom: 20%; right: 25%; width: 80px; height: 80px; background: ${this.config.colorScheme.primary}; border-radius: 15px; display: flex; align-items: center; justify-content: center; font-size: 2rem; animation: float 3s ease-in-out infinite 0.5s;">💰</div>
                
                <div class="${this.generateClassName('center', 'logo')}" style="text-align: center; background: white; padding: 3rem; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); position: relative; z-index: 10;">
                    <h2 style="font-size: 2.5rem; margin-bottom: 1rem; color: ${this.config.colorScheme.primary};">${this.siteName}</h2>
                    <p style="color: #666; font-size: 1.1rem; margin-bottom: 2rem;">Your Premier Gaming Destination</p>
                    <div class="${this.generateClassName('features', 'list')}" style="text-align: left;">
                        <div style="margin-bottom: 1rem; display: flex; align-items: center;">
                            <span style="color: ${this.config.colorScheme.primary}; font-size: 1.5rem; margin-right: 1rem;">✓</span>
                            <span>100% Free to Play</span>
                        </div>
                        <div style="margin-bottom: 1rem; display: flex; align-items: center;">
                            <span style="color: ${this.config.colorScheme.primary}; font-size: 1.5rem; margin-right: 1rem;">✓</span>
                            <span>No Registration Required</span>
                        </div>
                        <div style="margin-bottom: 1rem; display: flex; align-items: center;">
                            <span style="color: ${this.config.colorScheme.primary}; font-size: 1.5rem; margin-right: 1rem;">✓</span>
                            <span>Mobile Optimized</span>
                        </div>
                        <div style="display: flex; align-items: center;">
                            <span style="color: ${this.config.colorScheme.primary}; font-size: 1.5rem; margin-right: 1rem;">✓</span>
                            <span>Instant Play</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<style>
@keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
}
@media (max-width: 768px) {
    .${this.generateClassName('split', 'layout')} {
        grid-template-columns: 1fr !important;
    }
}
</style>`;

            case 'story':
                return `
<div class="${containerClass}" style="padding: 4rem 0;">
    <div class="${this.generateClassName('story', 'header')}" style="text-align: center; margin-bottom: 4rem;">
        <h1 style="font-size: 3.5rem; margin-bottom: 1rem; background: linear-gradient(45deg, ${this.config.colorScheme.primary}, ${this.config.colorScheme.secondary}); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
            The ${this.siteName} Story
        </h1>
        <p style="font-size: 1.3rem; color: #666; max-width: 600px; margin: 0 auto;">
            Every great platform has a story. Here's ours.
        </p>
    </div>
    
    <div class="${this.generateClassName('story', 'content')}" style="max-width: 900px; margin: 0 auto;">
        <div class="${this.generateClassName('chapter')}" style="margin-bottom: 4rem; padding: 3rem; background: linear-gradient(135deg, #f8f9fa, #e9ecef); border-radius: 20px; position: relative; overflow: hidden;">
            <div style="position: absolute; top: -50px; right: -50px; width: 200px; height: 200px; background: ${this.config.colorScheme.primary}20; border-radius: 50%; opacity: 0.3;"></div>
            <div class="${this.generateClassName('chapter', 'number')}" style="position: absolute; top: 2rem; left: 2rem; width: 60px; height: 60px; background: ${this.config.colorScheme.primary}; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: bold;">1</div>
            <div style="margin-left: 5rem;">
                <h2 style="font-size: 2.2rem; margin-bottom: 1.5rem; color: ${this.config.colorScheme.primary};">The Beginning</h2>
                <p style="font-size: 1.2rem; line-height: 1.7; color: #444; margin-bottom: 1.5rem;">
                    It all started with a simple idea: make casino gaming accessible to everyone. In 2020, our founder Alex 
                    realized that while people loved the excitement of casino games, not everyone could access them easily. 
                    The solution? A free, online social casino platform.
                </p>
                <p style="font-size: 1.1rem; line-height: 1.6; color: #666;">
                    "I wanted to create a place where anyone could experience the thrill of casino gaming without any barriers," 
                    says Alex. "No deposits, no downloads, no complications – just pure entertainment."
                </p>
            </div>
        </div>
        
        <div class="${this.generateClassName('chapter')}" style="margin-bottom: 4rem; padding: 3rem; background: linear-gradient(135deg, ${this.config.colorScheme.primary}10, ${this.config.colorScheme.secondary}10); border-radius: 20px; position: relative; overflow: hidden;">
            <div style="position: absolute; top: -50px; left: -50px; width: 200px; height: 200px; background: ${this.config.colorScheme.secondary}20; border-radius: 50%; opacity: 0.3;"></div>
            <div class="${this.generateClassName('chapter', 'number')}" style="position: absolute; top: 2rem; right: 2rem; width: 60px; height: 60px; background: ${this.config.colorScheme.secondary}; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: bold;">2</div>
            <div style="margin-right: 5rem;">
                <h2 style="font-size: 2.2rem; margin-bottom: 1.5rem; color: ${this.config.colorScheme.secondary};">Building the Dream</h2>
                <p style="font-size: 1.2rem; line-height: 1.7; color: #444; margin-bottom: 1.5rem;">
                    The first year was all about laying the foundation. We partnered with top game providers, designed an 
                    intuitive interface, and most importantly, listened to our early users. Every piece of feedback helped 
                    shape what ${this.siteName} would become.
                </p>
                <p style="font-size: 1.1rem; line-height: 1.6; color: #666;">
                    "We launched with 50 games and a handful of users. Today, we have over 500 games and serve millions 
                    of players worldwide. The growth has been incredible, but the mission remains the same."
                </p>
            </div>
        </div>
        
        <div class="${this.generateClassName('chapter')}" style="margin-bottom: 4rem; padding: 3rem; background: linear-gradient(135deg, ${this.config.colorScheme.accent}15, ${this.config.colorScheme.primary}15); border-radius: 20px; position: relative; overflow: hidden;">
            <div style="position: absolute; bottom: -50px; right: -50px; width: 200px; height: 200px; background: ${this.config.colorScheme.accent}20; border-radius: 50%; opacity: 0.3;"></div>
            <div class="${this.generateClassName('chapter', 'number')}" style="position: absolute; top: 2rem; left: 2rem; width: 60px; height: 60px; background: ${this.config.colorScheme.accent}; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: bold;">3</div>
            <div style="margin-left: 5rem;">
                <h2 style="font-size: 2.2rem; margin-bottom: 1.5rem; color: ${this.config.colorScheme.accent};">The Future</h2>
                <p style="font-size: 1.2rem; line-height: 1.7; color: #444; margin-bottom: 1.5rem;">
                    Today, ${this.siteName} is more than just a gaming platform – it's a community. We continue to innovate, 
                    adding new games, features, and ways for players to connect. Our vision is to be the world's most 
                    loved social casino platform.
                </p>
                <p style="font-size: 1.1rem; line-height: 1.6; color: #666;">
                    "We're just getting started. The future holds amazing possibilities for social gaming, and we're 
                    excited to be leading the way."
                </p>
            </div>
        </div>
    </div>
    
    <div class="${this.generateClassName('cta', 'section')}" style="text-align: center; margin-top: 4rem; padding: 3rem; background: ${this.config.colorScheme.primary}; color: white; border-radius: 20px;">
        <h2 style="font-size: 2.5rem; margin-bottom: 1rem;">Ready to Join Our Story?</h2>
        <p style="font-size: 1.2rem; margin-bottom: 2rem; opacity: 0.9;">
            Become part of the ${this.siteName} community and create your own gaming adventure.
        </p>
        <button class="${this.generateClassName('btn', 'accent')}" onclick="window.location.href='games.html'" style="padding: 1rem 2rem; font-size: 1.2rem; border-radius: 25px;">
            Start Playing Today
        </button>
    </div>
</div>`;

            case 'video-bg':
                return `
<div class="${this.generateClassName('video', 'hero')}" style="position: relative; min-height: 100vh; overflow: hidden; display: flex; align-items: center; justify-content: center;">
    <div class="${this.generateClassName('video', 'background')}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1;">
        <div style="position: absolute; inset: 0; background: linear-gradient(45deg, ${this.config.colorScheme.primary}90, ${this.config.colorScheme.secondary}90); z-index: 2;"></div>
        <div style="position: absolute; inset: 0; background: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1000 1000\"><defs><pattern id=\"grid\" width=\"50\" height=\"50\" patternUnits=\"userSpaceOnUse\"><path d=\"M 50 0 L 0 0 0 50\" fill=\"none\" stroke=\"white\" stroke-width=\"1\" opacity=\"0.1\"/></pattern></defs><rect width=\"100%\" height=\"100%\" fill=\"url(%23grid)\"/></svg>'); z-index: 3;"></div>
        <div class="${this.generateClassName('floating', 'particles')}" style="position: absolute; inset: 0; z-index: 4;">
            <div class="${this.generateClassName('particle')}" style="position: absolute; top: 20%; left: 10%; width: 8px; height: 8px; background: white; border-radius: 50%; opacity: 0.6; animation: particleFloat 4s ease-in-out infinite;">🎰</div>
            <div class="${this.generateClassName('particle')}" style="position: absolute; top: 60%; left: 80%; width: 8px; height: 8px; background: white; border-radius: 50%; opacity: 0.4; animation: particleFloat 5s ease-in-out infinite 1s;">🃏</div>
            <div class="${this.generateClassName('particle')}" style="position: absolute; top: 30%; left: 70%; width: 8px; height: 8px; background: white; border-radius: 50%; opacity: 0.5; animation: particleFloat 6s ease-in-out infinite 2s;">🎲</div>
            <div class="${this.generateClassName('particle')}" style="position: absolute; top: 80%; left: 20%; width: 8px; height: 8px; background: white; border-radius: 50%; opacity: 0.3; animation: particleFloat 3s ease-in-out infinite 0.5s;">💰</div>
        </div>
    </div>
    
    <div class="${containerClass}" style="position: relative; z-index: 10; text-align: center; color: white;">
        <div class="${this.generateClassName('hero', 'content')}" style="max-width: 800px; margin: 0 auto;">
            <h1 style="font-size: 4rem; margin-bottom: 1.5rem; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); animation: fadeInUp 1s ease-out;">
                Welcome to ${this.siteName}
            </h1>
            <p style="font-size: 1.4rem; margin-bottom: 2rem; opacity: 0.95; text-shadow: 1px 1px 2px rgba(0,0,0,0.5); animation: fadeInUp 1s ease-out 0.3s both;">
                Experience the ultimate social casino gaming platform with hundreds of free games, 
                stunning graphics, and endless entertainment.
            </p>
            
            <div class="${this.generateClassName('hero', 'stats')}" style="display: flex; justify-content: center; gap: 3rem; margin-bottom: 3rem; flex-wrap: wrap; animation: fadeInUp 1s ease-out 0.6s both;">
                <div class="${this.generateClassName('stat', 'item')}" style="text-align: center;">
                    <div style="font-size: 3rem; font-weight: bold; color: ${this.config.colorScheme.accent};">500+</div>
                    <div style="opacity: 0.9;">Premium Games</div>
                </div>
                <div class="${this.generateClassName('stat', 'item')}" style="text-align: center;">
                    <div style="font-size: 3rem; font-weight: bold; color: ${this.config.colorScheme.accent};">1M+</div>
                    <div style="opacity: 0.9;">Happy Players</div>
                </div>
                <div class="${this.generateClassName('stat', 'item')}" style="text-align: center;">
                    <div style="font-size: 3rem; font-weight: bold; color: ${this.config.colorScheme.accent};">24/7</div>
                    <div style="opacity: 0.9;">Always Available</div>
                </div>
            </div>
            
            <div class="${this.generateClassName('hero', 'actions')}" style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap; animation: fadeInUp 1s ease-out 0.9s both;">
                <button class="${this.generateClassName('btn', 'accent')}" onclick="window.location.href='games.html'" style="padding: 1.2rem 2.5rem; font-size: 1.3rem; border-radius: 30px; box-shadow: 0 8px 20px rgba(0,0,0,0.3); transition: all 0.3s ease;">
                    🎮 Start Playing Now
                </button>
                <button class="${this.generateClassName('btn', 'outline')}" onclick="scrollToContent()" style="padding: 1.2rem 2.5rem; font-size: 1.3rem; border-radius: 30px; background: transparent; border: 2px solid white; color: white; transition: all 0.3s ease;">
                    📖 Learn More
                </button>
            </div>
        </div>
    </div>
    
    <div class="${this.generateClassName('scroll', 'indicator')}" style="position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%); z-index: 10; animation: bounce 2s infinite;">
        <div style="color: white; font-size: 2rem; opacity: 0.7;">⬇</div>
    </div>
</div>

<div class="${containerClass}" style="padding: 4rem 0;" id="content">
    <div class="${this.generateClassName('about', 'content')}" style="max-width: 1000px; margin: 0 auto;">
        <div class="${this.generateClassName('grid', '2')}" style="gap: 4rem; align-items: center; margin-bottom: 4rem;">
            <div style="order: 1;">
                <h2 style="font-size: 2.5rem; margin-bottom: 1.5rem; color: ${this.config.colorScheme.primary};">Our Mission</h2>
                <p style="font-size: 1.2rem; line-height: 1.7; color: #555; margin-bottom: 2rem;">
                    At ${this.siteName}, we believe that everyone deserves access to premium entertainment. 
                    Our mission is to provide the most comprehensive and enjoyable social casino experience, 
                    completely free of charge.
                </p>
                <ul style="list-style: none; padding: 0;">
                    <li style="margin-bottom: 1rem; display: flex; align-items: center;">
                        <span style="color: ${this.config.colorScheme.primary}; font-size: 1.5rem; margin-right: 1rem;">🎯</span>
                        <span style="font-size: 1.1rem;">100% Free Gaming Experience</span>
                    </li>
                    <li style="margin-bottom: 1rem; display: flex; align-items: center;">
                        <span style="color: ${this.config.colorScheme.primary}; font-size: 1.5rem; margin-right: 1rem;">🛡️</span>
                        <span style="font-size: 1.1rem;">Safe and Secure Platform</span>
                    </li>
                    <li style="margin-bottom: 1rem; display: flex; align-items: center;">
                        <span style="color: ${this.config.colorScheme.primary}; font-size: 1.5rem; margin-right: 1rem;">📱</span>
                        <span style="font-size: 1.1rem;">Cross-Platform Compatibility</span>
                    </li>
                </ul>
            </div>
            <div style="order: 2;">
                <div style="background: linear-gradient(135deg, ${this.config.colorScheme.primary}20, ${this.config.colorScheme.secondary}20); padding: 3rem; border-radius: 20px; text-align: center;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">🏆</div>
                    <h3 style="font-size: 1.8rem; margin-bottom: 1rem; color: ${this.config.colorScheme.primary};">Award-Winning Platform</h3>
                    <p style="color: #666; line-height: 1.6;">
                        Recognized for excellence in social gaming, user experience, and innovation in the casino entertainment industry.
                    </p>
                </div>
            </div>
        </div>
        
        <div class="${this.generateClassName('features', 'showcase')}" style="background: #f8f9fa; padding: 4rem; border-radius: 20px; text-align: center;">
            <h2 style="font-size: 2.5rem; margin-bottom: 3rem; color: ${this.config.colorScheme.primary};">Why Choose ${this.siteName}?</h2>
            <div class="${this.generateClassName('grid', '3')}" style="gap: 2rem;">
                <div style="padding: 2rem; background: white; border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); transition: transform 0.3s ease;" onmouseover="this.style.transform='translateY(-10px)'" onmouseout="this.style.transform='translateY(0)'">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🎰</div>
                    <h4 style="margin-bottom: 1rem; color: ${this.config.colorScheme.primary};">Premium Games</h4>
                    <p style="color: #666;">Access to the latest and greatest casino games from top providers worldwide.</p>
                </div>
                <div style="padding: 2rem; background: white; border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); transition: transform 0.3s ease;" onmouseover="this.style.transform='translateY(-10px)'" onmouseout="this.style.transform='translateY(0)'">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">⚡</div>
                    <h4 style="margin-bottom: 1rem; color: ${this.config.colorScheme.primary};">Instant Play</h4>
                    <p style="color: #666;">No downloads, no installations. Start playing immediately in your browser.</p>
                </div>
                <div style="padding: 2rem; background: white; border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); transition: transform 0.3s ease;" onmouseover="this.style.transform='translateY(-10px)'" onmouseout="this.style.transform='translateY(0)'">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🌟</div>
                    <h4 style="margin-bottom: 1rem; color: ${this.config.colorScheme.primary};">Regular Updates</h4>
                    <p style="color: #666;">New games and features added regularly to keep your experience fresh.</p>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
@keyframes particleFloat {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-30px) rotate(180deg); }
}
@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
}
@keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }
    40% { transform: translateX(-50%) translateY(-10px); }
    60% { transform: translateX(-50%) translateY(-5px); }
}
.${this.generateClassName('btn', 'outline')}:hover {
    background: white !important;
    color: ${this.config.colorScheme.primary} !important;
}
@media (max-width: 768px) {
    .${this.generateClassName('grid', '2')} {
        grid-template-columns: 1fr !important;
    }
    .${this.generateClassName('grid', '3')} {
        grid-template-columns: 1fr !important;
    }
}
</style>

<script>
function scrollToContent() {
    document.getElementById('content').scrollIntoView({ behavior: 'smooth' });
}
</script>`;

            default:
                return `
<div class="${containerClass}" style="padding: 4rem 0;">
    <h1 class="${this.generateClassName('text', 'center')} ${this.generateClassName('mb', '4')}" style="font-size: 3rem;">About ${this.siteName}</h1>
    
    <div class="${this.generateClassName('grid', '2')}" style="gap: 3rem; align-items: center; margin-bottom: 3rem;">
        <div>
            <h2 style="margin-bottom: 1.5rem; color: ${this.config.colorScheme.primary};">Welcome to the Ultimate Casino Experience</h2>
            <p style="font-size: 1.1rem; line-height: 1.8; margin-bottom: 1.5rem;">
                At ${this.siteName}, we're passionate about providing the best social casino gaming experience. 
                Our platform offers hundreds of premium casino games that you can play for free, anytime, anywhere.
            </p>
            <p style="font-size: 1.1rem; line-height: 1.8; margin-bottom: 2rem;">
                Whether you're a seasoned casino enthusiast or just looking for some fun entertainment, 
                our diverse collection of slots, table games, and specialty games has something for everyone.
            </p>
            <ul class="${this.generateClassName('features', 'list')}" style="list-style: none; padding: 0;">
                <li style="margin-bottom: 1rem; display: flex; align-items: center;">
                    <span style="color: ${this.config.colorScheme.primary}; font-size: 1.5rem; margin-right: 1rem;">🎰</span>
                    <span>500+ Premium Casino Games</span>
                </li>
                <li style="margin-bottom: 1rem; display: flex; align-items: center;">
                    <span style="color: ${this.config.colorScheme.primary}; font-size: 1.5rem; margin-right: 1rem;">📱</span>
                    <span>Mobile-Optimized Gaming</span>
                </li>
                <li style="margin-bottom: 1rem; display: flex; align-items: center;">
                    <span style="color: ${this.config.colorScheme.primary}; font-size: 1.5rem; margin-right: 1rem;">🔒</span>
                    <span>Safe & Secure Platform</span>
                </li>
                <li style="margin-bottom: 1rem; display: flex; align-items: center;">
                    <span style="color: ${this.config.colorScheme.primary}; font-size: 1.5rem; margin-right: 1rem;">🎯</span>
                    <span>100% Free to Play</span>
                </li>
            </ul>
        </div>
        <div>
            <img src="https://images.unsplash.com/photo-1511193311914-0346f16efe90?w=600&h=400&fit=crop" alt="Casino Gaming" style="width: 100%; border-radius: 15px; box-shadow: 0 15px 35px rgba(0,0,0,0.1);">
        </div>
    </div>
    
    <div class="${this.generateClassName('values', 'section')}" style="background: #f8f9fa; padding: 3rem; border-radius: 15px; margin-bottom: 3rem;">
        <h2 class="${this.generateClassName('text', 'center')} ${this.generateClassName('mb', '4')}">Our Values</h2>
        <div class="${this.generateClassName('grid', '3')}">
            <div class="${this.generateClassName('text', 'center')}">
                <div style="font-size: 3rem; margin-bottom: 1rem;">🌟</div>
                <h3 style="margin-bottom: 1rem; color: ${this.config.colorScheme.primary};">Excellence</h3>
                <p>We strive to provide the highest quality gaming experience with premium games and smooth gameplay.</p>
            </div>
            <div class="${this.generateClassName('text', 'center')}">
                <div style="font-size: 3rem; margin-bottom: 1rem;">🤝</div>
                <h3 style="margin-bottom: 1rem; color: ${this.config.colorScheme.primary};">Community</h3>
                <p>Building a welcoming community where players can enjoy casino games in a safe, fun environment.</p>
            </div>
            <div class="${this.generateClassName('text', 'center')}">
                <div style="font-size: 3rem; margin-bottom: 1rem;">⚡</div>
                <h3 style="margin-bottom: 1rem; color: ${this.config.colorScheme.primary};">Innovation</h3>
                <p>Continuously improving our platform with the latest technology and gaming innovations.</p>
            </div>
        </div>
    </div>
</div>`;
        }
    }

    generateEnhancedContactPage() {
        const { contactPageLayout } = this.config;
        const containerClass = this.generateClassName('container');
        
        switch (contactPageLayout) {
            case 'email-display':
                return `
<div class="${containerClass}" style="padding: 4rem 0;">
    <h1 class="${this.generateClassName('text', 'center')} ${this.generateClassName('mb', '4')}" style="font-size: 3rem;">Contact Us</h1>
    
    <div class="${this.generateClassName('contact', 'hero')}" style="text-align: center; max-width: 600px; margin: 0 auto 4rem auto; padding: 3rem; background: linear-gradient(135deg, ${this.config.colorScheme.primary}15, ${this.config.colorScheme.secondary}15); border-radius: 20px;">
        <div style="font-size: 4rem; margin-bottom: 1.5rem;">📧</div>
        <h2 style="font-size: 2.5rem; margin-bottom: 1rem; color: ${this.config.colorScheme.primary};">Get in Touch</h2>
        <p style="font-size: 1.2rem; color: #666; margin-bottom: 2rem;">
            We'd love to hear from you! Drop us a line and we'll get back to you as soon as possible.
        </p>
        <a href="mailto:support@${this.domain}" class="${this.generateClassName('btn', 'primary')}" style="padding: 1rem 2rem; font-size: 1.2rem; text-decoration: none; display: inline-block; border-radius: 25px;">
            📧 support@${this.domain}
        </a>
    </div>
    
    <div class="${this.generateClassName('contact', 'methods')}" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-bottom: 4rem;">
        <div class="${this.generateClassName('contact', 'method')}" style="text-align: center; padding: 2rem; background: white; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); transition: transform 0.3s ease;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">💬</div>
            <h3 style="margin-bottom: 1rem; color: ${this.config.colorScheme.primary};">General Inquiries</h3>
            <p style="color: #666; margin-bottom: 1.5rem;">Questions about our games, features, or general support.</p>
            <a href="mailto:info@${this.domain}" class="${this.generateClassName('contact', 'email')}" style="color: ${this.config.colorScheme.primary}; text-decoration: none; font-weight: 600;">info@${this.domain}</a>
        </div>
        
        <div class="${this.generateClassName('contact', 'method')}" style="text-align: center; padding: 2rem; background: white; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); transition: transform 0.3s ease;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">🛠️</div>
            <h3 style="margin-bottom: 1rem; color: ${this.config.colorScheme.primary};">Technical Support</h3>
            <p style="color: #666; margin-bottom: 1.5rem;">Need help with technical issues or game problems?</p>
            <a href="mailto:tech@${this.domain}" class="${this.generateClassName('contact', 'email')}" style="color: ${this.config.colorScheme.primary}; text-decoration: none; font-weight: 600;">tech@${this.domain}</a>
        </div>
        
        <div class="${this.generateClassName('contact', 'method')}" style="text-align: center; padding: 2rem; background: white; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); transition: transform 0.3s ease;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">🎮</div>
            <h3 style="margin-bottom: 1rem; color: ${this.config.colorScheme.primary};">Game Suggestions</h3>
            <p style="color: #666; margin-bottom: 1.5rem;">Have ideas for new games or features? We'd love to hear them!</p>
            <a href="mailto:games@${this.domain}" class="${this.generateClassName('contact', 'email')}" style="color: ${this.config.colorScheme.primary}; text-decoration: none; font-weight: 600;">games@${this.domain}</a>
        </div>
        
        <div class="${this.generateClassName('contact', 'method')}" style="text-align: center; padding: 2rem; background: white; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); transition: transform 0.3s ease;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">💼</div>
            <h3 style="margin-bottom: 1rem; color: ${this.config.colorScheme.primary};">Business Partnerships</h3>
            <p style="color: #666; margin-bottom: 1.5rem;">Interested in partnering with us or business opportunities?</p>
            <a href="mailto:business@${this.domain}" class="${this.generateClassName('contact', 'email')}" style="color: ${this.config.colorScheme.primary}; text-decoration: none; font-weight: 600;">business@${this.domain}</a>
        </div>
    </div>
    
    <div class="${this.generateClassName('contact', 'info')}" style="background: #f8f9fa; padding: 3rem; border-radius: 15px; text-align: center;">
        <h3 style="margin-bottom: 2rem; color: ${this.config.colorScheme.primary};">Response Times</h3>
        <div class="${this.generateClassName('response', 'times')}" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem;">
            <div style="padding: 1.5rem; background: white; border-radius: 10px;">
                <div style="font-size: 2rem; margin-bottom: 0.5rem;">⚡</div>
                <h4 style="margin-bottom: 0.5rem;">General Inquiries</h4>
                <p style="color: #666;">Within 2-4 hours</p>
            </div>
            <div style="padding: 1.5rem; background: white; border-radius: 10px;">
                <div style="font-size: 2rem; margin-bottom: 0.5rem;">🔧</div>
                <h4 style="margin-bottom: 0.5rem;">Technical Support</h4>
                <p style="color: #666;">Within 1-2 hours</p>
            </div>
            <div style="padding: 1.5rem; background: white; border-radius: 10px;">
                <div style="font-size: 2rem; margin-bottom: 0.5rem;">💡</div>
                <h4 style="margin-bottom: 0.5rem;">Suggestions</h4>
                <p style="color: #666;">Within 24 hours</p>
            </div>
        </div>
    </div>
</div>
<style>
.${this.generateClassName('contact', 'method')}:hover {
    transform: translateY(-10px);
}
.${this.generateClassName('contact', 'email')}:hover {
    text-decoration: underline !important;
}
</style>`;

            case 'faq-contact':
                return `
<div class="${containerClass}" style="padding: 4rem 0;">
    <h1 class="${this.generateClassName('text', 'center')} ${this.generateClassName('mb', '4')}" style="font-size: 3rem;">Contact & FAQ</h1>
    
    <div class="${this.generateClassName('grid', '2')}" style="gap: 3rem; align-items: start;">
        <div class="${this.generateClassName('contact', 'section')}">
            <div class="${this.generateClassName('card')}" style="padding: 2rem; margin-bottom: 2rem;">
                <h2 style="margin-bottom: 1.5rem; color: ${this.config.colorScheme.primary};">💬 Quick Contact</h2>
                <form id="quickContactForm" class="${this.generateClassName('quick', 'form')}">
                    <div style="margin-bottom: 1rem;">
                        <label for="quickName" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Your Name</label>
                        <input type="text" id="quickName" required class="${this.generateClassName('form', 'input')}" style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 5px;">
                    </div>
                    <div style="margin-bottom: 1rem;">
                        <label for="quickEmail" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Email</label>
                        <input type="email" id="quickEmail" required class="${this.generateClassName('form', 'input')}" style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 5px;">
                    </div>
                    <div style="margin-bottom: 1rem;">
                        <label for="quickMessage" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Quick Message</label>
                        <textarea id="quickMessage" rows="4" required class="${this.generateClassName('form', 'textarea')}" style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 5px; resize: vertical;" placeholder="What can we help you with?"></textarea>
                    </div>
                    <button type="submit" class="${this.generateClassName('btn', 'primary')}" style="width: 100%; padding: 1rem;">Send Message</button>
                </form>
            </div>
            
            <div class="${this.generateClassName('card')}" style="padding: 2rem;">
                <h3 style="margin-bottom: 1rem; color: ${this.config.colorScheme.primary};">📧 Direct Contact</h3>
                <div class="${this.generateClassName('contact', 'info')}">
                    <div style="margin-bottom: 1rem; display: flex; align-items: center;">
                        <span style="font-size: 1.5rem; margin-right: 1rem; color: ${this.config.colorScheme.primary};">📧</span>
                        <div>
                            <strong>General Support</strong><br>
                            <a href="mailto:support@${this.domain}" style="color: ${this.config.colorScheme.primary};">support@${this.domain}</a>
                        </div>
                    </div>
                    <div style="margin-bottom: 1rem; display: flex; align-items: center;">
                        <span style="font-size: 1.5rem; margin-right: 1rem; color: ${this.config.colorScheme.primary};">🔧</span>
                        <div>
                            <strong>Technical Issues</strong><br>
                            <a href="mailto:tech@${this.domain}" style="color: ${this.config.colorScheme.primary};">tech@${this.domain}</a>
                        </div>
                    </div>
                    <div style="display: flex; align-items: center;">
                        <span style="font-size: 1.5rem; margin-right: 1rem; color: ${this.config.colorScheme.primary};">⏰</span>
                        <div>
                            <strong>Response Time</strong><br>
                            Usually within 2-4 hours
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="${this.generateClassName('faq', 'section')}">
            <h2 style="margin-bottom: 2rem; color: ${this.config.colorScheme.primary};">❓ Frequently Asked Questions</h2>
            
            <div class="${this.generateClassName('faq', 'accordion')}">
                <div class="${this.generateClassName('faq', 'item')}" style="margin-bottom: 1rem; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                    <button class="${this.generateClassName('faq', 'question')}" onclick="toggleFAQ('faq1')" style="width: 100%; text-align: left; padding: 1.5rem; background: #f8f9fa; border: none; font-weight: 600; font-size: 1.1rem; cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
                        Are all games really free to play?
                        <span id="faq1-icon">+</span>
                    </button>
                    <div id="faq1" class="${this.generateClassName('faq', 'answer')}" style="display: none; padding: 1.5rem; background: white;">
                        <p>Yes! All our casino games are completely free to play. There are no hidden costs, no in-app purchases, and no real money involved. You can enjoy unlimited gaming without spending a penny.</p>
                    </div>
                </div>
                
                <div class="${this.generateClassName('faq', 'item')}" style="margin-bottom: 1rem; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                    <button class="${this.generateClassName('faq', 'question')}" onclick="toggleFAQ('faq2')" style="width: 100%; text-align: left; padding: 1.5rem; background: #f8f9fa; border: none; font-weight: 600; font-size: 1.1rem; cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
                        Do I need to register or create an account?
                        <span id="faq2-icon">+</span>
                    </button>
                    <div id="faq2" class="${this.generateClassName('faq', 'answer')}" style="display: none; padding: 1.5rem; background: white;">
                        <p>No registration required! You can start playing immediately. Simply visit any game page and click play. Your progress will be saved locally on your device.</p>
                    </div>
                </div>
                
                <div class="${this.generateClassName('faq', 'item')}" style="margin-bottom: 1rem; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                    <button class="${this.generateClassName('faq', 'question')}" onclick="toggleFAQ('faq3')" style="width: 100%; text-align: left; padding: 1.5rem; background: #f8f9fa; border: none; font-weight: 600; font-size: 1.1rem; cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
                        Can I play on my mobile device?
                        <span id="faq3-icon">+</span>
                    </button>
                    <div id="faq3" class="${this.generateClassName('faq', 'answer')}" style="display: none; padding: 1.5rem; background: white;">
                        <p>Absolutely! Our platform is fully optimized for mobile devices. All games work seamlessly on smartphones and tablets, with touch-friendly controls and responsive design.</p>
                    </div>
                </div>
                
                <div class="${this.generateClassName('faq', 'item')}" style="margin-bottom: 1rem; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                    <button class="${this.generateClassName('faq', 'question')}" onclick="toggleFAQ('faq4')" style="width: 100%; text-align: left; padding: 1.5rem; background: #f8f9fa; border: none; font-weight: 600; font-size: 1.1rem; cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
                        How often do you add new games?
                        <span id="faq4-icon">+</span>
                    </button>
                    <div id="faq4" class="${this.generateClassName('faq', 'answer')}" style="display: none; padding: 1.5rem; background: white;">
                        <p>We add new games regularly! Our team is constantly working with game providers to bring you the latest and most exciting casino games. Check back weekly for new additions.</p>
                    </div>
                </div>
                
                <div class="${this.generateClassName('faq', 'item')}" style="margin-bottom: 1rem; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                    <button class="${this.generateClassName('faq', 'question')}" onclick="toggleFAQ('faq5')" style="width: 100%; text-align: left; padding: 1.5rem; background: #f8f9fa; border: none; font-weight: 600; font-size: 1.1rem; cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
                        Is my personal information safe?
                        <span id="faq5-icon">+</span>
                    </button>
                    <div id="faq5" class="${this.generateClassName('faq', 'answer')}" style="display: none; padding: 1.5rem; background: white;">
                        <p>Yes, your privacy is our priority. We use industry-standard security measures to protect any information you share with us. See our Privacy Policy for complete details.</p>
                    </div>
                </div>
                
                <div class="${this.generateClassName('faq', 'item')}" style="margin-bottom: 1rem; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                    <button class="${this.generateClassName('faq', 'question')}" onclick="toggleFAQ('faq6')" style="width: 100%; text-align: left; padding: 1.5rem; background: #f8f9fa; border: none; font-weight: 600; font-size: 1.1rem; cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
                        What if I encounter a problem with a game?
                        <span id="faq6-icon">+</span>
                    </button>
                    <div id="faq6" class="${this.generateClassName('faq', 'answer')}" style="display: none; padding: 1.5rem; background: white;">
                        <p>If you experience any technical issues, please contact our technical support team at tech@${this.domain}. We respond to technical issues within 1-2 hours and will help resolve any problems quickly.</p>
                    </div>
                </div>
            </div>
            
            <div style="margin-top: 2rem; padding: 1.5rem; background: ${this.config.colorScheme.primary}15; border-radius: 10px; text-align: center;">
                <h4 style="margin-bottom: 1rem; color: ${this.config.colorScheme.primary};">Still have questions?</h4>
                <p style="margin-bottom: 1rem; color: #666;">Can't find what you're looking for? We're here to help!</p>
                <a href="mailto:support@${this.domain}" class="${this.generateClassName('btn', 'primary')}" style="padding: 0.75rem 1.5rem; text-decoration: none; display: inline-block;">Contact Support</a>
            </div>
        </div>
    </div>
</div>

<script>
function toggleFAQ(faqId) {
    const answer = document.getElementById(faqId);
    const icon = document.getElementById(faqId + '-icon');
    
    if (answer.style.display === 'none' || answer.style.display === '') {
        answer.style.display = 'block';
        icon.textContent = '-';
    } else {
        answer.style.display = 'none';
        icon.textContent = '+';
    }
}

document.getElementById('quickContactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const button = this.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    button.textContent = 'Sending...';
    button.disabled = true;
    
    setTimeout(() => {
        alert('Thank you for your message! We will get back to you soon.');
        this.reset();
        button.textContent = originalText;
        button.disabled = false;
    }, 2000);
});
</script>`;

            case 'map-integration':
                return `
<div class="${containerClass}" style="padding: 4rem 0;">
    <h1 class="${this.generateClassName('text', 'center')} ${this.generateClassName('mb', '4')}" style="font-size: 3rem;">Contact Us</h1>
    
    <div class="${this.generateClassName('contact', 'hero')}" style="text-align: center; margin-bottom: 4rem; padding: 3rem; background: linear-gradient(135deg, ${this.config.colorScheme.primary}, ${this.config.colorScheme.secondary}); color: white; border-radius: 20px;">
        <h2 style="font-size: 2.5rem; margin-bottom: 1rem;">🌍 We're Here for You</h2>
        <p style="font-size: 1.2rem; opacity: 0.9; max-width: 600px; margin: 0 auto;">
            ${this.siteName} serves players worldwide with 24/7 support. No matter where you are, we're here to help you have the best gaming experience.
        </p>
    </div>
    
    <div class="${this.generateClassName('grid', '2')}" style="gap: 3rem; margin-bottom: 4rem;">
        <div class="${this.generateClassName('contact', 'form-section')}">
            <div class="${this.generateClassName('card')}" style="padding: 2rem;">
                <h3 style="margin-bottom: 1.5rem; color: ${this.config.colorScheme.primary};">📝 Send us a Message</h3>
                <form id="mapContactForm" class="${this.generateClassName('contact', 'form')}">
                    <div class="${this.generateClassName('form', 'row')}" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                        <div>
                            <label for="firstName" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">First Name</label>
                            <input type="text" id="firstName" required class="${this.generateClassName('form', 'input')}" style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 5px;">
                        </div>
                        <div>
                            <label for="lastName" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Last Name</label>
                            <input type="text" id="lastName" required class="${this.generateClassName('form', 'input')}" style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 5px;">
                        </div>
                    </div>
                    <div style="margin-bottom: 1rem;">
                        <label for="mapEmail" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Email Address</label>
                        <input type="email" id="mapEmail" required class="${this.generateClassName('form', 'input')}" style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 5px;">
                    </div>
                    <div style="margin-bottom: 1rem;">
                        <label for="location" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Your Location (Optional)</label>
                        <select id="location" class="${this.generateClassName('form', 'select')}" style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 5px;">
                            <option value="">Select your region</option>
                            <option value="north-america">North America</option>
                            <option value="europe">Europe</option>
                            <option value="asia">Asia</option>
                            <option value="australia">Australia</option>
                            <option value="south-america">South America</option>
                            <option value="africa">Africa</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div style="margin-bottom: 1rem;">
                        <label for="priority" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Priority Level</label>
                        <select id="priority" required class="${this.generateClassName('form', 'select')}" style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 5px;">
                            <option value="">Select priority</option>
                            <option value="low">Low - General Question</option>
                            <option value="medium">Medium - Account Issue</option>
                            <option value="high">High - Game Bug</option>
                            <option value="urgent">Urgent - Critical Problem</option>
                        </select>
                    </div>
                    <div style="margin-bottom: 1.5rem;">
                        <label for="mapMessage" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Your Message</label>
                        <textarea id="mapMessage" rows="5" required class="${this.generateClassName('form', 'textarea')}" style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 5px; resize: vertical;" placeholder="Please describe your question or issue in detail..."></textarea>
                    </div>
                    <button type="submit" class="${this.generateClassName('btn', 'primary')}" style="width: 100%; padding: 1rem; font-size: 1.1rem;">Send Message</button>
                </form>
            </div>
        </div>
        
        <div class="${this.generateClassName('location', 'info')}">
            <div class="${this.generateClassName('card')}" style="padding: 2rem; margin-bottom: 2rem;">
                <h3 style="margin-bottom: 1.5rem; color: ${this.config.colorScheme.primary};">🌐 Global Support Coverage</h3>
                <div class="${this.generateClassName('coverage', 'map')}" style="position: relative; background: #f0f0f0; border-radius: 10px; padding: 2rem; text-align: center; min-height: 300px; display: flex; flex-direction: column; justify-content: center;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">🗺️</div>
                    <h4 style="margin-bottom: 1rem; color: ${this.config.colorScheme.primary};">Worldwide Service</h4>
                    <p style="color: #666; margin-bottom: 2rem;">We provide support to players in all time zones with multilingual assistance available.</p>
                    
                    <div class="${this.generateClassName('coverage', 'stats')}" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 1rem;">
                        <div style="padding: 1rem; background: white; border-radius: 8px;">
                            <div style="font-size: 1.5rem; font-weight: bold; color: ${this.config.colorScheme.primary};">195</div>
                            <div style="font-size: 0.9rem; color: #666;">Countries</div>
                        </div>
                        <div style="padding: 1rem; background: white; border-radius: 8px;">
                            <div style="font-size: 1.5rem; font-weight: bold; color: ${this.config.colorScheme.primary};">24/7</div>
                            <div style="font-size: 0.9rem; color: #666;">Support</div>
                        </div>
                        <div style="padding: 1rem; background: white; border-radius: 8px;">
                            <div style="font-size: 1.5rem; font-weight: bold; color: ${this.config.colorScheme.primary};">15</div>
                            <div style="font-size: 0.9rem; color: #666;">Languages</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="${this.generateClassName('card')}" style="padding: 2rem;">
                <h3 style="margin-bottom: 1.5rem; color: ${this.config.colorScheme.primary};">⏰ Regional Support Hours</h3>
                <div class="${this.generateClassName('support', 'regions')}">
                    <div style="margin-bottom: 1rem; padding: 1rem; background: #f8f9fa; border-radius: 8px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <strong>🇺🇸 Americas</strong><br>
                                <span style="color: #666;">English, Spanish, Portuguese</span>
                            </div>
                            <div style="text-align: right; color: ${this.config.colorScheme.primary};">
                                <strong>24/7</strong>
                            </div>
                        </div>
                    </div>
                    <div style="margin-bottom: 1rem; padding: 1rem; background: #f8f9fa; border-radius: 8px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <strong>🇪🇺 Europe</strong><br>
                                <span style="color: #666;">English, German, French, Italian</span>
                            </div>
                            <div style="text-align: right; color: ${this.config.colorScheme.primary};">
                                <strong>24/7</strong>
                            </div>
                        </div>
                    </div>
                    <div style="margin-bottom: 1rem; padding: 1rem; background: #f8f9fa; border-radius: 8px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <strong>🌏 Asia Pacific</strong><br>
                                <span style="color: #666;">English, Japanese, Korean, Chinese</span>
                            </div>
                            <div style="text-align: right; color: ${this.config.colorScheme.primary};">
                                <strong>24/7</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <div class="${this.generateClassName('contact', 'methods')}" style="background: #f8f9fa; padding: 3rem; border-radius: 15px;">
        <h3 style="text-align: center; margin-bottom: 2rem; color: ${this.config.colorScheme.primary};">📞 Alternative Contact Methods</h3>
        <div class="${this.generateClassName('grid', '3')}" style="gap: 2rem;">
            <div style="text-align: center; padding: 1.5rem; background: white; border-radius: 10px;">
                <div style="font-size: 2.5rem; margin-bottom: 1rem;">📧</div>
                <h4 style="margin-bottom: 0.5rem;">Email Support</h4>
                <p style="color: #666; margin-bottom: 1rem;">Get detailed help via email</p>
                <a href="mailto:support@${this.domain}" style="color: ${this.config.colorScheme.primary}; font-weight: 600;">support@${this.domain}</a>
            </div>
            <div style="text-align: center; padding: 1.5rem; background: white; border-radius: 10px;">
                <div style="font-size: 2.5rem; margin-bottom: 1rem;">💬</div>
                <h4 style="margin-bottom: 0.5rem;">Live Chat</h4>
                <p style="color: #666; margin-bottom: 1rem;">Instant assistance available</p>
                <button onclick="openLiveChat()" class="${this.generateClassName('btn', 'secondary')}" style="padding: 0.5rem 1rem;">Start Chat</button>
            </div>
            <div style="text-align: center; padding: 1.5rem; background: white; border-radius: 10px;">
                <div style="font-size: 2.5rem; margin-bottom: 1rem;">📱</div>
                <h4 style="margin-bottom: 0.5rem;">Social Media</h4>
                <p style="color: #666; margin-bottom: 1rem;">Follow us for updates</p>
                <div style="display: flex; justify-content: center; gap: 0.5rem;">
                    <a href="#" style="font-size: 1.5rem;">📘</a>
                    <a href="#" style="font-size: 1.5rem;">🐦</a>
                    <a href="#" style="font-size: 1.5rem;">📷</a>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
document.getElementById('mapContactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const priority = formData.get('priority');
    const location = formData.get('location');
    
    const button = this.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    button.textContent = 'Sending...';
    button.disabled = true;
    
    setTimeout(() => {
        let responseTime = '2-4 hours';
        if (priority === 'urgent') responseTime = '30 minutes';
        else if (priority === 'high') responseTime = '1 hour';
        else if (priority === 'medium') responseTime = '1-2 hours';
        
        alert(\`Thank you for your message! Based on the priority level (\${priority}), we will respond within \${responseTime}.\`);
        this.reset();
        button.textContent = originalText;
        button.disabled = false;
    }, 2000);
});

function openLiveChat() {
    alert('Live chat feature coming soon! For immediate assistance, please use email support.');
}
</script>`;

            case 'split-layout':
                return `
<div class="${containerClass}" style="padding: 4rem 0;">
    <h1 class="${this.generateClassName('text', 'center')} ${this.generateClassName('mb', '4')}" style="font-size: 3rem;">Contact Us</h1>
    
    <div class="${this.generateClassName('grid', '2')}" style="gap: 3rem;">
        <div class="${this.generateClassName('card')}" style="padding: 2rem;">
            <h3 style="margin-bottom: 1.5rem; color: ${this.config.colorScheme.primary};">Send us a Message</h3>
            <form id="contactForm" class="${this.generateClassName('contact', 'form')}">
                <div style="margin-bottom: 1rem;">
                    <label for="name" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Your Name</label>
                    <input type="text" id="name" name="name" required class="${this.generateClassName('form', 'input')}" style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 5px; font-size: 1rem;">
                </div>
                <div style="margin-bottom: 1rem;">
                    <label for="email" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Email Address</label>
                    <input type="email" id="email" name="email" required class="${this.generateClassName('form', 'input')}" style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 5px; font-size: 1rem;">
                </div>
                <div style="margin-bottom: 1rem;">
                    <label for="subject" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Subject</label>
                    <select id="subject" name="subject" required class="${this.generateClassName('form', 'select')}" style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 5px; font-size: 1rem;">
                        <option value="">Select a topic</option>
                        <option value="general">General Inquiry</option>
                        <option value="technical">Technical Support</option>
                        <option value="games">Game Suggestion</option>
                        <option value="feedback">Feedback</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div style="margin-bottom: 1.5rem;">
                    <label for="message" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Your Message</label>
                    <textarea id="message" name="message" rows="5" required class="${this.generateClassName('form', 'textarea')}" style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 5px; font-size: 1rem; resize: vertical;" placeholder="Tell us how we can help you..."></textarea>
                </div>
                <button type="submit" class="${this.generateClassName('btn', 'primary')}" style="width: 100%; padding: 1rem; font-size: 1.1rem;">Send Message</button>
            </form>
        </div>
        
        <div>
            <div class="${this.generateClassName('card')}" style="padding: 2rem; margin-bottom: 2rem;">
                <h3 style="margin-bottom: 1.5rem; color: ${this.config.colorScheme.primary};">Get in Touch</h3>
                <div class="${this.generateClassName('contact', 'info')}">
                    <div style="margin-bottom: 1.5rem; display: flex; align-items: center;">
                        <span style="font-size: 1.5rem; margin-right: 1rem;">📧</span>
                        <div>
                            <strong>Email Us</strong><br>
                            <a href="mailto:support@${this.domain}" style="color: ${this.config.colorScheme.primary};">support@${this.domain}</a>
                        </div>
                    </div>
                    <div style="margin-bottom: 1.5rem; display: flex; align-items: center;">
                        <span style="font-size: 1.5rem; margin-right: 1rem;">🕒</span>
                        <div>
                            <strong>Response Time</strong><br>
                            We typically respond within 24 hours
                        </div>
                    </div>
                    <div style="display: flex; align-items: center;">
                        <span style="font-size: 1.5rem; margin-right: 1rem;">🌍</span>
                        <div>
                            <strong>Support Hours</strong><br>
                            24/7 Online Support Available
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="${this.generateClassName('card')}" style="padding: 2rem;">
                <h3 style="margin-bottom: 1.5rem; color: ${this.config.colorScheme.primary};">Frequently Asked Questions</h3>
                <div class="${this.generateClassName('faq', 'item')}" style="margin-bottom: 1rem;">
                    <strong>Are the games really free?</strong>
                    <p style="margin-top: 0.5rem; color: #666;">Yes! All our games are completely free to play. No hidden costs or purchases required.</p>
                </div>
                <div class="${this.generateClassName('faq', 'item')}" style="margin-bottom: 1rem;">
                    <strong>Do I need to register to play?</strong>
                    <p style="margin-top: 0.5rem; color: #666;">No registration required. You can start playing immediately!</p>
                </div>
                <div class="${this.generateClassName('faq', 'item')}">
                    <strong>Can I play on mobile?</strong>
                    <p style="margin-top: 0.5rem; color: #666;">Absolutely! Our games are optimized for all devices including smartphones and tablets.</p>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    
    // Simulate form submission
    const button = this.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    button.textContent = 'Sending...';
    button.disabled = true;
    
    setTimeout(() => {
        alert('Thank you for your message! We will get back to you soon.');
        this.reset();
        button.textContent = originalText;
        button.disabled = false;
    }, 2000);
});
</script>`;

            default:
                return `
<div class="${containerClass}" style="padding: 4rem 0;">
    <h1 class="${this.generateClassName('text', 'center')} ${this.generateClassName('mb', '4')}" style="font-size: 3rem;">Contact Us</h1>
    <div style="max-width: 600px; margin: 0 auto;">
        <div class="${this.generateClassName('card')}">
            <div style="padding: 2rem;">
                <h3 style="margin-bottom: 1rem;">Get in Touch</h3>
                <p style="margin-bottom: 2rem;">Have questions or feedback? We'd love to hear from you!</p>
                
                <form style="display: grid; gap: 1rem;">
                    <input type="text" placeholder="Your Name" required style="padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px;">
                    <input type="email" placeholder="Your Email" required style="padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px;">
                    <select required style="padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px;">
                        <option value="">Select a topic</option>
                        <option value="general">General Inquiry</option>
                        <option value="technical">Technical Support</option>
                        <option value="games">Game Suggestion</option>
                        <option value="other">Other</option>
                    </select>
                    <textarea placeholder="Your Message" rows="5" required style="padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px;"></textarea>
                    <button type="submit" class="${this.generateClassName('btn', 'primary')}">Send Message</button>
                </form>
            </div>
        </div>
    </div>
</div>`;
        }
    }

    generateEnhancedLegalPages(outputDir) {
        const { legalPageLayout } = this.config;
        
        const legalPages = [
            {
                file: 'terms.html',
                title: 'Terms & Conditions',
                content: this.generateTermsContent()
            },
            {
                file: 'privacy.html',
                title: 'Privacy Policy',
                content: this.generatePrivacyContent()
            },
            {
                file: 'cookies.html',
                title: 'Cookie Policy',
                content: this.generateCookieContent()
            },
            {
                file: 'responsible-gaming.html',
                title: 'Responsible Social Gaming',
                content: this.generateResponsibleGamingContent()
            }
        ];

        legalPages.forEach(page => {
            const enhancedContent = this.generateLegalPageLayout(page.content, page.title);
            fs.writeFileSync(
                path.join(outputDir, page.file),
                this.generateHTML(page.title, enhancedContent)
            );
        });
    }

    generateLegalPageLayout(content, title) {
        const { legalPageLayout } = this.config;
        const containerClass = this.generateClassName('container');
        
        switch (legalPageLayout) {
            case 'accordion':
                return `
<div class="${containerClass}" style="padding: 4rem 0;">
    <h1 class="${this.generateClassName('text', 'center')} ${this.generateClassName('mb', '4')}" style="font-size: 3rem;">${title}</h1>
    
    <div class="${this.generateClassName('legal', 'accordion')}" style="max-width: 900px; margin: 0 auto;">
        <div class="${this.generateClassName('accordion', 'item')}" style="margin-bottom: 1rem; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
            <button class="${this.generateClassName('accordion', 'header')}" onclick="toggleLegalAccordion('legal1')" style="width: 100%; text-align: left; padding: 2rem; background: linear-gradient(135deg, ${this.config.colorScheme.primary}10, ${this.config.colorScheme.secondary}10); border: none; font-weight: 600; font-size: 1.2rem; cursor: pointer; display: flex; justify-content: space-between; align-items: center; color: ${this.config.colorScheme.primary};">
                📋 1. Introduction & Overview
                <span id="legal1-icon" style="font-size: 1.5rem; transition: transform 0.3s ease;">+</span>
            </button>
            <div id="legal1" class="${this.generateClassName('accordion', 'content')}" style="display: none; padding: 2rem; background: white; line-height: 1.7;">
                <p style="margin-bottom: 1.5rem;">Welcome to ${this.siteName}. These legal terms outline the rules and regulations for the use of our social casino gaming platform. By accessing this website, you acknowledge that you have read, understood, and agree to be bound by these terms.</p>
                <ul style="margin-left: 1.5rem;">
                    <li style="margin-bottom: 0.5rem;">All games are for entertainment purposes only</li>
                    <li style="margin-bottom: 0.5rem;">No real money gambling takes place on this site</li>
                    <li style="margin-bottom: 0.5rem;">Users must be 18 years or older to access the site</li>
                    <li>We reserve the right to modify these terms at any time</li>
                </ul>
            </div>
        </div>
        
        <div class="${this.generateClassName('accordion', 'item')}" style="margin-bottom: 1rem; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
            <button class="${this.generateClassName('accordion', 'header')}" onclick="toggleLegalAccordion('legal2')" style="width: 100%; text-align: left; padding: 2rem; background: linear-gradient(135deg, ${this.config.colorScheme.primary}10, ${this.config.colorScheme.secondary}10); border: none; font-weight: 600; font-size: 1.2rem; cursor: pointer; display: flex; justify-content: space-between; align-items: center; color: ${this.config.colorScheme.primary};">
                🎮 2. Platform Usage Terms
                <span id="legal2-icon" style="font-size: 1.5rem; transition: transform 0.3s ease;">+</span>
            </button>
            <div id="legal2" class="${this.generateClassName('accordion', 'content')}" style="display: none; padding: 2rem; background: white; line-height: 1.7;">
                <p style="margin-bottom: 1.5rem;">By using ${this.siteName}, you agree to use our platform responsibly and in accordance with all applicable laws and regulations. The following guidelines apply to all users:</p>
                <ul style="margin-left: 1.5rem;">
                    <li style="margin-bottom: 0.5rem;">Use the platform for lawful purposes only</li>
                    <li style="margin-bottom: 0.5rem;">Respect other users and maintain a positive gaming environment</li>
                    <li style="margin-bottom: 0.5rem;">Do not attempt to hack, exploit, or damage our systems</li>
                    <li style="margin-bottom: 0.5rem;">Report any bugs or security issues to our support team</li>
                    <li>Follow responsible gaming practices</li>
                </ul>
            </div>
        </div>
        
        <div class="${this.generateClassName('accordion', 'item')}" style="margin-bottom: 1rem; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
            <button class="${this.generateClassName('accordion', 'header')}" onclick="toggleLegalAccordion('legal3')" style="width: 100%; text-align: left; padding: 2rem; background: linear-gradient(135deg, ${this.config.colorScheme.primary}10, ${this.config.colorScheme.secondary}10); border: none; font-weight: 600; font-size: 1.2rem; cursor: pointer; display: flex; justify-content: space-between; align-items: center; color: ${this.config.colorScheme.primary};">
                🛡️ 3. Privacy & Data Protection
                <span id="legal3-icon" style="font-size: 1.5rem; transition: transform 0.3s ease;">+</span>
            </button>
            <div id="legal3" class="${this.generateClassName('accordion', 'content')}" style="display: none; padding: 2rem; background: white; line-height: 1.7;">
                <p style="margin-bottom: 1.5rem;">Your privacy is important to us. We implement appropriate security measures to protect your personal information and ensure compliance with applicable privacy laws.</p>
                <ul style="margin-left: 1.5rem;">
                    <li style="margin-bottom: 0.5rem;">We collect minimal personal information necessary for service provision</li>
                    <li style="margin-bottom: 0.5rem;">Your data is encrypted and stored securely</li>
                    <li style="margin-bottom: 0.5rem;">We do not sell your personal information to third parties</li>
                    <li>You have the right to request deletion of your data</li>
                </ul>
            </div>
        </div>
        
        <div class="${this.generateClassName('accordion', 'item')}" style="margin-bottom: 1rem; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
            <button class="${this.generateClassName('accordion', 'header')}" onclick="toggleLegalAccordion('legal4')" style="width: 100%; text-align: left; padding: 2rem; background: linear-gradient(135deg, ${this.config.colorScheme.primary}10, ${this.config.colorScheme.secondary}10); border: none; font-weight: 600; font-size: 1.2rem; cursor: pointer; display: flex; justify-content: space-between; align-items: center; color: ${this.config.colorScheme.primary};">
                ⚖️ 4. Disclaimers & Limitations
                <span id="legal4-icon" style="font-size: 1.5rem; transition: transform 0.3s ease;">+</span>
            </button>
            <div id="legal4" class="${this.generateClassName('accordion', 'content')}" style="display: none; padding: 2rem; background: white; line-height: 1.7;">
                <p style="margin-bottom: 1.5rem;">The information and services on this website are provided on an 'as is' basis. ${this.siteName} makes no representations or warranties of any kind, express or implied.</p>
                <ul style="margin-left: 1.5rem;">
                    <li style="margin-bottom: 0.5rem;">No warranty of uninterrupted or error-free service</li>
                    <li style="margin-bottom: 0.5rem;">We are not liable for any damages arising from use of our platform</li>
                    <li style="margin-bottom: 0.5rem;">Service availability may vary and is not guaranteed</li>
                    <li>User assumes all risks associated with platform usage</li>
                </ul>
            </div>
        </div>
        
        <div class="${this.generateClassName('accordion', 'item')}" style="border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
            <button class="${this.generateClassName('accordion', 'header')}" onclick="toggleLegalAccordion('legal5')" style="width: 100%; text-align: left; padding: 2rem; background: linear-gradient(135deg, ${this.config.colorScheme.primary}10, ${this.config.colorScheme.secondary}10); border: none; font-weight: 600; font-size: 1.2rem; cursor: pointer; display: flex; justify-content: space-between; align-items: center; color: ${this.config.colorScheme.primary};">
                📞 5. Contact & Support Information
                <span id="legal5-icon" style="font-size: 1.5rem; transition: transform 0.3s ease;">+</span>
            </button>
            <div id="legal5" class="${this.generateClassName('accordion', 'content')}" style="display: none; padding: 2rem; background: white; line-height: 1.7;">
                <p style="margin-bottom: 1.5rem;">If you have any questions about these terms or need assistance, please don't hesitate to contact our support team:</p>
                <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 10px; margin-top: 1rem;">
                    <p style="margin-bottom: 0.5rem;"><strong>Email:</strong> <a href="mailto:legal@${this.domain}" style="color: ${this.config.colorScheme.primary};">legal@${this.domain}</a></p>
                    <p style="margin-bottom: 0.5rem;"><strong>General Support:</strong> <a href="mailto:support@${this.domain}" style="color: ${this.config.colorScheme.primary};">support@${this.domain}</a></p>
                    <p style="margin: 0;"><strong>Response Time:</strong> Within 24-48 hours</p>
                </div>
            </div>
        </div>
    </div>
    
    <div style="text-align: center; margin-top: 3rem; padding-top: 2rem; border-top: 1px solid #eee;">
        <p style="color: #666; margin-bottom: 1rem;"><strong>Last updated:</strong> ${new Date().toLocaleDateString()}</p>
        <p style="color: #888; font-size: 0.9rem;">This document is effective as of the date listed above and supersedes all previous versions.</p>
    </div>
</div>

<script>
function toggleLegalAccordion(accordionId) {
    const content = document.getElementById(accordionId);
    const icon = document.getElementById(accordionId + '-icon');
    
    if (content.style.display === 'none' || content.style.display === '') {
        content.style.display = 'block';
        icon.textContent = '-';
        icon.style.transform = 'rotate(180deg)';
    } else {
        content.style.display = 'none';
        icon.textContent = '+';
        icon.style.transform = 'rotate(0deg)';
    }
}
</script>`;

            case 'single-column':
                return `
<div class="${containerClass}" style="padding: 4rem 0;">
    <div class="${this.generateClassName('legal', 'header')}" style="text-align: center; margin-bottom: 4rem; padding: 3rem; background: linear-gradient(135deg, ${this.config.colorScheme.primary}, ${this.config.colorScheme.secondary}); color: white; border-radius: 20px;">
        <h1 style="font-size: 3.5rem; margin-bottom: 1rem;">${title}</h1>
        <p style="font-size: 1.3rem; opacity: 0.9; max-width: 600px; margin: 0 auto;">
            Please read these terms carefully as they govern your use of ${this.siteName} and our services.
        </p>
        <div style="margin-top: 2rem; padding: 1rem; background: rgba(255,255,255,0.2); border-radius: 10px; backdrop-filter: blur(10px);">
            <p style="margin: 0; font-size: 1.1rem;"><strong>Last Updated:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
    </div>
    
    <div class="${this.generateClassName('legal', 'content')}" style="max-width: 800px; margin: 0 auto; font-size: 1.1rem; line-height: 1.8;">
        <div class="${this.generateClassName('legal', 'section')}" style="margin-bottom: 3rem; padding: 2rem; background: white; border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.05); border-left: 4px solid ${this.config.colorScheme.primary};">
            <h2 style="color: ${this.config.colorScheme.primary}; margin-bottom: 1.5rem; display: flex; align-items: center;">
                <span style="font-size: 1.5rem; margin-right: 1rem;">📋</span>
                1. Introduction
            </h2>
            <p style="margin-bottom: 1.5rem;">Welcome to ${this.siteName}, your premier destination for social casino gaming. These terms and conditions constitute a legally binding agreement between you and ${this.siteName} regarding your use of our platform and services.</p>
            <p style="margin-bottom: 1.5rem;">By accessing or using our website, you acknowledge that you have read, understood, and agree to be bound by these terms. If you do not agree with any part of these terms, you must not use our services.</p>
            <div style="background: ${this.config.colorScheme.primary}10; padding: 1.5rem; border-radius: 10px; border-left: 3px solid ${this.config.colorScheme.primary};">
                <p style="margin: 0; font-weight: 600;">Key Points:</p>
                <ul style="margin: 0.5rem 0 0 1.5rem;">
                    <li>All games are for entertainment purposes only</li>
                    <li>No real money gambling takes place on this site</li>
                    <li>Users must be 18 years or older</li>
                </ul>
            </div>
        </div>
        
        <div class="${this.generateClassName('legal', 'section')}" style="margin-bottom: 3rem; padding: 2rem; background: white; border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.05); border-left: 4px solid ${this.config.colorScheme.secondary};">
            <h2 style="color: ${this.config.colorScheme.secondary}; margin-bottom: 1.5rem; display: flex; align-items: center;">
                <span style="font-size: 1.5rem; margin-right: 1rem;">🎮</span>
                2. Platform Usage & User Conduct
            </h2>
            <p style="margin-bottom: 1.5rem;">Your use of ${this.siteName} is subject to the following terms and conditions. By using our platform, you agree to comply with all applicable laws and regulations.</p>
            <h3 style="color: ${this.config.colorScheme.secondary}; margin-bottom: 1rem;">Acceptable Use:</h3>
            <ul style="margin-bottom: 1.5rem; margin-left: 1.5rem;">
                <li style="margin-bottom: 0.5rem;">Use the platform for lawful purposes only</li>
                <li style="margin-bottom: 0.5rem;">Respect other users and maintain a positive environment</li>
                <li style="margin-bottom: 0.5rem;">Report any bugs or security issues promptly</li>
                <li style="margin-bottom: 0.5rem;">Follow responsible gaming practices</li>
            </ul>
            <h3 style="color: ${this.config.colorScheme.secondary}; margin-bottom: 1rem;">Prohibited Activities:</h3>
            <ul style="margin-left: 1.5rem;">
                <li style="margin-bottom: 0.5rem;">Attempting to hack, exploit, or damage our systems</li>
                <li style="margin-bottom: 0.5rem;">Using automated tools or bots</li>
                <li style="margin-bottom: 0.5rem;">Violating intellectual property rights</li>
                <li>Engaging in fraudulent or deceptive practices</li>
            </ul>
        </div>
        
        <div class="${this.generateClassName('legal', 'section')}" style="margin-bottom: 3rem; padding: 2rem; background: white; border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.05); border-left: 4px solid ${this.config.colorScheme.accent};">
            <h2 style="color: ${this.config.colorScheme.accent}; margin-bottom: 1.5rem; display: flex; align-items: center;">
                <span style="font-size: 1.5rem; margin-right: 1rem;">🛡️</span>
                3. Privacy & Data Protection
            </h2>
            <p style="margin-bottom: 1.5rem;">We take your privacy seriously and are committed to protecting your personal information. Our data collection and processing practices are designed to be transparent and secure.</p>
            <p style="margin-bottom: 1.5rem;">We collect only the minimum amount of information necessary to provide our services effectively. All data is encrypted and stored securely using industry-standard practices.</p>
            <div style="background: ${this.config.colorScheme.accent}10; padding: 1.5rem; border-radius: 10px;">
                <p style="margin-bottom: 1rem; font-weight: 600;">Your Rights:</p>
                <ul style="margin: 0 0 0 1.5rem;">
                    <li style="margin-bottom: 0.5rem;">Right to access your personal data</li>
                    <li style="margin-bottom: 0.5rem;">Right to request data correction or deletion</li>
                    <li style="margin-bottom: 0.5rem;">Right to data portability</li>
                    <li>Right to withdraw consent at any time</li>
                </ul>
            </div>
        </div>
        
        <div class="${this.generateClassName('legal', 'section')}" style="margin-bottom: 3rem; padding: 2rem; background: white; border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.05); border-left: 4px solid #e74c3c;">
            <h2 style="color: #e74c3c; margin-bottom: 1.5rem; display: flex; align-items: center;">
                <span style="font-size: 1.5rem; margin-right: 1rem;">⚖️</span>
                4. Disclaimers & Limitation of Liability
            </h2>
            <p style="margin-bottom: 1.5rem;">The services and information on this website are provided on an "as is" and "as available" basis. ${this.siteName} makes no representations or warranties of any kind, express or implied, regarding the operation of our platform or the information, content, or materials included.</p>
            <p style="margin-bottom: 1.5rem;">To the fullest extent permitted by law, ${this.siteName} disclaims all warranties, express or implied, including but not limited to implied warranties of merchantability and fitness for a particular purpose.</p>
            <div style="background: #fee; padding: 1.5rem; border-radius: 10px; border: 1px solid #e74c3c;">
                <p style="margin: 0; font-weight: 600; color: #e74c3c;">Important Notice:</p>
                <p style="margin: 0.5rem 0 0 0;">We shall not be liable for any damages arising from the use or inability to use our services, including but not limited to direct, indirect, incidental, punitive, and consequential damages.</p>
            </div>
        </div>
        
        <div class="${this.generateClassName('legal', 'section')}" style="padding: 2rem; background: white; border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.05); border-left: 4px solid ${this.config.colorScheme.primary};">
            <h2 style="color: ${this.config.colorScheme.primary}; margin-bottom: 1.5rem; display: flex; align-items: center;">
                <span style="font-size: 1.5rem; margin-right: 1rem;">📞</span>
                5. Contact Information & Support
            </h2>
            <p style="margin-bottom: 1.5rem;">If you have any questions about these terms and conditions or need assistance with our services, please contact us using the information below:</p>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem;">
                <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 10px;">
                    <h4 style="margin-bottom: 1rem; color: ${this.config.colorScheme.primary};">📧 Legal Inquiries</h4>
                    <p style="margin: 0;"><a href="mailto:legal@${this.domain}" style="color: ${this.config.colorScheme.primary}; font-weight: 600;">legal@${this.domain}</a></p>
                    <p style="margin: 0.5rem 0 0 0; color: #666; font-size: 0.9rem;">For terms, privacy, and legal matters</p>
                </div>
                <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 10px;">
                    <h4 style="margin-bottom: 1rem; color: ${this.config.colorScheme.primary};">🛠️ General Support</h4>
                    <p style="margin: 0;"><a href="mailto:support@${this.domain}" style="color: ${this.config.colorScheme.primary}; font-weight: 600;">support@${this.domain}</a></p>
                    <p style="margin: 0.5rem 0 0 0; color: #666; font-size: 0.9rem;">For technical help and general questions</p>
                </div>
            </div>
            <div style="margin-top: 1.5rem; padding: 1rem; background: ${this.config.colorScheme.primary}10; border-radius: 8px; text-align: center;">
                <p style="margin: 0; font-weight: 600;">Response Time: We typically respond within 24-48 hours</p>
            </div>
        </div>
    </div>
</div>`;

            case 'tab-navigation':
                return `
<div class="${containerClass}" style="padding: 4rem 0;">
    <h1 class="${this.generateClassName('text', 'center')} ${this.generateClassName('mb', '4')}" style="font-size: 3rem;">${title}</h1>
    
    <div class="${this.generateClassName('tabs', 'container')}" style="max-width: 1000px; margin: 0 auto;">
        <div class="${this.generateClassName('tabs', 'navigation')}" style="display: flex; border-bottom: 2px solid #e0e0e0; margin-bottom: 2rem; background: white; border-radius: 10px 10px 0 0; overflow: hidden; box-shadow: 0 -2px 10px rgba(0,0,0,0.05);">
            <button class="${this.generateClassName('tab', 'button')} active" onclick="switchTab('tab1')" style="flex: 1; padding: 1.5rem; border: none; background: ${this.config.colorScheme.primary}; color: white; cursor: pointer; font-weight: 600; font-size: 1rem; transition: all 0.3s ease;">
                📋 Overview
            </button>
            <button class="${this.generateClassName('tab', 'button')}" onclick="switchTab('tab2')" style="flex: 1; padding: 1.5rem; border: none; background: #f8f9fa; color: #666; cursor: pointer; font-weight: 600; font-size: 1rem; transition: all 0.3s ease;">
                🎮 Usage Terms
            </button>
            <button class="${this.generateClassName('tab', 'button')}" onclick="switchTab('tab3')" style="flex: 1; padding: 1.5rem; border: none; background: #f8f9fa; color: #666; cursor: pointer; font-weight: 600; font-size: 1rem; transition: all 0.3s ease;">
                🛡️ Privacy
            </button>
            <button class="${this.generateClassName('tab', 'button')}" onclick="switchTab('tab4')" style="flex: 1; padding: 1.5rem; border: none; background: #f8f9fa; color: #666; cursor: pointer; font-weight: 600; font-size: 1rem; transition: all 0.3s ease;">
                ⚖️ Legal
            </button>
            <button class="${this.generateClassName('tab', 'button')}" onclick="switchTab('tab5')" style="flex: 1; padding: 1.5rem; border: none; background: #f8f9fa; color: #666; cursor: pointer; font-weight: 600; font-size: 1rem; transition: all 0.3s ease;">
                📞 Contact
            </button>
        </div>
        
        <div class="${this.generateClassName('tabs', 'content')}" style="background: white; border-radius: 0 0 10px 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.05);">
            <div id="tab1" class="${this.generateClassName('tab', 'panel')} active" style="padding: 3rem; line-height: 1.7; font-size: 1.1rem;">
                <h2 style="color: ${this.config.colorScheme.primary}; margin-bottom: 1.5rem; display: flex; align-items: center;">
                    <span style="font-size: 1.5rem; margin-right: 1rem;">📋</span>
                    Introduction & Overview
                </h2>
                <p style="margin-bottom: 1.5rem;">Welcome to ${this.siteName}, your premier destination for social casino gaming entertainment. This document outlines the comprehensive terms and conditions that govern your use of our platform and services.</p>
                <p style="margin-bottom: 1.5rem;">By accessing or using our website, you enter into a legally binding agreement with ${this.siteName}. These terms are designed to ensure a safe, fair, and enjoyable experience for all users while protecting both your rights and ours.</p>
                
                <div style="background: linear-gradient(135deg, ${this.config.colorScheme.primary}15, ${this.config.colorScheme.secondary}15); padding: 2rem; border-radius: 15px; margin-bottom: 2rem;">
                    <h3 style="margin-bottom: 1rem; color: ${this.config.colorScheme.primary};">Key Highlights</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                        <div style="background: white; padding: 1rem; border-radius: 8px; text-align: center;">
                            <div style="font-size: 2rem; margin-bottom: 0.5rem;">🎮</div>
                            <strong>Entertainment Only</strong>
                            <p style="margin: 0.5rem 0 0 0; font-size: 0.9rem; color: #666;">No real money gambling</p>
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 8px; text-align: center;">
                            <div style="font-size: 2rem; margin-bottom: 0.5rem;">🔒</div>
                            <strong>Secure Platform</strong>
                            <p style="margin: 0.5rem 0 0 0; font-size: 0.9rem; color: #666;">Your data is protected</p>
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 8px; text-align: center;">
                            <div style="font-size: 2rem; margin-bottom: 0.5rem;">👤</div>
                            <strong>18+ Only</strong>
                            <p style="margin: 0.5rem 0 0 0; font-size: 0.9rem; color: #666;">Age verification required</p>
                        </div>
                    </div>
                </div>
                
                <p style="margin-bottom: 1rem;"><strong>Last Updated:</strong> ${new Date().toLocaleDateString()}</p>
                <p style="color: #666;">This document supersedes all previous versions and is effective immediately upon posting.</p>
            </div>
            
            <div id="tab2" class="${this.generateClassName('tab', 'panel')}" style="display: none; padding: 3rem; line-height: 1.7; font-size: 1.1rem;">
                <h2 style="color: ${this.config.colorScheme.primary}; margin-bottom: 1.5rem; display: flex; align-items: center;">
                    <span style="font-size: 1.5rem; margin-right: 1rem;">🎮</span>
                    Platform Usage Terms
                </h2>
                <p style="margin-bottom: 2rem;">Your use of ${this.siteName} is governed by the following terms and conditions. Please read them carefully and ensure compliance at all times.</p>
                
                <div style="margin-bottom: 2rem;">
                    <h3 style="color: ${this.config.colorScheme.secondary}; margin-bottom: 1rem;">✅ Acceptable Use Policy</h3>
                    <ul style="margin-left: 1.5rem;">
                        <li style="margin-bottom: 0.8rem;"><strong>Lawful Use:</strong> Use our platform only for lawful purposes and in accordance with these terms</li>
                        <li style="margin-bottom: 0.8rem;"><strong>Respectful Conduct:</strong> Treat other users with respect and maintain a positive gaming environment</li>
                        <li style="margin-bottom: 0.8rem;"><strong>Age Requirement:</strong> You must be at least 18 years old to use our services</li>
                        <li style="margin-bottom: 0.8rem;"><strong>Responsible Gaming:</strong> Play responsibly and within your means</li>
                        <li><strong>Reporting:</strong> Report any bugs, security issues, or inappropriate behavior promptly</li>
                    </ul>
                </div>
                
                <div style="margin-bottom: 2rem;">
                    <h3 style="color: #e74c3c; margin-bottom: 1rem;">❌ Prohibited Activities</h3>
                    <ul style="margin-left: 1.5rem;">
                        <li style="margin-bottom: 0.8rem;">Attempting to hack, exploit, or damage our systems</li>
                        <li style="margin-bottom: 0.8rem;">Using automated tools, bots, or scripts</li>
                        <li style="margin-bottom: 0.8rem;">Violating intellectual property rights</li>
                        <li style="margin-bottom: 0.8rem;">Engaging in fraudulent or deceptive practices</li>
                        <li>Sharing inappropriate or harmful content</li>
                    </ul>
                </div>
                
                <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 1.5rem; border-radius: 10px;">
                    <h4 style="margin-bottom: 1rem; color: #856404;">⚠️ Important Notice</h4>
                    <p style="margin: 0; color: #856404;">Violation of these terms may result in immediate suspension or termination of your access to our platform. We reserve the right to take appropriate action to protect our community and services.</p>
                </div>
            </div>
            
            <div id="tab3" class="${this.generateClassName('tab', 'panel')}" style="display: none; padding: 3rem; line-height: 1.7; font-size: 1.1rem;">
                <h2 style="color: ${this.config.colorScheme.primary}; margin-bottom: 1.5rem; display: flex; align-items: center;">
                    <span style="font-size: 1.5rem; margin-right: 1rem;">🛡️</span>
                    Privacy & Data Protection
                </h2>
                <p style="margin-bottom: 2rem;">At ${this.siteName}, we are committed to protecting your privacy and ensuring the security of your personal information. This section outlines our data practices and your rights.</p>
                
                <div style="margin-bottom: 2rem;">
                    <h3 style="color: ${this.config.colorScheme.secondary}; margin-bottom: 1rem;">📊 Data Collection</h3>
                    <p style="margin-bottom: 1rem;">We collect only the minimum amount of information necessary to provide our services effectively:</p>
                    <ul style="margin-left: 1.5rem;">
                        <li style="margin-bottom: 0.5rem;">Technical information (IP address, browser type, device information)</li>
                        <li style="margin-bottom: 0.5rem;">Usage data (games played, time spent, preferences)</li>
                        <li style="margin-bottom: 0.5rem;">Optional contact information (email for support)</li>
                        <li>Performance and analytics data to improve our services</li>
                    </ul>
                </div>
                
                <div style="margin-bottom: 2rem;">
                    <h3 style="color: ${this.config.colorScheme.accent}; margin-bottom: 1rem;">🔐 Data Security</h3>
                    <p style="margin-bottom: 1rem;">We implement industry-standard security measures to protect your information:</p>
                    <ul style="margin-left: 1.5rem;">
                        <li style="margin-bottom: 0.5rem;">Encryption of data in transit and at rest</li>
                        <li style="margin-bottom: 0.5rem;">Regular security audits and updates</li>
                        <li style="margin-bottom: 0.5rem;">Limited access to personal data on a need-to-know basis</li>
                        <li>Compliance with applicable data protection regulations</li>
                    </ul>
                </div>
                
                <div style="background: ${this.config.colorScheme.primary}10; padding: 2rem; border-radius: 15px;">
                    <h3 style="color: ${this.config.colorScheme.primary}; margin-bottom: 1rem;">👤 Your Rights</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                        <div>
                            <strong>Access</strong>
                            <p style="margin: 0.5rem 0 0 0; font-size: 0.9rem;">Request a copy of your personal data</p>
                        </div>
                        <div>
                            <strong>Correction</strong>
                            <p style="margin: 0.5rem 0 0 0; font-size: 0.9rem;">Update or correct your information</p>
                        </div>
                        <div>
                            <strong>Deletion</strong>
                            <p style="margin: 0.5rem 0 0 0; font-size: 0.9rem;">Request removal of your data</p>
                        </div>
                        <div>
                            <strong>Portability</strong>
                            <p style="margin: 0.5rem 0 0 0; font-size: 0.9rem;">Transfer your data to another service</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div id="tab4" class="${this.generateClassName('tab', 'panel')}" style="display: none; padding: 3rem; line-height: 1.7; font-size: 1.1rem;">
                <h2 style="color: ${this.config.colorScheme.primary}; margin-bottom: 1.5rem; display: flex; align-items: center;">
                    <span style="font-size: 1.5rem; margin-right: 1rem;">⚖️</span>
                    Legal Terms & Disclaimers
                </h2>
                <p style="margin-bottom: 2rem;">This section contains important legal information regarding our services, disclaimers, and limitations of liability.</p>
                
                <div style="margin-bottom: 2rem;">
                    <h3 style="color: #e74c3c; margin-bottom: 1rem;">📋 Service Disclaimers</h3>
                    <p style="margin-bottom: 1rem;">Our services are provided "as is" and "as available" without any warranties:</p>
                    <ul style="margin-left: 1.5rem;">
                        <li style="margin-bottom: 0.5rem;">No guarantee of uninterrupted or error-free service</li>
                        <li style="margin-bottom: 0.5rem;">No warranty regarding accuracy or completeness of content</li>
                        <li style="margin-bottom: 0.5rem;">Service availability may vary without notice</li>
                        <li>We reserve the right to modify or discontinue services</li>
                    </ul>
                </div>
                
                <div style="margin-bottom: 2rem;">
                    <h3 style="color: #8e44ad; margin-bottom: 1rem;">⚡ Limitation of Liability</h3>
                    <p style="margin-bottom: 1rem;">To the fullest extent permitted by law, ${this.siteName} shall not be liable for:</p>
                    <ul style="margin-left: 1.5rem;">
                        <li style="margin-bottom: 0.5rem;">Direct, indirect, incidental, or consequential damages</li>
                        <li style="margin-bottom: 0.5rem;">Loss of profits, data, or business opportunities</li>
                        <li style="margin-bottom: 0.5rem;">Damages resulting from unauthorized access to your account</li>
                        <li>Any damages exceeding the amount paid for our services (if any)</li>
                    </ul>
                </div>
                
                <div style="background: #fee; border: 1px solid #e74c3c; padding: 1.5rem; border-radius: 10px;">
                    <h4 style="margin-bottom: 1rem; color: #e74c3c;">🚨 Important Legal Notice</h4>
                    <p style="margin: 0; color: #721c24;">These limitations apply regardless of the legal theory upon which any claim is based, whether in contract, tort, negligence, strict liability, or otherwise. Some jurisdictions may not allow certain limitations, so these may not apply to you.</p>
                </div>
            </div>
            
            <div id="tab5" class="${this.generateClassName('tab', 'panel')}" style="display: none; padding: 3rem; line-height: 1.7; font-size: 1.1rem;">
                <h2 style="color: ${this.config.colorScheme.primary}; margin-bottom: 1.5rem; display: flex; align-items: center;">
                    <span style="font-size: 1.5rem; margin-right: 1rem;">📞</span>
                    Contact Information & Support
                </h2>
                <p style="margin-bottom: 2rem;">We're here to help! If you have any questions about these terms or need assistance with our services, please don't hesitate to reach out to us.</p>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-bottom: 2rem;">
                    <div style="background: linear-gradient(135deg, ${this.config.colorScheme.primary}15, ${this.config.colorScheme.secondary}15); padding: 2rem; border-radius: 15px;">
                        <h3 style="margin-bottom: 1rem; color: ${this.config.colorScheme.primary};">📧 Legal & Compliance</h3>
                        <p style="margin-bottom: 1rem;">For questions about these terms, privacy policy, or other legal matters:</p>
                        <p style="margin-bottom: 0.5rem;"><strong>Email:</strong> <a href="mailto:legal@${this.domain}" style="color: ${this.config.colorScheme.primary}; font-weight: 600;">legal@${this.domain}</a></p>
                        <p style="margin: 0; color: #666; font-size: 0.9rem;">Response time: 24-48 hours</p>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, ${this.config.colorScheme.secondary}15, ${this.config.colorScheme.accent}15); padding: 2rem; border-radius: 15px;">
                        <h3 style="margin-bottom: 1rem; color: ${this.config.colorScheme.secondary};">🛠️ Technical Support</h3>
                        <p style="margin-bottom: 1rem;">For technical issues, game problems, or general assistance:</p>
                        <p style="margin-bottom: 0.5rem;"><strong>Email:</strong> <a href="mailto:support@${this.domain}" style="color: ${this.config.colorScheme.secondary}; font-weight: 600;">support@${this.domain}</a></p>
                        <p style="margin: 0; color: #666; font-size: 0.9rem;">Response time: 2-4 hours</p>
                    </div>
                </div>
                
                <div style="background: #f8f9fa; padding: 2rem; border-radius: 15px; text-align: center;">
                    <h3 style="margin-bottom: 1rem; color: ${this.config.colorScheme.primary};">📍 Our Commitment</h3>
                    <p style="margin-bottom: 1rem;">We are committed to providing excellent customer service and addressing your concerns promptly and professionally.</p>
                    <div style="display: flex; justify-content: center; gap: 2rem; flex-wrap: wrap;">
                        <div style="text-align: center;">
                            <div style="font-size: 2rem; margin-bottom: 0.5rem;">⚡</div>
                            <strong>Fast Response</strong>
                            <p style="margin: 0.5rem 0 0 0; font-size: 0.9rem; color: #666;">Quick and efficient support</p>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 2rem; margin-bottom: 0.5rem;">🎯</div>
                            <strong>Targeted Help</strong>
                            <p style="margin: 0.5rem 0 0 0; font-size: 0.9rem; color: #666;">Specialized assistance for your needs</p>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 2rem; margin-bottom: 0.5rem;">🤝</div>
                            <strong>Professional Service</strong>
                            <p style="margin: 0.5rem 0 0 0; font-size: 0.9rem; color: #666;">Courteous and knowledgeable staff</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
.${this.generateClassName('tab', 'button')}:hover {
    background: ${this.config.colorScheme.secondary} !important;
    color: white !important;
}
.${this.generateClassName('tab', 'button')}.active {
    background: ${this.config.colorScheme.primary} !important;
    color: white !important;
}
.${this.generateClassName('tab', 'panel')} {
    display: none;
}
.${this.generateClassName('tab', 'panel')}.active {
    display: block;
}
@media (max-width: 768px) {
    .${this.generateClassName('tabs', 'navigation')} {
        flex-direction: column;
    }
    .${this.generateClassName('tab', 'button')} {
        padding: 1rem !important;
        font-size: 0.9rem !important;
    }
}
</style>

<script>
function switchTab(tabId) {
    // Hide all tab panels
    const panels = document.querySelectorAll('.${this.generateClassName('tab', 'panel')}');
    panels.forEach(panel => {
        panel.classList.remove('active');
        panel.style.display = 'none';
    });
    
    // Remove active class from all tab buttons
    const buttons = document.querySelectorAll('.${this.generateClassName('tab', 'button')}');
    buttons.forEach(button => {
        button.classList.remove('active');
        button.style.background = '#f8f9fa';
        button.style.color = '#666';
    });
    
    // Show selected tab panel
    const selectedPanel = document.getElementById(tabId);
    selectedPanel.classList.add('active');
    selectedPanel.style.display = 'block';
    
    // Activate selected tab button
    event.target.classList.add('active');
    event.target.style.background = '${this.config.colorScheme.primary}';
    event.target.style.color = 'white';
}
</script>`;

            case 'floating-toc':
                return `
<div class="${containerClass}" style="padding: 4rem 0; position: relative;">
    <div class="${this.generateClassName('floating', 'toc')}" style="position: fixed; top: 50%; right: 2rem; transform: translateY(-50%); z-index: 1000; background: white; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.15); padding: 1.5rem; max-width: 250px; transition: all 0.3s ease;">
        <h4 style="margin-bottom: 1rem; color: ${this.config.colorScheme.primary}; font-size: 1rem;">📋 Quick Navigation</h4>
        <nav class="${this.generateClassName('floating', 'nav')}">
            <ul style="list-style: none; padding: 0; margin: 0;">
                <li style="margin-bottom: 0.5rem;">
                    <a href="#introduction" onclick="smoothScroll('introduction')" style="color: ${this.config.colorScheme.primary}; text-decoration: none; display: block; padding: 0.5rem; border-radius: 5px; font-size: 0.9rem; transition: all 0.3s ease;">
                        📋 Introduction
                    </a>
                </li>
                <li style="margin-bottom: 0.5rem;">
                    <a href="#usage-terms" onclick="smoothScroll('usage-terms')" style="color: ${this.config.colorScheme.primary}; text-decoration: none; display: block; padding: 0.5rem; border-radius: 5px; font-size: 0.9rem; transition: all 0.3s ease;">
                        🎮 Usage Terms
                    </a>
                </li>
                <li style="margin-bottom: 0.5rem;">
                    <a href="#privacy" onclick="smoothScroll('privacy')" style="color: ${this.config.colorScheme.primary}; text-decoration: none; display: block; padding: 0.5rem; border-radius: 5px; font-size: 0.9rem; transition: all 0.3s ease;">
                        🛡️ Privacy
                    </a>
                </li>
                <li style="margin-bottom: 0.5rem;">
                    <a href="#disclaimers" onclick="smoothScroll('disclaimers')" style="color: ${this.config.colorScheme.primary}; text-decoration: none; display: block; padding: 0.5rem; border-radius: 5px; font-size: 0.9rem; transition: all 0.3s ease;">
                        ⚖️ Legal
                    </a>
                </li>
                <li>
                    <a href="#contact" onclick="smoothScroll('contact')" style="color: ${this.config.colorScheme.primary}; text-decoration: none; display: block; padding: 0.5rem; border-radius: 5px; font-size: 0.9rem; transition: all 0.3s ease;">
                        📞 Contact
                    </a>
                </li>
            </ul>
        </nav>
        <div style="text-align: center; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #eee;">
            <button onclick="scrollToTop()" class="${this.generateClassName('btn', 'sm')}" style="background: ${this.config.colorScheme.primary}; color: white; border: none; padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.8rem; cursor: pointer;">
                ↑ Top
            </button>
        </div>
    </div>
    
    <div class="${this.generateClassName('legal', 'content')}" style="max-width: 800px; margin: 0 auto; padding-right: 300px;">
        <div class="${this.generateClassName('legal', 'header')}" style="text-align: center; margin-bottom: 4rem; padding: 3rem; background: linear-gradient(135deg, ${this.config.colorScheme.primary}, ${this.config.colorScheme.secondary}); color: white; border-radius: 20px;">
            <h1 style="font-size: 3.5rem; margin-bottom: 1rem;">${title}</h1>
            <p style="font-size: 1.2rem; opacity: 0.9; margin-bottom: 1rem;">
                Comprehensive legal terms governing your use of ${this.siteName}
            </p>
            <div style="background: rgba(255,255,255,0.2); padding: 1rem; border-radius: 10px; backdrop-filter: blur(10px);">
                <p style="margin: 0; font-size: 1rem;"><strong>Last Updated:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
        </div>
        
        <section id="introduction" class="${this.generateClassName('legal', 'section')}" style="margin-bottom: 4rem; padding: 3rem; background: white; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border-left: 5px solid ${this.config.colorScheme.primary};">
            <h2 style="color: ${this.config.colorScheme.primary}; margin-bottom: 2rem; font-size: 2.2rem; display: flex; align-items: center;">
                <span style="font-size: 1.8rem; margin-right: 1rem;">📋</span>
                1. Introduction & Agreement
            </h2>
            <p style="font-size: 1.2rem; line-height: 1.8; margin-bottom: 1.5rem; color: #444;">
                Welcome to ${this.siteName}, your premier destination for social casino gaming entertainment. These Terms of Service constitute a legally binding agreement between you, the user, and ${this.siteName}.
            </p>
            <div style="background: ${this.config.colorScheme.primary}10; padding: 2rem; border-radius: 15px; margin-bottom: 2rem;">
                <h3 style="color: ${this.config.colorScheme.primary}; margin-bottom: 1rem;">🎯 Key Terms Summary</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem;">
                    <div style="background: white; padding: 1.5rem; border-radius: 10px; text-align: center;">
                        <div style="font-size: 2.5rem; margin-bottom: 1rem;">🎮</div>
                        <h4 style="margin-bottom: 0.5rem;">Entertainment Only</h4>
                        <p style="margin: 0; color: #666; font-size: 0.9rem;">No real money gambling occurs on our platform</p>
                    </div>
                    <div style="background: white; padding: 1.5rem; border-radius: 10px; text-align: center;">
                        <div style="font-size: 2.5rem; margin-bottom: 1rem;">🔒</div>
                        <h4 style="margin-bottom: 0.5rem;">Secure & Safe</h4>
                        <p style="margin: 0; color: #666; font-size: 0.9rem;">Your privacy and security are our top priority</p>
                    </div>
                    <div style="background: white; padding: 1.5rem; border-radius: 10px; text-align: center;">
                        <div style="font-size: 2.5rem; margin-bottom: 1rem;">👤</div>
                        <h4 style="margin-bottom: 0.5rem;">Age Restricted</h4>
                        <p style="margin: 0; color: #666; font-size: 0.9rem;">Must be 18 years or older to use our services</p>
                    </div>
                </div>
            </div>
            <p style="line-height: 1.7; color: #555;">
                By accessing, browsing, or using our website and services, you acknowledge that you have read, understood, and agree to be bound by these terms. If you do not agree with any part of these terms, you must discontinue use of our platform immediately.
            </p>
        </section>
        
        <section id="usage-terms" class="${this.generateClassName('legal', 'section')}" style="margin-bottom: 4rem; padding: 3rem; background: white; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border-left: 5px solid ${this.config.colorScheme.secondary};">
            <h2 style="color: ${this.config.colorScheme.secondary}; margin-bottom: 2rem; font-size: 2.2rem; display: flex; align-items: center;">
                <span style="font-size: 1.8rem; margin-right: 1rem;">🎮</span>
                2. Platform Usage & User Conduct
            </h2>
            <p style="line-height: 1.7; margin-bottom: 2rem; color: #444;">
                Your use of ${this.siteName} is subject to specific terms and conditions designed to ensure a safe, fair, and enjoyable experience for all users.
            </p>
            
            <div style="margin-bottom: 2rem;">
                <h3 style="color: ${this.config.colorScheme.secondary}; margin-bottom: 1rem; font-size: 1.4rem;">✅ Acceptable Use Guidelines</h3>
                <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 1.5rem; border-radius: 10px;">
                    <ul style="margin: 0; margin-left: 1.5rem; color: #155724;">
                        <li style="margin-bottom: 0.8rem;"><strong>Lawful Use:</strong> Use our platform only for lawful purposes and in compliance with all applicable laws</li>
                        <li style="margin-bottom: 0.8rem;"><strong>Respectful Conduct:</strong> Treat other users, staff, and the community with respect and courtesy</li>
                        <li style="margin-bottom: 0.8rem;"><strong>Age Compliance:</strong> You must be at least 18 years of age to access and use our services</li>
                        <li style="margin-bottom: 0.8rem;"><strong>Responsible Gaming:</strong> Engage in responsible gaming practices and play within your limits</li>
                        <li><strong>Issue Reporting:</strong> Promptly report any bugs, security vulnerabilities, or inappropriate behavior</li>
                    </ul>
                </div>
            </div>
            
            <div style="margin-bottom: 2rem;">
                <h3 style="color: #e74c3c; margin-bottom: 1rem; font-size: 1.4rem;">❌ Prohibited Activities</h3>
                <div style="background: #f8d7da; border: 1px solid #f5c6cb; padding: 1.5rem; border-radius: 10px;">
                    <ul style="margin: 0; margin-left: 1.5rem; color: #721c24;">
                        <li style="margin-bottom: 0.8rem;">Attempting to hack, exploit, reverse engineer, or damage our systems</li>
                        <li style="margin-bottom: 0.8rem;">Using automated tools, bots, scripts, or any unauthorized third-party software</li>
                        <li style="margin-bottom: 0.8rem;">Violating intellectual property rights or engaging in copyright infringement</li>
                        <li style="margin-bottom: 0.8rem;">Engaging in fraudulent, deceptive, or illegal activities</li>
                        <li>Sharing inappropriate, harmful, or offensive content</li>
                    </ul>
                </div>
            </div>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 1.5rem; border-radius: 10px;">
                <h4 style="margin-bottom: 1rem; color: #856404; display: flex; align-items: center;">
                    <span style="font-size: 1.2rem; margin-right: 0.5rem;">⚠️</span>
                    Enforcement Notice
                </h4>
                <p style="margin: 0; color: #856404; line-height: 1.6;">
                    Violation of these terms may result in immediate suspension or permanent termination of your account and access to our services. We reserve the right to take any necessary action to protect our platform, users, and intellectual property.
                </p>
            </div>
        </section>
        
        <section id="privacy" class="${this.generateClassName('legal', 'section')}" style="margin-bottom: 4rem; padding: 3rem; background: white; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border-left: 5px solid ${this.config.colorScheme.accent};">
            <h2 style="color: ${this.config.colorScheme.accent}; margin-bottom: 2rem; font-size: 2.2rem; display: flex; align-items: center;">
                <span style="font-size: 1.8rem; margin-right: 1rem;">🛡️</span>
                3. Privacy & Data Protection
            </h2>
            <p style="line-height: 1.7; margin-bottom: 2rem; color: #444;">
                Your privacy is fundamental to our relationship with you. We are committed to protecting your personal information and maintaining transparency about our data practices.
            </p>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-bottom: 2rem;">
                <div style="background: ${this.config.colorScheme.accent}10; padding: 2rem; border-radius: 15px;">
                    <h3 style="color: ${this.config.colorScheme.accent}; margin-bottom: 1rem;">📊 Data We Collect</h3>
                    <ul style="margin: 0; margin-left: 1.5rem;">
                        <li style="margin-bottom: 0.5rem;">Technical information (IP address, browser, device)</li>
                        <li style="margin-bottom: 0.5rem;">Usage data (games played, preferences, session duration)</li>
                        <li style="margin-bottom: 0.5rem;">Optional contact information (email for support)</li>
                        <li>Performance analytics to improve our services</li>
                    </ul>
                </div>
                
                <div style="background: ${this.config.colorScheme.primary}10; padding: 2rem; border-radius: 15px;">
                    <h3 style="color: ${this.config.colorScheme.primary}; margin-bottom: 1rem;">🔐 Security Measures</h3>
                    <ul style="margin: 0; margin-left: 1.5rem;">
                        <li style="margin-bottom: 0.5rem;">End-to-end encryption for data transmission</li>
                        <li style="margin-bottom: 0.5rem;">Secure data storage with regular backups</li>
                        <li style="margin-bottom: 0.5rem;">Limited access on a need-to-know basis</li>
                        <li>Regular security audits and compliance checks</li>
                    </ul>
                </div>
            </div>
            
            <div style="background: linear-gradient(135deg, ${this.config.colorScheme.primary}15, ${this.config.colorScheme.accent}15); padding: 2rem; border-radius: 15px;">
                <h3 style="color: ${this.config.colorScheme.primary}; margin-bottom: 1.5rem; text-align: center;">👤 Your Privacy Rights</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                    <div style="background: white; padding: 1.5rem; border-radius: 10px; text-align: center;">
                        <div style="font-size: 2rem; margin-bottom: 1rem;">📋</div>
                        <strong>Data Access</strong>
                        <p style="margin: 0.5rem 0 0 0; font-size: 0.9rem; color: #666;">Request a copy of your personal data</p>
                    </div>
                    <div style="background: white; padding: 1.5rem; border-radius: 10px; text-align: center;">
                        <div style="font-size: 2rem; margin-bottom: 1rem;">✏️</div>
                        <strong>Data Correction</strong>
                        <p style="margin: 0.5rem 0 0 0; font-size: 0.9rem; color: #666;">Update or correct your information</p>
                    </div>
                    <div style="background: white; padding: 1.5rem; border-radius: 10px; text-align: center;">
                        <div style="font-size: 2rem; margin-bottom: 1rem;">🗑️</div>
                        <strong>Data Deletion</strong>
                        <p style="margin: 0.5rem 0 0 0; font-size: 0.9rem; color: #666;">Request removal of your data</p>
                    </div>
                    <div style="background: white; padding: 1.5rem; border-radius: 10px; text-align: center;">
                        <div style="font-size: 2rem; margin-bottom: 1rem;">📤</div>
                        <strong>Data Portability</strong>
                        <p style="margin: 0.5rem 0 0 0; font-size: 0.9rem; color: #666;">Transfer your data to another service</p>
                    </div>
                </div>
            </div>
        </section>
        
        <section id="disclaimers" class="${this.generateClassName('legal', 'section')}" style="margin-bottom: 4rem; padding: 3rem; background: white; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border-left: 5px solid #e74c3c;">
            <h2 style="color: #e74c3c; margin-bottom: 2rem; font-size: 2.2rem; display: flex; align-items: center;">
                <span style="font-size: 1.8rem; margin-right: 1rem;">⚖️</span>
                4. Legal Disclaimers & Liability Limitations
            </h2>
            <p style="line-height: 1.7; margin-bottom: 2rem; color: #444;">
                This section contains important legal information regarding our services, warranties, disclaimers, and limitations of liability.
            </p>
            
            <div style="margin-bottom: 2rem;">
                <h3 style="color: #e74c3c; margin-bottom: 1rem;">📋 Service Disclaimers</h3>
                <div style="background: #fee; border: 1px solid #e74c3c; padding: 1.5rem; border-radius: 10px;">
                    <p style="margin-bottom: 1rem; color: #721c24; font-weight: 600;">Our services are provided "AS IS" and "AS AVAILABLE" without warranties of any kind:</p>
                    <ul style="margin: 0; margin-left: 1.5rem; color: #721c24;">
                        <li style="margin-bottom: 0.5rem;">No guarantee of uninterrupted, timely, secure, or error-free operation</li>
                        <li style="margin-bottom: 0.5rem;">No warranty regarding accuracy, reliability, or completeness of content</li>
                        <li style="margin-bottom: 0.5rem;">Service availability may vary and is subject to maintenance and updates</li>
                        <li>We reserve the right to modify, suspend, or discontinue services at any time</li>
                    </ul>
                </div>
            </div>
            
            <div style="margin-bottom: 2rem;">
                <h3 style="color: #8e44ad; margin-bottom: 1rem;">⚡ Limitation of Liability</h3>
                <div style="background: #f3e5f5; border: 1px solid #ce93d8; padding: 1.5rem; border-radius: 10px;">
                    <p style="margin-bottom: 1rem; color: #4a148c; font-weight: 600;">To the fullest extent permitted by applicable law, ${this.siteName} shall not be liable for:</p>
                    <ul style="margin: 0; margin-left: 1.5rem; color: #4a148c;">
                        <li style="margin-bottom: 0.5rem;">Direct, indirect, incidental, special, consequential, or punitive damages</li>
                        <li style="margin-bottom: 0.5rem;">Loss of profits, revenue, data, use, goodwill, or other intangible losses</li>
                        <li style="margin-bottom: 0.5rem;">Damages resulting from unauthorized access to or alteration of your transmissions or data</li>
                        <li>Any damages arising from your use or inability to use our services</li>
                    </ul>
                </div>
            </div>
            
            <div style="background: #ffebee; border: 2px solid #e74c3c; padding: 2rem; border-radius: 15px;">
                <h4 style="margin-bottom: 1rem; color: #c62828; display: flex; align-items: center; font-size: 1.2rem;">
                    <span style="font-size: 1.5rem; margin-right: 0.5rem;">🚨</span>
                    Important Legal Notice
                </h4>
                <p style="margin-bottom: 1rem; color: #b71c1c; line-height: 1.6;">
                    These limitations apply regardless of the legal theory upon which any claim is based, whether in contract, tort (including negligence), strict liability, or otherwise, even if ${this.siteName} has been advised of the possibility of such damages.
                </p>
                <p style="margin: 0; color: #b71c1c; font-size: 0.9rem; font-style: italic;">
                    Some jurisdictions do not allow the exclusion or limitation of incidental or consequential damages, so the above limitations or exclusions may not apply to you.
                </p>
            </div>
        </section>
        
        <section id="contact" class="${this.generateClassName('legal', 'section')}" style="padding: 3rem; background: linear-gradient(135deg, ${this.config.colorScheme.primary}, ${this.config.colorScheme.secondary}); color: white; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.08);">
            <h2 style="color: white; margin-bottom: 2rem; font-size: 2.2rem; display: flex; align-items: center; text-align: center; justify-content: center;">
                <span style="font-size: 1.8rem; margin-right: 1rem;">📞</span>
                5. Contact Information & Legal Support
            </h2>
            <p style="text-align: center; font-size: 1.1rem; margin-bottom: 3rem; opacity: 0.9;">
                We're here to help with any questions about these terms or our legal policies. Our team is committed to providing comprehensive support.
            </p>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-bottom: 2rem;">
                <div style="background: rgba(255,255,255,0.15); padding: 2rem; border-radius: 15px; backdrop-filter: blur(10px); text-align: center;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">📧</div>
                    <h3 style="margin-bottom: 1rem;">Legal & Compliance</h3>
                    <p style="margin-bottom: 1rem; opacity: 0.9;">For questions about terms, privacy, or legal matters</p>
                    <a href="mailto:legal@${this.domain}" style="color: ${this.config.colorScheme.accent}; font-weight: 600; font-size: 1.1rem;">legal@${this.domain}</a>
                    <p style="margin: 0.5rem 0 0 0; opacity: 0.8; font-size: 0.9rem;">Response: 24-48 hours</p>
                </div>
                
                <div style="background: rgba(255,255,255,0.15); padding: 2rem; border-radius: 15px; backdrop-filter: blur(10px); text-align: center;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🛠️</div>
                    <h3 style="margin-bottom: 1rem;">General Support</h3>
                    <p style="margin-bottom: 1rem; opacity: 0.9;">For technical help and general assistance</p>
                    <a href="mailto:support@${this.domain}" style="color: ${this.config.colorScheme.accent}; font-weight: 600; font-size: 1.1rem;">support@${this.domain}</a>
                    <p style="margin: 0.5rem 0 0 0; opacity: 0.8; font-size: 0.9rem;">Response: 2-4 hours</p>
                </div>
            </div>
            
            <div style="text-align: center; padding: 2rem; background: rgba(255,255,255,0.1); border-radius: 15px; backdrop-filter: blur(10px);">
                <h3 style="margin-bottom: 1rem;">🌟 Our Commitment to Excellence</h3>
                <p style="margin-bottom: 1.5rem; opacity: 0.9;">
                    We are dedicated to providing exceptional service and ensuring your questions are answered promptly and professionally.
                </p>
                <div style="display: flex; justify-content: center; gap: 3rem; flex-wrap: wrap;">
                    <div style="text-align: center;">
                        <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">⚡</div>
                        <strong>Fast Response</strong>
                        <p style="margin: 0.5rem 0 0 0; opacity: 0.8; font-size: 0.9rem;">Quick turnaround times</p>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🎯</div>
                        <strong>Expert Help</strong>
                        <p style="margin: 0.5rem 0 0 0; opacity: 0.8; font-size: 0.9rem;">Knowledgeable assistance</p>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🤝</div>
                        <strong>Personal Service</strong>
                        <p style="margin: 0.5rem 0 0 0; opacity: 0.8; font-size: 0.9rem;">Courteous and professional</p>
                    </div>
                </div>
            </div>
        </section>
    </div>
</div>

<style>
.${this.generateClassName('floating', 'toc')} {
    transition: opacity 0.3s ease, transform 0.3s ease;
}
.${this.generateClassName('floating', 'nav')} a:hover {
    background: ${this.config.colorScheme.primary}15 !important;
    transform: translateX(5px);
}
.${this.generateClassName('floating', 'nav')} a.active {
    background: ${this.config.colorScheme.primary} !important;
    color: white !important;
}
@media (max-width: 1200px) {
    .${this.generateClassName('floating', 'toc')} {
        display: none !important;
    }
    .${this.generateClassName('legal', 'content')} {
        padding-right: 0 !important;
    }
}
</style>

<script>
function smoothScroll(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
        
        // Update active state
        const links = document.querySelectorAll('.${this.generateClassName('floating', 'nav')} a');
        links.forEach(link => link.classList.remove('active'));
        event.target.classList.add('active');
    }
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Auto-highlight active section based on scroll position
window.addEventListener('scroll', function() {
    const sections = ['introduction', 'usage-terms', 'privacy', 'disclaimers', 'contact'];
    const scrollPos = window.scrollY + 100;
    
    let activeSection = sections[0];
    
    sections.forEach(sectionId => {
        const element = document.getElementById(sectionId);
        if (element && element.offsetTop <= scrollPos) {
            activeSection = sectionId;
        }
    });
    
    // Update active link
    const links = document.querySelectorAll('.${this.generateClassName('floating', 'nav')} a');
    links.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + activeSection) {
            link.classList.add('active');
        }
    });
});
</script>`;

            case 'sidebar-toc':
                return `
<div class="${containerClass}" style="padding: 4rem 0;">
    <div class="${this.generateClassName('grid', '4')}" style="gap: 2rem;">
        <div class="${this.generateClassName('sidebar', 'toc')}" style="position: sticky; top: 2rem; height: fit-content;">
            <div class="${this.generateClassName('card')}" style="padding: 1.5rem;">
                <h4 style="margin-bottom: 1rem;">Table of Contents</h4>
                <nav class="${this.generateClassName('toc', 'nav')}">
                    <ul style="list-style: none; padding: 0;">
                        <li><a href="#section1" style="color: ${this.config.colorScheme.primary}; text-decoration: none; display: block; padding: 0.5rem 0;">1. Introduction</a></li>
                        <li><a href="#section2" style="color: ${this.config.colorScheme.primary}; text-decoration: none; display: block; padding: 0.5rem 0;">2. Terms of Use</a></li>
                        <li><a href="#section3" style="color: ${this.config.colorScheme.primary}; text-decoration: none; display: block; padding: 0.5rem 0;">3. User Responsibilities</a></li>
                        <li><a href="#section4" style="color: ${this.config.colorScheme.primary}; text-decoration: none; display: block; padding: 0.5rem 0;">4. Disclaimers</a></li>
                        <li><a href="#section5" style="color: ${this.config.colorScheme.primary}; text-decoration: none; display: block; padding: 0.5rem 0;">5. Contact Information</a></li>
                    </ul>
                </nav>
            </div>
        </div>
        <div style="grid-column: span 3;">
            <h1 style="margin-bottom: 2rem; font-size: 2.5rem;">${title}</h1>
            <div class="${this.generateClassName('legal', 'content')}" style="line-height: 1.8; font-size: 1.1rem;">
                ${content}
            </div>
        </div>
    </div>
</div>`;

            default:
                return `
<div class="${containerClass}" style="padding: 4rem 0;">
    <h1 class="${this.generateClassName('text', 'center')} ${this.generateClassName('mb', '4')}" style="font-size: 3rem;">${title}</h1>
    <div style="max-width: 800px; margin: 0 auto; line-height: 1.8; font-size: 1.1rem;">
        ${content}
        <p style="margin-top: 3rem; padding-top: 2rem; border-top: 1px solid #eee; text-align: center; color: #666;">
            <strong>Last updated:</strong> ${new Date().toLocaleDateString()}
        </p>
    </div>
</div>`;
        }
    }

    generateTermsContent() {
        return `
<div id="section1">
    <h2>1. Introduction</h2>
    <p>Welcome to ${this.siteName}. These terms and conditions outline the rules and regulations for the use of our social casino gaming platform.</p>
</div>

<div id="section2" style="margin-top: 2rem;">
    <h2>2. Terms of Use</h2>
    <p>By accessing this website, you accept these terms and conditions. Do not continue to use ${this.siteName} if you do not agree to all terms and conditions stated on this page.</p>
    <ul>
        <li>All games are for entertainment purposes only</li>
        <li>No real money gambling takes place on this site</li>
        <li>Users must be 18 years or older to access the site</li>
        <li>We reserve the right to modify these terms at any time</li>
    </ul>
</div>

<div id="section3" style="margin-top: 2rem;">
    <h2>3. User Responsibilities</h2>
    <p>Users are responsible for:</p>
    <ul>
        <li>Providing accurate information when required</li>
        <li>Using the platform responsibly and ethically</li>
        <li>Respecting other users and our community guidelines</li>
        <li>Not attempting to hack or exploit our systems</li>
    </ul>
</div>

<div id="section4" style="margin-top: 2rem;">
    <h2>4. Disclaimers</h2>
    <p>The information on this website is provided on an 'as is' basis. ${this.siteName} makes no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, or suitability of the information, games, or services.</p>
</div>

<div id="section5" style="margin-top: 2rem;">
    <h2>5. Contact Information</h2>
    <p>If you have any questions about these Terms & Conditions, please contact us at: <a href="mailto:legal@${this.domain}" style="color: ${this.config.colorScheme.primary};">legal@${this.domain}</a></p>
</div>`;
    }

    generatePrivacyContent() {
        return `
<h2>Information We Collect</h2>
<p>We may collect information about you in a variety of ways. The information we may collect includes:</p>
<ul>
    <li>Personal Data: Information that you voluntarily provide to us when using our services</li>
    <li>Usage Data: Information about how you use our website and games</li>
    <li>Technical Data: Information about your device and internet connection</li>
</ul>

<h2 style="margin-top: 2rem;">How We Use Your Information</h2>
<p>We may use the information we collect about you to:</p>
<ul>
    <li>Provide and maintain our gaming services</li>
    <li>Improve user experience and platform functionality</li>
    <li>Send you updates about new games and features</li>
    <li>Respond to your comments and questions</li>
</ul>

<h2 style="margin-top: 2rem;">Data Protection</h2>
<p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>

<h2 style="margin-top: 2rem;">Contact Us</h2>
<p>If you have questions about this Privacy Policy, please contact us at: <a href="mailto:privacy@${this.domain}" style="color: ${this.config.colorScheme.primary};">privacy@${this.domain}</a></p>`;
    }

    generateCookieContent() {
        return `
<h2>What Are Cookies</h2>
<p>Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.</p>

<h2 style="margin-top: 2rem;">How We Use Cookies</h2>
<p>We use cookies to:</p>
<ul>
    <li>Remember your preferences and settings</li>
    <li>Analyze how you use our website</li>
    <li>Improve our services and user experience</li>
    <li>Provide personalized content and advertisements</li>
</ul>

<h2 style="margin-top: 2rem;">Types of Cookies We Use</h2>
<ul>
    <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
    <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website</li>
    <li><strong>Preference Cookies:</strong> Remember your choices and preferences</li>
</ul>

<h2 style="margin-top: 2rem;">Managing Cookies</h2>
<p>You can control and manage cookies in your browser settings. Please note that removing or blocking cookies may impact your user experience.</p>`;
    }

    generateResponsibleGamingContent() {
        return `
<h2>Our Commitment to Responsible Gaming</h2>
<p>At ${this.siteName}, we are committed to promoting responsible social gaming practices. Our games are designed for entertainment purposes only and do not involve real money gambling.</p>

<h2 style="margin-top: 2rem;">Gaming Guidelines</h2>
<ul>
    <li>Set time limits for your gaming sessions</li>
    <li>Take regular breaks during extended play</li>
    <li>Remember that our games are for entertainment only</li>
    <li>Never chase losses or try to win back virtual credits</li>
    <li>If gaming stops being fun, take a break</li>
</ul>

<h2 style="margin-top: 2rem;">Signs to Watch For</h2>
<p>If you notice any of these signs, it may be time to take a break:</p>
<ul>
    <li>Gaming for longer periods than intended</li>
    <li>Feeling anxious when not playing</li>
    <li>Neglecting responsibilities or relationships</li>
    <li>Using gaming to escape problems or negative feelings</li>
</ul>

<h2 style="margin-top: 2rem;">Getting Help</h2>
<p>If you or someone you know needs help with gambling-related issues, these resources can provide support:</p>
<ul>
    <li>National Council on Problem Gambling: 1-800-522-4700</li>
    <li>Gamblers Anonymous: <a href="https://www.gamblersanonymous.org" style="color: ${this.config.colorScheme.primary};">www.gamblersanonymous.org</a></li>
    <li>Responsible Gambling Council: <a href="https://www.responsiblegambling.org" style="color: ${this.config.colorScheme.primary};">www.responsiblegambling.org</a></li>
</ul>

<h2 style="margin-top: 2rem;">Contact Us</h2>
<p>If you have concerns about responsible gaming, please contact us at: <a href="mailto:support@${this.domain}" style="color: ${this.config.colorScheme.primary};">support@${this.domain}</a></p>`;
    }
}

// CLI Interface
if (require.main === module) {
    const domain = process.argv[2];
    
    if (!domain) {
        console.error('Usage: node casino-generator.js <domain>');
        console.error('Example: node casino-generator.js example.com');
        process.exit(1);
    }
    
    const outputDir = path.join(process.cwd(), `casino-site-${domain.replace(/[^a-zA-Z0-9]/g, '-')}`);
    const generator = new CasinoSiteGenerator(domain);
    
    generator.generateSite(outputDir).catch(console.error);
}

module.exports = CasinoSiteGenerator;