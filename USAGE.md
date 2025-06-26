# Usage Guide

## Quick Start

```bash
node casino-generator.js yourdomain.com
```

## Examples

```bash
# Generate a casino site
node casino-generator.js casino-royale.com

# Generate another unique site
node casino-generator.js lucky-slots.com

# Using npm scripts
npm run generate casino-royale.com
npm start casino-royale.com
```

## What Gets Generated

```
casino-site-yourdomain-com/
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
        ├── starburst-1.jpg
        └── ...
```

## Key Features

| Feature | Description |
|---------|-------------|
| **Layout Variations** | 1000+ unique combinations per site |
| **Navigation Types** | 5 types (Traditional, Centered, Sidebar, Sticky, Mega) |
| **Hero Sections** | 5 types (Fullscreen, Split, Centered, Slider, Interactive) |
| **Game Layouts** | 10 layouts (Grid, Carousel, Masonry, List, etc.) |
| **CSS Frameworks** | 10 frameworks (Bootstrap, Tailwind, Bulma, etc.) |
| **DOM Structure** | Semantic vs Generic variations |
| **CSS Naming** | 5 conventions (BEM, Atomic, Semantic, etc.) |
| **Animations** | Advanced CSS animations and interactions |
| **SEO** | Schema markup, varied meta tags |
| **Responsiveness** | Advanced mobile-first design |
| **JavaScript** | Enhanced with carousels, sliders, filters |
| **Legal Pages** | 5 layout variations per page |
| **Contact Forms** | 5 different contact page layouts |
| **About Pages** | 5 layout variations (Timeline, Grid, etc.) |

## Configuration

The generator automatically selects random configurations including:
- Framework selection
- Color scheme assignment
- Layout combinations
- Navigation styles
- Content variations
- DOM structure types
- CSS naming conventions

Each run produces a completely unique website!

## API Integration

The generator:
- Attempts to fetch real games from SlotsLaunch API
- Falls back to demo games if API fails
- Downloads game thumbnails locally
- Handles errors gracefully
- Provides detailed console output

## Performance

- **Generation Time**: ~15 seconds
- **Output**: Feature-rich, production-ready websites
- **File Sizes**: Optimized for web deployment
- **Compatibility**: Works with all modern browsers

## Requirements

- Node.js 14+
- Internet connection (for API calls and thumbnail downloads)
- 50MB+ free disk space per generated site

## Deployment

Generated sites are static and can be deployed to:
- GitHub Pages
- Netlify
- Vercel
- Any web server
- CDN networks

Simply upload the generated folder contents to your hosting provider.

## Troubleshooting

### Common Issues

**API Token Issues:**
- The included token may expire
- Sites will use fallback demo games automatically

**Generation Fails:**
- Check Node.js version (14+ required)
- Ensure internet connectivity
- Verify disk space availability

**Missing Images:**
- Games will show placeholder images
- Thumbnails download automatically when possible

### Support

For issues or questions, check the generated site's contact page or review the console output during generation for detailed error information.