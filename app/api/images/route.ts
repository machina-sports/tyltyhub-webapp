import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import sharp from 'sharp'

export async function GET(request: NextRequest) {
  const imageUrl = request.nextUrl.searchParams.get('url')
  if (!imageUrl) {
    return NextResponse.json({ error: 'Image URL is required' }, { status: 400 })
  }

  try {
    const response = await fetch(imageUrl)
    const buffer = await response.arrayBuffer()

    const compressedBuffer = await sharp(Buffer.from(buffer))
      .resize(800, 800, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: 40 }) 
      .toBuffer()

    return new NextResponse(compressedBuffer, {
      headers: {
        'Content-Type': 'image/webp',
        'Cache-Control': 'public, max-age=31536000'
      }
    })
  } catch (error) {
    console.error('Error compressing image:', error)
    return NextResponse.json({ error: 'Failed to compress image' }, { status: 500 })
  }
} 