const baseURL = 'https://nf-api.onrender.com/api/v1/social';
const loginForm = document.querySelector('.login-form');
const registerForm = document.querySelector('.register-form');

const header = document.querySelector('h1');
import { getLocalStorage, setLocalStorage } from './utils.mjs';

async function registerFn(loginDetails) {
  try {
    const res = await fetch(`${baseURL}/auth/register`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginDetails),
    });
    const data = await res.json();
    if (res.ok) {
      // console.log('res OK', res);
      // console.log('data::', data);
      const { email, password } = loginDetails;
      loginFn(email, password);
      // loginFn()
      // const { accessToken, name, email, avatar } = data;
      // setLocalStorage(true, accessToken, name, email, avatar, name);
      // window.location.href = '../index.html';
    } else {
      console.log('res NOT OK', res);
    }
  } catch (e) {
    console.log(e, 'error happened in registerFn()');
  }
  // .then((res) => res.json())
  // .then((data) => console.log(data));
}
// registerFn(reg);

if (registerForm) {
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInputValue = document.querySelector('#name').value;
    const emailInputValue = document.querySelector('#email').value;
    const passwordInputValue = document.querySelector('#password').value;
    if (nameInputValue && emailInputValue && passwordInputValue.length >= 6) {
      if (
        emailInputValue.includes('@noroff.no') ||
        emailInputValue.includes('@stud.noroff.no')
      ) {
        console.log('does include, continue login');
        const registerDetails = {
          name: nameInputValue, // Required
          email: emailInputValue, // Required
          password: passwordInputValue, // Required
        };
        registerFn(registerDetails);
      }
    } else {
      // **display alarm here
      console.log('Email must include @noroff.no or @stud.noroff.no');
      console.log('Password must be atleast 6 characters');
    }
  });
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = document.querySelector('#email');
    const passwordInput = document.querySelector('#password');
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
        console.log(
          'warning: Email must include @noroff.no or @stud.noroff.no'
        );
      }
    } else {
      // wrongly typed input error here
      console.log('Email must include @noroff.no or @stud.noroff.no');
      console.log('Password must be atleast 6 characters');
    }
  });
}

// function loginForm() {

// }
// loginForm();

async function loginFn(email, password) {
  console.log('starting loginFn()');
  try {
    const res = await fetch(`${baseURL}/auth/login`, {
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
      const { accessToken, name, email, avatar } = data;
      setLocalStorage(true, accessToken, name, email, avatar, name);
      window.location.href = '../index.html';
    }
  } catch (e) {
    console.log(e, 'error happened in loginFn()');
  }
}
