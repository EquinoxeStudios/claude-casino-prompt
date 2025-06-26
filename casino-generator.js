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

            // Add other layout variations...
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

            // Add other footer variations...
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