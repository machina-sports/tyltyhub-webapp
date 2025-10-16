# 🏷️ White Label System - Sportingbet CWC

## 📋 Overview

This project has been transformed into a white label solution that supports multiple brands (bwin, sportingbet, etc.) from the same codebase.

## 🚀 Quick Start

### Development
```bash
# Develop with bwin brand (default)
npm run dev

# Develop with sportingbet brand
npm run dev:sportingbet

# Develop with bwin brand (explicit)
npm run dev:bwin
```

### Production Build
```bash
# Build for bwin
npm run build:bwin

# Build for sportingbet
npm run build:sportingbet
```

## 🏗️ Architecture

### 1. Brand Configuration
- **Location**: `config/brands/`
- **Files**: `bwin.json`, `sportingbet.json`
- **Control**: Centralized configurations per brand

### 2. React Context
- **File**: `contexts/brand-context.tsx`
- **Function**: Manage active brand and configurations
- **Hooks**: `useBrand()`, `useBrandConfig()`, `useBrandColors()`

### 3. Dynamic Components
- **Location**: `components/brand/`
- **Components**: `BrandLogo`, `BrandText`, `BrandColors`, `BrandSwitcher`

### 4. Build Scripts
- **File**: `scripts/build-brand.js`
- **Function**: Generate `.env.local` with brand configurations

## 🎨 Brand Customization

### Colors
```json
{
  "branding": {
    "colors": {
      "primary": "#FFCB00",
      "secondary": "#FDBA12",
      "success": "#2ECC71",
      "warning": "#FDBA12",
      "danger": "#FF3B30",
      "info": "#209CEE"
    }
  }
}
```

### Logos
```json
{
  "branding": {
    "logo": {
      "icon": "/bwin-logo-icon.png",
      "full": "/bwin-logo.png",
      "alt": "bwin logo"
    }
  }
}
```

### Content
```json
{
  "content": {
    "title": "BotAndWin: bwin's AI for LaLiga 2025/2026",
    "description": "Bet with bwin's Artificial Intelligence...",
    "ogImage": "https://bwinbot.com/og_image_4.png",
    "favicon": "/bwin-logo-icon.png"
  }
}
```

### Features
```json
{
  "features": {
    "enableAvatar": false,
    "enableBets": false,
    "enableChat": true
  }
}
```

## 🔧 Using Components

### Dynamic Logo
```tsx
import { BrandLogo } from '@/components/brand';

// Small logo (icon)
<BrandLogo variant="icon" width={32} height={32} />

// Full logo
<BrandLogo variant="full" width={120} height={40} />
```

### Dynamic Texts
```tsx
import { BrandText } from '@/components/brand';

// Brand title
<BrandText type="title" />

// Brand description
<BrandText type="description" />

// Display name
<BrandText type="displayName" />
```

### Dynamic Colors
```tsx
import { BrandColors, useBrandColors } from '@/components/brand';

// Apply brand colors
<BrandColors>
  <div className="bg-[var(--brand-primary)]">
    Content with brand color
  </div>
</BrandColors>

// Use colors programmatically
function MyComponent() {
  const colors = useBrandColors();
  return <div style={{ color: colors.primary }}>Text</div>;
}
```

## 🌐 Deployment

### Environment Variable
```bash
NEXT_PUBLIC_BRAND=bwin        # For bwin
NEXT_PUBLIC_BRAND=sportingbet # For sportingbet
```

### Docker
```dockerfile
ARG BRAND=bwin
ENV NEXT_PUBLIC_BRAND=${BRAND}
```

### Kubernetes
```yaml
env:
- name: NEXT_PUBLIC_BRAND
  value: "bwin"
```

## ➕ Adding New Brand

### 1. Create Configuration
```bash
# Create configuration file
touch config/brands/new-brand.json
```

### 2. Configure Brand
```json
{
  "id": "new-brand",
  "name": "New Brand",
  "displayName": "NewBrandBOT",
  "description": "New brand description",
  "language": "en-US",
  "locale": "en_US",
  "domain": "newbrand.com",
  "baseUrl": "https://newbrand.com",
  "sportsBaseUrl": "https://www.newbrand.com",
  "analytics": {
    "ga4Primary": "G-NEW-BRAND-PRIMARY",
    "ga4Secondary": "G-NEW-BRAND-SECONDARY",
    "tallysightWorkspace": "new-brand-workspace"
  },
  "branding": {
    "colors": {
      "primary": "#FF6B35",
      "secondary": "#F7931E",
      "success": "#00A651",
      "warning": "#FFD700",
      "danger": "#E74C3C",
      "info": "#3498DB"
    },
    "fonts": {
      "primary": "Inter",
      "fallback": "system-ui, sans-serif"
    },
    "logo": {
      "icon": "/new-brand-icon.png",
      "full": "/new-brand-logo.png",
      "alt": "New Brand logo"
    }
  },
  "content": {
    "title": "NewBrandBOT: AI for New Brand",
    "description": "Description for SEO and social media",
    "ogImage": "https://newbrand.com/og-image.png",
    "favicon": "/new-brand-favicon.ico"
  },
  "features": {
    "enableAvatar": true,
    "enableBets": true,
    "enableChat": true
  },
  "responsibleGaming": {
    "enabled": true,
    "text": "Play responsibly",
    "image": "/play-responsibly.png"
  }
}
```

### 3. Register Brand
```typescript
// In config/brands/index.ts
import newBrandConfig from './new-brand.json';

export const brands: Record<string, BrandConfig> = {
  bwin: bwinConfig,
  sportingbet: sportingbetConfig,
  'new-brand': newBrandConfig, // Add here
};
```

### 4. Add Scripts
```json
// In package.json
{
  "scripts": {
    "dev:new-brand": "node scripts/build-brand.js new-brand && next dev",
    "build:new-brand": "node scripts/build-brand.js new-brand && next build"
  }
}
```

### 5. Add Assets
Place in `public/` folder:
- `/new-brand-icon.png`
- `/new-brand-logo.png`
- `/new-brand-favicon.ico`
- `/play-responsibly.png`

## 🔄 Code Migration

### Before (Hardcoded)
```tsx
<img src="/bwin-logo.png" alt="bwin" />
<h1>BotAndWin: bwin's AI</h1>
<div className="bg-yellow-500" />
```

### After (White Label)
```tsx
<BrandLogo variant="full" />
<BrandText type="title" />
<BrandColors>
  <div className="bg-[var(--brand-primary)]" />
</BrandColors>
```

## 🐛 Troubleshooting

### Brand doesn't load
- ✅ Check if file exists in `config/brands/`
- ✅ Check if registered in `config/brands/index.ts`
- ✅ Check `NEXT_PUBLIC_BRAND` variable

### Assets don't load
- ✅ Check if files exist in `public/`
- ✅ Check paths in brand configuration

### Colors don't apply
- ✅ Check if component is wrapped in `<BrandColors>`
- ✅ Check if colors are defined in configuration

## 📊 Benefits

- ✅ **Centralized maintenance**: One codebase for multiple brands
- ✅ **Flexible deployment**: Independent deployment per brand
- ✅ **Simple configuration**: Add new brand in minutes
- ✅ **Type safety**: TypeScript for all configurations
- ✅ **Efficient development**: Hot reload between brands
- ✅ **Optimized SEO**: Brand-specific metadata
- ✅ **Separate analytics**: Independent tracking per brand

## 📚 Complete Documentation

For detailed documentation, see:
- [WHITE_LABEL_GUIDE.md](./WHITE_LABEL_GUIDE.md) - Complete guide
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [config/brands/](../config/brands/) - Brand configurations
- [components/brand/](../components/brand/) - Dynamic components
