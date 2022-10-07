const baseURL = 'https://nf-api.onrender.com/api/v1/social';
import {
  allPosts,
  displayAllPosts,
  displayContacts,
  displaySinglePost,
} from './layout.mjs';
import { displayProfileInfo, getProfileImage } from './profile.mjs';

export function getSessionStorage() {
  const sStorage = sessionStorage.getItem('isLoggedIn')
    ? JSON.parse(sessionStorage.getItem('isLoggedIn'))
    : null;
  return sStorage;
}

export function setSessionStorage(
  isLoggedIn,
  token,
  name,
  email,
  avatar,
  profileDisplayed
) {
  sessionStorage.setItem(
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

export function setFetchLimitURL(limit) {
  if (!limit) {
    return '';
  } else {
    let limitQuery = `&limit=${limit}`;
    return limitQuery;
  }
}

export async function commentOnPost(payload) {
  const sStorage = getSessionStorage();
  const { postID, body, list } = payload;
  console.log(postID);
  try {
    const res = await fetch(`${baseURL}/posts/${postID}/comment`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sStorage.token}`,
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
  // .then((res) => console.log(res));
}

export function uploadImageToContainer(container, input) {
  // onerror="this.style.display='none'"
  if (input) {
    console.log(input.value);
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
  // !base 64
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

export async function getUsers(userName = '', limit = '') {
  const sStorage = getSessionStorage();
  const limitQuery = setFetchLimitURL(limit);
  const res = await fetch(
    `${baseURL}/profiles/${userName}?_posts=true&_following=true&_followers=true${limitQuery}`,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sStorage && sStorage.token}`,
      },
    }
  );
  const data = await res.json();
  return data;
}

// ``${baseURL}/posts/${searchParams}?_author=true&_comments=true&reactions=true${limitQuery}`

export async function getPosts(token, searchParams = '', limit = '') {
  const limitQuery = setFetchLimitURL(limit);
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
}

// `${baseURL}/posts?sort=${sort}&sortOrder=${sortOrder}`,

export async function getSortedPosts(token, sort, sortOrder, offset, limit) {
  const limitQuery = setFetchLimitURL(limit);
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
  // console.log(data);
  return data;
}

export function checkIfLoggedIn() {
  // console.log('checkIfLoggedIn() sStorage::', sStorage);
  const sStorage = getSessionStorage();
  if (!window.location.href.includes('/login.html')) {
    if (window.location.href.includes('/register.html')) {
      return;
    } else if (!sStorage || !sStorage.isLoggedIn) {
      window.location.href = '../login.html';
    } else {
      console.log(`you are already logged in as ${sStorage.name}`);
    }
  }
}

export async function updateProfileInfo(name, req) {
  console.log('name::', name);
  console.log('req::', req);
  const sStorage = getSessionStorage();
  fetch(`${baseURL}/profiles/${name}/media`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sStorage.token}`,
    },
    body: JSON.stringify(req),
  }).then((res) => {
    if (res.ok) {
      displayProfileInfo();
      getProfileImage();
    }
  });
}
export async function followProfile(name) {
  const sStorage = getSessionStorage();
  fetch(`${baseURL}/profiles/${name}/follow`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sStorage.token}`,
    },
    body: JSON.stringify({}),
  }).then((res) => {
    if (res.ok) {
      displayProfileInfo(name);
      displayContacts();
    }
    // console.log(res);
  });
}
export async function unfollowProfile(name) {
  const sStorage = getSessionStorage();
  fetch(`${baseURL}/profiles/${name}/unfollow`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sStorage.token}`,
    },
    body: JSON.stringify({}),
  }).then((res) => {
    if (res.ok) {
      displayProfileInfo(name);
      displayContacts();
    }
  });
}

// react
export async function reactToPost(id, symbol, allPosts) {
  const sStorage = getSessionStorage();
  try {
    const res = await fetch(`${baseURL}/posts/${id}/react/${symbol}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sStorage.token}`,
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

export async function post(req) {
  const sStorage = getSessionStorage();
  try {
    const res = await fetch(`${baseURL}/posts`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sStorage.token}`,
      },
      body: JSON.stringify(req),
    });
    if (res.ok) {
      displayAllPosts(allPosts, getPosts(sStorage.token, '', 20), false);
    }
  } catch (e) {
    console.log(e, 'error in post()');
  }

  // .then((res) => {
  //   console.log(req);
  //   if (res.ok) {
  //     console.log(req);
  //
  //   } else {
  //     console.log(res);
  //   }
  // })
  // .catch((e) => console.log(e, 'error in post'));
}
// post();
export function editPost(id, req) {
  const sStorage = getSessionStorage();
  fetch(`${baseURL}/posts/${id}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sStorage.token}`,
    },
    body: JSON.stringify(req),
  }).then((res) => {
    if (res.ok) {
      displayAllPosts(allPosts, getPosts(sStorage.token, '', 20), false);
    }
  });
  // const data = await res.json();
}

// deletePost
export function deletePost(id) {
  const sStorage = getSessionStorage();
  fetch(`${baseURL}/posts/${id}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${sStorage.token}`,
    },
  }).then((res) => {
    if (res.ok) {
      displayAllPosts(allPosts, getPosts(sStorage.token, '', 20), false);
    }
  });
}

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

export function adjustForContacts(feedAndContactsContaier, contacts) {
  // contacts.className.includes('show-contacts') &&
  const contactWidth = contacts.getBoundingClientRect().width;
  if (window.innerWidth >= 1024) {
    feedAndContactsContaier.style.marginRight = `${contactWidth}px`;
  } else {
    feedAndContactsContaier.style.marginRight = `0px`;
  }
}

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
