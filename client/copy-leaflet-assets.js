const fs = require('fs');
const path = require('path');

const leafletPath = path.join(__dirname, 'node_modules', 'leaflet', 'dist', 'images');
const publicPath = path.join(__dirname, 'public');

// Create public directory if it doesn't exist
if (!fs.existsSync(publicPath)) {
  fs.mkdirSync(publicPath);
}

// Copy marker icons
const files = [
  'marker-icon.png',
  'marker-icon-2x.png',
  'marker-shadow.png'
];

files.forEach(file => {
  fs.copyFileSync(
    path.join(leafletPath, file),
    path.join(publicPath, file)
  );
});

// Copy colored markers
const coloredMarkers = [
  { color: 'blue', files: ['marker-icon-blue.png', 'marker-icon-2x-blue.png'] },
  { color: 'red', files: ['marker-icon-red.png', 'marker-icon-2x-red.png'] }
];

coloredMarkers.forEach(({ color, files }) => {
  files.forEach(file => {
    const sourcePath = path.join(__dirname, 'node_modules', '@pointhi', 'leaflet-color-markers', 'img', file);
    const destPath = path.join(publicPath, file);
    fs.copyFileSync(sourcePath, destPath);
  });
});

console.log('Leaflet assets copied successfully!'); 