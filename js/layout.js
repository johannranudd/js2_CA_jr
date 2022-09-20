const feedAndContactsContaier = document.querySelector(
  '.feed-and-contacts-container'
);
const baseURL = 'https://nf-api.onrender.com/api/v1/social';

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
const searchBtn = document.querySelector('.search-btn');
const searchFormPosts = document.querySelector('.search-form-posts');
const allPosts = document.querySelector('.all-posts');
import {
  adjustForSidebar,
  keepOlyOneSidebarOpen,
  getPosts,
  getSessionStorage,
  getSortedPosts,
  displayAllPosts,
} from './utils.js';

// eventListeners

window.addEventListener('DOMContentLoaded', () => {
  const sStorage = getSessionStorage();
  displayAllPosts(allPosts, getPosts(sStorage.token, '', 20));
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

searchFormPosts.addEventListener('submit', async (e) => {
  e.preventDefault();
  const sStorage = getSessionStorage();
  const searchValue = searchPostsInput.value;
  if (searchValue) {
    const data = await getPosts(sStorage.token, '');
    const filteredData = data.filter((item) => {
      if (
        item.title.includes(searchValue) ||
        item.body.includes(searchValue) ||
        item.author.name.includes(searchValue)
      ) {
        return item;
      }
    });
    if (filteredData.length > 0) {
      displayAllPosts(allPosts, filteredData);
    }
  } else {
    displayAllPosts(allPosts, getPosts(sStorage.token, '', 20));
  }
});

// async function searchFunction(token, searchValue) {

//   const res = await fetch(`${baseURL}/posts`, {
//     headers: {
//       Accept: 'application/json',
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${token}`,
//     },
//   });
//   const data = await res.json();
//   console.log(data);
//   const filteredData = data.filter((item) => {
//     return item.title === searchValue;
//   });

// }
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
