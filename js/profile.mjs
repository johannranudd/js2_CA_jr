const baseURL = 'https://nf-api.onrender.com/api/v1/social';
const allPosts = document.querySelector('.all-posts');
const profileComponent = document.querySelector('.profile-component');
const editProfileForm = document.querySelector('.edit-profile-modal');
const newBannerInput = document.querySelector('#new-banner');
const newAvatarInput = document.querySelector('#new-avatar');
const uploadedBanner = document.querySelector('.uploaded-banner');
const uploadedAvatar = document.querySelector('.uploaded-avatar');

import {
  getSessionStorage,
  setSessionStorage,
  checkIfLoggedIn,
  getPosts,
  getUsers,
  uploadImageToContainer,
  updateProfileInfo,
  followProfile,
} from './utils.mjs';
import { displayAllPosts } from './layout.mjs';
const globalSStorage = getSessionStorage();

window.addEventListener('DOMContentLoaded', () => {
  displayProfileInfo();
  displayAllPosts(allPosts);
});

if (newBannerInput && newAvatarInput && editProfileForm) {
  newBannerInput.addEventListener('change', () => {
    uploadImageToContainer(uploadedBanner, newBannerInput);
  });
  newAvatarInput.addEventListener('change', () => {
    uploadImageToContainer(uploadedAvatar, newAvatarInput);
  });

  editProfileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const bannerImage = uploadedBanner.querySelector('img');
    const avatarImage = uploadedAvatar.querySelector('img');
    const submitObject = {
      banner: bannerImage ? bannerImage.src : '', // Optional
      avatar: avatarImage ? avatarImage.src : '', // Optional
    };
    updateProfileInfo(globalSStorage.name, submitObject);
    editProfileForm.classList.remove('show-edit-profile-modal');
  });
}

if (globalSStorage) {
}
export async function displayProfileInfo(
  username = globalSStorage && globalSStorage.name
) {
  const data = await getUsers(username, 99999);
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
            ${
              name === globalSStorage.name
                ? '<button class="edit-profile-btn">Edit profile</button>'
                : ''
            }
            
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
              ${
                name !== globalSStorage.name
                  ? `<button class="follow-btn" data-username="${name}">Follow +</button>`
                  : ''
              }
              
          </div>
    `;
  const bannerContainer = profileComponent.querySelector('.banner');
  bannerContainer.style.backgroundImage = `url(${banner && banner})`;

  const editProfileBtn = document.querySelector('.edit-profile-btn');
  if (editProfileBtn) {
    editProfileBtn.addEventListener('click', (e) => {
      editProfileForm.classList.add('show-edit-profile-modal');
    });
  }
  const followBtn = document.querySelector('.follow-btn');
  if (followBtn) {
    followBtn.addEventListener('click', (e) => {
      const name = e.target.dataset.username;
      followProfile(name);
    });
  }
}
// function openEditModal() {}
