import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function optimizeImages() {
  const imagesDir = path.join(__dirname, '..', 'public', 'images');
  const optimizedDir = path.join(__dirname, '..', 'public', 'images', 'optimized');
  
  // Create optimized directory if it doesn't exist
  try {
    await fs.mkdir(optimizedDir, { recursive: true });
  } catch (err) {
    console.error('Error creating directory:', err);
  }

  const files = await fs.readdir(imagesDir);
  const imageFiles = files.filter(file => 
    /\.(jpg|jpeg|png|webp)$/i.test(file) && !file.includes('optimized')
  );

  console.log(`Found ${imageFiles.length} images to optimize`);

  for (const file of imageFiles) {
    const inputPath = path.join(imagesDir, file);
    const outputName = path.parse(file).name;
    const stats = await fs.stat(inputPath);
    const fileSizeMB = stats.size / (1024 * 1024);
    
    console.log(`\nProcessing ${file} (${fileSizeMB.toFixed(2)} MB)`);

    try {
      // Skip badge files and small images
      if (file.includes('badge') || file.includes('favicon') || fileSizeMB < 0.1) {
        console.log(`  Skipping ${file} (badge/favicon/small file)`);
        continue;
      }

      // For Gemini generated images (hero images)
      if (file.includes('Gemini_Generated')) {
        // Create WebP version for modern browsers
        await sharp(inputPath)
          .resize(1920, null, { withoutEnlargement: true })
          .webp({ quality: 85 })
          .toFile(path.join(optimizedDir, `${outputName}.webp`));
        
        // Create optimized JPEG fallback
        await sharp(inputPath)
          .resize(1920, null, { withoutEnlargement: true })
          .jpeg({ quality: 85, progressive: true })
          .toFile(path.join(optimizedDir, `${outputName}.jpg`));
        
        // Create mobile version
        await sharp(inputPath)
          .resize(768, null, { withoutEnlargement: true })
          .webp({ quality: 80 })
          .toFile(path.join(optimizedDir, `${outputName}-mobile.webp`));
        
        console.log(`  ✓ Created WebP, JPEG, and mobile versions`);
      } 
      // For Craig's professional photo
      else if (file.includes('craig-fearn')) {
        await sharp(inputPath)
          .resize(800, null, { withoutEnlargement: true })
          .jpeg({ quality: 85, progressive: true })
          .toFile(path.join(optimizedDir, `${outputName}-optimized.jpg`));
        
        await sharp(inputPath)
          .resize(800, null, { withoutEnlargement: true })
          .webp({ quality: 85 })
          .toFile(path.join(optimizedDir, `${outputName}.webp`));
        
        console.log(`  ✓ Created optimized JPEG and WebP versions`);
      }
      // For other images
      else {
        const ext = path.extname(file).toLowerCase();
        if (ext === '.png') {
          await sharp(inputPath)
            .png({ quality: 85, compressionLevel: 9 })
            .toFile(path.join(optimizedDir, `${outputName}-optimized.png`));
        } else if (ext === '.jpg' || ext === '.jpeg') {
          await sharp(inputPath)
            .jpeg({ quality: 85, progressive: true })
            .toFile(path.join(optimizedDir, `${outputName}-optimized.jpg`));
        }
        console.log(`  ✓ Optimized ${ext} image`);
      }

      // Check new file sizes
      const optimizedFiles = await fs.readdir(optimizedDir);
      const newFiles = optimizedFiles.filter(f => f.startsWith(outputName));
      
      for (const newFile of newFiles) {
        const newStats = await fs.stat(path.join(optimizedDir, newFile));
        const newSizeMB = newStats.size / (1024 * 1024);
        const reduction = ((fileSizeMB - newSizeMB) / fileSizeMB * 100).toFixed(1);
        console.log(`    ${newFile}: ${newSizeMB.toFixed(2)} MB (${reduction}% reduction)`);
      }

    } catch (err) {
      console.error(`  Error processing ${file}:`, err.message);
    }
  }

  console.log('\n✅ Image optimization complete!');
  console.log('Optimized images saved to:', optimizedDir);
}

optimizeImages().catch(console.error);