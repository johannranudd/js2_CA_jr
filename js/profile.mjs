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
  getPosts,
  getUsers,
  uploadImageToContainer,
  updateProfileInfo,
  followProfile,
  unfollowProfile,
} from './utils.mjs';
import { displayAllPosts } from './layout.mjs';

const globalLocalStorage = getLocalStorage();

/**
 * displays users profile image or displays default image.
 * @example
 * ```js
 * // call function
 * getProfileImage()
 * // function will check for users avatar and display as image, if user doesn't have avatar then a default image will be displayed instead.
 * ```
 */
export async function getProfileImage() {
  const user = await getUsers(globalLocalStorage.name, '');

  if (!user.avatar) {
    profileImagePostComp.src = '../images/profile_placeholder.png';
  } else if (user) {
    profileImagePostComp.src = user.avatar;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  if (globalLocalStorage) {
    if (globalLocalStorage.name === globalLocalStorage.profileDisplayed) {
      displayProfileInfo(globalLocalStorage.name);
      getProfileImage();
    } else {
      displayProfileInfo(globalLocalStorage.profileDisplayed);
      getProfileImage();
    }
  }
});

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

  editProfileForm.addEventListener('submit', async (e) => {
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

/**
 * displays a users information in the profile component on profile.html
 * @param {string} username string, default = globalLocalStorage.profileDisplayed, name of user you want to display.
 * @returns {string} string, returns a template litteral string and fills tha page with html
 * @example
 * ```js
 * // call function
 * displayProfileInfo("john_doe")
 * // will populate the profile component with information about john_doe
 * ```
 */
export async function displayProfileInfo(
  username = globalLocalStorage.profileDisplayed
) {
  const data = await getUsers(username, '');
  const { avatar, banner, followers, name, _count } = data;

  if (profileComponent) {
    profileComponent.innerHTML = `
          <div class="banner"></div>
          
          
          <div class="profile-image-edit-follow-btns">
            <img
              class="profile-image"
              src="${avatar}"
              alt="Profile image of ${name}"
              onerror="this.src='../images/profile_placeholder.png';"
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

/**
 * get posts from the selected user displayed in profile component
 * @param {object} e object, event object
 * @example
 * ```js
 * // call function
 * getDisplayedUseersPosts(e)
 * // will populate the feed with only selected users posts, given throught the event object. like: e.target.dataset.username
 * ```
 */
export async function getDisplayedUseersPosts(e) {
  const spinner = document.createElement('div');
  spinner.classList.add('spinner');
  allPosts.innerHTML = '';
  allPosts.appendChild(spinner);
  if (loadMoreBtn) {
    loadMoreBtn.style.display = 'none';
  }
  const data = await getPosts(globalLocalStorage.token, '', 9999);
  const allPostsFromUser = data.filter(
    (item) => item.author.name === e.target.dataset.username
  );
  displayAllPosts(allPosts, allPostsFromUser, false);
}

/**
 * lets user follow or unfollow another user and updates profile component.
 * @param {object} e object, event object 
 * @param {element} followBtn element, button with eventlistener 
 * @example
 * ```js
 * // call function
 * followeUnfollowUpdate(e, followBtn)
 *  const profileName = e.target.dataset.username;
 * if (followBtn.textContent === 'Follow +') {
    followProfile(profileName);
  } 
 * ```
 */
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
