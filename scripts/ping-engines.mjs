// scripts/ping-engines.mjs
const SITEMAP_URL = 'https://toptenuae.com/sitemap.xml';

async function pingEngines() {
  console.log('📡 Pinging search engines...');

  const engines = [
    { name: 'Bing', url: `https://www.bing.com/ping?sitemap=${SITEMAP_URL}` },
  ];

  for (const engine of engines) {
    try {
      const res = await fetch(engine.url);
      if (res.ok) {
        console.log(`✅ Successfully pinged ${engine.name}`);
      } else {
        console.log(`⚠️ ${engine.name} ping returned status: ${res.status}`);
      }
    } catch (err) {
      console.error(`❌ Failed to ping ${engine.name}:`, err.message);
    }
  }
}

pingEngines();