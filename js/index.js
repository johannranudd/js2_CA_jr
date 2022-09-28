const baseURL = 'https://nf-api.onrender.com/api/v1/social';
const allPosts = document.querySelector('.all-posts');
import {
  getSessionStorage,
  setSessionStorage,
  checkIfLoggedIn,
  getPosts,
} from './utils.js';

window.addEventListener('load', checkIfLoggedIn);
