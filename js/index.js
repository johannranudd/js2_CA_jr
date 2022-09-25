const baseURL = 'https://nf-api.onrender.com/api/v1/social';
const allPosts = document.querySelector('.all-posts');
import {
  getSessionStorage,
  setSessionStorage,
  checkIfLoggedIn,
  getPosts,
} from './utils.js';

window.addEventListener('load', checkIfLoggedIn);

async function getUsers(userName = '') {
  const sStorage = getSessionStorage();
  const res = await fetch(
    `${baseURL}/profiles/${userName}?_posts=true&_following=true&_followers=true`,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sStorage.token}`,
      },
    }
  );
  const data = await res.json();
  return data;
}

// getUsers();
