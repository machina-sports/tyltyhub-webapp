# 🏗️ White Label System Architecture

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        NEXT.JS APPLICATION                      │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐    ┌─────────────────┐    ┌──────────────┐ │
│  │   Brand Context │    │  Brand Config   │    │  Components  │ │
│  │                 │    │                 │    │              │ │
│  │ • useBrand()    │◄───┤ • bwin.json     │    │ • BrandLogo  │ │
│  │ • useBrandConfig│    │ • sportingbet   │    │ • BrandText  │ │
│  │ • useBrandColors│    │   .json         │    │ • BrandColors│ │
│  └─────────────────┘    └─────────────────┘    │ • BrandSwitcher│
│           │                       │             └──────────────┘ │
│           │                       │                      │       │
│           ▼                       ▼                      ▼       │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    MAIN LAYOUT                             │ │
│  │                                                             │ │
│  │ • Dynamic metadata (SEO, OG, Twitter)                      │ │
│  │ • Dynamic analytics (GA4, Tallysight)                      │ │
│  │ • Dynamic favicon                                          │ │
│  │ • Dynamic language                                          │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DEPLOYMENT LAYER                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   BWIN       │  │ SPORTINGBET  │  │  NEW BRAND   │          │
│  │              │  │              │  │              │          │
│  │ • Docker     │  │ • Docker     │  │ • Docker     │          │
│  │ • K8s        │  │ • K8s        │  │ • K8s        │          │
│  │ • ENV: bwin  │  │ • ENV:       │  │ • ENV:       │          │
│  │              │  │   sportingbet│  │   new-brand  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow

```
1. BUILD TIME
   ┌─────────────┐    ┌──────────────┐    ┌─────────────┐
   │ Build       │───►│ Generates    │───►│ Next.js     │
   │ Script      │    │ .env.local   │    │ Build       │
   └─────────────┘    └──────────────┘    └─────────────┘

2. RUNTIME
   ┌─────────────┐    ┌──────────────┐    ┌─────────────┐
   │ NEXT_PUBLIC │───►│ Brand Context│───►│ Dynamic     │
   │ _BRAND      │    │ Provider     │    │ Components  │
   │ Variable    │    │              │    │             │
   └─────────────┘    └──────────────┘    └─────────────┘
```

## 📁 File Structure

```
sportingbet-cwc/
├── config/brands/                 # Brand configurations
│   ├── index.ts                   # Centralized configurations
│   ├── bwin.json                  # bwin config
│   └── sportingbet.json           # sportingbet config
├── contexts/
│   └── brand-context.tsx          # React brand context
├── components/brand/               # Dynamic components
│   ├── brand-logo.tsx             # Dynamic logo
│   ├── brand-text.tsx             # Dynamic texts
│   ├── brand-colors.tsx           # Dynamic colors
│   ├── brand-switcher.tsx         # Brand switcher (dev)
│   └── index.ts                   # Exports
├── hooks/
│   └── use-brand-colors.ts        # Colors hook
├── lib/
│   ├── metadata.ts                # Dynamic metadata
│   └── betting-urls.ts            # Dynamic URLs
├── scripts/
│   └── build-brand.js             # Build script
└── public/                        # Brand assets
    ├── bwin-logo.png
    ├── bwin-logo-icon.png
    ├── sb-logo.png
    └── sb-logo_new.png
```

## 🎯 Customization Points

### 1. Brand Configuration
- **Colors**: Primary, secondary, success, warning, danger, info
- **Logos**: Icon, full, alt text
- **Texts**: Title, description, display name
- **URLs**: Base URL, sports URL, domain
- **Analytics**: GA4 IDs, Tallysight workspace
- **Features**: Avatar, bets, chat toggles
- **Responsible Gaming**: Text, image

### 2. Dynamic Metadata
- **SEO**: Title, description, keywords
- **Open Graph**: Title, description, image, locale
- **Twitter**: Card, title, description, image
- **Favicon**: Dynamic icon
- **Language**: HTML lang attribute

### 3. Dynamic Analytics
- **Google Analytics 4**: Primary and secondary IDs
- **Tallysight**: Specific workspace
- **Events**: Brand-specific categorization

### 4. Dynamic URLs
- **Betting URLs**: Sportsbook base URL
- **Language**: URL language
- **Deep Links**: Brand-specific configuration

## 🔧 Build Scripts

### Development
```bash
npm run dev:bwin          # Develop with bwin
npm run dev:sportingbet   # Develop with sportingbet
```

### Production
```bash
npm run build:bwin        # Build for bwin
npm run build:sportingbet # Build for sportingbet
```

### Build Script
```javascript
// scripts/build-brand.js
1. Receives brandId as parameter
2. Loads brand configuration
3. Generates .env.local with configurations
4. Applies environment variables
```

## 🌐 Deployment

### Environment Variables
```bash
NEXT_PUBLIC_BRAND=bwin        # Active brand
NEXT_PUBLIC_BASE_URL=...      # Brand base URL
NEXT_PUBLIC_SPORTS_BASE_URL=... # Sportsbook URL
FEATURE_TOGGLE_ENABLE_*=...   # Brand features
```

### Docker
```dockerfile
ARG BRAND=bwin
ENV NEXT_PUBLIC_BRAND=${BRAND}
# Build and run with specific brand
```

### Kubernetes
```yaml
# Deployment for each brand
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-${BRAND}
spec:
  template:
    spec:
      containers:
      - name: app
        env:
        - name: NEXT_PUBLIC_BRAND
          value: "${BRAND}"
```

## 🎨 Advanced Customization

### Custom Colors
```typescript
// tailwind.config.ts
colors: {
  'brand-primary': 'var(--brand-primary)',
  'brand-secondary': 'var(--brand-secondary)',
  // ... other colors
}
```

### Custom Fonts
```typescript
// tailwind.config.ts
fontFamily: {
  'brand': ['var(--brand-font)', 'system-ui', 'sans-serif'],
}
```

### Brand-Specific Components
```
components/brand/bwin/
├── custom-header.tsx
├── custom-footer.tsx
└── custom-styles.css
```

## 🔄 Migration

### Before (Hardcoded)
```tsx
<img src="/bwin-logo.png" alt="bwin" />
<h1>bwinBOT: bwin's AI</h1>
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

## 📈 Benefits

- ✅ **Centralized maintenance**: One codebase for multiple brands
- ✅ **Flexible deployment**: Independent deployment per brand
- ✅ **Simple configuration**: Add new brand in minutes
- ✅ **Type safety**: TypeScript for all configurations
- ✅ **Efficient development**: Hot reload between brands
- ✅ **Optimized SEO**: Brand-specific metadata
- ✅ **Separate analytics**: Independent tracking per brand
- ✅ **Scalability**: Easy addition of new brands
- ✅ **Maintainability**: Clean and organized code
- ✅ **Flexibility**: Granular customization per brand

## 🔧 Technical Implementation

### Brand Context Provider
```tsx
// contexts/brand-context.tsx
export function BrandProvider({ children }) {
  const [brand, setBrandState] = useState(getBrandConfig());
  
  return (
    <BrandContext.Provider value={{ brand, setBrand, isLoading }}>
      {children}
    </BrandContext.Provider>
  );
}
```

### Dynamic Metadata Generation
```tsx
// lib/metadata.ts
export function generateBrandMetadata(brand: BrandConfig) {
  return {
    metadata: {
      title: brand.content.title,
      description: brand.content.description,
      // ... other metadata
    }
  };
}
```

### Build Script Logic
```javascript
// scripts/build-brand.js
const brandConfig = JSON.parse(fs.readFileSync(brandConfigPath, 'utf8'));

const envContent = `
NEXT_PUBLIC_BRAND=${brandId}
NEXT_PUBLIC_BASE_URL=${brandConfig.baseUrl}
// ... other variables
`;

fs.writeFileSync('.env.local', envContent);
```

## 🚀 Getting Started

1. **Choose a brand**: Set `NEXT_PUBLIC_BRAND` environment variable
2. **Run development**: `npm run dev:${brand}`
3. **Customize**: Edit brand configuration in `config/brands/`
4. **Deploy**: Use brand-specific build and deployment scripts

## 📚 Documentation

- [README.md](./README.md) - Quick start guide
- [WHITE_LABEL_GUIDE.md](./WHITE_LABEL_GUIDE.md) - Complete documentation
- [config/brands/](../config/brands/) - Brand configurations
- [components/brand/](../components/brand/) - Dynamic components
