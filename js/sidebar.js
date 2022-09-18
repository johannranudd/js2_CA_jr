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
import { adjustForSidebar } from './utils.js';

// MOBILE

menuBtn.addEventListener('click', () => {
  // sidebar.classList.toggle('show-sidebar');
  // keepOlyOneSidebarOpen();
});
contactBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    // contacts.classList.toggle('show-contacts');
    keepOlyOneSidebarOpen();
    adjustForSidebar(sidebar, feedAndContactsContaier, contacts, mainContainer);
  });
});

// !test
// function keepOlyOneSidebarOpen() {
//   if (contacts.className.includes('show-contacts')) {
//     contacts.classList.add('show-contacts');
//     sidebar.classList.remove('show-sidebar');
//     console.log('SIDEBAR REMOVED');
//   }
//   if (sidebar.className.includes('show-sidebar')) {
//     sidebar.classList.remove('show-sidebar');
//     contacts.classList.remove('show-contacts');
//     console.log('REMOVE CONTACTS');
//   }
// }
// !test
// > 500

// adjustForSidebar();
window.addEventListener('resize', () => {
  adjustForSidebar(sidebar, feedAndContactsContaier, contacts, mainContainer);
});

adjustForSidebar(sidebar, feedAndContactsContaier, contacts, mainContainer);
