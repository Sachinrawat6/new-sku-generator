import { useState } from 'react';

const MissingSkuWithCheckedStatus = ({ missing, unchecked }) => {
  const [toggle, setToggle] = useState(false);
  const toggledStyles = (toggle ? unchecked : missing) || [];

  /**
   *  Export Unchecked styles to CSV
   */
  const handleExportUnchecked = () => {
    if (!unchecked || unchecked.length === 0) {
      console.warn('No unchecked styles to export');
      return;
    }

    // CSV headers
    const headers = ['S.No', 'Style Number', 'Status'];

    // CSV rows
    const rows = unchecked.map((item, index) => [
      index + 1,
      item.style,
      item.checked ? 'Checked' : 'Unchecked',
    ]);

    // Build CSV string (with proper escaping)
    const escapeCsv = (value) => {
      const str = String(value ?? '');

      if (/[",\n]/.test(str)) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
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
    link.download = `unchecked-styles-${timestamp}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            Missing Styles with Checked Status
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {toggle
              ? `Showing ${unchecked.length} unchecked styles`
              : `Showing ${missing.length} missing styles`}
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={handleExportUnchecked}
            disabled={!unchecked || unchecked.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            title={
              unchecked?.length > 0
                ? `Export ${unchecked.length} unchecked styles`
                : 'No unchecked styles to export'
            }
          >
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
            Export Unchecked ({unchecked?.length || 0})
          </button>

          {/* Toggle Button */}
          <button
            onClick={() => setToggle((prev) => !prev)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            Show {toggle ? 'Checked' : 'Unchecked'}
          </button>
        </div>
      </div>

      {/* Table */}
      {toggledStyles.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-gray-200">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200">
            <div className="col-span-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              #
            </div>
            <div className="col-span-7 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Style Number
            </div>
            <div className="col-span-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
              Status
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {toggledStyles.map((m, i) => (
              <div
                key={m.style}
                className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors duration-150"
              >
                <div className="col-span-1 text-sm text-gray-400 font-mono">{i + 1}</div>
                <div className="col-span-7 text-sm font-medium text-gray-900">{m.style}</div>
                <div className="col-span-4 flex justify-end">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      m.checked ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {m.checked ? 'Checked' : 'Unchecked'}
                  </span>
                </div>
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

export default MissingSkuWithCheckedStatus;
