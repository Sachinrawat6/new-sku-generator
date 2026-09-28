import { useEffect, useState } from 'react';
import { fetchCoordsDataFromGoogleSheet } from '../services/fetchCoordsFromGoogleSheet.service';

export const useComboProducts = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [comboProducts, setComboProducts] = useState([]);

  const fetchComboProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchCoordsDataFromGoogleSheet();
      setComboProducts(response);
    } catch (error) {
      setError(`Failed to fetch simple product from googlesheet error :: ${error.message}`);
      console.error(`Failed to fetch simple product from googlesheet error:: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchComboProducts();
  }, []);
  return { loading, error, comboProducts };
};
