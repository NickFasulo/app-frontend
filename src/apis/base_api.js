import BaseAxios from 'axios';

import { apiBaseUrl } from '../config';
import { logError } from '../utils/logging';

const axios = BaseAxios.create({
  baseURL: apiBaseUrl,
  timeout: 60 * 1000
});
export const callYupApi = async (apiConfig) => {
  const headers = {
    Accept: 'application/json'
  };

  try {
    const response = await axios.request({
      headers,
      ...apiConfig
    });

    return response.data;
  } catch (err) {
    logError('Yup api Error:', err);
    return null;
  }
};

export default callYupApi;
