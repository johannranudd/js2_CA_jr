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
const modalBackdrop = document.querySelector('.modal-backdrop');

import {
  getLocalStorage,
  setLocalStorage,
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

const globalLocalStorage = getLocalStorage();
// export let profileDisplayed = globalLocalStorage && globalLocalStorage.name;

export async function getProfileImage() {
  const user = await getUsers(globalLocalStorage.name, '');
  if (user.avatar) {
    profileImagePostComp.src = user.avatar;
  } else {
    profileImagePostComp.src =
      'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png';
  }
}

window.addEventListener('DOMContentLoaded', () => {
  if (globalLocalStorage) {
    if (globalLocalStorage.name === globalLocalStorage.profileDisplayed) {
      displayProfileInfo(globalLocalStorage.name);
      getProfileImage();
    } else {
      displayProfileInfo(globalLocalStorage.profileDisplayed);
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
    updateProfileInfo(globalLocalStorage.name, submitObject);
    uploadedBanner.innerHTML = '';
    uploadedAvatar.innerHTML = '';
    editProfileForm.reset();
    editProfileForm.classList.remove('show-edit-profile-modal');
    modalBackdrop.classList.remove('show-modal-backdrop');
  });
}

export async function displayProfileInfo(
  username = globalLocalStorage.profileDisplayed
) {
  const data = await getUsers(username, '');
  const { avatar, banner, email, followers, following, name, posts, _count } =
    data;

  if (profileComponent) {
    profileComponent.innerHTML = `
          <div class="banner"></div>
          
          
          <div class="profile-image-edit-follow-btns">
            <img
              class="profile-image"
              src="${avatar}"
              alt="Profile image of ${name}"
              onerror="this.src='https://www.pngitem.com/pimgs/m/30-307416_profile-icon-png-image-free-download-searchpng-employee.png';"
            />
            
                    <div class="follow-statistics-contianer">
                              <button class="post-count stat-btn" data-username="${name}">


                              <strong>${_count.posts}</strong>Posts
    
    </button>
                      <div class="following stat-btn"><strong>${
                        _count.following
                      }</strong>Following</div>
                      <div class="followers stat-btn"><strong>${
                        _count.followers
                      }</strong>Followers</div>
                      ${
                        name !== globalLocalStorage.name
                          ? `<button class="follow-btn" data-username="${name}">Follow +</button>`
                          : ''
                      }              
                  </div>
                    
            
          </div>
          <div class="name-and-edit-profile">
              <h2 class="username">${name}</h2>
              ${
                name === globalLocalStorage.name
                  ? '<button class="edit-profile-btn">Edit profile</button>'
                  : ''
              }
          </div>
          
          
    `;
    // profileDisplayed = name;

    setLocalStorage(
      true,
      globalLocalStorage.token,
      globalLocalStorage.name,
      globalLocalStorage.email,
      globalLocalStorage.avatar,
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
        modalBackdrop.classList.add('show-modal-backdrop');
      });
      modalBackdrop.addEventListener('click', (e) => {
        if (e.target.className.includes('modal-backdrop')) {
          editProfileForm.classList.remove('show-edit-profile-modal');
          modalBackdrop.classList.remove('show-modal-backdrop');
        }
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
        (follower) => follower.name === globalLocalStorage.name
      );
      if (foundFollower) {
        if (foundFollower.name === globalLocalStorage.name) {
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
    // loadMoreBtn.remove();
    loadMoreBtn.style.display = 'none';
  }
  const data = await getPosts(globalLocalStorage.token, '', 9999);
  const allPostsFromUser = data.filter(
    (item) => item.author.name === e.target.dataset.username
  );
  displayAllPosts(allPosts, allPostsFromUser, false);
}

function followeUnfollowUpdate(e, followBtn) {
  const profileName = e.target.dataset.username;
  setLocalStorage(
    true,
    globalLocalStorage.token,
    globalLocalStorage.name,
    globalLocalStorage.email,
    globalLocalStorage.avatar,
    profileName
  );
  if (followBtn.textContent === 'Follow +') {
    followProfile(profileName);
  } else {
    unfollowProfile(profileName);
  }
}
