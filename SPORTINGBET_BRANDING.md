# Sportingbet Branding Implementation

This document outlines how the Sportingbet brand guidelines have been implemented in the application and provides guidance on maintaining consistent branding.

## Color Palette

The Sportingbet brand colors have been implemented as CSS variables and Tailwind classes:

### Primary Colors

| Name | Hex | Usage |
|------|-----|-------|
| Bright Deep Blue | #003DC4 | Secondary buttons, accents |
| Bright Dark Blue | #061F3F | Text, headings, dark backgrounds |
| Bright Extra Light Blue | #D3ECFF | Secondary backgrounds, highlights |
| Bright Light Blue | #45CAFF | Accents, highlights |
| Bright Blue | #0A5EEA | Primary buttons, sidebar, links |
| Bright Red | #F13131 | Error messages, alerts |
| White | #FFFFFF | Backgrounds, text on dark backgrounds |
| Light Grey | #EEEFF1 | Subtle backgrounds, dividers |

### Usage in Tailwind

Colors can be accessed using the primary/secondary/etc system or directly with sportingbet namespace:

```tsx
// Using mapped shadow variables
<div className="bg-primary text-primary-foreground">Primary button</div>

// Using direct sportingbet colors
<div className="bg-sportingbet-bright-blue text-sportingbet-white">Primary button</div>
```

## Typography

The Sportingbet brand uses two primary font families:

1. **Sportingbet Sans** - For headings, titles and emphasis
2. **Frutiger LT** (with Arial/Helvetica as fallbacks) - For body text

### Usage in CSS

```tsx
// Headings automatically use Sportingbet Sans
<h1>This uses Sportingbet Sans</h1>

// Explicit usage
<div className="font-sportingbet">This uses Sportingbet Sans</div>
<div className="font-frutiger">This uses Frutiger LT</div>
```

## DOT Component

The DOT element is a key part of the Sportingbet brand identity. It's implemented as a reusable React component following the brand guidelines:

- Base rectangle: 900px × 700px
- Tilt: 12 degrees
- Corner radius: 65px

### Basic Usage

```tsx
import { Dot, SportingbetDot, SportingbetDarkDot } from "@/components/ui/dot";

// Default implementation with Sportingbet blue
<Dot size={24} />

// Pre-configured color variants
<SportingbetDot size={32} /> // Bright Blue
<SportingbetDarkDot size={32} /> // Dark Blue

// Custom color
<Dot size={40} color="#45CAFF" />
```

### Integration with Other Components

The DOT can be combined with other UI elements:

```tsx
<Button variant="default" className="flex items-center gap-2">
  Primary <SportingbetDot size={16} />
</Button>

<Badge variant="sportingbet" className="flex items-center gap-1.5">
  Badge <SportingbetDot size={10} />
</Badge>

<h1 className="flex items-center">
  Heading with DOT <SportingbetDot size={24} className="ml-2" />
</h1>
```

### Animation Examples

The DOT can be animated using Tailwind classes:

```tsx
// Spinning animation
<Dot size={48} className="animate-spin-slow" />

// Pulse effect
<Dot size={48} className="animate-pulse" />

// Hover scaling
<Dot size={48} className="hover:scale-125 transition-transform duration-300" />
```

## Components

### Buttons

We've extended the button component with Sportingbet styling:

```tsx
// Default primary button using Sportingbet blue
<Button>Default Button</Button>

// Explicit Sportingbet variant
<Button variant="sportingbet" size="xl">Large Sportingbet Button</Button>
```

### Badges

Badges have been styled to match the Sportingbet branding:

```tsx
<Badge variant="sportingbet">Sportingbet Badge</Badge>
<Badge variant="sportingbetOutline">Outline Badge</Badge>
```

### Cards

Cards use the rounded corners specified in the brand guidelines:

```tsx
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    Card content
  </CardContent>
  <CardFooter>
    Card footer
  </CardFooter>
</Card>
```

## Logo Usage

The Sportingbet logo should have adequate spacing around it and should not be distorted or modified. Refer to the brand guidelines for specific rules around logo usage.

## Utility Classes

We've added some utility classes to make it easier to apply Sportingbet branding:

- `.sb-disclaimer` - Styles text according to disclaimer guidelines
- `.sb-cta` - Styles call-to-action buttons according to guidelines

## Demo Page

A demonstration of all brand elements can be found at `/branding`. This page showcases the DOT component with various sizes and colors, along with examples of how to integrate it with other UI components.

## Disclaimer

Always include the brand disclaimer in the footer as required by the brand guidelines:

```tsx
<footer className="sb-disclaimer">
  If it stops being fun, stop
</footer>
```

---

This implementation follows version 2.2 of the Sportingbet brand guidelines (December 2024). Refer to the full brand guidelines for detailed specifications. 