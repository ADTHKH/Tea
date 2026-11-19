/**
 * 熱感收據機（Xprinter XP-Q90EC，58mm 紙）：網頁直接透過 USB 列印，不跳任何列印視窗。
 *
 * 實測過的規則（照做才不會亂碼）：
 * 1. 中文、圖案一律先畫成黑白點陣圖再送，收據機內建字型不認中文。
 * 2. 一張圖要切成每段 64 行送，整張一次送會塞爆收據機記憶體。
 * 3. 每送 512 bytes 停一下，送太快一樣會塞爆。
 * 4. 一次只印一張，上一張印完、切好紙才送下一張。
 *
 * 樹莓派上要先跑一次 scripts/setup-raspberry-pi.sh，瀏覽器才有權限而且不會跳詢問視窗。
 */

const PRINTER = { vendorId: 0x0483, productId: 0x070b };
const PAPER_DOTS = 384; // 58mm 紙寬 = 384 點
const ROWS_PER_CHUNK = 64;
const USB_CHUNK_BYTES = 512;
const USB_PAUSE_MS = 50; // ponytail: 固定節奏送；還是印到亂碼就把這個調大
const CUT_WAIT_MS = 3000; // 等出紙、切紙完再接下一張

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const usb = () => (navigator as any).usb;

/** 後台用：讓瀏覽器記住這台收據機（要人按按鈕才能叫出選擇視窗；樹莓派已預先授權就不用） */
export async function pairPrinter(): Promise<void> {
  if (!usb()) throw new Error('這個瀏覽器不支援 USB 列印，請用 Chrome 或 Chromium');
  await usb().requestDevice({ filters: [PRINTER] });
}

async function findPrinter(): Promise<any | null> {
  if (!usb()) return null;
  const devices = await usb().getDevices();
  return devices.find((d: any) => d.vendorId === PRINTER.vendorId && d.productId === PRINTER.productId) || null;
}

/** 把圖片縮到紙寬、用黑點疏密模擬灰階（Floyd–Steinberg 抖色），轉成收據機的點陣圖指令 */
export async function imageToReceiptBytes(url: string): Promise<Uint8Array> {
  const img = new Image();
  img.src = url;
  await img.decode();
  const w = PAPER_DOTS;
  const h = Math.round((img.naturalHeight * w) / img.naturalWidth);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(img, 0, 0, w, h);
  const px = ctx.getImageData(0, 0, w, h).data;

  const gray = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) gray[i] = 0.299 * px[i * 4] + 0.587 * px[i * 4 + 1] + 0.114 * px[i * 4 + 2];

  const rowBytes = w / 8;
  const bits = new Uint8Array(rowBytes * h); // 1 = 黑點
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      const black = gray[i] < 128;
      const err = gray[i] - (black ? 0 : 255);
      if (black) bits[y * rowBytes + (x >> 3)] |= 0x80 >> (x & 7);
      if (x + 1 < w) gray[i + 1] += (err * 7) / 16;
      if (y + 1 < h) {
        if (x > 0) gray[i + w - 1] += (err * 3) / 16;
        gray[i + w] += (err * 5) / 16;
        if (x + 1 < w) gray[i + w + 1] += err / 16;
      }
    }
  }

  const parts: Uint8Array[] = [Uint8Array.of(0x1b, 0x40)]; // 重設收據機
  for (let y = 0; y < h; y += ROWS_PER_CHUNK) {
    const n = Math.min(ROWS_PER_CHUNK, h - y);
    parts.push(Uint8Array.of(0x1d, 0x76, 0x30, 0x00, rowBytes & 0xff, rowBytes >> 8, n & 0xff, n >> 8)); // GS v 0 點陣圖
    parts.push(bits.subarray(y * rowBytes, (y + n) * rowBytes));
  }
  parts.push(Uint8Array.of(0x0a, 0x0a, 0x0a, 0x0a, 0x0a, 0x1d, 0x56, 0x01)); // 送紙後切紙

  const out = new Uint8Array(parts.reduce((s, p) => s + p.length, 0));
  let o = 0;
  for (const p of parts) {
    out.set(p, o);
    o += p.length;
  }
  return out;
}

async function sendToPrinter(data: Uint8Array): Promise<void> {
  const dev = await findPrinter();
  if (!dev) throw new Error('找不到收據機：請確認電源已開、USB 已接');
  await dev.open();
  try {
    if (!dev.configuration) await dev.selectConfiguration(1);
    const iface =
      dev.configuration.interfaces.find((i: any) => i.alternates[0].interfaceClass === 7) || dev.configuration.interfaces[0];
    await dev.claimInterface(iface.interfaceNumber);
    const ep = iface.alternates[0].endpoints.find((e: any) => e.direction === 'out');
    for (let k = 0; k < data.length; k += USB_CHUNK_BYTES) {
      await dev.transferOut(ep.endpointNumber, data.subarray(k, k + USB_CHUNK_BYTES));
      await sleep(USB_PAUSE_MS);
    }
    await sleep(CUT_WAIT_MS);
    await dev.releaseInterface(iface.interfaceNumber);
  } finally {
    await dev.close();
  }
}

let queue: Promise<void> = Promise.resolve();

/** 印一張圖。多人同時按會排隊，一張印完才印下一張 */
export function printImage(url: string): Promise<void> {
  const job = queue.then(async () => sendToPrinter(await imageToReceiptBytes(url)));
  queue = job.catch(() => {});
  return job;
}
