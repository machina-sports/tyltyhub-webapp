# 🏷️ White Label Guide

This guide explains how to use the white label system to support multiple brands from the same codebase.

## 📋 Overview

The white label system allows the same codebase to be used for different brands (bwin, sportingbet, etc.) with specific configurations for each one.

## 🏗️ System Structure

### Brand Configuration
```
config/brands/
├── index.ts          # Centralized configurations
├── bwin.json         # bwin brand configuration
└── sportingbet.json  # sportingbet brand configuration
```

### Brand Components
```
components/brand/
├── brand-logo.tsx    # Dynamic logo
├── brand-text.tsx    # Dynamic texts
├── brand-colors.tsx  # Dynamic colors
├── brand-switcher.tsx # Brand switcher (dev only)
└── index.ts          # Centralized exports
```

### Brand Context
```
contexts/brand-context.tsx  # React context for active brand management
hooks/use-brand-colors.ts   # Hook for brand colors
lib/metadata.ts            # Dynamic metadata generation
```

## 🚀 How to Use

### 1. Local Development

```bash
# Develop with bwin brand
npm run dev:bwin

# Develop with sportingbet brand
npm run dev:sportingbet

# Default development (uses bwin as fallback)
npm run dev
```

### 2. Production Build

```bash
# Build for bwin
npm run build:bwin

# Build for sportingbet
npm run build:sportingbet
```

### 3. Using Brand Components

```tsx
import { BrandLogo, BrandText, BrandColors } from '@/components/brand';
import { useBrandConfig, useBrandColors } from '@/contexts/brand-context';

function MyComponent() {
  const brand = useBrandConfig();
  const colors = useBrandColors();
  
  return (
    <BrandColors>
      <div>
        <BrandLogo variant="full" width={120} height={40} />
        <BrandText type="title" />
        <BrandText type="description" />
        <div style={{ color: colors.primary }}>
          Text with brand color
        </div>
      </div>
    </BrandColors>
  );
}
```

## ➕ Adding a New Brand

### 1. Create Configuration File

Create a new file in `config/brands/new-brand.json`:

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

### 2. Update Configurations

Add the new brand in `config/brands/index.ts`:

```typescript
import newBrandConfig from './new-brand.json';

export const brands: Record<string, BrandConfig> = {
  bwin: bwinConfig,
  sportingbet: sportingbetConfig,
  'new-brand': newBrandConfig, // Add here
};
```

### 3. Add Build Scripts

Update `package.json`:

```json
{
  "scripts": {
    "dev:new-brand": "node scripts/build-brand.js new-brand && next dev",
    "build:new-brand": "node scripts/build-brand.js new-brand && next build"
  }
}
```

### 4. Add Assets

Place the new brand assets in the `public/` folder:
- `/new-brand-icon.png`
- `/new-brand-logo.png`
- `/new-brand-favicon.ico`
- `/play-responsibly.png`

## 🔧 Deployment Configuration

### Environment Variables

The system uses the `NEXT_PUBLIC_BRAND` variable to determine which brand to use:

```bash
# For bwin
NEXT_PUBLIC_BRAND=bwin

# For sportingbet
NEXT_PUBLIC_BRAND=sportingbet

# For new brand
NEXT_PUBLIC_BRAND=new-brand
```

### Docker

Update the `Dockerfile` to accept the brand variable:

```dockerfile
ARG BRAND=bwin
ENV NEXT_PUBLIC_BRAND=${BRAND}
```

### Kubernetes/Deployment

Example deployment for multiple brands:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-bwin
spec:
  template:
    spec:
      containers:
      - name: app
        image: app:latest
        env:
        - name: NEXT_PUBLIC_BRAND
          value: "bwin"
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-sportingbet
spec:
  template:
    spec:
      containers:
      - name: app
        image: app:latest
        env:
        - name: NEXT_PUBLIC_BRAND
          value: "sportingbet"
```

## 🎨 Advanced Customization

### Custom Colors

To add brand-specific colors, update `tailwind.config.ts`:

```typescript
// Add brand-specific colors
colors: {
  // ... existing colors
  'new-brand': {
    'primary': '#FF6B35',
    'secondary': '#F7931E',
    // ... other colors
  }
}
```

### Custom Fonts

To use brand-specific fonts:

```typescript
// In tailwind.config.ts
fontFamily: {
  'new-brand': ['CustomFont', 'system-ui', 'sans-serif'],
}
```

### Brand-Specific Components

Create brand-specific components:

```
components/brand/new-brand/
├── custom-header.tsx
├── custom-footer.tsx
└── custom-styles.css
```

## 🐛 Troubleshooting

### Issue: Brand doesn't load
- Check if the configuration file exists in `config/brands/`
- Check if the brand is registered in `config/brands/index.ts`
- Check if the `NEXT_PUBLIC_BRAND` variable is defined

### Issue: Assets don't load
- Check if files exist in the `public/` folder
- Check the paths in the brand configuration file

### Issue: Colors don't apply
- Check if the component is wrapped in `<BrandColors>`
- Check if colors are defined in the brand configuration

## 📚 Practical Examples

### Example 1: Header with Dynamic Logo

```tsx
import { BrandLogo, BrandText } from '@/components/brand';

export function Header() {
  return (
    <header className="flex items-center space-x-4">
      <BrandLogo variant="icon" width={32} height={32} />
      <BrandText type="displayName" className="text-xl font-bold" />
    </header>
  );
}
```

### Example 2: Button with Brand Color

```tsx
import { useBrandColors } from '@/hooks/use-brand-colors';

export function CTAButton() {
  const colors = useBrandColors();
  
  return (
    <button 
      className="px-4 py-2 rounded"
      style={{ backgroundColor: colors.primary }}
    >
      <BrandText type="title" />
    </button>
  );
}
```

### Example 3: Dynamic Metadata

```tsx
import { generateBrandMetadata } from '@/lib/metadata';
import { getBrandConfig } from '@/config/brands';

export function generateMetadata() {
  const brand = getBrandConfig();
  return generateBrandMetadata(brand).metadata;
}
```

## 🔄 Code Migration

To migrate hardcoded code to the white label system:

1. **Replace hardcoded logos:**
   ```tsx
   // Before
   <img src="/bwin-logo.png" alt="bwin" />
   
   // After
   <BrandLogo variant="full" />
   ```

2. **Replace hardcoded texts:**
   ```tsx
   // Before
   <h1>bwinBOT: bwin's AI</h1>
   
   // After
   <BrandText type="title" />
   ```

3. **Replace hardcoded colors:**
   ```tsx
   // Before
   <div className="bg-yellow-500" />
   
   // After
   <BrandColors>
     <div className="bg-[var(--brand-primary)]" />
   </BrandColors>
   ```

## 📈 Benefits

- ✅ **Centralized maintenance**: One codebase for multiple brands
- ✅ **Flexible deployment**: Independent deployment per brand
- ✅ **Simple configuration**: Add new brand in minutes
- ✅ **Type safety**: TypeScript for all configurations
- ✅ **Efficient development**: Hot reload between brands
- ✅ **Optimized SEO**: Brand-specific metadata
- ✅ **Separate analytics**: Independent tracking per brand
