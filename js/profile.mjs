const baseURL = 'https://nf-api.onrender.com/api/v1/social';
const allPosts = document.querySelector('.all-posts');
const profileComponent = document.querySelector('.profile-component');
const editProfileForm = document.querySelector('.edit-profile-modal');
const newBannerInput = document.querySelector('#new-banner');
const newAvatarInput = document.querySelector('#new-avatar');
const uploadedBanner = document.querySelector('.uploaded-banner');
const uploadedAvatar = document.querySelector('.uploaded-avatar');
const loadMoreBtn = document.querySelector('.load-more-btn');
const profileImagePostComp = document.querySelector(
  '.post-component .profile-image'
);

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

export async function getProfileImage() {
  const user = await getUsers(globalSStorage.name, '');
  profileImagePostComp.src = user.avatar;
}

window.addEventListener('DOMContentLoaded', () => {
  if (globalSStorage) {
    if (globalSStorage.name === globalSStorage.profileDisplayed) {
      displayProfileInfo(globalSStorage.name);
      getProfileImage();
    } else {
      displayProfileInfo(globalSStorage.profileDisplayed);
    }
  }
});

// uploadImageToContainer(container, input);
if (newBannerInput && newAvatarInput && editProfileForm) {
  newBannerInput.addEventListener('keyup', () => {
    setTimeout(() => {
      uploadImageToContainer(uploadedBanner, newBannerInput);
    }, 100);
  });
  newBannerInput.addEventListener('drop', () => {
    setTimeout(() => {
      uploadImageToContainer(uploadedBanner, newBannerInput);
    }, 100);
  });
  newAvatarInput.addEventListener('keyup', () => {
    setTimeout(() => {
      uploadImageToContainer(uploadedAvatar, newAvatarInput);
    }, 100);
  });
  newAvatarInput.addEventListener('drop', () => {
    setTimeout(() => {
      uploadImageToContainer(uploadedAvatar, newAvatarInput);
    }, 100);
  });

  editProfileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const bannerImage = uploadedBanner.querySelector('img');
    const avatarImage = uploadedAvatar.querySelector('img');
    const submitObject = {};
    if (bannerImage) {
      submitObject.banner = bannerImage.src;
    }
    if (avatarImage) {
      submitObject.avatar = avatarImage.src;
    }
    updateProfileInfo(globalSStorage.name, submitObject);

    editProfileForm.classList.remove('show-edit-profile-modal');
  });
}

export async function displayProfileInfo(
  username = globalSStorage.profileDisplayed
) {
  const data = await getUsers(username, '');
  const { avatar, banner, email, followers, following, name, posts, _count } =
    data;

  if (profileComponent) {
    profileComponent.innerHTML = `
          <div class="banner"></div>
          <div class="profile-image-edit-profile-btn-container">
            <img
              class="profile-image"
              src="${avatar}"
              alt="Profile image of ${name}"
              onerror="this.src='https://www.pngitem.com/pimgs/m/30-307416_profile-icon-png-image-free-download-searchpng-employee.png';"
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
  const profileName = e.target.dataset.username;
  setSessionStorage(
    true,
    globalSStorage.token,
    globalSStorage.name,
    globalSStorage.email,
    globalSStorage.avatar,
    profileName
  );
  if (followBtn.textContent === 'Follow +') {
    followProfile(profileName);
  } else {
    unfollowProfile(profileName);
  }
}
