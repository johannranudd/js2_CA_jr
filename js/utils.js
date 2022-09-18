const baseURL = 'https://nf-api.onrender.com/api/v1/social';

export async function displayAllPosts(list) {
  const sStorage = getSessionStorage();
  const data = await getPosts(sStorage.token, '');
  // 40?_author=true&_comments=true&reactions=true
  // console.log('data in displayPosts', data);
  data.map((post) => {
    const { id, title, body, media } = post;
    const listItem = `
    <li>
    <h4><strong>TITLE: ${title}</strong></h4>
    <p>body: ${body}</p>
    ${media.length > 10 ? `<img src=${media} alt="test" />` : ''}
    </li>`;
    list.innerHTML += listItem;
  });
}

export async function getPosts(token, searchParams = '') {
  const res = await fetch(`${baseURL}/posts/${searchParams}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  return data;
}
// getAllPosts(baseURL);

export function checkIfLoggedIn() {
  const sStorage = getSessionStorage();

  if (!sStorage || !sStorage.isLoggedIn) {
    window.location.href = '../login.html';
  } else {
    console.log('you are already logged in as');
  }
}

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
  if (contacts.className.includes('show-contact') && window.innerWidth < 1024) {
    contacts.style.right = `2.5%`;
  } else if (
    !contacts.className.includes('show-contact') &&
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
