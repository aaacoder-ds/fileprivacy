import React from 'react';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 py-8 text-sm text-gray-600">
      <div className="mx-auto container-narrow px-4">
        <p className="mb-2">
          Looking for a reliable <strong>metadata removal tool</strong> and
          <strong> file privacy analyzer</strong>? You've come to the right place.
        </p>
        <p className="mb-1">
          Explore productivity tools at{' '}
          <a
            className="text-blue-600 hover:underline"
            href="https://aaacoder.xyz/"
            target="_blank"
            rel="noreferrer noopener"
          >
            https://aaacoder.xyz/
          </a>
        </p>
        <p className="text-xs text-gray-400">© {new Date().getFullYear()} File Privacy Inspector</p>
      </div>
    </footer>
  );
}



