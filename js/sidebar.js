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
  contactsElementPositioning();
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

function contactsElementPositioning() {
  const mainContainerRect = mainContainer.getBoundingClientRect();
  if (contacts.className.includes('show-contact') && window.innerWidth < 1024) {
    contacts.style.right = `2.5%`;
  } else if (
    !contacts.className.includes('show-contact') &&
    window.innerWidth < 1024
  ) {
    contacts.style.right = `-110%`;
  } else if (window.innerWidth > 1024) {
    contacts.style.right = `2.5%`;
  }
  if (mainContainerRect.width >= 1280) {
    contacts.style.right = `${mainContainerRect.left}px`;
  }
}
