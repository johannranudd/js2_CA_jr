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
const sortByOldestBtn = document.querySelector('.oldest');
const sortByNewestBtn = document.querySelector('.newest');
const searchPostsInput = document.querySelector('.search-posts-input');
const allPosts = document.querySelector('.all-posts');
import {
  adjustForSidebar,
  keepOlyOneSidebarOpen,
  getPosts,
  getSessionStorage,
  getSortedPosts,
  displayAllPosts,
} from './utils.js';

// MOBILE
window.addEventListener('DOMContentLoaded', () => {
  const sStorage = getSessionStorage();
  displayAllPosts(allPosts, getPosts(sStorage.token, ''));
});

menuBtn.addEventListener('click', (e) => {
  keepOlyOneSidebarOpen(e, contacts, sidebar, mainContainer);
});
contactBtns.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    keepOlyOneSidebarOpen(e, contacts, sidebar, mainContainer);
    adjustForSidebar(sidebar, feedAndContactsContaier, contacts, mainContainer);
  });
});

// > 500

window.addEventListener('resize', () => {
  adjustForSidebar(sidebar, feedAndContactsContaier, contacts, mainContainer);
});

adjustForSidebar(sidebar, feedAndContactsContaier, contacts, mainContainer);

sortByOldestBtn.addEventListener('click', async () => {
  const sStorage = getSessionStorage();
  displayAllPosts(allPosts, getSortedPosts(sStorage.token, 'created', 'asc'));
});
sortByNewestBtn.addEventListener('click', async () => {
  const sStorage = getSessionStorage();
  displayAllPosts(allPosts, getSortedPosts(sStorage.token, 'created', 'desc'));
});
