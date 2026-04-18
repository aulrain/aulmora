const fs = require('fs');

// Tiny simplistic PBM (Portable Bitmap) converted to PNG via some module?
// Let's generate a tiny 64x64 raw RGB pixel array, then wrap it in BMP base64.
// BMP is super simple to construct manually.
const width = 128;
const height = 128;
const fileSize = 54 + width * height * 4;

const buf = Buffer.alloc(fileSize);

// BMP header
buf.write('BM', 0);
buf.writeUInt32LE(fileSize, 2);
buf.writeUInt32LE(0, 6);
buf.writeUInt32LE(54, 10); // Offset to pixel data

// DIB Header
buf.writeUInt32LE(40, 14); // Header size
buf.writeInt32LE(width, 18);
buf.writeInt32LE(-height, 22); // Negative to indicate top-down
buf.writeUInt16LE(1, 26); // Color planes
buf.writeUInt16LE(32, 28); // Bits per pixel
buf.writeUInt32LE(0, 30); // Uncompressed
buf.writeUInt32LE(width * height * 4, 34); // Image size
buf.writeInt32LE(2835, 38);
buf.writeInt32LE(2835, 42);
buf.writeUInt32LE(0, 46);
buf.writeUInt32LE(0, 50);

// Pixel Data
let offset = 54;
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const v = Math.floor(Math.random() * 255);
    // BGRA format
    buf.writeUInt8(v, offset);     // B
    buf.writeUInt8(v, offset + 1); // G
    buf.writeUInt8(v, offset + 2); // R
    buf.writeUInt8(20, offset + 3); // A
    offset += 4;
  }
}

const base64 = buf.toString('base64');
console.log('url("data:image/bmp;base64,' + base64 + '")');
