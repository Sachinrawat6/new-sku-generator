import { useEffect, useState } from 'react';

export const useSimpleProductLocalStorage = () => {
  const [localStorageSimpleProducts, setLocalStorageSimpleProducts] = useState([]);

  const getSimpleProduct = () => {
    const stored = localStorage.getItem('simple-products:style-numbers');
    const localStorageStyles = stored ? JSON.parse(stored) : [];
    setLocalStorageSimpleProducts(localStorageStyles);
  };

  useEffect(() => {
    getSimpleProduct();
  }, []);

  return { localStorageSimpleProducts };
};
