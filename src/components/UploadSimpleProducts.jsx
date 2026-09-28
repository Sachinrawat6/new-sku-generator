import { useState, useRef, useMemo } from 'react';
import Papa from 'papaparse';
import {
  FiUploadCloud,
  FiFileText,
  FiCheckCircle,
  FiAlertCircle,
  FiX,
  FiSave,
  FiTrash2,
} from 'react-icons/fi';

import { STORAGE_KEY } from '../constants/index.js';

const UploadSimpleProducts = () => {
  const [fileName, setFileName] = useState('');
  const [rawCount, setRawCount] = useState(0);
  const [styleNumbers, setStyleNumbers] = useState([]);
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  // ---------- Parse CSV ----------
  const parseFile = (file) => {
    setParsing(true);
    setError(null);
    setSaved(false);
    setFileName(file.name);
    setRawCount(0);
    setStyleNumbers([]);

    Papa.parse(file, {
      header: false, // Manual mapping — avoids FieldMismatch warnings
      skipEmptyLines: 'greedy',
      complete: (results) => {
        try {
          const rows = (results.data || []).filter(
            (r) => Array.isArray(r) && r.some((c) => String(c).trim() !== '')
          );

          if (rows.length < 2) {
            setError('CSV is empty or contains only the header row');
            setParsing(false);
            return;
          }

          // Header row
          const headers = rows[0].map((h) => String(h).trim());

          // Find the "Item SkuCode" column (flexible matching)
          const skuIndex = headers.findIndex((h) =>
            ['Item SkuCode', 'Item SKU Code', 'ItemSkuCode', 'SKU Code', 'SkuCode', 'SKU'].includes(
              h
            )
          );

          if (skuIndex === -1) {
            setError(
              'Column "Item SkuCode" not found in CSV. Headers: ' +
                headers.slice(0, 5).join(', ') +
                '...'
            );
            setParsing(false);
            return;
          }

          // Data rows
          const dataRows = rows.slice(1);
          setRawCount(dataRows.length);

          // Extract unique style numbers as Numbers
          const set = new Set();
          dataRows.forEach((row) => {
            const sku = String(row[skuIndex] ?? '').trim();
            if (!sku) return;

            // "24045-Green-XXS" → "24045"
            const stylePart = sku.split('-')[0]?.trim();
            if (!stylePart) return;

            //  Convert to Number — skip if not a valid number
            const num = Number(stylePart);
            if (!Number.isNaN(num)) set.add(num);
          });

          // Sort ascending numerically
          const sorted = Array.from(set).sort((a, b) => a - b);

          setStyleNumbers(sorted);
          setParsing(false);
        } catch (err) {
          setError(err.message || 'Failed to process CSV');
          setParsing(false);
        }
      },
      error: (err) => {
        setError(err.message || 'Failed to parse CSV');
        setParsing(false);
      },
    });
  };

  // ---------- Drag & Drop ----------
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) parseFile(file);
  };

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (file) parseFile(file);
  };

  // ---------- Save to localStorage ----------
  const handleSave = () => {
    if (!styleNumbers.length) return;
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

      // Merge both arrays, coerce to Number, filter > 12000, then dedupe
      const merged = Array.from(new Set([...existing.map(Number), ...styleNumbers.map(Number)]))
        .filter((n) => !Number.isNaN(n) && n > 12000)
        .sort((a, b) => a - b);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        window.location.reload();
      }, 1000);
    } catch (err) {
      setError('Failed to save to localStorage');
    }
  };
  // ---------- Clear current upload ----------
  const handleReset = () => {
    setFileName('');
    setRawCount(0);
    setStyleNumbers([]);
    setError(null);
    setSaved(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  // ---------- Saved count ----------
  const savedCount = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]').length;
    } catch {
      return 0;
    }
  }, [saved]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Upload Simple Products
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Upload a CSV — unique style numbers will be saved to localStorage
          </p>
        </div>

        {/* Upload Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`cursor-pointer bg-white border-2 border-dashed rounded-lg p-10 text-center transition-colors ${
            isDragging ? 'border-gray-900 bg-gray-50' : 'border-gray-300 hover:border-gray-900'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileInput}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
              <FiUploadCloud className="w-6 h-6 text-gray-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                Click to upload <span className="text-gray-400">or drag & drop</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">CSV file (max 10MB)</p>
            </div>
          </div>
        </div>

        {/* File info bar */}
        {fileName && (
          <div className="mt-4 bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <FiFileText className="w-5 h-5 text-gray-500 shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{fileName}</p>
                <p className="text-xs text-gray-500">
                  {rawCount} rows • {styleNumbers.length} unique styles
                </p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleReset();
              }}
              className="p-1.5 text-gray-400 hover:text-gray-900 rounded-md hover:bg-gray-100"
              aria-label="Remove file"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <FiAlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Parsing */}
        {parsing && (
          <div className="mt-4 flex items-center gap-3 text-sm text-gray-600">
            <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
            Parsing CSV...
          </div>
        )}

        {/* Preview */}
        {styleNumbers.length > 0 && !parsing && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-base font-semibold text-gray-900">Unique Style Numbers</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Extracted from the <span className="font-mono">Item SkuCode</span> column
                </p>
              </div>
              <span className="text-xs font-medium text-gray-700 bg-white border border-gray-200 px-2.5 py-1 rounded-md">
                {styleNumbers.length} styles
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 mt-5">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:border-gray-900 transition-colors"
              >
                <FiTrash2 className="w-4 h-4" />
                Clear
              </button>

              <div className="flex items-center gap-3 mb-4">
                {saved && (
                  <span className="flex items-center gap-1.5 text-sm text-green-700">
                    <FiCheckCircle className="w-4 h-4" />
                    Saved
                  </span>
                )}
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 transition-colors"
                >
                  <FiSave className="w-4 h-4" />
                  Save to Local Storage
                </button>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="max-h-96 overflow-y-auto divide-y divide-gray-100">
                {styleNumbers.map((style) => (
                  <div
                    key={style}
                    className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <p className="text-sm font-semibold text-gray-900 font-mono">{style}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
          </div>
        )}

        {/* Saved info footer */}
        <div className="mt-6 text-xs text-gray-500 text-center">
          {savedCount} style number{savedCount !== 1 ? 's' : ''} already saved in localStorage
        </div>
      </div>
    </div>
  );
};

export default UploadSimpleProducts;
