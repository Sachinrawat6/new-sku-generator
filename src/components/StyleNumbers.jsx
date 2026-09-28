import { useMemo, useState } from 'react';
import { useSimpleProduct } from '../hooks/useSimpleProducts';

const ITEMS_PER_PAGE = 12;

const StyleNumbers = () => {
  const { error, loading, simpleProducts } = useSimpleProduct();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('all'); // all | checked | unchecked

  // ✅ Search & filter applied on ALL data (not just current page)
  const filtered = useMemo(() => {
    if (!simpleProducts) return [];
    const q = search.trim().toLowerCase();

    return simpleProducts.filter((p) => {
      const matchesSearch = q === '' || String(p.style).toLowerCase().includes(q);
      const matchesFilter =
        filter === 'all' ||
        (filter === 'checked' && p.checked) ||
        (filter === 'unchecked' && !p.checked);
      return matchesSearch && matchesFilter;
    });
  }, [simpleProducts, search, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);

  // ✅ Pagination applied AFTER filtering — so search results show correctly
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1); // reset to first page on new search
  };

  const handleFilter = (value) => {
    setFilter(value);
    setPage(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 px-6">
        <div className="w-full max-w-md bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          <p className="font-semibold">Something went wrong</p>
          <p className="text-sm mt-1">{error.message || 'Failed to load data'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Style Numbers</h1>
            <p className="text-sm text-gray-500 mt-1">Manage and browse all style numbers</p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">Total</span>
            <span className="font-semibold text-gray-900 bg-white border border-gray-200 px-3 py-1 rounded-md">
              {simpleProducts?.length ?? 0}
            </span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder="Search by style number..."
                className="w-full pl-10 pr-10 py-2 text-sm border border-gray-200 rounded-md bg-gray-50 focus:bg-white focus:border-gray-900 focus:outline-none transition-colors"
              />
              {search && (
                <button
                  onClick={() => {
                    setSearch('');
                    setPage(1);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900"
                  aria-label="Clear search"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center bg-gray-100 rounded-md p-1">
              {[
                { key: 'all', label: 'All' },
                { key: 'checked', label: 'Checked' },
                { key: 'unchecked', label: 'Unchecked' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => handleFilter(tab.key)}
                  className={`px-4 py-1.5 text-sm font-medium rounded transition-colors ${
                    filter === tab.key
                      ? 'bg-white text-gray-900'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results info */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between text-sm text-gray-500 mb-3 px-1">
            <span>
              Showing{' '}
              <span className="font-medium text-gray-900">
                {(currentPage - 1) * ITEMS_PER_PAGE + 1}
              </span>
              –
              <span className="font-medium text-gray-900">
                {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}
              </span>{' '}
              of <span className="font-medium text-gray-900">{filtered.length}</span>
            </span>
            {search && (
              <span className="text-gray-500">
                for &ldquo;<span className="text-gray-900 font-medium">{search}</span>&rdquo;
              </span>
            )}
          </div>
        )}

        {/* ✅ Flex List (no grid) */}
        {paginated.length > 0 ? (
          <div className="flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden divide-y divide-gray-200">
            {paginated.map((product) => (
              <div
                key={product.style}
                className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <h2 className="text-base font-semibold text-gray-900 truncate">{product.style}</h2>
                <span
                  className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded border ${
                    product.checked
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : 'bg-gray-50 text-gray-600 border-gray-200'
                  }`}
                >
                  {product.checked ? 'Checked' : 'Unchecked'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white border border-dashed border-gray-300 rounded-lg">
            <svg
              className="w-10 h-10 mx-auto text-gray-300 mb-3"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <p className="text-gray-500 text-sm">
              {search || filter !== 'all'
                ? 'No results match your search'
                : 'No style numbers found'}
            </p>
            {(search || filter !== 'all') && (
              <button
                onClick={() => {
                  setSearch('');
                  setFilter('all');
                  setPage(1);
                }}
                className="mt-3 text-sm font-medium text-gray-900 underline underline-offset-2 hover:no-underline"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-md bg-white text-gray-700 hover:border-gray-900 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 transition-colors"
            >
              ← Previous
            </button>

            <div className="hidden sm:flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .map((p, idx, arr) => (
                  <span key={p} className="flex items-center">
                    {idx > 0 && arr[idx - 1] !== p - 1 && (
                      <span className="px-2 text-gray-400">…</span>
                    )}
                    <button
                      onClick={() => setPage(p)}
                      className={`min-w-[36px] h-9 px-3 text-sm font-medium rounded-md border transition-colors ${
                        p === currentPage
                          ? 'bg-gray-900 text-white border-gray-900'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-gray-900'
                      }`}
                    >
                      {p}
                    </button>
                  </span>
                ))}
            </div>

            <span className="sm:hidden text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-md bg-white text-gray-700 hover:border-gray-900 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 transition-colors"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StyleNumbers;
