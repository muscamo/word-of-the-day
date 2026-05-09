#!/usr/bin/env node
/**
 * generate-assets.js
 * Generates placeholder app icons at the correct sizes.
 * Run: node generate-assets.js
 *
 * For production, replace with your real designed icon.
 * Required sizes:
 *   icon.png            — 1024×1024 (Expo scales down)
 *   adaptive-icon.png   — 1024×1024 foreground (centered, with padding)
 *   splash.png          — 1284×2778 (iPhone 14 Pro Max size, Expo crops)
 *   notification-icon.png — 96×96 monochrome white on transparent
 *   feature-graphic.png — 1024×500 (Play Store banner)
 */

const fs = require('fs');
const path = require('path');

// We'll write raw SVG files that can be converted, or use a simple
// colored PNG approach with the `sharp` package if available.
// If sharp is not installed, this script outputs SVG placeholders instead.

const ASSETS_DIR = path.join(__dirname, 'assets');
if (!fs.existsSync(ASSETS_DIR)) fs.mkdirSync(ASSETS_DIR);

const svgIcon = (size, text = '📖') => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="#0a0a12" rx="${size * 0.2}"/>
  <text x="50%" y="54%" font-size="${size * 0.45}" text-anchor="middle" dominant-baseline="middle">${text}</text>
</svg>`;

const svgSplash = `<svg xmlns="http://www.w3.org/2000/svg" width="1284" height="2778" viewBox="0 0 1284 2778">
  <rect width="1284" height="2778" fill="#0a0a12"/>
  <text x="642" y="1340" font-size="200" text-anchor="middle" dominant-baseline="middle">📖</text>
  <text x="642" y="1560" font-size="60" fill="#c084fc" text-anchor="middle" font-family="sans-serif" font-weight="bold">Word of the Day</text>
</svg>`;

const svgFeature = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="500" viewBox="0 0 1024 500">
  <rect width="1024" height="500" fill="#0a0a12"/>
  <text x="512" y="200" font-size="120" text-anchor="middle" dominant-baseline="middle">📖</text>
  <text x="512" y="320" font-size="52" fill="#f0e6ff" text-anchor="middle" font-family="sans-serif" font-weight="800">Word of the Day</text>
  <text x="512" y="390" font-size="28" fill="#c084fc" text-anchor="middle" font-family="sans-serif">Expand your vocabulary, one word at a time.</text>
</svg>`;

const svgNotification = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">
  <rect width="96" height="96" fill="transparent"/>
  <text x="48" y="52" font-size="56" text-anchor="middle" dominant-baseline="middle" fill="white">W</text>
</svg>`;

fs.writeFileSync(path.join(ASSETS_DIR, 'icon.svg'), svgIcon(1024));
fs.writeFileSync(path.join(ASSETS_DIR, 'adaptive-icon.svg'), svgIcon(1024));
fs.writeFileSync(path.join(ASSETS_DIR, 'splash.svg'), svgSplash);
fs.writeFileSync(path.join(ASSETS_DIR, 'feature-graphic.svg'), svgFeature);
fs.writeFileSync(path.join(ASSETS_DIR, 'notification-icon.svg'), svgNotification);

console.log('✅ SVG placeholders written to assets/');
console.log('');
console.log('Next steps:');
console.log('1. Open each .svg in Figma, Sketch, or Adobe Illustrator');
console.log('2. Export as PNG at the correct size');
console.log('3. Replace the .png files in assets/ with your exported files');
console.log('');
console.log('Required PNG files:');
console.log('  icon.png              1024×1024');
console.log('  adaptive-icon.png     1024×1024');
console.log('  splash.png            1284×2778');
console.log('  notification-icon.png   96×96  (white monochrome on transparent)');
console.log('  feature-graphic.png   1024×500  (for Play Store listing)');
