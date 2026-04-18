const fs = require('fs');
const { createCanvas } = require('canvas');

const width = 256;
const height = 256;
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

const imgData = ctx.createImageData(width, height);
for (let i = 0; i < imgData.data.length; i += 4) {
    const val = Math.floor(Math.random() * 255);
    imgData.data[i] = val;
    imgData.data[i + 1] = val;
    imgData.data[i + 2] = val;
    imgData.data[i + 3] = 25; // alpha
}
ctx.putImageData(imgData, 0, 0);

const base64 = canvas.toDataURL();
console.log('url("' + base64 + '")');
