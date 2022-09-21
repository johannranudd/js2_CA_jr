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
const loadMoreBtn = document.querySelector('.load-more-btn');
import {
  adjustForSidebar,
  keepOlyOneSidebarOpen,
  getPosts,
  getSessionStorage,
  getSortedPosts,
  displayAllPosts,
} from './utils.js';

let currentOffset = 0;
let limit = 20;
// eventListeners

window.addEventListener('DOMContentLoaded', () => {
  const sStorage = getSessionStorage();
  currentOffset = 20;
  displayAllPosts(allPosts, getPosts(sStorage.token, '', currentOffset), false);
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
      // remove load more btn here
      displayAllPosts(allPosts, filteredData, false);
      currentOffset = 0;
    }
  } else {
    displayAllPosts(
      allPosts,
      getPosts(sStorage.token, '', currentOffset),
      false
    );
  }
});

// > 500

window.addEventListener('resize', () => {
  adjustForSidebar(sidebar, feedAndContactsContaier, contacts, mainContainer);
});
adjustForSidebar(sidebar, feedAndContactsContaier, contacts, mainContainer);

// sort by ascending

// let isDescending = true;

sortByOldestBtn.addEventListener('click', async () => {
  const sStorage = getSessionStorage();
  currentOffset = 0;
  displayAllPosts(
    allPosts,
    getSortedPosts(sStorage.token, 'created', 'asc', currentOffset, limit),
    false
  );
});
// sort by descending
sortByNewestBtn.addEventListener('click', async () => {
  const sStorage = getSessionStorage();
  currentOffset = 0;
  displayAllPosts(
    allPosts,
    getSortedPosts(sStorage.token, 'created', 'desc', currentOffset, limit),
    false
  );
});

// load more
loadMoreBtn.addEventListener('click', async () => {
  const sStorage = getSessionStorage();
  const data = await getPosts(sStorage.token, '', '');
  console.log(currentOffset);
  if (currentOffset < data.length) {
    displayAllPosts(
      allPosts,
      getSortedPosts(sStorage.token, 'created', 'desc', currentOffset, limit),
      true
    );
    currentOffset += 20;
  } else {
    console.log('wanring: there are no mote posts lodamore eventlistener');
  }
});
