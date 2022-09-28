const baseURL = 'https://nf-api.onrender.com/api/v1/social';
const allPosts = document.querySelector('.all-posts');
const profileComponent = document.querySelector('.profile-component');

import {
  getSessionStorage,
  setSessionStorage,
  checkIfLoggedIn,
  getPosts,
  getUsers,
} from './utils.js';
import { displayAllPosts } from './layout.js';

window.addEventListener('DOMContentLoaded', displayAllPosts(allPosts));

async function displayProfileInfo() {
  profileComponent.innerHTML = '';
  const sStorage = getSessionStorage();
  const data = await getUsers(sStorage.name, 99999);
  console.log(data);
  const { avatar, banner, email, followers, following, name, posts, count } =
    data;
  profileComponent.innerHTML = `
          <div class="banner"></div>
          <div class="profile-image-edit-profile-btn-container">
            <img
              class="profile-image"
              src="${
                avatar
                  ? avatar
                  : 'https://www.pngitem.com/pimgs/m/30-307416_profile-icon-png-image-free-download-searchpng-employee.png'
              }"
              alt="Profile image"
            />
            <button class="edit-profile-btn">Edit profile</button>
          </div>
          <h2 class="username">${name}</h2>
          <div class="follow-statistics-contianer">
            <button class="post-count"><strong>${
              posts.length
            }</strong>Posts</button>
              <button class="following"><strong>${
                following.length
              }</strong>Following</button>
              <button class="followers"><strong>${
                followers.length
              }</strong>Followers</button>
          </div>
    `;
  const bannerContainer = profileComponent.querySelector('.banner');
  bannerContainer.style.backgroundImage = `url(${banner && banner})`;
  if (posts) {
    console.log('has');
    console.log(posts.length);
  } else {
    console.log('no');
  }
  // console.log(followers && followers);
}
displayProfileInfo();
