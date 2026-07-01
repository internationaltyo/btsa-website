import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const country = request.headers.get('x-vercel-ip-country')
  const isLocalhost = request.headers.get('host')?.includes('localhost')

  // Allow local development + Belgian visitors
  if (isLocalhost || !country || country === 'BE') {
    return NextResponse.next()
  }

  // Block everyone else
  return new NextResponse(
    `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>BTSA — Alleen beschikbaar in België</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      min-height: 100vh;
      background: #0D1128;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: sans-serif;
    }
    .box {
      text-align: center;
      padding: 48px 40px;
      max-width: 480px;
    }
    .flag { font-size: 64px; margin-bottom: 24px; }
    h1 {
      font-size: 32px;
      font-weight: 900;
      color: #fff;
      letter-spacing: 2px;
      margin-bottom: 12px;
    }
    .accent { color: #F5A623; }
    p {
      color: rgba(255,255,255,0.5);
      font-size: 15px;
      line-height: 1.6;
      margin-top: 16px;
    }
    .divider {
      width: 48px;
      height: 4px;
      background: #A50044;
      margin: 24px auto;
      border-radius: 2px;
    }
  </style>
</head>
<body>
  <div class="box">
    <div class="flag">🇧🇪</div>
    <h1>BTSA <span class="accent">WEBSITE</span></h1>
    <div class="divider"></div>
    <p>Deze website is enkel beschikbaar voor bezoekers in <strong style="color:#fff">België</strong>.</p>
    <p style="margin-top:8px">This website is only available for visitors in Belgium.</p>
  </div>
</body>
</html>`,
    {
      status: 403,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    }
  )
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|btsa-logo.png|.*\\.svg|.*\\.png).*)'],
}
