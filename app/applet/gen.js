const fs = require('fs');
const h = 256, w = 256, f = 54 + w * h * 4, b = Buffer.alloc(f);
b.write('BM', 0);
b.writeUInt32LE(f, 2);
b.writeUInt32LE(54, 10);
b.writeUInt32LE(40, 14);
b.writeInt32LE(w, 18);
b.writeInt32LE(-h, 22);
b.writeUInt16LE(1, 26);
b.writeUInt16LE(32, 28);
b.writeUInt32LE(w * h * 4, 34);
let o = 54;
for (let i = 0; i < h * w; i++) {
  const v = Math.floor(Math.random() * 256);
  b.writeUInt8(v, o);
  b.writeUInt8(v, o + 1);
  b.writeUInt8(v, o + 2);
  b.writeUInt8(20, o + 3);
  o += 4;
}
fs.writeFileSync('noise.txt', 'data:image/bmp;base64,' + b.toString('base64'));
