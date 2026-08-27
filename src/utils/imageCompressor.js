/**
 * Image Compression Utility (Client-Side WebP Engine)
 * Converts arbitrary uploaded images (JPEG, PNG, HEIC, etc.) to WebP format,
 * scaling down dimensions to max 1200px and targeting <200KB payload.
 *
 * @module imageCompressor
 */

/**
 * @typedef {Object} CompressionOptions
 * @property {number} [maxWidth=1200]
 * @property {number} [maxHeight=1200]
 * @property {number} [quality=0.78]
 * @property {number} [targetMaxSizeBytes=204800]
 */

/**
 * @typedef {Object} CompressionResult
 * @property {File} file
 * @property {Blob} blob
 * @property {string} previewUrl
 * @property {number} originalSize
 * @property {number} compressedSize
 * @property {number} compressionRatio
 * @property {number} width
 * @property {number} height
 */

/**
 * Compresses an image File or Blob into an optimized WebP File
 *
 * @param {File | Blob} inputFile - Raw user input image
 * @param {CompressionOptions} [options={}] - Configuration overrides
 * @returns {Promise<CompressionResult>}
 */
export async function compressImageToWebP(inputFile, options = {}) {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.78,
    targetMaxSizeBytes = 200 * 1024, // 200 KB target
  } = options;

  const originalSize = inputFile.size;
  const originalName = inputFile.name || 'menu-item-image.jpg';
  const fileNameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.')) || 'image';
  const webpFileName = `${fileNameWithoutExt}-${Date.now()}.webp`;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error('Failed to read input image file'));

    reader.onload = (event) => {
      const img = new Image();

      img.onerror = () => reject(new Error('Failed to parse and decode image buffer'));

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect-ratio preserved scaling
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        // Render onto Canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Unable to acquire 2D canvas context'));
        }

        // Use high-quality smoothing algorithms
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Attempt WebP export
        const attemptExport = (currentQuality) => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                return reject(new Error('Canvas WebP encoding returned null'));
              }

              // If size exceeds target and quality can be reduced further, step down slightly
              if (blob.size > targetMaxSizeBytes && currentQuality > 0.55) {
                attemptExport(currentQuality - 0.08);
                return;
              }

              const compressedFile = new File([blob], webpFileName, {
                type: 'image/webp',
                lastModified: Date.now(),
              });

              const previewUrl = URL.createObjectURL(blob);

              resolve({
                file: compressedFile,
                blob,
                previewUrl,
                originalSize,
                compressedSize: blob.size,
                compressionRatio: Number(((1 - blob.size / (originalSize || 1)) * 100).toFixed(1)),
                width,
                height,
              });
            },
            'image/webp',
            currentQuality
          );
        };

        attemptExport(quality);
      };

      img.src = event.target?.result;
    };

    reader.readAsDataURL(inputFile);
  });
}

/**
 * Format bytes into human-readable representation (e.g. "145 KB", "1.2 MB")
 * @param {number} bytes
 * @param {number} [decimals=1]
 * @returns {string}
 */
export function formatBytes(bytes, decimals = 1) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
