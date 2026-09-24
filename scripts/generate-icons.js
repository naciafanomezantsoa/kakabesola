import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const svgPath = path.resolve('public/icon.svg');
const svgBuffer = fs.readFileSync(svgPath);

async function run() {
  console.log('Generating PWA and Android icons from public/icon.svg...');

  // 192x192
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.resolve('public/pwa-192x192.png'));
  console.log('Created pwa-192x192.png');

  // 512x512
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.resolve('public/pwa-512x512.png'));
  console.log('Created pwa-512x512.png');

  // 512x512 Maskable (with 10% safe zone padding)
  await sharp(svgBuffer)
    .resize(410, 410)
    .extend({
      top: 51,
      bottom: 51,
      left: 51,
      right: 51,
      background: '#f43f5e',
    })
    .png()
    .toFile(path.resolve('public/pwa-maskable-512x512.png'));
  console.log('Created pwa-maskable-512x512.png');

  // Apple touch icon (180x180)
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.resolve('public/apple-touch-icon.png'));
  console.log('Created apple-touch-icon.png');

  // Favicon (32x32)
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.resolve('public/favicon.ico'));
  console.log('Created favicon.ico');

  console.log('All icons generated successfully!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
