import axios from 'axios';
import {
  GOOGLE_SHEET_BASE_URL,
  GOOGLE_SHEET_ID,
  GOOGLE_SHEET_API_KEY,
  GOOGLE_SHEET_STYLE_NUMBER_RANGE,
} from '../constants/index.js';

export const fetchStyleNumbersFromGoogleSheet = async () => {
  const url = `${GOOGLE_SHEET_BASE_URL}/${GOOGLE_SHEET_ID}/values/${GOOGLE_SHEET_STYLE_NUMBER_RANGE}?key=${GOOGLE_SHEET_API_KEY}`;
  const response = await axios.get(url);

  const styles = response.data.values;

  const result = styles
    .slice(1)
    .map((row) => ({
      style: Number(row[0]),
      checked: String(row[1]).trim().toUpperCase() === 'TRUE',
    }))
    .filter((item) => !Number.isNaN(item.style));

  return result;
};
