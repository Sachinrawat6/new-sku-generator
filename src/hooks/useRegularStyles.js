import axios from 'axios';
import { useState } from 'react';
import { STYLEWISE_BASE_URL } from '../constants/index.js';

export const useRegularStyle = () => {
  const [regularStyles, setRegularStyles] = useState([]);
  const [regularStyleLoading, setRegularStyleLoading] = useState(false);
  const [regularStyleError, setRegularStyleError] = useState(null);

  const fetchRegularStyles = async (styles) => {
    setRegularStyleLoading(true);
    setRegularStyleError(null);
    try {
      console.log('Sending styles to API:', styles);
      const response = await axios.post(
        `${STYLEWISE_BASE_URL}/regular-style/upload-styles`,
        styles
      );
      setRegularStyles(response.data?.data);
      return response.data?.data;
    } catch (error) {
      setRegularStyleError(`Failed to fetch regular style error :: ${error.message}`);
      throw error;
    } finally {
      setRegularStyleLoading(false);
    }
  };

  return {
    regularStyleError,
    regularStyleLoading,
    regularStyles,
    fetchRegularStyles,
  };
};
