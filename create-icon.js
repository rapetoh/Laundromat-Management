// This is a helper script to create a simple icon
// You can run this to generate a basic icon, or replace with your own .ico file

const fs = require('fs');
const path = require('path');

// Create a simple SVG icon
const svgIcon = `
<svg width="256" height="256" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
  <rect width="256" height="256" fill="#3B82F6"/>
  <circle cx="128" cy="128" r="80" fill="white"/>
  <path d="M88 128 L128 88 L168 128 L128 168 Z" fill="#3B82F6"/>
  <text x="128" y="200" text-anchor="middle" fill="white" font-family="Arial" font-size="16" font-weight="bold">P</text>
</svg>
`;

// Save the SVG
fs.writeFileSync(path.join(__dirname, 'public', 'icon.svg'), svgIcon);

console.log('Icon SVG created at public/icon.svg');
console.log('You can convert this to .ico using online tools like:');
console.log('- https://convertio.co/svg-ico/');
console.log('- https://www.icoconverter.com/');
console.log('');
console.log('Or download a laundry/pressing icon and convert it to .ico format');
console.log('Recommended size: 256x256 pixels'); 