const feedAndContactsContaier = document.querySelector(
  '.feed-and-contacts-container'
);
const sidebar = document.querySelector('.sidebar');
const menuBtn = document.querySelector('.menu-btn');
const contactsBtn = document.querySelector('.contacts-btn');
const contacts = document.querySelector('.contacts');
const listOfContacts = document.querySelector('.list-of-contacts');
const mobilebar = document.querySelector('.mobilebar');

// MOBILE

menuBtn.addEventListener('click', () => {
  sidebar.classList.toggle('show-sidebar');
});
contactsBtn.addEventListener('click', () => {
  contacts.classList.toggle('show-contacts');
});

// > 500

window.addEventListener('resize', adjustForSidebar);

function adjustForSidebar() {
  const sidebarWidth = sidebar.getBoundingClientRect().width;
  const contactWidth = contacts.getBoundingClientRect().width;
  console.log(contactWidth);
  if (window.innerWidth >= 500) {
    feedAndContactsContaier.style.marginLeft = `${sidebarWidth}px`;
    sidebar.classList.remove('show-sidebar');
    console.log('removing');
  } else if (window.innerWidth > 1024) {
    feedAndContactsContaier.style.marginRight = `${contactWidth}px`;
  } else {
    feedAndContactsContaier.style.marginLeft = `0px`;
    // feedAndContactsContaier.style.marginRight = `0px`;
    // contacts.classList.remove('show-contacts');
    console.log('NOOOOt removing');
  }
}
adjustForSidebar();

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
