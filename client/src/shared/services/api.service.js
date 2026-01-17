/**
 * Shared API Service
 * Base HTTP client for all API requests
 */

const BASE_URL = 'http://localhost:80';

/**
 * Generic HTTP request handler
 */
const request = async (url, options = {}) => {
  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log(errorData,"errorData");
      
      const error = new Error(errorData.message || `HTTP error! status: ${response.status}`);
      error.status = response.status;
      throw error;
    }

    return await response.json();
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
};

/**
 * GET request
 */
export const get = async (url) => {
  return request(url, { method: 'GET' });
};

/**
 * POST request
 */
export const post = async (url, data) => {
  return request(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * PATCH request
 */
export const patch = async (url, data) => {
  return request(url, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

/**
 * DELETE request
 */
export const del = async (url) => {
  return request(url, { method: 'DELETE' });
};

/**
 * Upload form data (multipart/form-data)
 */
export const uploadFormData = async (url, formData) => {
  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
      // Don't set Content-Type for FormData, browser will set it with boundary
    });

    if (!response.ok) {
      const errorData = await response.json();
      const error = new Error(errorData.message || `HTTP error! status: ${response.status}`);
      error.status = response.status;
      throw error;
    }

    return await response.json();
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
};

export default {
  get,
  post, 
  patch,
  del,
  uploadFormData,
};
