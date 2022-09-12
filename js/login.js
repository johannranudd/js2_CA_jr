const baseURL = 'https://nf-api.onrender.com';
const loginForm = document.querySelector('.login-form');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
const header = document.querySelector('h1');

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

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const emailValue = emailInput.value;
  const passwordValue = passwordInput.value;

  if (emailValue && passwordValue.length >= 6) {
    if (
      emailValue.includes('@noroff.no') ||
      emailValue.includes('@stud.noroff.no')
    ) {
      // success
      console.log('does include, continue login');
      loginFn(emailValue, passwordValue);
    } else {
      // missing @noroff.no or @stud.noroff.no
      console.log('warning: Email must include @noroff.no or @stud.noroff.no');
    }
  } else {
    // wrongly typed input error here
    console.log('Email must include @noroff.no or @stud.noroff.no');
    console.log('Password must be atleast 6 characters');
  }
});

// function loginForm() {

// }
// loginForm();

async function loginFn(email, password) {
  try {
    const res = await fetch(`${baseURL}/api/v1/social/auth/login`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
    const data = await res.json();

    if (res.ok) {
      setSessionStorage(true, data.accessToken);
      window.location.href = '/index.html';
    } else {
      setSessionStorage(false, null);
    }

    return data;
  } catch (e) {
    console.log(e, 'error happened in loginFn()');
  }
}

function setSessionStorage(isLoggedIn, token) {
  sessionStorage.setItem(
    'isLoggedIn',
    JSON.stringify({
      isLoggedIn: isLoggedIn,
      token: token,
    })
  );
}
