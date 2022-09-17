const feedAndContactsContaier = document.querySelector(
  '.feed-and-contacts-container'
);
const sidebar = document.querySelector('.sidebar');
const menuBtn = document.querySelector('.menu-btn');
const contactBtns = document.querySelectorAll('.contacts-btn');
const contacts = document.querySelector('.contacts');
const listOfContacts = document.querySelector('.list-of-contacts');
const mobilebar = document.querySelector('.mobilebar');
const mainContainer = document.querySelector('.main-container');

// MOBILE

menuBtn.addEventListener('click', () => {
  sidebar.classList.toggle('show-sidebar');
});
contactBtns.forEach((btn) => {
  // if (window.innerWidth < 1024) {
  // }
  btn.addEventListener('click', () => {
    contacts.classList.toggle('show-contacts');
    adjustForSidebar();
  });
});

// > 500

window.addEventListener('resize', adjustForSidebar);

function adjustForSidebar() {
  const sidebarWidth = sidebar.getBoundingClientRect().width;

  if (window.innerWidth >= 500) {
    feedAndContactsContaier.style.marginLeft = `${sidebarWidth}px`;
    sidebar.classList.remove('show-sidebar');
  } else {
    feedAndContactsContaier.style.marginLeft = `0px`;
  }
  adjustForContacts();
  // !test
  // const mainContainerRect = mainContainer.getBoundingClientRect();
  // console.log(mainContainerRect.width);
  // if (mainContainerRect.width >= 1280){

  // }
  // !test
}
adjustForSidebar();

function adjustForContacts() {
  // contacts.className.includes('show-contacts') &&
  const contactWidth = contacts.getBoundingClientRect().width;
  if (window.innerWidth >= 1024) {
    feedAndContactsContaier.style.marginRight = `${contactWidth}px`;
  } else {
    feedAndContactsContaier.style.marginRight = `0px`;
  }
}

// let lastScroll = 0;
// window.addEventListener('scroll', (e) => {
//   const listRect = contacts.getBoundingClientRect();
//   const mobilebarHeight = mobilebar.getBoundingClientRect().height;

//   if (window.pageYOffset > lastScroll) {
//     console.log('down');
//     if (listRect.bottom > window.pageYOffset * 2) {
//     } else {
//       contacts.style.position = 'fixed';
//       contacts.style.bottom = `${mobilebarHeight}px`;
//     }
//     lastScroll = window.pageYOffset;
//   } else if (window.pageYOffset < lastScroll) {
//     if (
//       listRect.height > window.pageYOffset &&
//       contacts.className.includes('show-contacts')
//     ) {
//       // console.log('erdgrf');
//     }
//     lastScroll = window.pageYOffset;
//   }
// });
