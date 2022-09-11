const baseURL = 'https://nf-api.onrender.com';

const loginDetails = {
  name: 'Johann_Ranudd',
  email: 'JohRan33976@stud.noroff.no',
  password: 'canBePublic12345@',
};

async function registerFn(loginDetails) {
  fetch(`${baseURL}/api/v1/social/auth/register`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(loginDetails),
  });
  // .then((res) => res.json())
  // .then((data) => console.log(data));
}
// registerFn(loginDetails);

function loginForm() {
  const loginForm = document.querySelector('.login-form');
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('you have submitted');
  });
}
loginForm();

async function loginFn() {
  const res = await fetch(`${baseURL}/api/v1/social/auth/login`, {
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
  //   console.log(data);
  return data;
}

// loginFn();

async function getAllPosts() {
  const res = await fetch(`${baseURL}/api/v1/social/posts`, {
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
