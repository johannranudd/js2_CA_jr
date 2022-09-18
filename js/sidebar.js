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
  sidebar.classList.toggle('show-sidebar');
});
contactBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    contacts.classList.toggle('show-contacts');

    adjustForSidebar(sidebar, feedAndContactsContaier, contacts, mainContainer);
  });
});

// !test
// function keepOlyOneSidebarOpen() {
//   if (contacts.className.includes('show-contacts')) {
//     sidebar.classList.remove('show-sidebar');
//   }
// }
// !test
// > 500

// adjustForSidebar();
window.addEventListener('resize', () => {
  adjustForSidebar(sidebar, feedAndContactsContaier, contacts, mainContainer);
});

adjustForSidebar(sidebar, feedAndContactsContaier, contacts, mainContainer);
