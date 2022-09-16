const feedAndContactsContaier = document.querySelector(
  '.feed-and-contacts-container'
);
const sidebar = document.querySelector('.sidebar');

window.addEventListener('resize', adjustForSidebar);

function adjustForSidebar() {
  const sidebarWidth = sidebar.getBoundingClientRect().width;
  if (window.innerWidth >= 500) {
    feedAndContactsContaier.style.marginLeft = `${sidebarWidth}px`;
    console.log('removing');
  } else {
    feedAndContactsContaier.style.marginLeft = `0px`;
    console.log('NOOOOt removing');
  }
}
adjustForSidebar();
