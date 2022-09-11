function checkIfLoggedIn() {
  const sStorage = sessionStorage.getItem('isLoggedIn')
    ? JSON.parse(sessionStorage.getItem('isLoggedIn'))
    : null;

  if (!sStorage) {
    // send user to login page
    window.location.href = '../login.html';

    // have a register option
  } else {
    // console.log('you are already logged in as');
  }
}
window.addEventListener('DOMContentLoaded', checkIfLoggedIn);
