const fs = require('fs');
const https = require('https');
const path = require('path');

const categories = [
  { name: 'electronics', url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c' },
  { name: 'mobiles', url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9' },
  { name: 'laptops', url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8' },
  { name: 'fashion', url: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f' },
  { name: 'grocery', url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836' },
  { name: 'sports', url: 'https://images.unsplash.com/photo-1505843279827-eebd7b84c1d4' },
];

const dir = path.join(__dirname, 'categories');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

categories.forEach(cat => {
  const file = fs.createWriteStream(path.join(dir, `${cat.name}.jpg`));
  https.get(cat.url, response => {
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log(`${cat.name}.jpg downloaded!`);
    });
  });
}); 