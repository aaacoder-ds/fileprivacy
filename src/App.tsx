import React, { useMemo, useState } from 'react';
import Footer from './components/Footer';
import { analyzeFile, type FileAnalysis } from './lib/analyzer';

export default function App() {
  const [analyses, setAnalyses] = useState<FileAnalysis[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const totalSize = useMemo(() => analyses.reduce((sum, a) => sum + a.sizeBytes, 0), [analyses]);

  async function onFilesSelected(files: FileList | null) {
    if (!files || files.length === 0) return;
    setIsAnalyzing(true);
    const results: FileAnalysis[] = [];
    for (const file of Array.from(files)) {
      // eslint-disable-next-line no-await-in-loop
      const res = await analyzeFile(file);
      results.push(res);
    }
    setAnalyses(results);
    setIsAnalyzing(false);
  }

  return (
    <div>
      <header className="bg-white border-b border-gray-200">
        <div className="mx-auto container-narrow px-4 py-6">
          <h1 className="text-2xl font-semibold text-gray-900">File Privacy Inspector</h1>
          <p className="text-gray-600 mt-1">Inspect files for sensitive metadata before you share them.</p>
        </div>
      </header>

      <main className="mx-auto container-narrow px-4">
        <section className="mt-8">
          <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center">
            <p className="mb-4 text-gray-700">Drop files here or choose files to analyze.</p>
            <input
              className="mx-auto block w-full max-w-sm cursor-pointer rounded-md border border-gray-300 bg-gray-50 p-2 text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100"
              type="file"
              multiple
              onChange={(e) => onFilesSelected(e.target.files)}
            />
            {isAnalyzing && <p className="mt-3 text-sm text-gray-500">Analyzing…</p>}
          </div>
        </section>

        {analyses.length > 0 && (
          <section className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Analysis results</h2>
              <p className="text-sm text-gray-600">
                {analyses.length} file(s), total {(totalSize / 1024).toFixed(1)} KB
              </p>
            </div>
            <ul className="mt-4 space-y-4">
              {analyses.map((a) => (
                <li key={a.name} className="rounded-lg border border-gray-200 bg-white p-4">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{a.name}</p>
                      <p className="text-sm text-gray-600">
                        {a.mimeType} — {(a.sizeBytes / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">Last modified: {new Date(a.lastModified).toLocaleString()}</div>
                  </div>

                  {a.exifSummary && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-800">EXIF summary</p>
                      <div className="mt-1 grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {Object.entries(a.exifSummary).map(([k, v]) => (
                          <div key={k} className="rounded bg-gray-50 p-2 text-sm text-gray-700">
                            <span className="font-semibold">{k}:</span> {String(v)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {a.tips.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-800">Privacy tips</p>
                      <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-gray-700">
                        {a.tips.map((t, idx) => (
                          <li key={idx}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-12">
          <div className="rounded-md bg-blue-50 p-4 text-blue-900">
            <p>
              Explore productivity tools at{' '}
              <a className="font-medium underline" href="https://aaacoder.xyz/" target="_blank" rel="noreferrer noopener">
                https://aaacoder.xyz/
              </a>
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}



