const baseURL = 'https://nf-api.onrender.com/api/v1/social';
import { allPosts, displayAllPosts } from './layout.js';
import { displayProfileInfo } from './profile.js';

export function getSessionStorage() {
  const sStorage = sessionStorage.getItem('isLoggedIn')
    ? JSON.parse(sessionStorage.getItem('isLoggedIn'))
    : null;
  return sStorage;
}

export function setSessionStorage(isLoggedIn, token, name, email, avatar) {
  sessionStorage.setItem(
    'isLoggedIn',
    JSON.stringify({
      isLoggedIn: isLoggedIn,
      token: token,
      name: name,
      email: email,
      avatar: avatar,
    })
  );
}

function setFetchLimitURL(limit) {
  if (!limit) {
    return '';
  } else {
    let limitQuery = `&limit=${limit}`;
    return limitQuery;
  }
}

export function uploadImageToContainer(container, input) {
  const reader = new FileReader();
  reader.onload = function () {
    const img = new Image();
    img.src = reader.result;
    const alt = document.createAttribute('alt');
    alt.value = 'Your uploaded image';
    img.setAttributeNode(alt);
    container.appendChild(img);
  };
  reader.readAsDataURL(input.files[0]);
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
        Authorization: `Bearer ${sStorage.token}`,
      },
    }
  );
  const data = await res.json();
  return data;
}

// `${baseURL}/posts/${searchParams}?_author=true&_comments=true&reactions=true&limit=${limit}`;

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
  // console.log('limitQuery in getSortedPosts():::', limitQuery);
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
  const sStorage = getSessionStorage();
  // console.log('checkIfLoggedIn() sStorage::', sStorage);
  if (!sStorage || !sStorage.isLoggedIn) {
    window.location.href = '../login.html';
  } else {
    console.log(`you are already logged in as ${sStorage.name}`);
  }
}

export async function updateProfileInfo(name, req) {
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
    }
  });
}

export function post(req) {
  const sStorage = getSessionStorage();
  fetch(`${baseURL}/posts`, {
    method: 'POST',
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
}
// post();
export function editPost(id, req) {
  const sStorage = getSessionStorage();
  console.log(id);
  console.log(req);
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
  if (
    contacts.className.includes('show-contacts') &&
    window.innerWidth < 1024
  ) {
    contacts.style.right = `2.5%`;
  } else if (
    !contacts.className.includes('show-contacts') &&
    window.innerWidth < 1024
  ) {
    contacts.style.right = `-200%`;
  } else if (window.innerWidth > 1024) {
    contacts.style.right = `2.5%`;
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
  if (e.currentTarget.className === 'contacts-btn') {
    if (!contacts.className.includes('show-contacts')) {
      contacts.classList.add('show-contacts');
    } else {
      contacts.classList.remove('show-contacts');
    }
    sidebar.classList.remove('show-sidebar');
  }
  if (e.currentTarget.className === 'menu-btn') {
    if (!sidebar.className.includes('show-sidebar')) {
      sidebar.classList.add('show-sidebar');
    } else {
      sidebar.classList.remove('show-sidebar');
    }
    contacts.classList.remove('show-contacts');
  }
  contactsElementPositioning(contacts, mainContainer);
}
