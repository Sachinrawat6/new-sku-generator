import { useEffect, useState } from 'react';
import UploadComboProducts from '../components/UploadComboProducts';
import { useComboProducts } from '../hooks/useComboProducts';
import { useComboProductLocalStorage } from '../hooks/useComboProductsLocalStorage';
import MissingComboProducts from '../components/MissingComboSku';

const CreateComboProducts = () => {
  const { loading, error, comboProducts } = useComboProducts();
  const { localStorageComboProducts } = useComboProductLocalStorage();
  const [missingComboProducts, setMissingComboProducts] = useState([]);

  useEffect(() => {
    if (loading || error) return;
    if (!comboProducts || !localStorageComboProducts) return;

    const filtered = comboProducts.filter((s) => !localStorageComboProducts.includes(s.style));
    setMissingComboProducts(filtered);
  }, [comboProducts, localStorageComboProducts, loading, error]);

  console.log('missing combo', missingComboProducts);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-medium mb-4">Missing Combo Products</h1>
      {localStorageComboProducts.length === 0 && <UploadComboProducts />}
      <MissingComboProducts comboProducts={missingComboProducts} />
    </div>
  );
};

export default CreateComboProducts;
