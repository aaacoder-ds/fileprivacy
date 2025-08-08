// Lightweight client-side metadata analyzer
// For images: extract EXIF using exifr

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - exifr does not ship TS types by default
import exifr from 'exifr';

export type FileAnalysis = {
  name: string;
  sizeBytes: number;
  mimeType: string;
  lastModified: number;
  exifSummary?: Record<string, unknown>;
  tips: string[];
};

export async function analyzeFile(file: File): Promise<FileAnalysis> {
  const base: FileAnalysis = {
    name: file.name,
    sizeBytes: file.size,
    mimeType: file.type || 'application/octet-stream',
    lastModified: file.lastModified,
    tips: [],
  };

  const tips: string[] = [];

  if (file.type.startsWith('image/')) {
    try {
      const exif = await exifr.parse(file).catch(() => undefined);
      if (exif && typeof exif === 'object') {
        // Select a safe subset of fields to display
        const keys = ['Make', 'Model', 'LensModel', 'DateTimeOriginal', 'Artist', 'Copyright', 'GPSLatitude', 'GPSLongitude'];
        const summary: Record<string, unknown> = {};
        for (const key of keys) {
          if (key in exif) summary[key] = (exif as Record<string, unknown>)[key];
        }
        base.exifSummary = summary;

        if (summary.GPSLatitude || summary.GPSLongitude) {
          tips.push('Image contains GPS coordinates. Consider removing location data before sharing.');
        }
        if (summary.Artist || summary.Copyright) {
          tips.push('Image embeds author/copyright fields. Remove if privacy is a concern.');
        }
      } else {
        tips.push('No EXIF metadata detected or it may already be stripped.');
      }
      tips.push('To remove EXIF, export via screenshot or use tools like exiftool or online EXIF removers.');
    } catch {
      tips.push('Failed to read EXIF metadata. The file might be corrupted or unsupported.');
    }
  } else if (file.type === 'application/pdf') {
    tips.push('PDF files can include author, title, and creation metadata. Use “Print to PDF” or a PDF sanitization tool to remove.');
  } else if (file.type.startsWith('video/') || file.type.startsWith('audio/')) {
    tips.push('Media files may include codec, device, and location metadata. Re-encode via privacy-focused tools to strip.');
  } else if (file.type.startsWith('text/') || file.name.endsWith('.docx') || file.name.endsWith('.xlsx')) {
    tips.push('Documents may contain author names, comments, and change history. Use the application’s Inspect/Remove personal info feature.');
  }

  base.tips = tips;
  return base;
}



