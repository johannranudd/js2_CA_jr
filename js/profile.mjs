const baseURL = 'https://nf-api.onrender.com/api/v1/social';
const allPosts = document.querySelector('.all-posts');
const profileComponent = document.querySelector('.profile-component');
const editProfileForm = document.querySelector('.edit-profile-modal');
const newBannerInput = document.querySelector('#new-banner');
const newAvatarInput = document.querySelector('#new-avatar');
const uploadedBanner = document.querySelector('.uploaded-banner');
const uploadedAvatar = document.querySelector('.uploaded-avatar');
const loadMoreBtn = document.querySelector('.load-more-btn');
const profileLink = document.querySelector('.profile-link');

import {
  getSessionStorage,
  setSessionStorage,
  checkIfLoggedIn,
  getPosts,
  getUsers,
  uploadImageToContainer,
  updateProfileInfo,
  followProfile,
  unfollowProfile,
  setFetchLimitURL,
} from './utils.mjs';
import { displayAllPosts } from './layout.mjs';
const globalSStorage = getSessionStorage();
// export let profileDisplayed = globalSStorage && globalSStorage.name;

// window.onbeforeunload = function () {
//   setSessionStorage(
//     true,
//     globalSStorage.token,
//     globalSStorage.name,
//     globalSStorage.email,
//     globalSStorage.avatar,
//     globalSStorage.name
//   );
// };

window.addEventListener('DOMContentLoaded', () => {
  if (globalSStorage) {
    if (globalSStorage.name === globalSStorage.profileDisplayed) {
      displayProfileInfo(globalSStorage.name);
    } else {
      displayProfileInfo(globalSStorage.profileDisplayed);
    }
  }
  // displayAllPosts(allPosts);
  // displayAllPosts(
  //   allPosts,
  //   getPosts(globalSStorage.token, profileDisplayed, 9999),
  //   false
  // );
  // getPosts(token, (searchParams = ''), (limit = ''));
});

if (profileLink) {
  profileLink.addEventListener('click', () => {
    setSessionStorage(
      true,
      globalSStorage.token,
      globalSStorage.name,
      globalSStorage.email,
      globalSStorage.avatar,
      globalSStorage.name
    );
  });
}

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

export async function displayProfileInfo(
  username = globalSStorage.profileDisplayed
) {
  const data = await getUsers(username, 99999);
  const { avatar, banner, email, followers, following, name, posts, _count } =
    data;
  if (profileComponent) {
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
            <button class="post-count" data-username="${name}"><strong>${
      _count.posts
    }</strong>Posts</button>
              <button class="following"><strong>${
                _count.following
              }</strong>Following</button>
              <button class="followers"><strong>${
                _count.followers
              }</strong>Followers</button>
              ${
                name !== globalSStorage.name
                  ? `<button class="follow-btn" data-username="${name}">Follow +</button>`
                  : ''
              }              
          </div>
    `;
    // profileDisplayed = name;
    setSessionStorage(
      true,
      globalSStorage.token,
      globalSStorage.name,
      globalSStorage.email,
      globalSStorage.avatar,
      name
    );
    // banner
    const bannerContainer = profileComponent.querySelector('.banner');
    bannerContainer.style.backgroundImage = `url(${banner && banner})`;

    // edit button
    const editProfileBtn = document.querySelector('.edit-profile-btn');
    if (editProfileBtn) {
      editProfileBtn.addEventListener('click', (e) => {
        editProfileForm.classList.add('show-edit-profile-modal');
      });
    }

    // load Posts
    const viewPostsBtn = document.querySelector('.post-count');
    viewPostsBtn.addEventListener('click', getDisplayedUseersPosts);

    // follow / unfollow
    const followBtn = document.querySelector('.follow-btn');
    if (followBtn) {
      // followeUnfollowUpdate(followBtn, followers);
      const foundFollower = followers.find(
        (follower) => follower.name === globalSStorage.name
      );
      if (foundFollower) {
        if (foundFollower.name === globalSStorage.name) {
          followBtn.textContent = 'Unfollow -';
        }
      }
      followBtn.addEventListener('click', (e) => {
        followeUnfollowUpdate(e, followBtn);
      });
    }
  }
}

export async function getDisplayedUseersPosts(e) {
  const spinner = document.createElement('div');
  spinner.classList.add('spinner');
  allPosts.innerHTML = '';
  allPosts.appendChild(spinner);
  const loadMoreBtn = document.querySelector('.load-more-btn');
  if (loadMoreBtn) {
    loadMoreBtn.remove();
  }
  const data = await getPosts(globalSStorage.token, '', 9999);
  const allPostsFromUser = data.filter(
    (item) => item.author.name === e.target.dataset.username
  );
  displayAllPosts(allPosts, allPostsFromUser, false);
}

function followeUnfollowUpdate(e, followBtn) {
  const name = e.target.dataset.username;

  if (followBtn.textContent === 'Follow +') {
    // console.log('follow');
    // profileDisplayed = name;
    setSessionStorage(
      true,
      globalSStorage.token,
      globalSStorage.name,
      globalSStorage.email,
      globalSStorage.avatar,
      name
    );
    followProfile(name);
    displayProfileInfo(name);

    // console.log(name);
  } else {
    // console.log('unfollow');
    // profileDisplayed = name;
    setSessionStorage(
      true,
      globalSStorage.token,
      globalSStorage.name,
      globalSStorage.email,
      globalSStorage.avatar,
      name
    );
    unfollowProfile(name);
    displayProfileInfo(name);
    // console.log(name);
  }
}
