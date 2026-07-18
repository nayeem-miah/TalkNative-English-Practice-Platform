import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(

      <div
        style={{
          fontSize: 22,
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: '10px',
          fontFamily: 'sans-serif',
          fontWeight: 900,
          boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)',
        }}
      >
        F
      </div>
    ),
    {
      ...size,
    }
}
