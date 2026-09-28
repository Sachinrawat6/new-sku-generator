import axios from 'axios';
import {
  GOOGLE_SHEET_BASE_URL,
  GOOGLE_SHEET_ID,
  GOOGLE_SHEET_COORDS_RANGE,
  GOOGLE_SHEET_API_KEY,
} from '../constants/index.js';

export const fetchCoordsDataFromGoogleSheet = async () => {
  const url = `${GOOGLE_SHEET_BASE_URL}/${GOOGLE_SHEET_ID}/values/${GOOGLE_SHEET_COORDS_RANGE}?key=${GOOGLE_SHEET_API_KEY}`;
  const response = await axios.get(url);

  const coords = response.data.values;

  const result = coords
    .slice(1)
    .map((row) => ({
      style: Number(row[0]),
    }))
    .filter((item) => !Number.isNaN(item.style));

  return result;
};
