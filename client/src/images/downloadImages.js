const https = require('https');
const fs = require('fs');
const path = require('path');

const images = [
    {
        name: 'hero1.jpg',
        url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8'
    },
    {
        name: 'hero2.jpg',
        url: 'https://images.unsplash.com/photo-1445205170230-053b83016050'
    },
    {
        name: 'newsletter-bg.jpg',
        url: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04'
    }
];

// Create images directory if it doesn't exist
const imagesDir = path.join(__dirname);
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

// Download each image
images.forEach(image => {
    const filePath = path.join(imagesDir, image.name);
    https.get(`${image.url}?w=1920&q=80`, response => {
        const fileStream = fs.createWriteStream(filePath);
        response.pipe(fileStream);
        fileStream.on('finish', () => {
            console.log(`Downloaded ${image.name}`);
        });
    }).on('error', err => {
        console.error(`Error downloading ${image.name}:`, err);
    });
}); 