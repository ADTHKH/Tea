import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// High body limit for base64 high-resolution images and animated GIFs
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

const IMAGES_DIR = path.resolve(__dirname, 'images');
const PUBLIC_IMAGES_DIR = path.resolve(__dirname, 'public/images');
const DATA_DIR = path.resolve(__dirname, 'data');
const SETTINGS_PATH = 'data/customSettings.json';
const ASSETS_PATH = 'data/customAssets.json';

// Ensure directories exist
[IMAGES_DIR, PUBLIC_IMAGES_DIR, DATA_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.mp4']);

interface StoredAsset {
  id: string;
  name: string;
  category: string;
  targetKey: string;
  url: string;
  uploadedAt: string;
  notes?: string;
}

interface AssetsStoreData {
  assets: StoredAsset[];
  deletedUrls: string[];
}

/**
 * 長期存檔：發布後的主機重啟就會清空，所以有設定 GITHUB_TOKEN 時，
 * 設定、素材清單、上傳的圖都直接寫回 GitHub 專案；沒設定時才寫本機（只適合本機開發）。
 */
const GH_TOKEN = process.env.GITHUB_TOKEN || '';
const GH_REPO = process.env.GITHUB_REPO || 'ADTHKH/Tea';
const GH_BRANCH = process.env.GITHUB_BRANCH || 'main';

const ghUrl = (repoPath: string) =>
  `https://api.github.com/repos/${GH_REPO}/contents/${repoPath.split('/').map(encodeURIComponent).join('/')}`;
const ghHeaders = (accept = 'application/vnd.github+json') => ({
  Authorization: `Bearer ${GH_TOKEN}`,
  Accept: accept,
  'X-GitHub-Api-Version': '2022-11-28'
});

async function readStored(repoPath: string): Promise<Buffer | null> {
  if (!GH_TOKEN) {
    const p = path.join(__dirname, repoPath);
    return fs.existsSync(p) ? fs.readFileSync(p) : null;
  }
  const res = await fetch(`${ghUrl(repoPath)}?ref=${GH_BRANCH}`, { headers: ghHeaders('application/vnd.github.raw') });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub 讀取 ${repoPath} 失敗：${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function ghSha(repoPath: string): Promise<string | undefined> {
  const res = await fetch(`${ghUrl(repoPath)}?ref=${GH_BRANCH}`, { headers: ghHeaders() });
  return res.ok ? (await res.json()).sha : undefined;
}

async function writeStored(repoPath: string, content: Buffer, message: string): Promise<void> {
  if (!GH_TOKEN) {
    fs.writeFileSync(path.join(__dirname, repoPath), content);
    return;
  }
  // 別人剛好同時寫入會拿到舊版本號（409），重拿一次再寫
  for (let attempt = 0; attempt < 2; attempt++) {
    const res = await fetch(ghUrl(repoPath), {
      method: 'PUT',
      headers: ghHeaders(),
      body: JSON.stringify({ message, content: content.toString('base64'), branch: GH_BRANCH, sha: await ghSha(repoPath) })
    });
    if (res.ok) return;
    if (res.status !== 409 || attempt > 0) throw new Error(`GitHub 寫入 ${repoPath} 失敗：${res.status} ${await res.text()}`);
  }
}

// 設定檔先放記憶體，停止變動 2 秒後才寫出一次，避免拖滑桿時每秒寫幾十次
const jsonCache = new Map<string, any>();
const flushTimers = new Map<string, NodeJS.Timeout>();

async function readJson(repoPath: string): Promise<any> {
  if (!jsonCache.has(repoPath)) {
    const buf = await readStored(repoPath);
    let parsed = null;
    try {
      parsed = buf ? JSON.parse(buf.toString('utf-8')) : null;
    } catch {}
    jsonCache.set(repoPath, parsed);
  }
  return jsonCache.get(repoPath);
}

function writeJson(repoPath: string, data: any) {
  jsonCache.set(repoPath, data);
  clearTimeout(flushTimers.get(repoPath));
  flushTimers.set(
    repoPath,
    setTimeout(() => {
      writeStored(repoPath, Buffer.from(JSON.stringify(data, null, 2), 'utf-8'), `後台更新 ${repoPath}`).catch((err) =>
        console.error('[Storage] 存檔失敗:', err)
      );
    }, 2000)
  );
}

// 後台新上傳、還沒重新發布的圖，從 GitHub 拿一次後留在記憶體
const uploadedImages = new Map<string, Buffer>();

async function imageUrlExists(url: string): Promise<boolean> {
  if (!url.startsWith('/images/')) return true;
  const rel = url.replace(/^\/images\//, '');
  if (!rel || rel.includes('..') || rel.includes('/')) return false;
  if (fs.existsSync(path.join(IMAGES_DIR, rel)) || fs.existsSync(path.join(PUBLIC_IMAGES_DIR, rel))) return true;
  if (uploadedImages.has(rel)) return true;
  return GH_TOKEN ? Boolean(await ghSha(`images/${rel}`)) : false;
}

function inferTargetKeyFromFilename(filename: string): { category: string; targetKey: string } {
  const knownSlots = [
    'process-gif-muzha-tieguanyin',
    'process-gif-wenshan-baozhong',
    'process-gif-tieguanyin-black',
    'process-gif-taiwan-gaoshan-oolong',
    'process-gif-jinxuan-oolong',
    'process-gif-taiwan-sijichun',
    'process-gif-default',
    'process-chart-muzha-tieguanyin',
    'process-chart-wenshan-baozhong',
    'process-chart-tieguanyin-black',
    'process-chart-taiwan-gaoshan-oolong',
    'process-chart-jinxuan-oolong',
    'process-chart-taiwan-sijichun',
    'process-chart-default',
    'print-label-calm',
    'print-label-warm',
    'print-label-joy',
    'print-label-nostalgic',
    'print-label-vibrant',
    'print-label-grounded',
    'print-label-default',
    'emotion-btn-calm',
    'emotion-btn-warm',
    'emotion-btn-joy',
    'emotion-btn-nostalgic',
    'emotion-btn-vibrant',
    'emotion-btn-grounded',
    'emotion-calm',
    'emotion-warm',
    'emotion-joy',
    'emotion-nostalgic',
    'emotion-vibrant',
    'emotion-grounded',
    'home-cover',
    'bg-main',
    'bg-process',
    'bg-steam',
    'bg-emotion',
    'cup-center',
  ];

  for (const key of knownSlots) {
    if (filename.startsWith(key)) {
      const category = key.startsWith('process-gif-')
        ? 'gif'
        : key.startsWith('process-chart-')
        ? 'chart'
        : key.startsWith('print-label-')
        ? 'label'
        : key.startsWith('emotion-btn-')
        ? 'emotion'
        : key.startsWith('emotion-')
        ? 'monster'
        : key.startsWith('cup-')
        ? 'cup'
        : 'background';
      return { category, targetKey: key };
    }
  }
  return { category: 'general', targetKey: '' };
}

/**
 * Initialize customAssets.json from IMAGES_DIR ONLY if customAssets.json does not exist yet.
 * Never automatically mutates, copies, or restores files inside images/!
 */
async function getFrozenAssetsStore(): Promise<AssetsStoreData> {
  const saved = await readJson(ASSETS_PATH);
  if (saved) {
    return {
      assets: Array.isArray(saved.assets) ? saved.assets : [],
      deletedUrls: Array.isArray(saved.deletedUrls) ? saved.deletedUrls : []
    };
  }

  const filesInImages = fs.existsSync(IMAGES_DIR) ? fs.readdirSync(IMAGES_DIR) : [];
  const assets: StoredAsset[] = [];

  for (const file of filesInImages) {
    const ext = path.extname(file).toLowerCase();
    if (!IMAGE_EXTS.has(ext)) continue;
    const { category, targetKey } = inferTargetKeyFromFilename(file);
    assets.push({
      id: `disk-${encodeURIComponent(file)}`,
      name: path.basename(file, ext),
      category,
      targetKey,
      url: `/images/${file}`,
      uploadedAt: new Date().toLocaleDateString('zh-TW'),
      notes: `images/${file}`
    });
  }

  const store: AssetsStoreData = { assets, deletedUrls: [] };
  writeJson(ASSETS_PATH, store);
  return store;
}

// Serve /images directly from IMAGES_DIR first (user's authoritative images folder), then PUBLIC_IMAGES_DIR
app.use('/images', express.static(IMAGES_DIR));
app.use('/images', express.static(PUBLIC_IMAGES_DIR));
app.get('/images/:name', async (req, res, next) => {
  const name = req.params.name;
  if (!GH_TOKEN || name.includes('/') || name.includes('..')) return next();
  try {
    let buf = uploadedImages.get(name);
    if (!buf) {
      buf = (await readStored(`images/${name}`)) || undefined;
      if (!buf) return next();
      uploadedImages.set(name, buf);
    }
    res.type(path.extname(name)).send(buf);
  } catch (err) {
    next(err);
  }
});

// API 1: Save image file into images/ and public/images/ folders AND persist to storage library + optional slot binding
app.post('/api/save-image', async (req, res) => {
  try {
    const { filename, dataUrl, targetKey, bindToSlot } = req.body;

    if (!dataUrl || typeof dataUrl !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid dataUrl' });
    }

    // Determine target file extension and clean filename
    const matches = dataUrl.match(/^data:([A-Za-z0-9-+\/]+);base64,(.+)$/);
    let mimeType = 'image/png';
    let base64Data = dataUrl;

    if (matches && matches.length === 3) {
      mimeType = matches[1];
      base64Data = matches[2];
    }

    const lowerFileExt = filename && typeof filename === 'string' ? path.extname(filename).toLowerCase() : '';
    let ext = '.png';
    if (mimeType.includes('gif') || lowerFileExt === '.gif') ext = '.gif';
    else if (mimeType.includes('jpeg') || mimeType.includes('jpg') || lowerFileExt === '.jpg' || lowerFileExt === '.jpeg') ext = '.jpg';
    else if (mimeType.includes('webp') || lowerFileExt === '.webp') ext = '.webp';
    else if (mimeType.includes('svg') || lowerFileExt === '.svg') ext = '.svg';

    let cleanName = '';
    if (targetKey && typeof targetKey === 'string' && targetKey.trim().length > 0 && bindToSlot !== false) {
      const safeKey = targetKey.trim().replace(/[/\\?%*:|"<>]/g, '_');
      cleanName = `${safeKey}_${Date.now()}${ext}`;
    } else if (filename && typeof filename === 'string' && filename.trim().length > 0) {
      const base = path.basename(filename.trim().replace(/[/\\?%*:|"<>]/g, '_'), path.extname(filename.trim()));
      cleanName = `${base}_${Date.now()}${ext}`;
    } else {
      cleanName = `upload_${Date.now()}${ext}`;
    }

    const buffer = Buffer.from(base64Data, 'base64');

    // 寫進 images/（有 GITHUB_TOKEN 就是寫回 GitHub 專案）
    await writeStored(`images/${cleanName}`, buffer, `後台上傳 ${cleanName}`);
    if (GH_TOKEN) {
      uploadedImages.set(cleanName, buffer);
    } else {
      fs.writeFileSync(path.join(PUBLIC_IMAGES_DIR, cleanName), buffer);
    }

    const fileUrl = `/images/${cleanName}`;
    const inferred = inferTargetKeyFromFilename(cleanName);
    const displayBaseName = filename && typeof filename === 'string'
      ? filename.replace(/\.[^/.]+$/, '')
      : cleanName.replace(/\.[^/.]+$/, '');

    const newAsset: StoredAsset = {
      id: `asset-${Date.now()}`,
      name: displayBaseName,
      category: inferred.category,
      targetKey: bindToSlot !== false ? (targetKey || inferred.targetKey) : '',
      url: fileUrl,
      uploadedAt: new Date().toLocaleDateString('zh-TW'),
      notes: `自動存入 images/${cleanName}`
    };

    // Persist immediately into data/customAssets.json
    const store = await getFrozenAssetsStore();
    store.deletedUrls = (store.deletedUrls || []).filter((u) => u !== fileUrl);
    store.assets = [newAsset, ...store.assets.filter((a) => a.url !== fileUrl)];
    writeJson(ASSETS_PATH, store);

    // If a slot targetKey is specified and binding is requested, persist immediately into data/customSettings.json too
    if (bindToSlot !== false && targetKey && typeof targetKey === 'string' && targetKey.trim().length > 0) {
      const existingSettings: any = (await readJson(SETTINGS_PATH)) || {};
      const nextSettings = {
        ...existingSettings,
        customImages: {
          ...(existingSettings.customImages || {}),
          [targetKey.trim()]: fileUrl
        }
      };
      writeJson(SETTINGS_PATH, nextSettings);
    }

    console.log(`[API] Saved image to disk & storage: ${cleanName} (${buffer.length} bytes)`);

    return res.json({
      success: true,
      filename: cleanName,
      url: fileUrl,
      asset: newAsset
    });
  } catch (err: any) {
    console.error('[API] Error saving image:', err);
    return res.status(500).json({ error: err.message || 'Failed to save image' });
  }
});

// API 1b: Get persistent media assets library (frozen snapshot in customAssets.json; does not modify images/)
app.get('/api/assets', async (_req, res) => {
  try {
    const store = await getFrozenAssetsStore();
    return res.json({ assets: store.assets });
  } catch (err: any) {
    console.error('[API] Error reading assets:', err);
    return res.status(500).json({ error: 'Failed to read assets' });
  }
});

// API 1c: Save media assets library to data/customAssets.json
app.post('/api/assets', async (req, res) => {
  try {
    const { assets, deletedUrl } = req.body;
    const current = await getFrozenAssetsStore();
    const nextDeleted = new Set(current.deletedUrls || []);
    if (deletedUrl && typeof deletedUrl === 'string') {
      nextDeleted.add(deletedUrl);
    }
    const sanitizedAssets: StoredAsset[] = Array.isArray(assets)
      ? assets.filter((a: any) => a && typeof a.url === 'string' && !a.url.startsWith('data:'))
      : current.assets;

    const nextStore: AssetsStoreData = {
      assets: sanitizedAssets,
      deletedUrls: Array.from(nextDeleted)
    };
    writeJson(ASSETS_PATH, nextStore);
    return res.json({ success: true, assets: nextStore.assets });
  } catch (err: any) {
    console.error('[API] Error saving assets:', err);
    return res.status(500).json({ error: err.message || 'Failed to save assets' });
  }
});

// API 2: Save custom theme settings to data/customSettings.json with safe merge (never drops existing valid customImages or overwrites with dead URLs)
app.post('/api/save-settings', async (req, res) => {
  try {
    const { settings, deletedImageKey, deletedImageKeys } = req.body;
    if (!settings) {
      return res.status(400).json({ error: 'Missing settings payload' });
    }

    const existing: any = (await readJson(SETTINGS_PATH)) || {};

    const mergedImages: Record<string, string> = {
      ...(existing.customImages || {})
    };

    if (settings.customImages && typeof settings.customImages === 'object') {
      for (const [k, v] of Object.entries(settings.customImages)) {
        if (typeof v !== 'string' || !v) continue;
        // Reject stale /images/... paths that do not exist on disk so old tabs cannot corrupt saved slots
        if (v.startsWith('/images/') && !(await imageUrlExists(v))) {
          continue;
        }
        mergedImages[k] = v;
      }
    }

    if (deletedImageKey && typeof deletedImageKey === 'string') {
      delete mergedImages[deletedImageKey];
    }
    if (Array.isArray(deletedImageKeys)) {
      for (const key of deletedImageKeys) {
        if (typeof key === 'string') {
          delete mergedImages[key];
        }
      }
    }

    const merged = {
      ...existing,
      ...settings,
      customImages: mergedImages,
      customTexts: {
        ...(existing.customTexts || {}),
        ...(settings.customTexts || {})
      },
      emotionButtonSizes: {
        ...(existing.emotionButtonSizes || {}),
        ...(settings.emotionButtonSizes || {})
      },
      emotionNfcChips: {
        ...(existing.emotionNfcChips || {}),
        ...(settings.emotionNfcChips || {})
      }
    };

    writeJson(SETTINGS_PATH, merged);
    console.log('[API] Saved merged settings to customSettings.json');
    return res.json({ success: true, settings: merged });
  } catch (err: any) {
    console.error('[API] Error saving settings:', err);
    return res.status(500).json({ error: err.message || 'Failed to save settings' });
  }
});

// API 3: Get custom theme settings from data/customSettings.json
app.get('/api/settings', async (_req, res) => {
  try {
    return res.json((await readJson(SETTINGS_PATH)) || null);
  } catch (err: any) {
    console.error('[API] Error reading settings:', err);
    return res.status(500).json({ error: 'Failed to read settings' });
  }
});

// Mount Vite or serve static dist in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true }
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Exhibition Kiosk running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
