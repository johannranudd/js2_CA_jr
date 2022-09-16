const feedAndContactsContaier = document.querySelector(
  '.feed-and-contacts-container'
);
const sidebar = document.querySelector('.sidebar');
const menuBtn = document.querySelector('.menu-btn');

// MOBILE

menuBtn.addEventListener('click', () => {
  sidebar.classList.toggle('show-sidebar');
});

// > 500

window.addEventListener('resize', adjustForSidebar);

function adjustForSidebar() {
  if (window.innerWidth >= 500) {
    const sidebarWidth = sidebar.getBoundingClientRect().width;
    feedAndContactsContaier.style.marginLeft = `${sidebarWidth}px`;
    sidebar.classList.remove('show-sidebar');
    console.log('removing');
  } else {
    feedAndContactsContaier.style.marginLeft = `0px`;
    console.log('NOOOOt removing');
  }
}
adjustForSidebar();
