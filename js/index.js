const baseURL = 'https://nf-api.onrender.com/api/v1/social';
const allPosts = document.querySelector('.all-posts');
import {
  getSessionStorage,
  setSessionStorage,
  checkIfLoggedIn,
  getPosts,
} from './utils.js';

window.addEventListener('load', checkIfLoggedIn);

// function test() {
//   const sStorage = getSessionStorage();
//   fetch(`${baseURL}/posts/Oliver`, {
//     method: 'GET',
//     headers: {
//       Accept: 'application/json',
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${sStorage.token}`,
//     },
//   })
//     .then((res) => res.json())
//     .then((data) => console.log(data));
// }
// test();
