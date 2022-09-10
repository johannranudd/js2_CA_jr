const loginDetails = {
  name: 'Johann_Ranudd',
  email: 'JohRan33976@stud.noroff.no',
  password: 'canBePublic12345@',
};

const baseURL = 'https://nf-api.onrender.com';

async function registerFn(url) {
  fetch(`${url}/api/v1/social/auth/register`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(loginDetails),
  });
}

async function loginFn(url) {
  const res = await fetch(`${url}/api/v1/social/auth/login`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'JohRan33976@stud.noroff.no',
      password: 'canBePublic12345@',
    }),
  });
  const data = await res.json();
  console.log(data.accessToken);
  return data.accessToken;
}

// loginFn(baseURL);

async function getAllPosts(url) {
  const res = await fetch(`${url}/api/v1/social/posts`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTgsIm5hbWUiOiJKb2hhbm5fUmFudWRkIiwiZW1haWwiOiJKb2hSYW4zMzk3NkBzdHVkLm5vcm9mZi5ubyIsImF2YXRhciI6bnVsbCwiYmFubmVyIjpudWxsLCJpYXQiOjE2NjI4MzU1Mzd9.Y-FFBEN-vvEd_2gYGEHX1zwzsI2P85OXkG42WNKWjik`,
    },
  });
  const data = await res.json();
  console.log(data);
}
// getAllPosts(baseURL);
