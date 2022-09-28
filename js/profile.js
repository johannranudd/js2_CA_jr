const baseURL = 'https://nf-api.onrender.com/api/v1/social';
const allPosts = document.querySelector('.all-posts');

import {
  getSessionStorage,
  setSessionStorage,
  checkIfLoggedIn,
  getPosts,
  getUsers,
} from './utils.js';
import { displayAllPosts } from './layout.js';

displayAllPosts(allPosts);

async function displayProfileInfo() {
  const sStorage = getSessionStorage();
  const data = await getUsers(sStorage.name, 99999);
  console.log(data);
  const { avatar, banner, email, followers, following, name, posts, count } =
    data;
}
displayProfileInfo();
