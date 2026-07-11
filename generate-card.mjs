import sharp from 'sharp';

const W = 600;
const H = 850;

const svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#0a0f1e"/>
      <stop offset="100%" stop-color="#060b16"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="42%" r="55%">
      <stop offset="0%"   stop-color="#1a4a8a" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#060b16" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="accentBar" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"   stop-color="#3b82f6"/>
      <stop offset="50%"  stop-color="#7dc9e8"/>
      <stop offset="100%" stop-color="#3b82f6"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${W}" height="${H}" rx="18" fill="url(#bgGrad)"/>
  <rect width="${W}" height="${H}" rx="18" fill="url(#glow)"/>
  <!-- Border -->
  <rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="17" fill="none" stroke="rgba(100,180,255,0.18)" stroke-width="1.5"/>
  <!-- Top accent bar -->
  <rect x="0" y="0" width="${W}" height="5" rx="2" fill="url(#accentBar)"/>

  <!-- Honeycomb grid (decorative, very subtle) -->
  <g opacity="0.06" stroke="#7dc9e8" stroke-width="0.8" fill="none">
    <polygon points="60,60 90,43 120,60 120,94 90,111 60,94"/>
    <polygon points="120,60 150,43 180,60 180,94 150,111 120,94"/>
    <polygon points="180,60 210,43 240,60 240,94 210,111 180,94"/>
    <polygon points="240,60 270,43 300,60 300,94 270,111 240,94"/>
    <polygon points="300,60 330,43 360,60 360,94 330,111 300,94"/>
    <polygon points="360,60 390,43 420,60 420,94 390,111 360,94"/>
    <polygon points="420,60 450,43 480,60 480,94 450,111 420,94"/>
    <polygon points="480,60 510,43 540,60 540,94 510,111 480,94"/>
    <polygon points="30,111 60,94 90,111 90,145 60,162 30,145"/>
    <polygon points="90,111 120,94 150,111 150,145 120,162 90,145"/>
    <polygon points="150,111 180,94 210,111 210,145 180,162 150,145"/>
    <polygon points="210,111 240,94 270,111 270,145 240,162 210,145"/>
    <polygon points="270,111 300,94 330,111 330,145 300,162 270,145"/>
    <polygon points="330,111 360,94 390,111 390,145 360,162 330,145"/>
    <polygon points="390,111 420,94 450,111 450,145 420,162 390,145"/>
    <polygon points="450,111 480,94 510,111 510,145 480,162 450,145"/>
    <polygon points="60,162 90,145 120,162 120,196 90,213 60,196"/>
    <polygon points="120,162 150,145 180,162 180,196 150,213 120,196"/>
    <polygon points="180,162 210,145 240,162 240,196 210,213 180,196"/>
    <polygon points="240,162 270,145 300,162 300,196 270,213 240,196"/>
    <polygon points="300,162 330,145 360,162 360,196 330,213 300,196"/>
    <polygon points="360,162 390,145 420,162 420,196 390,213 360,196"/>
    <polygon points="420,162 450,145 480,162 480,196 450,213 420,196"/>
    <polygon points="480,162 510,145 540,162 540,196 510,213 480,196"/>
  </g>

  <!-- Logo hex shape -->
  <g transform="translate(218, 250)">
    <polygon points="82,0 164,41 164,123 82,164 0,123 0,41"
             fill="rgba(30,60,120,0.6)" stroke="#7dc9e8" stroke-width="2"/>
    <polygon points="82,18 148,54 148,128 82,146 16,110 16,54"
             fill="rgba(10,20,50,0.8)" stroke="rgba(100,180,255,0.3)" stroke-width="1"/>
    <!-- B text in hex -->
    <text x="82" y="105" font-family="Georgia, serif" font-size="90" font-weight="bold"
          fill="#7dc9e8" text-anchor="middle" opacity="0.9">B</text>
  </g>

  <!-- Brand name -->
  <text x="300" y="466" font-family="Arial, sans-serif" font-size="46" font-weight="bold"
        fill="white" text-anchor="middle" letter-spacing="3">BuildHive</text>

  <!-- Tagline -->
  <text x="300" y="502" font-family="Arial, sans-serif" font-size="15"
        fill="rgba(100,180,255,0.7)" text-anchor="middle" letter-spacing="6">DIGITAL STUDIO</text>

  <!-- Divider -->
  <line x1="120" y1="530" x2="480" y2="530" stroke="rgba(100,180,255,0.15)" stroke-width="1"/>

  <!-- Services -->
  <text x="300" y="565" font-family="Arial, sans-serif" font-size="12"
        fill="rgba(255,255,255,0.35)" text-anchor="middle" letter-spacing="3">WEB · 3D · BRAND · PRODUCTS</text>

  <!-- Email -->
  <text x="300" y="640" font-family="Courier New, monospace" font-size="14"
        fill="rgba(255,255,255,0.55)" text-anchor="middle">hello@buildhive.studio</text>

  <!-- Location -->
  <circle cx="245" cy="674" r="3" fill="#7dc9e8" opacity="0.7"/>
  <text x="255" y="679" font-family="Arial, sans-serif" font-size="12"
        fill="rgba(255,255,255,0.35)" letter-spacing="1">Vijayawada, IN</text>

  <!-- Bottom strip -->
  <rect x="0" y="${H - 60}" width="${W}" height="60" rx="0" fill="rgba(100,180,255,0.04)"/>
  <rect x="0" y="${H - 60}" width="${W}" height="1"  fill="rgba(100,180,255,0.12)"/>
  <text x="300" y="${H - 25}" font-family="Arial, sans-serif" font-size="11"
        fill="rgba(255,255,255,0.2)" text-anchor="middle" letter-spacing="2">BUILDHIVE.STUDIO</text>
</svg>`;

sharp(Buffer.from(svg))
  .png()
  .toFile('public/buildhive-card.png')
  .then(() => console.log('BuildHive card generated OK'))
  .catch(err => { console.error('Error:', err); process.exit(1); });
