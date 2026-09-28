import { useState } from 'react';
import { COMBO_STORAGE_KEY } from '../constants';

const MissingComboProducts = ({ comboProducts = [] }) => {
  const [isRedirecting, setIsRedirecting] = useState(false);

  /**
   * Export missing combo styles to CSV
   */
  const handleExportComboStyles = () => {
    if (!comboProducts || comboProducts.length === 0) {
      console.warn('No combo styles to export');
      return;
    }

    // CSV headers + rows
    const headers = ['Coord Style Number'];
    const rows = comboProducts.map((item) => [item.style]);

    // Proper CSV escaping
    const escapeCsv = (value) => {
      const str = String(value ?? '');
      return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
    };

    const csvContent = [
      headers.map(escapeCsv).join(','),
      ...rows.map((row) => row.map(escapeCsv).join(',')),
    ].join('\n');

    // Create blob & trigger download
    const blob = new Blob(['\uFEFF' + csvContent], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().slice(0, 10);

    link.href = url;
    link.download = `combo-styles-${timestamp}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Revoke on next tick so the download has a chance to start
    setTimeout(() => URL.revokeObjectURL(url), 0);

    // Clear only the combo key
    localStorage.removeItem(COMBO_STORAGE_KEY);

    // Show redirecting message, then open new tab after a short delay
    setIsRedirecting(true);
    try {
      setTimeout(() => {
        window.open(
          'https://stylewisev5.netlify.app/create-combo-product',
          '_blank',
          'noopener,noreferrer'
        );
      }, 200);
    } catch (error) {
      console.error('failed to redirect');
    } finally {
      setIsRedirecting(false);
      setTimeout(() => {
        window.location.reload();
      }, 300);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            Missing Combo Products
          </h1>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={handleExportComboStyles}
            disabled={!comboProducts || comboProducts.length === 0 || isRedirecting}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isRedirecting ? (
              <>
                {/* Spinner */}
                <svg
                  className="h-4 w-4 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Redirecting...
              </>
            ) : (
              <>
                {/* Download icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Export Combo Products
              </>
            )}
          </button>
        </div>
      </div>

      {/* Redirecting banner */}
      {isRedirecting && (
        <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-lg bg-emerald-50 border border-emerald-200">
          <svg
            className="h-5 w-5 text-emerald-600 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          <p className="text-sm font-medium text-emerald-800">
            Export complete. Redirecting to Create Combo Product page...
          </p>
        </div>
      )}

      {/* Table */}
      {comboProducts.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-gray-200">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200">
            <div className="col-span-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              #
            </div>
            <div className="col-span-7 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Style Number
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {comboProducts.map((m, i) => (
              <div
                key={m.style}
                className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors duration-150"
              >
                <div className="col-span-1 text-sm text-gray-400 font-mono">{i + 1}</div>
                <div className="col-span-7 text-sm font-medium text-gray-900">{m.style}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-sm text-gray-500">No styles to display</p>
        </div>
      )}
    </div>
  );
};

export default MissingComboProducts;
