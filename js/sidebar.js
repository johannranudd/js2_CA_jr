const feedAndContactsContaier = document.querySelector(
  '.feed-and-contacts-container'
);
const sidebar = document.querySelector('.sidebar');

window.addEventListener('resize', adjustForSidebar);

function adjustForSidebar() {
  const sidebarWidth = sidebar.getBoundingClientRect().width;
  feedAndContactsContaier.style.marginLeft = `${sidebarWidth}px`;
}
adjustForSidebar();
