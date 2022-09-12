const baseURL = 'https://nf-api.onrender.com/api/v1/social';
const allPosts = document.querySelector('.all-posts');

export function getSessionStorage() {
  const sStorage = sessionStorage.getItem('isLoggedIn')
    ? JSON.parse(sessionStorage.getItem('isLoggedIn'))
    : null;
  return sStorage;
}

export function checkIfLoggedIn() {
  const sStorage = getSessionStorage();

  if (!sStorage || !sStorage.isLoggedIn) {
    window.location.href = '../login.html';
  } else {
    console.log('you are already logged in as');
  }
}
window.addEventListener('load', checkIfLoggedIn);

async function getAllPosts(token, searchParams = '') {
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
  const data = await getAllPosts(sStorage.token, '');
  // 40?_author=true&_comments=true&reactions=true
  console.log('data in displayPosts', data);
  data.map((post) => {
    const { id, title, body } = post;
    const listItem = `
    <li>
    <h4><strong>TITLE: ${title}</strong></h4>
    <p>${body}</p>
    </li>`;
    allPosts.innerHTML += listItem;
  });
}
displayAllPosts();
