# Article Recommendation Widget - Usage Guide

## Overview
The `ArticleRecommendationWidget` component displays article recommendations in the chat assistant, similar to how betting odds are displayed.

## Component Location
`/components/article-recommendation-widget.tsx`

## Integration
The widget is already integrated into:
- `/components/assistant-ui/assistant-modal.tsx` (Modal assistant)
- `/app/assistant/[id]/page.tsx` (Full-page assistant)

## Data Format
The assistant backend should return article objects in the following format:

```json
{
  "objects": [
    {
      "article_id": "123",
      "image_path": "/path/to/image.jpg",
      "title": "Article Title",
      "subtitle": "Article subtitle or description",
      "slug": "article-slug"
    }
  ]
}
```

## Required Fields
- `article_id` (string): Unique identifier for the article
- `slug` (string): URL slug for routing to `/discover/[slug]`
- `title` (string): Article title
- `subtitle` (string): Article description/subtitle
- `image_path` (string): Path to article image

## How It Works

### Detection
The widget automatically detects article objects by looking for the presence of both `article_id` and `slug` fields.

### Separation from Betting Markets
Articles and betting markets are automatically separated:
- Objects with `article_id` → Article widgets
- Objects without `article_id` → Betting widgets

### Display Features
1. **Single Article**: Shows as a card with image, title, subtitle, and "Read More" link
2. **Multiple Articles**: Shows as a carousel with navigation arrows and indicators
3. **Animation**: Slides in from above when first displayed
4. **Responsive**: Adapts to mobile and desktop views
5. **Image**: Shows article thumbnail with hover zoom effect
6. **Link**: Clicking navigates to `/discover/[slug]`

## Example Usage in Component

```tsx
import { ArticleRecommendationWidget } from '@/components/article-recommendation-widget'

const articles = [
  {
    article_id: "1",
    image_path: "/og_image_1.png",
    title: "FIFA Club World Cup 2025: Everything You Need to Know",
    subtitle: "Complete guide to the expanded tournament format",
    slug: "fifa-cwc-2025-guide"
  },
  {
    article_id: "2",
    image_path: "/og_image_2.png",
    title: "Top Teams to Watch in CWC 2025",
    subtitle: "Analysis of favorites and dark horses",
    slug: "cwc-2025-top-teams"
  }
]

<ArticleRecommendationWidget articles={articles} />
```

## Backend Integration

When the AI agent wants to recommend articles, it should include them in the response:

```json
{
  "content": "Here are some articles you might find interesting:",
  "document_content": [{
    "objects": [
      {
        "article_id": "123",
        "image_path": "/images/article.jpg",
        "title": "Article Title",
        "subtitle": "Article description",
        "slug": "article-slug"
      }
    ]
  }]
}
```

## Styling
The widget inherits brand colors and follows the same design pattern as the betting recommendations widget:
- Uses `brand-primary` for hover states and active indicators
- Responsive card design with rounded corners
- Smooth animations and transitions
- Consistent spacing and typography

## Notes
- The widget is optimized for up to 420px width
- Images use Next.js Image component for optimization
- Links use Next.js Link component for client-side navigation
- All navigation happens within the app (no external links)

