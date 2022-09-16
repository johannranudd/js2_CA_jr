const baseURL = 'https://nf-api.onrender.com/api/v1/social';
// import { getSessionStorage } from './index.js';

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
