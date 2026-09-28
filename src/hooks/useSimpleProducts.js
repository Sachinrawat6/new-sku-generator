import { useEffect, useState } from 'react';
import { fetchStyleNumbersFromGoogleSheet } from '../services/fetchStyleNumbersFromGoogleSheet.service';

export const useSimpleProduct = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [simpleProducts, setSimpleProducts] = useState([]);

  const fetchSimpleProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchStyleNumbersFromGoogleSheet();
      const sortedStyles = response
        .filter((s) => s.style > 12000)
        .sort((a, b) => a.style - b.style);
      setSimpleProducts(sortedStyles);
    } catch (error) {
      setError(`Failed to fetch simple product from googlesheet error :: ${error.message}`);
      console.error(`Failed to fetch simple product from googlesheet error:: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSimpleProduct();
  }, []);
  return { loading, error, simpleProducts };
};
