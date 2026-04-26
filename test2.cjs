const fs = require('fs');
try {
  require('vm').createScript(fs.readFileSync('script3.js', 'utf8'));
} catch (e) {
  console.log(e.stack);
}
