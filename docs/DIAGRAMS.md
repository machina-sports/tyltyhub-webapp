# 📊 White Label System Diagrams

## 🏗️ System Architecture

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

## 🎯 Brand Configuration Structure

```
Brand Configuration (JSON)
├── Basic Info
│   ├── id: "bwin"
│   ├── name: "bwin"
│   ├── displayName: "bwinBOT"
│   └── description: "bwin's AI for LaLiga"
├── Localization
│   ├── language: "es-ES"
│   ├── locale: "es_ES"
│   ├── domain: "bwinbot.com"
│   └── baseUrl: "https://bwinbot.com"
├── Branding
│   ├── colors: { primary, secondary, ... }
│   ├── fonts: { primary, fallback }
│   └── logo: { icon, full, alt }
├── Content
│   ├── title: "bwinBOT: bwin's AI"
│   ├── description: "SEO description"
│   ├── ogImage: "https://bwinbot.com/og.png"
│   └── favicon: "/bwin-logo-icon.png"
├── Analytics
│   ├── ga4Primary: "G-RP42Y35MC2"
│   ├── ga4Secondary: "G-9F6CHT1XS6"
│   └── tallysightWorkspace: "bwin-spain"
├── Features
│   ├── enableAvatar: false
│   ├── enableBets: false
│   └── enableChat: true
└── Responsible Gaming
    ├── enabled: true
    ├── text: "Juega con responsabilidad"
    └── image: "/Juega con responsabilidad.png"
```

## 🔧 Component Hierarchy

```
App Layout
├── BrandProvider
│   ├── Providers
│   │   ├── MainProvider
│   │   │   ├── DiscoveryProvider
│   │   │   │   ├── Sidebar
│   │   │   │   └── Main Content
│   │   │   │       ├── Topbar (with BrandLogo)
│   │   │   │       ├── Page Content
│   │   │   │       └── ResponsibleGamingResponsive
│   │   │   ├── AgeVerification
│   │   │   ├── Footer
│   │   │   ├── LGPDConsent
│   │   │   ├── Toaster
│   │   │   └── BrandSwitcher (dev only)
│   │   └── BrandColors (applies CSS variables)
```

## 🚀 Build Process

```
1. Developer runs: npm run dev:bwin
   │
   ▼
2. Build script executes: node scripts/build-brand.js bwin
   │
   ▼
3. Script loads: config/brands/bwin.json
   │
   ▼
4. Script generates: .env.local
   │
   ├── NEXT_PUBLIC_BRAND=bwin
   ├── NEXT_PUBLIC_BASE_URL=https://bwinbot.com
   ├── NEXT_PUBLIC_SPORTS_BASE_URL=https://www.bwin.es
   ├── FEATURE_TOGGLE_ENABLE_AVATAR=0
   ├── FEATURE_TOGGLE_ENABLE_BETS=0
   └── FEATURE_TOGGLE_ENABLE_CHAT=1
   │
   ▼
5. Next.js starts with brand configuration
   │
   ▼
6. BrandProvider loads brand config
   │
   ▼
7. Components render with brand-specific data
```

## 🌐 Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CI/CD PIPELINE                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐        │
│  │   GitHub    │    │   Docker    │    │ Kubernetes  │        │
│  │   Actions   │    │   Registry  │    │   Cluster   │        │
│  │             │    │             │    │             │        │
│  │ • Build     │───►│ • Tag by    │───►│ • Deploy    │        │
│  │   Scripts   │    │   Brand     │    │   by Brand  │        │
│  │ • Test      │    │ • Multi-    │    │ • Scale     │        │
│  │ • Package   │    │   arch      │    │   Indep.    │        │
│  └─────────────┘    └─────────────┘    └─────────────┘        │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      PRODUCTION ENVIRONMENT                    │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   BWIN       │  │ SPORTINGBET  │  │  NEW BRAND   │          │
│  │   SITE       │  │    SITE      │  │    SITE      │          │
│  │              │  │              │  │              │          │
│  │ • bwinbot.com│  │ • sportingbot│  │ • newbrand   │          │
│  │ • Spanish    │  │   .com.br    │  │   .com       │          │
│  │ • LaLiga     │  │ • Portuguese │  │ • English    │          │
│  │ • Yellow     │  │ • CWC        │  │ • Custom     │          │
│  │              │  │ • Green      │  │ • Colors     │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Brand Switching Flow

```
Development Mode
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Brand       │───►│ Brand       │───►│ Page        │
│ Switcher    │    │ Context     │    │ Reload      │
│ (Dev Only)  │    │ Update      │    │ with New    │
│             │    │             │    │ Brand       │
└─────────────┘    └─────────────┘    └─────────────┘

Production Mode
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Environment │───►│ Brand       │───►│ Static      │
│ Variable    │    │ Context     │    │ Brand       │
│ NEXT_PUBLIC │    │ Loads       │    │ Rendering   │
│ _BRAND      │    │ Config      │    │             │
└─────────────┘    └─────────────┘    └─────────────┘
```

## 📊 Component Usage Examples

```
BrandLogo Component
├── variant="icon" → Small logo (32x32)
├── variant="full" → Full logo (120x40)
├── width/height → Custom dimensions
└── className → Custom styling

BrandText Component
├── type="title" → Brand title
├── type="description" → Brand description
├── type="displayName" → Display name
└── className → Custom styling

BrandColors Component
├── Wraps children
├── Applies CSS variables
└── Enables dynamic theming

BrandSwitcher Component
├── Development only
├── Shows current brand
├── Lists available brands
└── Reloads page on change
```

## 🎨 CSS Variables System

```
:root {
  /* Brand Colors */
  --brand-primary: #FFCB00;
  --brand-secondary: #FDBA12;
  --brand-success: #2ECC71;
  --brand-warning: #FDBA12;
  --brand-danger: #FF3B30;
  --brand-info: #209CEE;
  
  /* Usage in Tailwind */
  .bg-[var(--brand-primary)]
  .text-[var(--brand-secondary)]
  .border-[var(--brand-success)]
}
```

## 🔧 Environment Variables

```
Build Time Variables
├── BRAND → Brand identifier
├── MACHINA_API_KEY → API key
├── MACHINA_CLIENT_URL → Client URL
└── IMAGE_CONTAINER_URL → Image container

Runtime Variables
├── NEXT_PUBLIC_BRAND → Active brand
├── NEXT_PUBLIC_BASE_URL → Brand base URL
├── NEXT_PUBLIC_SPORTS_BASE_URL → Sportsbook URL
├── FEATURE_TOGGLE_ENABLE_AVATAR → Avatar feature
├── FEATURE_TOGGLE_ENABLE_BETS → Bets feature
├── FEATURE_TOGGLE_ENABLE_CHAT → Chat feature
└── NEXT_PUBLIC_SITE_OFFLINE → Maintenance mode
```
