const baseURL = 'https://nf-api.onrender.com/api/v1/social';
// import { getSessionStorage } from './index.js';

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
