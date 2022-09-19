const baseURL = 'https://nf-api.onrender.com/api/v1/social';
const allPosts = document.querySelector('.all-posts');

import {
  getSessionStorage,
  setSessionStorage,
  checkIfLoggedIn,
  getPosts,
  displayAllPosts,
} from './utils.js';

displayAllPosts(allPosts);