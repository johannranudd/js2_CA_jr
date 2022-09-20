const baseURL = 'https://nf-api.onrender.com/api/v1/social';

export function getSessionStorage() {
  const sStorage = sessionStorage.getItem('isLoggedIn')
    ? JSON.parse(sessionStorage.getItem('isLoggedIn'))
    : null;
  return sStorage;
}

export function setSessionStorage(isLoggedIn, token) {
  sessionStorage.setItem(
    'isLoggedIn',
    JSON.stringify({
      isLoggedIn: isLoggedIn,
      token: token,
    })
  );
}

export async function displayAllPosts(list, fetchMethod) {
  // const sStorage = getSessionStorage();
  list.innerHTML = '';
  const data = await fetchMethod;
  // 40?_author=true&_comments=true&reactions=true
  // console.log('data in displayPosts', data);
  data.map((post) => {
    const { id, title, body, media, author } = post;

    const listItem = `
    <li>
    <h4>author: ${author.name && author.name}</h4>
    <p>title: ${title}</p>
    <p>body: ${body}</p>
    ${media.length > 10 ? `<img src=${media} alt="test" />` : ''}
    </li>`;
    list.innerHTML += listItem;
  });
}
// `${baseURL}/posts/${searchParams}?_author=true&_comments=true&reactions=true&limit=${limit}`;

function setFetchLimitURL(limit) {
  if (!limit) {
    return;
  } else {
    let limitQuery;
    console.log('limit:::', limit);
    limitQuery = `&limit=${limit}`;
    return limitQuery;
  }
}

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
  // console.log(data);
  return data;
}
// getAllPosts(baseURL);

// `${baseURL}/posts?sort=${sort}&sortOrder=${sortOrder}`,

export async function getSortedPosts(token, sort, sortOrder, limit) {
  const limitQuery = setFetchLimitURL(limit);
  console.log('limitQuery in getSortedPosts():::', limitQuery);
  const res = await fetch(
    `${baseURL}/posts?sort=${sort}&sortOrder=${sortOrder}&_author=true&_comments=true&reactions=true${limitQuery}`,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await res.json();
  console.log(data);
  return data;
}

export function checkIfLoggedIn() {
  const sStorage = getSessionStorage();

  if (!sStorage || !sStorage.isLoggedIn) {
    window.location.href = '../login.html';
  } else {
    console.log('you are already logged in as');
  }
}

export function post() {
  const ss = getSessionStorage();
  fetch(`${baseURL}/posts`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ss.token}`,
    },
    body: JSON.stringify({
      title: 'njbr test_1 title',
      body: 'njbr body',
      tags: ['njbr tag1', 'tag2'],
      media:
        'https://www.awesomealpharetta.com/wp-content/uploads/2020/06/ice_cream_cones_blog.jpg',
    }),
  });
}
// post();

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
    contacts.style.right = `-110%`;
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
  if (e.target.className === 'contacts-btn') {
    if (!contacts.className.includes('show-contacts')) {
      contacts.classList.add('show-contacts');
    } else {
      contacts.classList.remove('show-contacts');
    }
    sidebar.classList.remove('show-sidebar');
  }
  if (e.target.className === 'menu-btn') {
    if (!sidebar.className.includes('show-sidebar')) {
      sidebar.classList.add('show-sidebar');
    } else {
      sidebar.classList.remove('show-sidebar');
    }
    contacts.classList.remove('show-contacts');
  }
  contactsElementPositioning(contacts, mainContainer);
}
