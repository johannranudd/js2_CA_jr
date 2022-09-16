const baseURL = 'https://nf-api.onrender.com/api/v1/social';
const allPosts = document.querySelector('.all-posts');
import { getSessionStorage, setSessionStorage } from './post.js';

export function checkIfLoggedIn() {
  const sStorage = getSessionStorage();

  if (!sStorage || !sStorage.isLoggedIn) {
    window.location.href = '../login.html';
  } else {
    console.log('you are already logged in as');
  }
}
window.addEventListener('load', checkIfLoggedIn);

async function getPosts(token, searchParams = '') {
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

async function displayAllPosts() {
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
    allPosts.innerHTML += listItem;
  });
}
displayAllPosts();

async function changePostById(id) {
  const sStorage = getSessionStorage();
  const res = await fetch(`${baseURL}/posts/${id}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sStorage.token}`,
    },
    body: JSON.stringify({
      title: 'njbr test_3 title',
      body: 'njbr test_body_3',
      tags: ['test2'],
    }),
  });
  // const data = await res.json();
}
// changePostById(57);

async function getUsers(userName = '') {
  const sStorage = getSessionStorage();
  const res = await fetch(
    `${baseURL}/profiles/${userName}?_posts=true&_following=true&_followers=true`,
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

getUsers();
