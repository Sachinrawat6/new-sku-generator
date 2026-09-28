import { useEffect, useState, useCallback } from 'react';
import MissingSkuWithCheckedStatus from '../components/MissingSkuWithCheckedStatus';
import UploadSimpleProducts from '../components/UploadSimpleProducts';
import { useSimpleProductLocalStorage } from '../hooks/useSimpleProductLocalStorage';
import { useSimpleProduct } from '../hooks/useSimpleProducts';
import { useRegularStyle } from '../hooks/useRegularStyles';
import { downloadSingleProduct } from '../utils/downloadSimpleProducts';
import { STORAGE_KEY } from '../constants/index.js';

const CreateSimpleProducts = () => {
  const { error, loading, simpleProducts } = useSimpleProduct();
  const { localStorageSimpleProducts } = useSimpleProductLocalStorage();
  const { regularStyleError, regularStyleLoading, regularStyles, fetchRegularStyles } =
    useRegularStyle();

  const [missing, setMissingStyles] = useState([]);
  const [unchecked, setUncheked] = useState([]);

  const getMissingStyleNumber = useCallback(() => {
    const filteredStyle = simpleProducts.filter(
      (s) => !localStorageSimpleProducts.includes(s.style)
    );
    setMissingStyles(filteredStyle.filter((s) => s.checked === true));
    setUncheked(filteredStyle.filter((s) => s.checked === false));
  }, [simpleProducts, localStorageSimpleProducts]);

  useEffect(() => {
    if (simpleProducts.length > 0) {
      getMissingStyleNumber();
    }
  }, [simpleProducts, getMissingStyleNumber]);

  const handleCreateAndDownload = async () => {
    if (missing.length === 0) {
      console.warn('No missing styles to upload');
      return;
    }

    try {
      // Step 1: Create Simple Products (regular styles fetch)
      const styleNumbers = missing.map((m) => m.style);
      const data = await fetchRegularStyles(styleNumbers);

      if (!data || data.length === 0) {
        console.warn('No data to download');
        return;
      }

      downloadSingleProduct(data, 'Qurvii');
      localStorage.removeItem(STORAGE_KEY);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.error('Create & Download failed:', err);
    }
  };

  if (loading) {
    return <p className="text-center mt-4">loading...</p>;
  }
  if (regularStyleLoading) {
    return <p className="text-center mt-4">generating simple products...</p>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex gap-3 flex-wrap justify-end mb-4">
        {missing.length > 0 && localStorageSimpleProducts.length > 0 && (
          <button
            onClick={handleCreateAndDownload}
            disabled={missing.length === 0 || regularStyleLoading}
            className="bg-green-500 text-white py-3 px-4 rounded-2xl outline-0 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed ease-in duration-75 cursor-pointer"
          >
            {regularStyleLoading ? 'Processing...' : 'Download Simple Products'}
          </button>
        )}
      </div>

      {regularStyleError && <p className="text-red-500 mt-2 text-sm">{regularStyleError}</p>}

      {localStorageSimpleProducts?.length === 0 && <UploadSimpleProducts />}

      <MissingSkuWithCheckedStatus missing={missing} unchecked={unchecked} />
    </div>
  );
};

export default CreateSimpleProducts;
