import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
 
export const alt = 'SportingBet CWC Chat'
export const size = {
  width: 1200,
  height: 630,
}
 
export const contentType = 'image/png'
 
export default async function Image({ params }: { params: { id: string } }) {
  return new ImageResponse(
    <div
      style={{
        fontSize: 64,
        background: '#061F3F',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
        <div 
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 40,
          }}
        >
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#ffffff',
              borderRadius: '16px',
              padding: '24px',
              width: '300px',
              height: '100px',
            }}
          >
            <div style={{ fontSize: 44, fontWeight: 'bold', color: '#061F3F' }}>SportingBet</div>
          </div>
          <div
            style={{
              fontSize: 48,
              fontWeight: 'bold',
              color: '#ffffff',
              letterSpacing: '-0.025em',
              textAlign: 'center',
              padding: '0 50px',
              lineHeight: 1.3,
              maxWidth: '60%',
            }}
          >
            Chat SportingBOT do SportingBet CWC
          </div>
        </div>
        
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            fontSize: 24,
            color: '#45CAFF',
            letterSpacing: '-0.025em',
          }}
        >
          Clique para visualizar a conversa completa
        </div>
    </div>,
    { ...size }
  )
}
