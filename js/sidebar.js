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
import { adjustForSidebar, contactsElementPositioning } from './utils.js';

// MOBILE

menuBtn.addEventListener('click', (e) => {
  // sidebar.classList.toggle('show-sidebar');
  keepOlyOneSidebarOpen(e);
});
contactBtns.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    // contacts.classList.toggle('show-contacts');
    keepOlyOneSidebarOpen(e);
    adjustForSidebar(sidebar, feedAndContactsContaier, contacts, mainContainer);
  });
});

function keepOlyOneSidebarOpen(e) {
  if (e.target.className === 'contacts-btn') {
    if (!contacts.className.includes('show-contacts')) {
      contacts.classList.add('show-contacts');
    } else {
      contacts.classList.remove('show-contacts');
    }
    sidebar.classList.remove('show-sidebar');
  } else if (e.target.className === 'menu-btn') {
    if (!sidebar.className.includes('show-sidebar')) {
      sidebar.classList.add('show-sidebar');
    } else {
      sidebar.classList.remove('show-sidebar');
    }
    contacts.classList.remove('show-contacts');
  }
  contactsElementPositioning(contacts, mainContainer);
}
// > 500

// adjustForSidebar();
window.addEventListener('resize', () => {
  adjustForSidebar(sidebar, feedAndContactsContaier, contacts, mainContainer);
});

adjustForSidebar(sidebar, feedAndContactsContaier, contacts, mainContainer);
