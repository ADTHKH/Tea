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
const SETTINGS_FILE = path.join(DATA_DIR, 'customSettings.json');
const ASSETS_FILE = path.join(DATA_DIR, 'customAssets.json');

// Ensure directories exist
[IMAGES_DIR, PUBLIC_IMAGES_DIR, DATA_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg']);

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

function readAssetsStore(): AssetsStoreData {
  if (fs.existsSync(ASSETS_FILE)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(ASSETS_FILE, 'utf-8'));
      return {
        assets: Array.isArray(parsed?.assets) ? parsed.assets : [],
        deletedUrls: Array.isArray(parsed?.deletedUrls) ? parsed.deletedUrls : []
      };
    } catch {
      return { assets: [], deletedUrls: [] };
    }
  }
  return { assets: [], deletedUrls: [] };
}

function writeAssetsStore(data: AssetsStoreData) {
  fs.writeFileSync(ASSETS_FILE, JSON.stringify(data, null, 2), 'utf-8');
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
function getFrozenAssetsStore(): AssetsStoreData {
  if (fs.existsSync(ASSETS_FILE)) {
    return readAssetsStore();
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
  writeAssetsStore(store);
  return store;
}

// Serve /images directly from IMAGES_DIR first (user's authoritative images folder), then PUBLIC_IMAGES_DIR
app.use('/images', express.static(IMAGES_DIR));
app.use('/images', express.static(PUBLIC_IMAGES_DIR));

// API 1: Save image file into images/ and public/images/ folders AND persist to storage library + optional slot binding
app.post('/api/save-image', (req, res) => {
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

    // Write to both ./images/ and ./public/images/
    const targetPathImages = path.join(IMAGES_DIR, cleanName);
    const targetPathPublic = path.join(PUBLIC_IMAGES_DIR, cleanName);

    fs.writeFileSync(targetPathImages, buffer);
    fs.writeFileSync(targetPathPublic, buffer);

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
    const store = getFrozenAssetsStore();
    store.deletedUrls = (store.deletedUrls || []).filter((u) => u !== fileUrl);
    store.assets = [newAsset, ...store.assets.filter((a) => a.url !== fileUrl)];
    writeAssetsStore(store);

    // If a slot targetKey is specified and binding is requested, persist immediately into data/customSettings.json too
    if (bindToSlot !== false && targetKey && typeof targetKey === 'string' && targetKey.trim().length > 0) {
      let existingSettings: any = {};
      if (fs.existsSync(SETTINGS_FILE)) {
        try {
          existingSettings = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8'));
        } catch {
          existingSettings = {};
        }
      }
      const nextSettings = {
        ...existingSettings,
        customImages: {
          ...(existingSettings.customImages || {}),
          [targetKey.trim()]: fileUrl
        }
      };
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(nextSettings, null, 2), 'utf-8');
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
app.get('/api/assets', (_req, res) => {
  try {
    const store = getFrozenAssetsStore();
    return res.json({ assets: store.assets });
  } catch (err: any) {
    console.error('[API] Error reading assets:', err);
    return res.status(500).json({ error: 'Failed to read assets' });
  }
});

// API 1c: Save media assets library to data/customAssets.json
app.post('/api/assets', (req, res) => {
  try {
    const { assets, deletedUrl } = req.body;
    const current = getFrozenAssetsStore();
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
    writeAssetsStore(nextStore);
    return res.json({ success: true, assets: nextStore.assets });
  } catch (err: any) {
    console.error('[API] Error saving assets:', err);
    return res.status(500).json({ error: err.message || 'Failed to save assets' });
  }
});

// Helper: check whether an /images/... URL resolves to an existing file on disk
function imageUrlExistsOnDisk(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  if (!url.startsWith('/images/')) return true;
  const rel = url.replace(/^\/images\//, '');
  if (!rel || rel.includes('..')) return false;
  return fs.existsSync(path.join(IMAGES_DIR, rel)) || fs.existsSync(path.join(PUBLIC_IMAGES_DIR, rel));
}

// API 2: Save custom theme settings to data/customSettings.json with safe merge (never drops existing valid customImages or overwrites with dead URLs)
app.post('/api/save-settings', (req, res) => {
  try {
    const { settings, deletedImageKey, deletedImageKeys } = req.body;
    if (!settings) {
      return res.status(400).json({ error: 'Missing settings payload' });
    }

    let existing: any = {};
    if (fs.existsSync(SETTINGS_FILE)) {
      try {
        existing = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8'));
      } catch (e) {
        existing = {};
      }
    }

    const mergedImages: Record<string, string> = {
      ...(existing.customImages || {})
    };

    if (settings.customImages && typeof settings.customImages === 'object') {
      for (const [k, v] of Object.entries(settings.customImages)) {
        if (typeof v !== 'string' || !v) continue;
        // Reject stale /images/... paths that do not exist on disk so old tabs cannot corrupt saved slots
        if (v.startsWith('/images/') && !imageUrlExistsOnDisk(v)) {
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

    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(merged, null, 2), 'utf-8');
    console.log('[API] Saved merged settings to customSettings.json');
    return res.json({ success: true, settings: merged });
  } catch (err: any) {
    console.error('[API] Error saving settings:', err);
    return res.status(500).json({ error: err.message || 'Failed to save settings' });
  }
});

// API 3: Get custom theme settings from data/customSettings.json
app.get('/api/settings', (_req, res) => {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const raw = fs.readFileSync(SETTINGS_FILE, 'utf-8');
      return res.json(JSON.parse(raw));
    }
    return res.json(null);
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
