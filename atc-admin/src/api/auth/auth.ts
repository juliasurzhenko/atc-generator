// import axios from 'axios';

// const API_URL = 'http://localhost:3000'; // Або свій бекенд

// const apiClient = axios.create({
//   baseURL: API_URL,
// });

// let logoutFunction: (() => void) | null = null;

// export const setLogoutFunction = (logoutFn: () => void) => {
//   logoutFunction = logoutFn;
// };

// apiClient.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       localStorage.removeItem('token');
//       if (logoutFunction) {
//         logoutFunction();
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// export default apiClient;
