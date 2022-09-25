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
export const allPosts = document.querySelector('.all-posts');
const loadMoreBtn = document.querySelector('.load-more-btn');
// const singlePostFeed = document.querySelectorAll('.single-post-feed');

import {
  adjustForSidebar,
  keepOlyOneSidebarOpen,
  getPosts,
  getSessionStorage,
  getSortedPosts,
} from './utils.js';

let currentOffset = 0;
let limit = 20;
export let isEditingPost = false;
export let editID = '';

export async function displayAllPosts(list, fetchMethod, isAddingToPrevList) {
  if (!isAddingToPrevList) {
    list.innerHTML = '';
  }
  const data = await fetchMethod;
  // console.log('data in displayPosts', data);
  const sStorage = getSessionStorage();
  if (data) {
    data.map((post) => {
      const { id, title, body, media, author } = post;

      const listItem = `
    <li class="single-post-feed" data-id="${id}" data-user="${
        author && author.name
      }">
    <p><strong>${id}</strong></p>
      <div class="edit-delete-btn-container">
      ${
        sStorage.name === author.name
          ? '<button class="delete-post-btn" type="button">delete</button><button class="edit-post-btn" type="button">edit</button>'
          : ''
      }
      </div>
      
      <p class="post-author">author: ${author && author.name}</p>
      <p class="post-title">title: ${title && title}</p>
      <p class="post-body">body: ${body && body}</p>
      <div class="post-image-container">
        ${
          media &&
          `<img class="post-image" src=${media} alt="image posted by ${
            author && author.name
          }" onerror="this.style.display='none'" />`
        }
      </div>
    </li>`;
      list.innerHTML += listItem;
      // eventlisteners
      const deletePostBtns = document.querySelectorAll('.delete-post-btn');
      const editPostBtns = document.querySelectorAll('.edit-post-btn');

      deletePostBtns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const id = Number(e.target.parentNode.parentNode.dataset.id);
          deletePost(id);
        });
      });

      editPostBtns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const id = Number(e.target.parentNode.parentNode.dataset.id);
          editID = id;
          isEditingPost = true;
          // submitPost(id);
          // editPost(id);
          // set isEditingPost to true

          // then go to postForm and check for true or false
          // if true use put method when submiting form
        });
      });
      //
      //
      //
      // single item
      const singlePostFeed = document.querySelectorAll('.single-post-feed');
      singlePostFeed.forEach((post) => {
        post.addEventListener('click', async (e) => {
          const sStorage = getSessionStorage();
          const postID = Number(e.currentTarget.dataset.id);
          const singleData = await getPosts(sStorage.token, postID, '');

          const { id, title, body, media, author } = singleData;
          const singleListItem = `
              <li class="single-post-feed" data-id="${id}" data-user="${
            author && author.name
          }">
           <p><strong>${id}</strong></p>
            <div class="edit-delete-btn-container">
              ${
                sStorage.name === author.name
                  ? '<button class="delete-post-btn" type="button">delete</button><button class="edit-post-btn" type="button">edit</button>'
                  : ''
              }
            </div>
                <p class="post-author">author: ${author && author.name}</p>
                <p class="post-title">title: ${title && title}</p>
                <p class="post-body">body: ${body && body}</p>
                <div class="post-image-container">
                    
                    ${
                      media &&
                      `<img class="post-image" src=${media} alt="image posted by ${
                        author && author.name
                      }" onerror="this.style.display='none'" />`
                    }
                    
                </div>
              </li>`;
          list.innerHTML = singleListItem;
          // ** remove load more btn
          const deletePostBtn = document.querySelector('.delete-post-btn');
          const editPostBtn = document.querySelector('.edit-post-btn');
          deletePostBtn.addEventListener('click', (e) => {
            const id = Number(e.target.parentNode.parentNode.dataset.id);
            deletePost(id);
          });

          editPostBtn.addEventListener('click', () => {
            const id = Number(e.target.parentNode.parentNode.dataset.id);
            editID = id;
            isEditingPost = true;
          });
        });
      });
    });
  }
}
//
//
//
// editPost

//
//
//
//
// deletePost
function deletePost(id) {
  const sStorage = getSessionStorage();
  fetch(`${baseURL}/posts/${id}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${sStorage.token}`,
    },
  }).then((res) => {
    if (res.ok) {
      displayAllPosts(allPosts, getPosts(sStorage.token, '', 20), false);
    }
  });
}

//
//
//
//
// eventListeners

window.addEventListener('DOMContentLoaded', () => {
  const sStorage = getSessionStorage();
  displayAllPosts(allPosts, getPosts(sStorage.token, '', 20), false);
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
      currentOffset = 0;
      displayAllPosts(allPosts, filteredData, false);
    }
  } else {
    //**  display a warning here
  }
});

// > 500

window.addEventListener('resize', () => {
  adjustForSidebar(sidebar, feedAndContactsContaier, contacts, mainContainer);
});
adjustForSidebar(sidebar, feedAndContactsContaier, contacts, mainContainer);
//
//
//
//
// sort by ascending
let isDescending = true;

sortByOldestBtn.addEventListener('click', async () => {
  const sStorage = getSessionStorage();
  currentOffset = 0;
  displayAllPosts(
    allPosts,
    getSortedPosts(sStorage.token, 'created', 'asc', currentOffset, limit),
    false
  );
  isDescending = false;
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
  isDescending = true;
});

//
//
// load more
loadMoreBtn.addEventListener('click', async () => {
  const sStorage = getSessionStorage();
  const data = await getPosts(sStorage.token, '', '');
  if (currentOffset < data.length) {
    currentOffset += 20;
    if (isDescending) {
      displayAllPosts(
        allPosts,
        getSortedPosts(sStorage.token, 'created', 'desc', currentOffset, limit),
        true
      );
    } else {
      displayAllPosts(
        allPosts,
        getSortedPosts(sStorage.token, 'created', 'asc', currentOffset, limit),
        true
      );
    }
  } else {
    console.log('wanring: there are no mote posts lodamore eventlistener');
  }
});

// press post
