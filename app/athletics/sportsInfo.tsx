export type SportInfo = {
  en: string
  ta: string
  descNl: string
  descTa: string
  svg: React.ReactNode
}

const svgProps = { viewBox: '0 0 200 160', xmlns: 'http://www.w3.org/2000/svg', width: '100%', height: '100%' }

export const SPORT_INFO: Record<string, SportInfo> = {
  '20m Run': {
    en: '20m Run', ta: '20மீ. ஓட்டம்',
    descNl: 'Een sprintrace over 20 meter speciaal voor de allerkleinsten. Kinderen lopen zo snel mogelijk van de startlijn naar de finishlijn. Het doel is plezier hebben en de eerste stappen in atletiek zetten.',
    descTa: '20 மீட்டர் தூரத்தை மிக வேகமாக ஓடும் ஒரு போட்டி. சிறு குழந்தைகளுக்காக வடிவமைக்கப்பட்ட இந்த ஓட்டப் போட்டியில் வேகம் மற்றும் உற்சாகம் முக்கியமானது.',
    svg: <svg {...svgProps}><rect width="200" height="160" fill="#0D1128"/><line x1="20" y1="120" x2="180" y2="120" stroke="#F5A623" strokeWidth="3"/><line x1="20" y1="115" x2="20" y2="130" stroke="#F5A623" strokeWidth="3"/><line x1="180" y1="115" x2="180" y2="130" stroke="#A50044" strokeWidth="3"/><text x="18" y="112" fill="#F5A623" fontSize="8" fontFamily="sans-serif">START</text><text x="165" y="112" fill="#A50044" fontSize="8" fontFamily="sans-serif">FINISH</text><ellipse cx="40" cy="95" rx="10" ry="10" fill="#F5A623"/><line x1="40" y1="105" x2="38" y2="120" stroke="#fff" strokeWidth="2"/><line x1="38" y1="120" x2="30" y2="132" stroke="#fff" strokeWidth="2"/><line x1="38" y1="120" x2="46" y2="130" stroke="#fff" strokeWidth="2"/><line x1="40" y1="108" x2="28" y2="115" stroke="#fff" strokeWidth="2"/><line x1="40" y1="108" x2="52" y2="112" stroke="#fff" strokeWidth="2"/><text x="60" y="75" fill="rgba(255,255,255,0.15)" fontSize="40" fontFamily="sans-serif" fontWeight="bold">20m</text></svg>,
  },
  '25m Run': {
    en: '25m Run', ta: '25மீ. ஓட்டம்',
    descNl: 'Een sprintrace over 25 meter voor kinderen van 4-5 jaar. Kinderen leren hun energie te gebruiken in een korte, snelle race. Snelheid en plezier staan centraal.',
    descTa: '25 மீட்டர் தூரத்தை வேகமாக ஓடும் போட்டி. 4-5 வயது குழந்தைகளுக்காக வடிவமைக்கப்பட்டது. வேகம் மற்றும் மகிழ்ச்சி இந்த போட்டியின் முக்கிய அம்சங்கள்.',
    svg: <svg {...svgProps}><rect width="200" height="160" fill="#0D1128"/><line x1="20" y1="120" x2="180" y2="120" stroke="#F5A623" strokeWidth="3"/><line x1="20" y1="115" x2="20" y2="130" stroke="#F5A623" strokeWidth="3"/><line x1="180" y1="115" x2="180" y2="130" stroke="#A50044" strokeWidth="3"/><text x="18" y="112" fill="#F5A623" fontSize="8" fontFamily="sans-serif">START</text><text x="165" y="112" fill="#A50044" fontSize="8" fontFamily="sans-serif">FINISH</text><ellipse cx="50" cy="92" rx="10" ry="10" fill="#F5A623"/><line x1="50" y1="102" x2="47" y2="120" stroke="#fff" strokeWidth="2"/><line x1="47" y1="120" x2="38" y2="132" stroke="#fff" strokeWidth="2"/><line x1="47" y1="120" x2="56" y2="130" stroke="#fff" strokeWidth="2"/><line x1="50" y1="106" x2="38" y2="113" stroke="#fff" strokeWidth="2"/><line x1="50" y1="106" x2="62" y2="111" stroke="#fff" strokeWidth="2"/><text x="60" y="75" fill="rgba(255,255,255,0.15)" fontSize="40" fontFamily="sans-serif" fontWeight="bold">25m</text></svg>,
  },
  '50m Run': {
    en: '50m Run', ta: '50மீ. ஓட்டம்',
    descNl: 'Een sprintrace over 50 meter voor kinderen van 6-7 jaar. Bij deze afstand wordt ook uithoudingsvermogen een factor naast pure snelheid. Kinderen leren hun tempo te beheersen.',
    descTa: '50 மீட்டர் தூரத்தை வேகமாக ஓடும் போட்டி. 6-7 வயது குழந்தைகளுக்காக வடிவமைக்கப்பட்டது. வேகம் மற்றும் சகிப்புத்தன்மை இரண்டும் முக்கியம்.',
    svg: <svg {...svgProps}><rect width="200" height="160" fill="#0D1128"/><line x1="20" y1="120" x2="180" y2="120" stroke="#F5A623" strokeWidth="3"/><line x1="20" y1="115" x2="20" y2="130" stroke="#F5A623" strokeWidth="3"/><line x1="180" y1="115" x2="180" y2="130" stroke="#A50044" strokeWidth="3"/><text x="18" y="112" fill="#F5A623" fontSize="8" fontFamily="sans-serif">START</text><text x="165" y="112" fill="#A50044" fontSize="8" fontFamily="sans-serif">FINISH</text><ellipse cx="60" cy="90" rx="11" ry="11" fill="#F5A623"/><line x1="60" y1="101" x2="57" y2="120" stroke="#fff" strokeWidth="2.5"/><line x1="57" y1="120" x2="45" y2="133" stroke="#fff" strokeWidth="2.5"/><line x1="57" y1="120" x2="66" y2="132" stroke="#fff" strokeWidth="2.5"/><line x1="60" y1="105" x2="45" y2="110" stroke="#fff" strokeWidth="2.5"/><line x1="60" y1="105" x2="73" y2="108" stroke="#fff" strokeWidth="2.5"/><text x="65" y="72" fill="rgba(255,255,255,0.15)" fontSize="40" fontFamily="sans-serif" fontWeight="bold">50m</text></svg>,
  },
  '75m Run': {
    en: '75m Run', ta: '75மீ. ஓட்டம்',
    descNl: 'Een sprintrace over 75 meter voor kinderen van 8-9 jaar. Op deze afstand telt zowel explosiviteit als uithoudingsvermogen. Kinderen leren goed van start te gaan en het tempo vol te houden.',
    descTa: '75 மீட்டர் தூரத்தை வேகமாக ஓடும் போட்டி. 8-9 வயது குழந்தைகளுக்காக வடிவமைக்கப்பட்டது. துவக்கத்தில் வேகம் மற்றும் இறுதி வரை தொடர்வது முக்கியம்.',
    svg: <svg {...svgProps}><rect width="200" height="160" fill="#0D1128"/><line x1="20" y1="120" x2="180" y2="120" stroke="#F5A623" strokeWidth="3"/><line x1="20" y1="115" x2="20" y2="130" stroke="#F5A623" strokeWidth="3"/><line x1="180" y1="115" x2="180" y2="130" stroke="#A50044" strokeWidth="3"/><text x="18" y="112" fill="#F5A623" fontSize="8">START</text><text x="165" y="112" fill="#A50044" fontSize="8">FINISH</text><ellipse cx="70" cy="88" rx="12" ry="12" fill="#F5A623"/><line x1="70" y1="100" x2="66" y2="120" stroke="#fff" strokeWidth="2.5"/><line x1="66" y1="120" x2="54" y2="133" stroke="#fff" strokeWidth="2.5"/><line x1="66" y1="120" x2="76" y2="132" stroke="#fff" strokeWidth="2.5"/><line x1="70" y1="104" x2="54" y2="110" stroke="#fff" strokeWidth="2.5"/><line x1="70" y1="104" x2="83" y2="107" stroke="#fff" strokeWidth="2.5"/><text x="60" y="70" fill="rgba(255,255,255,0.15)" fontSize="38" fontFamily="sans-serif" fontWeight="bold">75m</text></svg>,
  },
  '100m Run': {
    en: '100m Run', ta: '100மீ. ஓட்டம்',
    descNl: 'De klassieke 100 meter sprint – de koningin van de atletiek. Deelnemers tonen hun maximale snelheid over de volledige afstand. Reactietijd, explosiviteit en techniek zijn de sleutelfactoren.',
    descTa: 'அதிவேக 100 மீட்டர் ஓட்டம் — விளையாட்டின் ராணி. தொடக்க எதிர்வினை நேரம், வெடிப்பு வேகம் மற்றும் நுட்பம் ஆகியவை வெற்றியின் திறவுகோல்.',
    svg: <svg {...svgProps}><rect width="200" height="160" fill="#0D1128"/>{[0,1,2,3,4,5,6,7].map(i=><line key={i} x1={20+i*22} y1="115" x2={20+i*22} y2="130" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>)}<line x1="20" y1="122" x2="180" y2="122" stroke="#F5A623" strokeWidth="2"/><rect x="170" y="60" width="8" height="60" fill="#A50044" opacity="0.8"/><ellipse cx="35" cy="80" rx="12" ry="12" fill="#F5A623"/><line x1="35" y1="92" x2="30" y2="115" stroke="#fff" strokeWidth="2.5"/><line x1="30" y1="115" x2="18" y2="128" stroke="#fff" strokeWidth="2.5"/><line x1="30" y1="115" x2="40" y2="126" stroke="#fff" strokeWidth="2.5"/><line x1="35" y1="96" x2="18" y2="100" stroke="#fff" strokeWidth="2.5"/><line x1="35" y1="96" x2="50" y2="100" stroke="#fff" strokeWidth="2.5"/><text x="55" y="68" fill="rgba(255,255,255,0.12)" fontSize="38" fontWeight="bold">100m</text></svg>,
  },
  'Run with Candy': {
    en: 'Run with Candy', ta: 'இனிப்புடன் ஓடுதல்',
    descNl: 'Kinderen lopen met een snoepje in hun hand (of op een lepel) naar de finish zonder het te laten vallen. Coördinatie en evenwicht zijn net zo belangrijk als snelheid. Een vrolijke en uitdagende race!',
    descTa: 'இனிப்பை கையில் (அல்லது கரண்டியில்) வைத்துக்கொண்டு ஓடும் போட்டி. சமநிலை மற்றும் ஒருங்கிணைப்பு வேகத்தை விட முக்கியம். மகிழ்ச்சியான போட்டி!',
    svg: <svg {...svgProps}><rect width="200" height="160" fill="#0D1128"/><ellipse cx="100" cy="80" rx="50" ry="50" fill="rgba(245,166,35,0.1)"/><circle cx="100" cy="80" r="20" fill="#F5A623"/><circle cx="93" cy="73" r="6" fill="#A50044"/><circle cx="107" cy="73" r="6" fill="#004D98"/><circle cx="93" cy="87" r="6" fill="#22C55E"/><circle cx="107" cy="87" r="6" fill="#fff"/><ellipse cx="50" cy="110" rx="12" ry="12" fill="#F5A623" opacity="0.7"/><line x1="50" y1="122" x2="47" y2="138" stroke="#fff" strokeWidth="2"/><line x1="47" y1="138" x2="38" y2="148" stroke="#fff" strokeWidth="2"/><line x1="47" y1="138" x2="56" y2="147" stroke="#fff" strokeWidth="2"/><line x1="50" y1="126" x2="38" y2="131" stroke="#fff" strokeWidth="2"/><line x1="62" y1="118" x2="68" y2="112" stroke="#fff" strokeWidth="2"/><circle cx="70" cy="110" r="5" fill="#F5A623"/></svg>,
  },
  'Fruit Picking': {
    en: 'Fruit Picking', ta: 'பழம் பொறுக்குதல்',
    descNl: 'Plastic fruit ligt verspreid over het parcours. Kinderen rapen zoveel mogelijk fruit op en leggen het in een mand. De winnaar is degene met de meeste stukjes fruit. Leerzaam en leuk!',
    descTa: 'பிளாஸ்டிக் பழங்கள் திடலில் சிதறி இருக்கும். குழந்தைகள் கூடுதலான பழங்களை பொறுக்கி கூடையில் போட வேண்டும். அதிக பழம் சேகரிப்பவர் வெற்றியாளர்.',
    svg: <svg {...svgProps}><rect width="200" height="160" fill="#0D1128"/><circle cx="60" cy="60" r="12" fill="#E2231A"/><circle cx="57" cy="50" r="3" fill="#22C55E"/><circle cx="100" cy="45" r="14" fill="#F5A623"/><circle cx="97" cy="33" r="3" fill="#22C55E"/><circle cx="145" cy="55" r="11" fill="#A50044"/><circle cx="142" cy="46" r="3" fill="#22C55E"/><circle cx="80" cy="90" r="10" fill="#F5A623"/><circle cx="130" cy="85" r="12" fill="#E2231A"/><rect x="75" y="120" width="50" height="30" rx="4" fill="#8B6914" opacity="0.8"/><path d="M70 120 Q100 110 130 120" stroke="#8B6914" strokeWidth="3" fill="none"/><ellipse cx="100" cy="120" rx="30" ry="8" fill="#A0702A" opacity="0.5"/></svg>,
  },
  'Water Filling': {
    en: 'Water Filling', ta: 'நீர் நிரப்புதல்',
    descNl: 'Met een klein bakje of spons halen kinderen water uit een emmer en vullen een fles of beker zo snel mogelijk. Wie het snelst vult, wint! Coördinatie, snelheid en geduld zijn vereist.',
    descTa: 'சிறிய கிண்ணம் அல்லது கடல்பாசி மூலம் குழந்தைகள் தண்ணீரை ஒரு பாட்டிலில் நிரப்ப வேண்டும். யார் வேகமாக நிரப்புகிறார்களோ அவர்கள் வெற்றியாளர்.',
    svg: <svg {...svgProps}><rect width="200" height="160" fill="#0D1128"/><rect x="30" y="80" width="40" height="50" rx="4" fill="#004D98" opacity="0.8"/><rect x="30" y="80" width="40" height="20" fill="#0066CC" opacity="0.6"/><rect x="120" y="90" width="30" height="55" rx="3" fill="#1a3a6b"/><rect x="120" y="90" width="30" height="40" fill="#004D98" opacity="0.7"/><path d="M70 95 Q95 85 120 100" stroke="#00BFFF" strokeWidth="3" fill="none" strokeDasharray="4 2"/><circle cx="90" cy="88" r="4" fill="#00BFFF" opacity="0.8"/><circle cx="85" cy="80" r="3" fill="#00BFFF" opacity="0.5"/><circle cx="95" cy="76" r="2" fill="#00BFFF" opacity="0.4"/><text x="38" y="145" fill="#F5A623" fontSize="8" fontFamily="sans-serif">EMMER</text><text x="120" y="152" fill="#F5A623" fontSize="8" fontFamily="sans-serif">BEKER</text></svg>,
  },
  'Color ID': {
    en: 'Color ID', ta: 'நிறம் இனம் காணுதல்',
    descNl: 'Kinderen krijgen gekleurde kaartjes of voorwerpen en moeten ze zo snel mogelijk in de juiste kleurgroep sorteren. Test je snelheid, concentratie en kleurkennis!',
    descTa: 'குழந்தைகளுக்கு வண்ண அட்டைகள் அல்லது பொருட்கள் கொடுக்கப்படும். அவற்றை சரியான வண்ண குழுவில் வேகமாக வகைப்படுத்த வேண்டும்.',
    svg: <svg {...svgProps}><rect width="200" height="160" fill="#0D1128"/><rect x="20" y="50" width="35" height="35" rx="4" fill="#E2231A"/><rect x="65" y="50" width="35" height="35" rx="4" fill="#004D98"/><rect x="110" y="50" width="35" height="35" rx="4" fill="#F5A623"/><rect x="155" y="50" width="35" height="35" rx="4" fill="#22C55E"/><circle cx="37" cy="115" r="12" fill="#E2231A" opacity="0.8"/><circle cx="75" cy="118" r="10" fill="#F5A623" opacity="0.8"/><rect x="100" y="106" width="20" height="20" rx="2" fill="#004D98" opacity="0.8"/><circle cx="163" cy="115" r="11" fill="#22C55E" opacity="0.8"/><line x1="37" y1="103" x2="37" y2="85" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeDasharray="3 2"/><line x1="75" y1="108" x2="83" y2="85" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeDasharray="3 2"/></svg>,
  },
  'Ball into Bucket': {
    en: 'Ball into Bucket', ta: 'வாளிக்குள் பந்து போடுதல்',
    descNl: 'Vanop een vaste afstand gooien kinderen een bal in een emmer of ring. Je hebt een bepaald aantal beurten. Wie de meeste ballen raak gooit, wint. Oog-handcoördinatie is essentieel!',
    descTa: 'நிர்ணயிக்கப்பட்ட தூரத்திலிருந்து குழந்தைகள் வாளியில் பந்தை போட வேண்டும். கண்-கை ஒருங்கிணைப்பு இந்த போட்டியில் மிகவும் முக்கியம்.',
    svg: <svg {...svgProps}><rect width="200" height="160" fill="#0D1128"/><ellipse cx="150" cy="120" rx="25" ry="8" fill="#8B6914"/><rect x="128" y="88" width="44" height="32" rx="3" fill="#A0702A"/><ellipse cx="150" cy="88" rx="22" ry="7" fill="#8B6914"/><circle cx="55" cy="85" r="14" fill="#004D98" opacity="0.9"/><path d="M69 80 Q110 55 132 82" stroke="#F5A623" strokeWidth="2.5" fill="none" strokeDasharray="5 3"/><circle cx="132" cy="82" r="5" fill="#F5A623" opacity="0.6"/><ellipse cx="55" cy="130" rx="12" ry="12" fill="#F5A623" opacity="0.6"/><line x1="55" y1="118" x2="55" y2="99" stroke="#fff" strokeWidth="2"/><line x1="55" y1="108" x2="70" y2="99" stroke="#fff" strokeWidth="2"/></svg>,
  },
  'Picture Word Match': {
    en: 'Picture Word Match', ta: 'படம்-சொல் பொருத்தம்',
    descNl: 'Kinderen zien een afbeelding en moeten het juiste woord erbij kiezen uit meerdere opties. Dit test leesvaardigheid, woordenschat en concentratie op een speelse manier.',
    descTa: 'குழந்தைகளுக்கு ஒரு படம் காட்டப்படும். அந்த படத்திற்கு பொருத்தமான சொல்லை பல விருப்பங்களில் இருந்து தேர்ந்தெடுக்க வேண்டும்.',
    svg: <svg {...svgProps}><rect width="200" height="160" fill="#0D1128"/><rect x="20" y="30" width="70" height="55" rx="4" fill="#1a2a5e" stroke="#004D98" strokeWidth="2"/><circle cx="55" cy="52" r="15" fill="#F5A623" opacity="0.8"/><line x1="48" y1="65" x2="55" y2="72" stroke="#F5A623" strokeWidth="2"/><line x1="62" y1="65" x2="55" y2="72" stroke="#F5A623" strokeWidth="2"/><line x1="45" y1="57" x2="43" y2="65" stroke="#F5A623" strokeWidth="2"/><line x1="65" y1="57" x2="67" y2="65" stroke="#F5A623" strokeWidth="2"/><rect x="110" y="30" width="70" height="20" rx="3" fill="#004D98" opacity="0.8"/><rect x="110" y="58" width="70" height="20" rx="3" fill="#1a2a5e" stroke="#004D98" strokeWidth="1"/><rect x="110" y="86" width="70" height="20" rx="3" fill="#1a2a5e" stroke="#004D98" strokeWidth="1"/><text x="120" y="44" fill="#fff" fontSize="9" fontFamily="sans-serif">☀️ ZON / SUN</text><text x="120" y="72" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="sans-serif">🌙 MAAN</text><text x="120" y="100" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="sans-serif">⭐ STER</text><line x1="90" y1="52" x2="108" y2="40" stroke="#F5A623" strokeWidth="2" strokeDasharray="3 2"/><circle cx="108" cy="40" r="3" fill="#F5A623"/></svg>,
  },
  'Run with Load': {
    en: 'Run with Load', ta: 'தலையில் பொதியுடன் ஓடுதல்',
    descNl: 'Kinderen lopen met een licht voorwerp (zoals een zak of boek) op hun hoofd naar de finish. Als het valt, moeten ze het opnieuw plaatsen. Evenwicht en concentratie zijn essentieel!',
    descTa: 'தலையில் ஒரு சிறிய பொருளை வைத்துக்கொண்டு ஓட வேண்டும். விழுந்தால் மீண்டும் வைக்கலாம். சமநிலை மற்றும் கவனம் மிக முக்கியம்.',
    svg: <svg {...svgProps}><rect width="200" height="160" fill="#0D1128"/><rect x="65" y="45" width="30" height="18" rx="3" fill="#A50044"/><ellipse cx="80" cy="45" rx="15" ry="5" fill="#C0004A"/><ellipse cx="80" cy="63" rx="15" ry="5" fill="#C0004A"/><ellipse cx="80" cy="70" rx="12" ry="12" fill="#F5A623"/><line x1="80" y1="82" x2="76" y2="105" stroke="#fff" strokeWidth="3"/><line x1="76" y1="105" x2="62" y2="120" stroke="#fff" strokeWidth="3"/><line x1="76" y1="105" x2="88" y2="118" stroke="#fff" strokeWidth="3"/><line x1="80" y1="88" x2="62" y2="96" stroke="#fff" strokeWidth="3"/><line x1="80" y1="88" x2="96" y2="93" stroke="#fff" strokeWidth="3"/><line x1="20" y1="125" x2="180" y2="125" stroke="rgba(255,255,255,0.2)" strokeWidth="2"/></svg>,
  },
  'Sack Race': {
    en: 'Sack Race', ta: 'சாக்கோட்டம்',
    descNl: 'De klassieke zakkenrace! Deelnemers stappen in een jute zak en springen zo snel mogelijk naar de finish. Een hilarische en uitdagende race waarbij iedereen lacht. Evenwicht is de sleutel!',
    descTa: 'கிளாசிக் சாக்கு ஓட்டம்! பங்கேற்பாளர்கள் சாக்கினுள் நுழைந்து ஃபினிஷ் நோக்கி குதிக்க வேண்டும். சமநிலையும் வேகமும் முக்கியம்.',
    svg: <svg {...svgProps}><rect width="200" height="160" fill="#0D1128"/><ellipse cx="100" cy="75" rx="12" ry="12" fill="#F5A623"/><path d="M82 95 Q75 120 80 150 Q100 145 120 150 Q125 120 118 95 Z" fill="#8B6914" opacity="0.85"/><path d="M88 95 L88 90 L112 90 L112 95" stroke="#A0702A" strokeWidth="2" fill="none"/><line x1="100" y1="87" x2="100" y2="80" stroke="#fff" strokeWidth="2"/><line x1="100" y1="86" x2="84" y2="94" stroke="#fff" strokeWidth="2"/><line x1="100" y1="86" x2="116" y2="91" stroke="#fff" strokeWidth="2"/><circle cx="88" cy="140" r="4" fill="#A0702A"/><circle cx="112" cy="140" r="4" fill="#A0702A"/><line x1="20" y1="150" x2="180" y2="150" stroke="rgba(255,255,255,0.2)" strokeWidth="2"/></svg>,
  },
  'Shape Matching': {
    en: 'Shape Matching', ta: 'உருவம் பொருத்துதல்',
    descNl: 'Kinderen krijgen geometrische vormen en moeten ze zo snel mogelijk in de juiste opening plaatsen. Logisch denken, ruimtelijk inzicht en snelheid bepalen wie wint.',
    descTa: 'வடிவங்களை சரியான இடங்களில் வேகமாக பொருத்த வேண்டும். தர்க்க சிந்தனை மற்றும் வேகம் வெற்றியை தீர்மானிக்கின்றன.',
    svg: <svg {...svgProps}><rect width="200" height="160" fill="#0D1128"/><rect x="30" y="40" width="40" height="40" rx="2" fill="none" stroke="#F5A623" strokeWidth="2" strokeDasharray="4 2"/><circle cx="100" cy="60" r="20" fill="none" stroke="#F5A623" strokeWidth="2" strokeDasharray="4 2"/><polygon points="160,40 180,80 140,80" fill="none" stroke="#F5A623" strokeWidth="2" strokeDasharray="4 2"/><rect x="35" y="110" width="30" height="30" rx="2" fill="#004D98" opacity="0.9"/><circle cx="130" cy="125" r="15" fill="#A50044" opacity="0.9"/><polygon points="165,110 182,140 148,140" fill="#22C55E" opacity="0.9"/><line x1="50" y1="110" x2="50" y2="80" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="3 2"/><line x1="130" y1="110" x2="100" y2="80" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="3 2"/></svg>,
  },
  'Balloon Burst': {
    en: 'Balloon Burst', ta: 'பலூன் உடைத்தல்',
    descNl: 'Kinderen blazen een ballon op en laten hem vervolgens knappen (door erop te zitten, hem tegen de grond te gooien of door er een pin in te steken). Wie het snelst blaast en knalt, wint!',
    descTa: 'பலூனை ஊதி வேகமாக உடைக்க வேண்டும். யார் வேகமாக ஊதி உடைக்கிறார்களோ அவர்கள் வெற்றியாளர். உற்சாகமான மற்றும் வேடிக்கையான போட்டி.',
    svg: <svg {...svgProps}><rect width="200" height="160" fill="#0D1128"/><ellipse cx="100" cy="70" rx="40" ry="50" fill="#A50044" opacity="0.85"/><ellipse cx="85" cy="55" rx="12" ry="8" fill="rgba(255,255,255,0.2)"/><line x1="100" y1="120" x2="100" y2="135" stroke="#A50044" strokeWidth="2"/><path d="M85 135 Q100 128 115 135" stroke="#A50044" strokeWidth="2" fill="none"/><text x="75" y="78" fill="rgba(255,255,255,0.4)" fontSize="28">💥</text><circle cx="150" cy="40" r="15" fill="#F5A623" opacity="0.7"/><circle cx="52" cy="50" r="12" fill="#004D98" opacity="0.6"/><circle cx="162" cy="90" r="10" fill="#22C55E" opacity="0.6"/></svg>,
  },
  'Elephant Drawing': {
    en: 'Elephant Drawing', ta: 'யானைக்கு கண் வைத்தல்',
    descNl: 'Geblinddoekt proberen deelnemers een stip op het oog van een getekende olifant te plaatsen. Na een rondje draaien om je te desoriënteren, loop je naar het papier. Wie het dichtst bij het oog komt, wint!',
    descTa: 'கண்களை கட்டிக்கொண்டு சுழற்றப்பட்ட பிறகு, வரையப்பட்ட யானையின் கண்ணில் புள்ளி வைக்க வேண்டும். கண்ணுக்கு மிக அருகில் வைப்பவர் வெற்றியாளர்.',
    svg: <svg {...svgProps}><rect width="200" height="160" fill="#0D1128"/><ellipse cx="110" cy="90" rx="55" ry="45" fill="#6B7280" opacity="0.7"/><ellipse cx="85" cy="80" rx="15" ry="18" fill="#6B7280" opacity="0.9"/><ellipse cx="165" cy="75" rx="12" ry="15" fill="#6B7280" opacity="0.9"/><circle cx="92" cy="78" r="8" fill="#1a2a5e"/><circle cx="92" cy="78" r="4" fill="#000"/><circle cx="94" cy="76" r="2" fill="#fff"/><path d="M90 108 Q80 130 75 145" stroke="#6B7280" strokeWidth="6" fill="none" strokeLinecap="round"/><circle cx="130" cy="85" r="6" fill="#1a2a5e" opacity="0.4"/><text x="38" y="50" fill="#F5A623" fontSize="11">😵</text><line x1="55" y1="52" x2="75" y2="70" stroke="#F5A623" strokeWidth="1.5" strokeDasharray="3 2"/><circle cx="80" cy="72" r="5" fill="#F5A623" opacity="0.7"/></svg>,
  },
  'Shot Put': {
    en: 'Shot Put', ta: 'குண்டு போடுதல்',
    descNl: 'Deelnemers gooien een zware kogel (shot) zo ver mogelijk. De techniek bestaat uit een draaibeweging gevolgd door een stootende werpbeweging. Kracht en techniek bepalen hoe ver de kogel vliegt.',
    descTa: 'கனமான குண்டை முடிந்தவரை தூரமாக தூக்கி எறிய வேண்டும். வலிமை மற்றும் சரியான நுட்பம் தூரத்தை தீர்மானிக்கின்றன.',
    svg: <svg {...svgProps}><rect width="200" height="160" fill="#0D1128"/><circle cx="55" cy="100" r="20" fill="#6B7280"/><circle cx="50" cy="95" r="5" fill="rgba(255,255,255,0.2)"/><path d="M75 90 Q110 55 155 45" stroke="#F5A623" strokeWidth="2.5" fill="none" strokeDasharray="5 3"/><circle cx="155" cy="45" r="8" fill="#F5A623" opacity="0.4"/><line x1="20" y1="130" x2="180" y2="130" stroke="rgba(255,255,255,0.2)" strokeWidth="2"/><ellipse cx="50" cy="115" rx="12" ry="12" fill="#F5A623" opacity="0.5"/><line x1="50" y1="103" x2="50" y2="85" stroke="#fff" strokeWidth="2"/><line x1="50" y1="92" x2="38" y2="96" stroke="#fff" strokeWidth="2"/><line x1="50" y1="92" x2="62" y2="85" stroke="#fff" strokeWidth="2"/><line x1="50" y1="103" x2="38" y2="115" stroke="#fff" strokeWidth="2"/><line x1="50" y1="103" x2="60" y2="115" stroke="#fff" strokeWidth="2"/></svg>,
  },
  'Standing Long Jump': {
    en: 'Standing Long Jump', ta: 'நின்று நீளம் பாய்தல்',
    descNl: 'Vanuit stilstand springen deelnemers zo ver mogelijk naar voren. Beide voeten staan op de startlijn. Explosiviteit in de benen en een goede armzwaai zijn de sleutel tot een grote sprong.',
    descTa: 'நின்ற இடத்திலிருந்தே முடிந்தவரை தூரமாக முன்னோக்கி தாண்ட வேண்டும். கால்களின் வெடிப்பு வலிமை மற்றும் கை வீச்சு தூரத்தை தீர்மானிக்கின்றன.',
    svg: <svg {...svgProps}><rect width="200" height="160" fill="#0D1128"/><line x1="40" y1="130" x2="180" y2="130" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>{[0,1,2,3,4].map(i=><line key={i} x1={60+i*28} y1="128" x2={60+i*28} y2="135" stroke="#F5A623" strokeWidth="1"/>)}<ellipse cx="45" cy="100" rx="12" ry="12" fill="#F5A623"/><line x1="45" y1="112" x2="40" y2="130" stroke="#fff" strokeWidth="2.5"/><line x1="40" y1="130" x2="32" y2="140" stroke="#fff" strokeWidth="2.5"/><line x1="40" y1="130" x2="50" y2="140" stroke="#fff" strokeWidth="2.5"/><line x1="45" y1="116" x2="28" y2="110" stroke="#fff" strokeWidth="2.5"/><line x1="45" y1="116" x2="60" y2="105" stroke="#fff" strokeWidth="2.5"/><path d="M57 108 Q100 60 148 125" stroke="#F5A623" strokeWidth="2" fill="none" strokeDasharray="5 3"/><ellipse cx="148" cy="125" rx="8" ry="5" fill="#F5A623" opacity="0.5"/></svg>,
  },
  'Fruit Basket': {
    en: 'Fruit Basket', ta: 'கூடையில் பழம் சேகரித்தல்',
    descNl: 'Deelnemers moeten fruit uit een hangend mandje of hoog geplaatste mand halen. Behendigheid, lenigheid en snelheid zijn vereist. Wie het meeste fruit verzamelt in de kortste tijd, wint!',
    descTa: 'தொங்கும் கூடையிலிருந்து பழங்களை வேகமாக சேகரிக்க வேண்டும். சாமர்த்தியம் மற்றும் வேகம் முக்கியம்.',
    svg: <svg {...svgProps}><rect width="200" height="160" fill="#0D1128"/><line x1="100" y1="10" x2="100" y2="50" stroke="#8B6914" strokeWidth="3"/><path d="M70 50 Q100 45 130 50 Q125 85 100 88 Q75 85 70 50 Z" fill="#8B6914" opacity="0.8"/><circle cx="85" cy="62" r="8" fill="#E2231A"/><circle cx="100" cy="58" r="9" fill="#F5A623"/><circle cx="116" cy="64" r="7" fill="#22C55E"/><ellipse cx="60" cy="125" rx="12" ry="12" fill="#F5A623" opacity="0.7"/><line x1="60" y1="113" x2="60" y2="88" stroke="#fff" strokeWidth="2"/><line x1="60" y1="100" x2="73" y2="93" stroke="#fff" strokeWidth="2"/><line x1="60" y1="113" x2="48" y2="140" stroke="#fff" strokeWidth="2"/><line x1="60" y1="113" x2="70" y2="138" stroke="#fff" strokeWidth="2"/></svg>,
  },
  'Spoon & Lime': {
    en: 'Spoon & Lime', ta: 'தேசிக்காய்க் கரண்டி',
    descNl: 'Met een lepel in de mond en een citroen/limoen op de lepel lopen deelnemers naar de finish. Als de citroen valt, moet je terug naar het begin. Evenwicht, concentratie en een rustige pas zijn essentieel!',
    descTa: 'வாயில் கரண்டியை வைத்துக்கொண்டு அதன் மீது தேசிக்காயை சமப்படுத்தி ஓட வேண்டும். விழுந்தால் மீண்டும் தொடங்க வேண்டும். சமநிலை மிக முக்கியம்.',
    svg: <svg {...svgProps}><rect width="200" height="160" fill="#0D1128"/><ellipse cx="80" cy="115" rx="12" ry="12" fill="#F5A623" opacity="0.7"/><line x1="80" y1="103" x2="85" y2="85" stroke="#fff" strokeWidth="2"/><ellipse cx="97" cy="80" rx="18" ry="6" fill="#8B6914"/><ellipse cx="110" cy="80" rx="6" ry="5" fill="#8B6914"/><circle cx="90" cy="76" r="8" fill="#22C55E" opacity="0.9"/><circle cx="87" cy="73" r="3" fill="rgba(255,255,255,0.3)"/><line x1="80" y1="115" x2="68" y2="140" stroke="#fff" strokeWidth="2"/><line x1="80" y1="115" x2="90" y2="138" stroke="#fff" strokeWidth="2"/><line x1="80" y1="105" x2="66" y2="110" stroke="#fff" strokeWidth="2"/><line x1="20" y1="145" x2="180" y2="145" stroke="rgba(255,255,255,0.2)" strokeWidth="2"/></svg>,
  },
  'Musical Chairs': {
    en: 'Musical Chairs', ta: 'சங்கீதக் கதிரை',
    descNl: 'Klassiek spel: stoelen staan in een kring, één minder dan het aantal spelers. Als de muziek stopt, zoek je zo snel mogelijk een stoel. Wie geen stoel vindt, valt af. Reactiesnelheid is alles!',
    descTa: 'கிளாசிக் விளையாட்டு: வட்டமாக நாற்காலிகள் வைக்கப்படும், ஒன்று குறைவாக. இசை நிற்கும்போது வேகமாக நாற்காலியில் உட்கார வேண்டும். உட்கார முடியாதவர் வெளியேறுவார்.',
    svg: <svg {...svgProps}><rect width="200" height="160" fill="#0D1128"/>{[[100,30,0],[155,65,72],[140,130,144],[60,130,216],[45,65,288]].map(([cx,cy,rot],i)=><g key={i} transform={`rotate(${rot} 100 90)`}><rect x={cx-12} y={cy} width="24" height="18" rx="2" fill={['#A50044','#004D98','#F5A623','#22C55E','#8B4513'][i]} opacity="0.8"/><line x1={cx-8} y1={cy+18} x2={cx-8} y2={cy+28} stroke={['#A50044','#004D98','#F5A623','#22C55E','#8B4513'][i]} strokeWidth="2"/><line x1={cx+8} y1={cy+18} x2={cx+8} y2={cy+28} stroke={['#A50044','#004D98','#F5A623','#22C55E','#8B4513'][i]} strokeWidth="2"/></g>)}<text x="88" y="95" fill="rgba(255,255,255,0.5)" fontSize="18">♪</text></svg>,
  },
  'Discus Throw': {
    en: 'Discus Throw', ta: 'தட்டு எறிதல்',
    descNl: 'Deelnemers gooien een schijf (discus) zo ver mogelijk. Vanuit een draaiende beweging wordt de discus met een zwiepende armbeweging weggegooid. Kracht, rotatie en lostijdstip zijn cruciaal.',
    descTa: 'தட்டை (டிஸ்கஸ்) முடிந்தவரை தூரமாக எறிய வேண்டும். சுழற்று இயக்கம் மற்றும் வலிமை தூரத்தை தீர்மானிக்கின்றன.',
    svg: <svg {...svgProps}><rect width="200" height="160" fill="#0D1128"/><ellipse cx="55" cy="105" rx="18" ry="8" fill="#6B7280" opacity="0.9"/><ellipse cx="55" cy="103" rx="18" ry="8" fill="#9CA3AF"/><path d="M73 98 Q115 55 165 35" stroke="#F5A623" strokeWidth="2.5" fill="none" strokeDasharray="5 3"/><ellipse cx="165" cy="35" rx="10" ry="4" fill="#F5A623" opacity="0.4"/><line x1="20" y1="135" x2="180" y2="135" stroke="rgba(255,255,255,0.2)" strokeWidth="2"/><ellipse cx="48" cy="120" rx="12" ry="12" fill="#F5A623" opacity="0.6"/><line x1="48" y1="108" x2="52" y2="90" stroke="#fff" strokeWidth="2.5"/><line x1="52" y1="95" x2="70" y2="88" stroke="#fff" strokeWidth="2.5"/><line x1="52" y1="95" x2="38" y2="92" stroke="#fff" strokeWidth="2.5"/><line x1="48" y1="108" x2="36" y2="120" stroke="#fff" strokeWidth="2.5"/><line x1="48" y1="108" x2="58" y2="120" stroke="#fff" strokeWidth="2.5"/></svg>,
  },
  'Weight Lifting': {
    en: 'Weight Lifting', ta: 'பாரம் தூக்குதல்',
    descNl: 'Deelnemers heffen een gewichthefstel zo hoog mogelijk of zo vaak mogelijk boven het hoofd. Kracht, techniek en ademhaling zijn essentieel. Wie het zwaarste gewicht tilt of het meeste herhalingen doet, wint.',
    descTa: 'எடை தூக்கும் போட்டி. பங்கேற்பாளர்கள் தங்கள் தலைக்கு மேலே எடையை தூக்க வேண்டும். வலிமை மற்றும் சரியான நுட்பம் வெற்றியை தீர்மானிக்கின்றன.',
    svg: <svg {...svgProps}><rect width="200" height="160" fill="#0D1128"/><rect x="40" y="70" width="120" height="12" rx="6" fill="#6B7280"/><rect x="20" y="58" width="30" height="36" rx="4" fill="#A50044"/><rect x="22" y="62" width="26" height="28" rx="3" fill="#C0004A"/><rect x="150" y="58" width="30" height="36" rx="4" fill="#A50044"/><rect x="152" y="62" width="26" height="28" rx="3" fill="#C0004A"/><ellipse cx="100" cy="115" rx="14" ry="14" fill="#F5A623"/><line x1="100" y1="76" x2="100" y2="101" stroke="#fff" strokeWidth="3"/><line x1="100" y1="90" x2="82" y2="96" stroke="#fff" strokeWidth="3"/><line x1="100" y1="90" x2="118" y2="96" stroke="#fff" strokeWidth="3"/><line x1="100" y1="101" x2="88" y2="120" stroke="#fff" strokeWidth="3"/><line x1="100" y1="101" x2="112" y2="120" stroke="#fff" strokeWidth="3"/></svg>,
  },
}
