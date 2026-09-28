import { useEffect, useState } from 'react';
import { COMBO_STORAGE_KEY } from '../constants/index.js';
export const useComboProductLocalStorage = () => {
  const [localStorageComboProducts, setLocalStorageComboProducts] = useState([]);

  const getComboProduct = () => {
    const stored = localStorage.getItem(COMBO_STORAGE_KEY);
    const localStorageStyles = stored ? JSON.parse(stored) : [];
    setLocalStorageComboProducts(localStorageStyles);
  };

  useEffect(() => {
    getComboProduct();
  }, []);

  return { localStorageComboProducts };
};
