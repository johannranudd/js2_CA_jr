const baseURL = 'https://nf-api.onrender.com';
const allPosts = document.querySelector('.all-posts');

function checkIfLoggedIn() {
  const sStorage = getSessionStorage();

  if (!sStorage || !sStorage.isLoggedIn) {
    window.location.href = '../login.html';
  } else {
    console.log('you are already logged in as');
  }
}
window.addEventListener('DOMContentLoaded', checkIfLoggedIn);

async function getAllPosts(token) {
  const res = await fetch(`${baseURL}/api/v1/social/posts`, {
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

async function displayPosts() {
  const sStorage = getSessionStorage();
  const data = await getAllPosts(sStorage.token);
  console.log('data in displayPosts', data);
  const list = data.map((post) => {
    const { id, title, body } = post;
    const listItem = `
    <li>
    <h4><strong>TITLE: ${title}</strong></h4>
    <p>${body}</p>
    </li>`;
    allPosts.innerHTML += listItem;
  });
}
displayPosts();

function getSessionStorage() {
  const sStorage = sessionStorage.getItem('isLoggedIn')
    ? JSON.parse(sessionStorage.getItem('isLoggedIn'))
    : null;
  return sStorage;
}
