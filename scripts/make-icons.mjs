// מייצר אייקוני PNG ללא תלויות חיצוניות: חלון צבעי מים, שמש זורחת וכובע גבוה, בלי טקסט.
import { writeFileSync, mkdirSync } from 'node:fs';
import { deflateSync } from 'node:zlib';

const crcTable = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (const byte of buf) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeBuf = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([len, typeBuf, data, crc]);
}

// צבע לנקודה בקואורדינטות 0..1: נייר בהיר, חלון שמיים כחול, שמש זהובה וכובע גבוה בסגול.
function colorAt(u, v) {
  const paper = [247, 242, 232];
  let c = paper;
  const inWash = u > 0.12 && u < 0.88 && v > 0.12 && v < 0.88;
  if (inWash) {
    const t = (v - 0.12) / 0.76;
    c = [156 + (207 - 156) * t, 200 + (230 - 200) * t, 228 + (243 - 228) * t];
  }
  const dx = u - 0.5;
  const dy = v - 0.66;
  const d = Math.sqrt(dx * dx + dy * dy);
  const ang = Math.atan2(dy, dx);
  if (inWash && dy < 0 && d > 0.22 && d < 0.4 && Math.abs(Math.sin(ang * 7)) > 0.82) c = [111, 143, 176];
  if (d < 0.22 && v < 0.88) c = [247, 207, 61];
  // כובע: כתר, פס וכנף
  const crown = u > 0.4 && u < 0.6 && v > 0.3 && v < 0.6 + 0 && v > 0.3 - (u - 0.4) * 0.15;
  const band = u > 0.4 && u < 0.6 && v > 0.52 && v < 0.58;
  const brim = ((u - 0.5) / 0.19) ** 2 + ((v - 0.6) / 0.04) ** 2 < 1;
  if (crown || brim) c = [107, 44, 84];
  if (band) c = [241, 185, 74];
  return c;
}

function render(size) {
  const raw = Buffer.alloc((size * 4 + 1) * size);
  const ss = 3;
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0;
    for (let x = 0; x < size; x++) {
      let r = 0, g = 0, b = 0;
      for (let sy = 0; sy < ss; sy++) {
        for (let sx = 0; sx < ss; sx++) {
          const c = colorAt((x + (sx + 0.5) / ss) / size, (y + (sy + 0.5) / ss) / size);
          r += c[0]; g += c[1]; b += c[2];
        }
      }
      const n = ss * ss;
      const i = y * (size * 4 + 1) + 1 + x * 4;
      raw[i] = Math.round(r / n);
      raw[i + 1] = Math.round(g / n);
      raw[i + 2] = Math.round(b / n);
      raw[i + 3] = 255;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

mkdirSync('public/icons', { recursive: true });
for (const size of [192, 512]) {
  writeFileSync(`public/icons/icon-${size}.png`, render(size));
}
console.log('icons written');
