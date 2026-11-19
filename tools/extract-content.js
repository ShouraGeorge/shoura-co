/* Turns src/assets/content.js (which the browser and the content studio use)
   into src/content.json for the Python builder, so there is exactly one
   place content is edited and no chance of the two drifting apart. */
const fs = require('fs');
const code = fs.readFileSync('src/assets/content.js', 'utf8');
const out = new Function(code + '; return {PRODUCTS, SHOP_CATS, POSTS};')();
fs.writeFileSync('src/content.json', JSON.stringify(out, null, 1));
console.log('content: ' + out.POSTS.length + ' articles, ' +
            out.PRODUCTS.length + ' products, ' +
            out.SHOP_CATS.length + ' categories');
