const baseURL = 'https://nf-api.onrender.com/api/v1/social';
import {
  allPosts,
  displayAllPosts,
  displayContacts,
  displaySinglePost,
  loadMoreBtn,
} from './layout.mjs';
import { displayProfileInfo, getProfileImage } from './profile.mjs';

/**
 * gets local storage
 * @returns {object} object, isLoggedIn, current state of localStorage
 */
export function getLocalStorage() {
  const locStorage = localStorage.getItem('isLoggedIn')
    ? JSON.parse(localStorage.getItem('isLoggedIn'))
    : null;
  return locStorage;
}

/**
 * sets the local stoarage to an object with user information,
 * access token, and helps view other profiles in the profile.html page.
 * @param {boolean} isLoggedIn boolean, check if loged in or not
 * @param {string} token string, JWT access token
 * @param {string} name string, users name
 * @param {string} email string, users email
 * @param {string} avatar string, users avatar
 * @param {string} profileDisplayed string, profile displayed on profile.html page
 */
export function setLocalStorage(
  isLoggedIn,
  token,
  name,
  email,
  avatar,
  profileDisplayed
) {
  localStorage.setItem(
    'isLoggedIn',
    JSON.stringify({
      isLoggedIn: isLoggedIn,
      token: token,
      name: name,
      email: email,
      avatar: avatar,
      profileDisplayed: profileDisplayed,
    })
  );
}

/**
 * used to create a search parameter to fetch limited amounts of data in order to handle loading process.
 * @param {number} limit number, number of objects you want in return
 * @returns {string} string, limitQuery
 * @example
 * ```js
 * setFetchLimitURL(20)
 * // expect return: "&limit=20"
 * ```
 */
export function setFetchLimitURL(limit) {
  if (!limit) {
    return '';
  } else {
    let limitQuery = `&limit=${limit}`;
    return limitQuery;
  }
}

/**
 * Creates a comment on a post.
 * @param {object} payload object, { postID, body, list }
 * @returns {function} function, displaySinglePost(postID, list);
 * @example
 * ```js
 * // variables in pseudocode
 *
 * // const postID = id of post you want to comment on, used in URL.
 * // const body =  your comment, gathered from textarea.value
 * // const list = the <ul> element you want the content to be displayed in
 *
 * // call function like this
 * commentOnPost({ postID, body, list });
 * // function will create a post
 * ```
 */
export async function commentOnPost(payload) {
  const locStorage = getLocalStorage();
  const { postID, body, list } = payload;
  try {
    const res = await fetch(`${baseURL}/posts/${postID}/comment`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${locStorage.token}`,
      },
      body: JSON.stringify({
        body: body, // Required
      }),
    });
    if (res.ok) {
      displaySinglePost(postID, list);
    }
  } catch (e) {
    console.log(e, 'error in commentOnPost()');
  }
}

/**
 * displays an image in a container
 * @param {element} container element, container you want to display image in.
 * @param {element} input element, input you want to grab the value from
 * @example
 * ```js
 * // call function
 * uploadImageToContainer(container, input)
 * // creates and appends an image to container
 * container.innerHTML = `<img class="uploaded-image-before-post" src="${input.value}" alt="your uploaded image"  />`;
 * // also displays wwarning if image has error
 * ```
 */
export function uploadImageToContainer(container, input) {
  if (input) {
    container.innerHTML = `<img class="uploaded-image-before-post" src="${input.value}" alt="your uploaded image"  />`;
    const image = document.querySelector('.uploaded-image-before-post');
    image.addEventListener('error', (e) => {
      image.style.display = 'none';
      container.textContent = 'Image must be a string';
      setTimeout(() => {
        container.textContent = '';
      }, 3000);
    });
  }
  // !file upload
  // const reader = new FileReader();
  // reader.onload = function () {
  //   const img = new Image();
  //   img.src = reader.result;
  //   const alt = document.createAttribute('alt');
  //   alt.value = 'Your uploaded image';
  //   img.setAttributeNode(alt);
  //   container.appendChild(img);
  // };
  // reader.readAsDataURL(input.files[0]);
}

/**
 * gets users from API
 * @param {string} userName string, default = "", name of the user you want in return
 * @param {string} limit string, default = "", how many users you want.
 * @returns {(object | Array)} object or array, data returned if fetch successfull
 * @example
 * ```js
 * // for single user call:
 * getUsers("john_doe", '')
 * // expect one object with user information
 * //
 * // for multiple users call:
 * getUsers("", 34)
 * // expect array of 34 objects with users information
 * ```
 */
export async function getUsers(userName = '', limit = '') {
  const locStorage = getLocalStorage();
  const limitQuery = setFetchLimitURL(limit);
  try {
    const res = await fetch(
      `${baseURL}/profiles/${userName}?_posts=true&_following=true&_followers=true${limitQuery}`,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${locStorage && locStorage.token}`,
        },
      }
    );
    const data = await res.json();
    return data;
  } catch (e) {
    console.log(e, 'error occured in getUsers()');
  }
}

/**
 * get one or more posts
 * @param {string} token string, JWT accessToken
 * @param {number} searchParams number, default = "", id of spesiffic post
 * @param {number} limit number, default = "", limit of posts you want to get
 * @returns {(object | Array)} object or array, data returned if fetch successfull
 * @example
 * ```js
 * // call funciton :
 * getPosts(token, searchParams = '', limit = '')
 * // expect array of all posts / default limit might exist on the API
 * getPosts(token, searchParams = '', 99999)
 * // expect array of up to 99999 posts
 * getPosts(token, 336)
 * //expect object with the id of 336
 * ```
 */
export async function getPosts(token, searchParams = '', limit = '') {
  const limitQuery = setFetchLimitURL(limit);
  try {
    const res = await fetch(
      `${baseURL}/posts/${searchParams}?_author=true&_comments=true&reactions=true${limitQuery}`,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await res.json();
    return data;
  } catch (e) {
    console.log(e, 'error occured in getPosts()');
  }
}

/**
 * get sorted posts
 * @param {string} token string, JWT accessToken
 * @param {string} sort string, what you want to sort by, example: "created"
 * @param {string} sortOrder string, "asc" or "desc"
 * @param {number} offset number, the offset you want to fetch from.
 * @param {number} limit number, limit of posts you want in return.
 * @returns {(object | Array)} object or array, data returned if fetch successfull
 * @example
 * ```js
 * // call function
 * getSortedPosts(token, "created", "asc", 40, 20)
 * // expect array of 20 posts sorted by created in an ascending order with an offset of 40.
 * ```
 */
export async function getSortedPosts(token, sort, sortOrder, offset, limit) {
  loadMoreBtn.style.display = 'block';
  const limitQuery = setFetchLimitURL(limit);
  try {
    const res = await fetch(
      `${baseURL}/posts?sort=${sort}&sortOrder=${sortOrder}&_author=true&_comments=true&reactions=true&offset=${offset}${limitQuery}`,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await res.json();
    return data;
  } catch (e) {
    console.log(e, 'error occured in getSortedPosts()');
  }
}

/**
 * check if useer is loged in, redirect if not.
 * @example
 * ```js
 * // call function
 * checkIfLoggedIn()
 * // checks the window.location and checks if there is an object in localstorage called isLoggedIn, if not true user will be redirected too login.html
 * ```
 */
export function checkIfLoggedIn() {
  const locStorage = getLocalStorage();
  if (!window.location.href.includes('/login.html')) {
    if (window.location.href.includes('/register.html')) {
      return;
    } else if (!locStorage || !locStorage.isLoggedIn) {
      window.location.href = '../login.html';
    } else {
      console.log(`you are already logged in as ${locStorage.name}`);
    }
  }
}

/**
 * get sorted posts
 * method: PUT
 * @param {string} name string, name of the profile you want to update
 * @param {object} req object, request object sent in the body
 * @example
 * ```js
 * // call function
 * updateProfileInfo("john_doe", {avatar: "new_avatar_string", banner: "new_banner_string"});
 *
 * ```
 */
export async function updateProfileInfo(name, req) {
  const locStorage = getLocalStorage();

  fetch(`${baseURL}/profiles/${name}/media`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${locStorage.token}`,
    },
    body: JSON.stringify(req),
  })
    .then((res) => {
      if (res.ok) {
        displayProfileInfo();
        getProfileImage();
      }
    })
    .catch((e) => {
      console.log(e, 'error occured in updateProfileInfo()');
    });
}

/**
 * follow a profile
 * method: PUT
 * @param {string} name string, name of the profile you want to update
 * @example
 * ```js
 * // call function
 * followProfile("john_doe")
 * // user logged in should expect to follow user named "john_doe"
 *
 * ```
 */
export async function followProfile(name) {
  const locStorage = getLocalStorage();
  fetch(`${baseURL}/profiles/${name}/follow`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${locStorage.token}`,
    },
    body: JSON.stringify({}),
  })
    .then((res) => {
      if (res.ok) {
        displayProfileInfo(name);
        displayContacts();
      }
    })
    .catch((e) => {
      console.log(e, 'error occured in followProfile()');
    });
}

/**
 * unfollow a profile
 * method: PUT
 * @param {string} name string, name of the profile you want to update
 * @example
 * ```js
 * // call function
 * unfollowProfile("john_doe")
 * // user logged in should expect to unfollow user named "john_doe"
 *
 * ```
 */
export async function unfollowProfile(name) {
  const locStorage = getLocalStorage();
  fetch(`${baseURL}/profiles/${name}/unfollow`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${locStorage.token}`,
    },
    body: JSON.stringify({}),
  })
    .then((res) => {
      if (res.ok) {
        displayProfileInfo(name);
        displayContacts();
      }
    })
    .catch((e) => {
      console.log(e, 'error occured in unfollowProfile()');
    });
}

/**
 * react to post
 * method: PUT
 * @param {number} id number, id of the post youre reacting to
 * @param {string} symbol string, your reaction to a post (must be an emoji)
 * @param {element} allPosts element, element you want to display the post in
 * @example
 * ```js
 * // call function
 * reactToPost(336, '👍', listElement);
 * // user should expect to react 👍 to post 336 and listElemnt will update to show the results
 * ```
 */
export async function reactToPost(id, symbol, allPosts) {
  const locStorage = getLocalStorage();
  try {
    const res = await fetch(`${baseURL}/posts/${id}/react/${symbol}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${locStorage.token}`,
      },
      body: JSON.stringify({
        symbol: symbol,
        count: 1,
        postId: id,
      }),
    });
    if (res.ok) {
      displaySinglePost(id, allPosts);
    }
  } catch (e) {
    console.log(e, 'error in reactToPost()');
  }
}

/**
 * create a post
 * method: POST
 * @param {object} req object, request object
 * @example
 * ```js
 * // call function
 * const submitObject = {
 * "title": "string",  // Required
 * "body": "string",   // Required
 * "tags": ["string"], // Optional
 * "media": "https://url.com/image.jpg"   // Optional
 * }
 * post(submitObject);
 *
 * ```
 */
export async function post(req) {
  const locStorage = getLocalStorage();
  try {
    const res = await fetch(`${baseURL}/posts`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${locStorage.token}`,
      },
      body: JSON.stringify(req),
    });
    if (res.ok) {
      displayAllPosts(allPosts, getPosts(locStorage.token, '', 20), false);
    }
  } catch (e) {
    console.log(e, 'error occured in post()');
  }
}

/**
 * edit a post
 * method: PUT
 * @param {number} id number, id of the post you want to edit
 * @param {object} req object, new request object to replace old post
 * @example
 * ```js
 * // call function
 * const submitObject = {
 * "title": "string",  // Required
 * "body": "string",   // Required
 * "tags": ["string"], // Optional
 * "media": "https://url.com/image.jpg"   // Optional
 * }
 * editPost(336, submitObject);
 * // expect post with id 336 to be updated
 * ```
 */
export function editPost(id, req) {
  const locStorage = getLocalStorage();
  fetch(`${baseURL}/posts/${id}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${locStorage.token}`,
    },
    body: JSON.stringify(req),
  })
    .then((res) => {
      if (res.ok) {
        displayAllPosts(allPosts, getPosts(locStorage.token, '', 20), false);
      }
    })
    .catch((e) => {
      console.log(e, 'error occured in editPost()');
    });
}

/**
 * delete a post
 * method: DELETE
 * @param {number} id number, id of the post you want to edit
 * @example
 * ```js
 * // call function
 * deletePost(57);
 * // expect post with id 57 to be deleted
 * ```
 */
export function deletePost(id) {
  const locStorage = getLocalStorage();
  fetch(`${baseURL}/posts/${id}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${locStorage.token}`,
    },
  })
    .then((res) => {
      if (res.ok) {
        displayAllPosts(allPosts, getPosts(locStorage.token, '', 20), false);
      }
    })
    .catch((e) => {
      console.log(e, 'error occured in deletePost()');
    });
}

/**
 * positions contacts element on page
 * @param {element} contacts element, list of contacts in app.
 * @param {element} mainContainer  element, widest container in app
 * @example
 * ```js
 * // call function
 * contactsElementPositioning(contacts, mainContainer)
 * // contacts will now be positioned relative to mainContainer
 * ```
 */
export function contactsElementPositioning(contacts, mainContainer) {
  const mainContainerRect = mainContainer.getBoundingClientRect();

  if (window.innerWidth >= 1024) {
    contacts.style.right = `0%`;
  }

  if (
    contacts.className.includes('show-contacts') &&
    window.innerWidth < 1024
  ) {
    contacts.style.right = `0%`;
  } else if (
    !contacts.className.includes('show-contacts') &&
    window.innerWidth < 1024
  ) {
    contacts.style.right = `-200%`;
  }

  if (mainContainerRect.width >= 1280) {
    contacts.style.right = `${mainContainerRect.left}px`;
  }
}

/**
 * makes room for contacts element
 * @param {element} feedAndContactsContaier  element, element that contains both feed component and contacts component
 * @param {element} contacts element, list of contacts in app.
 * @example
 * ```js
 * // call function
 * adjustForContacts(feedAndContactsContaier, contacts)
 * // feedAndContactsContaier will now have margin right equal to the width of contacts element
 * ```
 */
export function adjustForContacts(feedAndContactsContaier, contacts) {
  // contacts.className.includes('show-contacts') &&
  const contactWidth = contacts.getBoundingClientRect().width;
  if (window.innerWidth >= 1024) {
    feedAndContactsContaier.style.marginRight = `${contactWidth}px`;
  } else {
    feedAndContactsContaier.style.marginRight = `0px`;
  }
}

/**
 * adjusts feed content to have margin right equal to the width of sidebar if width is greater than 500
 * @param {element} sidebar element, sidebar element.
 * @param {element} feedAndContactsContaier element, element that contains both feed component and contacts component
 * @param {element} contacts element, list of contacts in app.
 * @param {element} mainContainer  element, widest container in app
 * @example
 * ```js
 * // call function
 * adjustForSidebar(
  sidebar,
  feedAndContactsContaier,
  contacts,
  mainContainer
)
 * // adjusts feed content to have margin right equal to the width of sidebar if width is greater than 500
 * ```
 */
export function adjustForSidebar(
  sidebar,
  feedAndContactsContaier,
  contacts,
  mainContainer
) {
  const sidebarWidth = sidebar.getBoundingClientRect().width;

  if (window.innerWidth >= 500) {
    feedAndContactsContaier.style.marginLeft = `${sidebarWidth}px`;
    sidebar.classList.remove('show-sidebar');
  } else {
    feedAndContactsContaier.style.marginLeft = `0px`;
  }
  adjustForContacts(feedAndContactsContaier, contacts);
  contactsElementPositioning(contacts, mainContainer);
}

/**
 * keeps only one sidebar open at the time
 * @param {element} e element, sidebar element.
 * @param {element} contacts element, list of contacts in app.
 * @param {element} sidebar element, sidebar element.
 * @param {element} mainContainer  element, widest container in app
 * @example
 * ```js
 * // call function
 * keepOlyOneSidebarOpen(e, contacts, sidebar, mainContainer)
 * // when opening a sidebar, this function makes sure to close the other.
 * ```
 */
export function keepOlyOneSidebarOpen(e, contacts, sidebar, mainContainer) {
  if (e.currentTarget.className.includes('contacts-btn')) {
    if (!contacts.className.includes('show-contacts')) {
      contacts.classList.add('show-contacts');
    } else {
      contacts.classList.remove('show-contacts');
    }
    sidebar.classList.remove('show-sidebar');
  }
  if (e.currentTarget.className.includes('menu-btn')) {
    if (!sidebar.className.includes('show-sidebar')) {
      sidebar.classList.add('show-sidebar');
    } else {
      sidebar.classList.remove('show-sidebar');
    }
    contacts.classList.remove('show-contacts');
  }
  contactsElementPositioning(contacts, mainContainer);
}
