const baseURL = 'https://nf-api.onrender.com';

function checkIfLoggedIn() {
  const sStorage = sessionStorage.getItem('isLoggedIn')
    ? JSON.parse(sessionStorage.getItem('isLoggedIn'))
    : null;

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
  console.log(data);
}
// getAllPosts(baseURL);
