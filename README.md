# Casino Site Generator

Automated system for generating complete social casino websites with unique designs, layouts, and content following detailed specifications.

## Features

- **Full Automation**: Generates complete casino sites with one command
- **Unique Designs**: 1000+ possible unique combinations per site
- **SlotsLaunch Integration**: Fetches real game data and thumbnails with fallback
- **Responsive Design**: Mobile-first responsive layouts with animations
- **SEO Optimized**: Schema markup, varied meta tags, semantic HTML
- **Multiple Frameworks**: 10 CSS frameworks randomly selected
- **Advanced Variations**: Every element randomized per specifications
- **Full Specification Compliance**: Implements all prompt.txt requirements

## Quick Start

```bash
# Generate a casino site for your domain
node casino-generator.js yourdomain.com
```

This will create a complete casino website in the `casino-site-yourdomain-com/` directory.

## Generated Site Structure

```
casino-site-{domain}/
├── index.html              # Advanced homepage with randomized layouts
├── games.html              # Enhanced games page with filtering/search
├── game.html               # Dynamic game page with multiple layouts
├── about.html              # About page with timeline/grid/story layouts
├── contact.html            # Contact with forms/maps/FAQ layouts
├── terms.html              # Legal pages with TOC/accordion layouts
├── privacy.html            # Enhanced legal content
├── cookies.html            # Cookie policy with proper formatting
├── responsible-gaming.html # Responsible gaming information
├── css/
│   └── style.css          # Advanced CSS with animations/responsiveness
├── js/
│   └── main.js            # Enhanced JavaScript with interactions
└── images/
    └── games/             # Downloaded game thumbnails
        ├── {slug}-{id}.jpg
        └── ...
```

## Enhanced Randomized Elements

Each generated site is unique with **1000+ possible combinations** including:

### **Core Framework & Styling**
- **CSS Framework**: Tailwind, Bootstrap, Bulma, Foundation, Materialize, Pure, Semantic UI, UIKit, Skeleton, or Custom CSS
- **Color Scheme**: Vegas Classic, Modern Neon, Elegant Royal, Fresh Digital, or Dark Mode
- **DOM Structure**: Semantic HTML vs Generic DIV structure
- **CSS Naming**: BEM, Atomic, Semantic, Abbreviated, or Prefixed conventions
- **Styling Approach**: Inline CSS, external stylesheets, or mixed approaches

### **Page Layout Variations**
- **Navigation Style**: Traditional, Centered, Sidebar, Sticky, or Mega Menu (each with unique features)
- **Hero Layout**: Fullscreen, Split, Centered, Slider, or Interactive (with animations/effects)
- **Featured Games**: Card Grid, Carousel, Masonry, List, or Hexagonal layouts
- **New Games**: Ribbon, Spotlight, Ticker, Grid with Dates, or Timeline layouts
- **About Section**: Text with Icons, Video, Statistics, Testimonials, or Interactive
- **Footer**: Mega, Minimal, Accordion, Map-Style, or Dark variations

### **Page-Specific Variations**
- **Games Page**: Grid, List, Card-Flip, Magazine, or Masonry layouts with filters
- **Game Page**: Centered, Sidebar, Tabbed, Fullscreen, or Hero layouts
- **About Page**: Timeline, Team Grid, Split Screen, Story, or Video Background
- **Contact Page**: Contact Form, Email Display, Split Layout, FAQ+Contact, or Map Integration
- **Legal Pages**: Sidebar TOC, Accordion, Single Column, Tab Navigation, or Floating TOC

### **Content & SEO Variations**
- **Site Names**: Randomly generated from adjectives + casino terms + suffixes
- **Headlines**: 7+ different hero headline variations
- **CTA Buttons**: 12+ different call-to-action button text options
- **Meta Tags**: Multiple title and description format variations
- **Schema Markup**: Proper structured data for websites and organizations

## API Integration

The generator automatically:

1. Fetches games from SlotsLaunch API
2. Downloads game thumbnails locally
3. Generates 5 random featured games
4. Shows 5 newest games
5. Creates complete games listing page
6. Sets up individual game pages with iframes

## Requirements

- Node.js 14+
- Internet connection (for API calls and thumbnail downloads)
- Valid SlotsLaunch API token (included)

## Usage Examples

```bash
# Generate site for casino.com
node casino-generator.js casino.com

# Generate site for myslots.net  
node casino-generator.js myslots.net

# Generate site for localhost development
node casino-generator.js localhost
```

## Customization

The generator uses randomization for uniqueness, but you can modify:

- **API Token**: Update `this.apiToken` in the CasinoSiteGenerator class
- **Color Schemes**: Modify the `colorSchemes` array
- **Site Name Templates**: Update `adjectives`, `terms`, and `suffixes` arrays
- **Framework Options**: Add/remove from the `frameworks` array

## Output

Each generated site includes:

- ✅ Fully functional HTML pages
- ✅ Responsive CSS styling
- ✅ Game thumbnails downloaded locally
- ✅ JavaScript for interactivity
- ✅ SEO-optimized meta tags
- ✅ Legal pages (Terms, Privacy, etc.)
- ✅ Contact forms
- ✅ Game integration with iframes

## Legal Compliance

All generated sites include:
- Terms & Conditions page
- Privacy Policy page  
- Cookie Policy page
- Responsible Gaming information
- "Entertainment only" disclaimers

## Browser Support

Generated sites work in all modern browsers:
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Performance

- Lazy loading for game thumbnails
- Minified CSS (framework dependent)
- Optimized image formats
- Fast loading times

## Security

- API tokens hidden from client-side code
- No server-side vulnerabilities
- Static file generation only
- Safe thumbnail downloads

## Deployment

Generated sites are static and can be deployed to:
- GitHub Pages
- Netlify
- Vercel
- Any web server
- CDN networks

Simply upload the generated folder contents to your web hosting.

## License

MIT License - Feel free to use for commercial projects.