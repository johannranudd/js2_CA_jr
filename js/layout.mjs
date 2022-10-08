const feedAndContactsContaier = document.querySelector(
  '.feed-and-contacts-container'
);
const baseURL = 'https://nf-api.onrender.com/api/v1/social';

const sidebar = document.querySelector('.sidebar');
const menuBtn = document.querySelector('.menu-btn');
const contactBtns = document.querySelectorAll('.contacts-btn');
const contacts = document.querySelector('.contacts');
const listOfContacts = document.querySelector('.list-of-contacts');
const mainContainer = document.querySelector('.main-container');
const sortByOldestBtn = document.querySelector('.oldest');
const sortByNewestBtn = document.querySelector('.newest');
const searchPostsInput = document.querySelector('.search-posts-input');
const searchFormPosts = document.querySelector('.search-form-posts');
export const allPosts = document.querySelector('.all-posts');
const loadMoreBtn = document.querySelector('.load-more-btn');
const postTitleInput = document.querySelector('.post-title-input');
const submitPostBtn = document.querySelector('.submit-post-btn');
const homeComponentHeading = document.querySelector('.home-component h4');
const profileLink = document.querySelector('.profile-link');
const logoutBtn = document.querySelector('.logout');

import {
  checkIfLoggedIn,
  adjustForSidebar,
  keepOlyOneSidebarOpen,
  getPosts,
  getSessionStorage,
  getSortedPosts,
  deletePost,
  getUsers,
  setSessionStorage,
  commentOnPost,
  reactToPost,
} from './utils.mjs';

import { displayProfileInfo } from './profile.mjs';

let currentOffset = 0;
let limit = 20;
export let isEditingPost = false;
export let editID = '';

const globalSStorage = getSessionStorage();

window.addEventListener('load', checkIfLoggedIn);

/**
 * displays a users information
 */
export async function displayContacts() {
  listOfContacts.innerHTML = '';
  const user = await getUsers(globalSStorage.name, '');
  if (user) {
    user.following.map((item) => {
      const { avatar, name } = item;
      listOfContacts.innerHTML += `<li class="contact-list-item hoverAnimation" data-username="${name}">
        <img class="profile-image-contacts" src="${avatar}" src="${avatar}"
                alt="Profile image ${name}"
                onerror="this.src='https://www.pngitem.com/pimgs/m/30-307416_profile-icon-png-image-free-download-searchpng-employee.png';" />
        <p>${name}</p>
      </li>`;
      const contactsListItem = document.querySelectorAll('.contact-list-item');
      // console.log(contactsListItem);
      contactsListItem.forEach((contact) => {
        contact.addEventListener('click', (e) => {
          refreshContactsAndProfile(e);
        });
      });
    });
  } else {
    console.log('no user');
  }
}

function refreshContactsAndProfile(e) {
  const profileName = e.currentTarget.dataset.username;
  contacts.classList.remove('show-contacts');
  adjustForSidebar(sidebar, feedAndContactsContaier, contacts, mainContainer);
  setSessionStorage(
    true,
    globalSStorage.token,
    globalSStorage.name,
    globalSStorage.email,
    globalSStorage.avatar,
    profileName
  );
  if (window.location.href.includes('profile.html')) {
    displayProfileInfo(profileName);
  } else {
    window.location.href = `../profile.html`;
  }
}

if (globalSStorage) {
  window.addEventListener('DOMContentLoaded', () => {
    const sStorage = getSessionStorage();
    displayAllPosts(allPosts, getPosts(sStorage.token, '', 20), false);
    adjustForSidebar(sidebar, feedAndContactsContaier, contacts, mainContainer);
    const onPageText = homeComponentHeading.textContent.split('/')[0];
    homeComponentHeading.innerHTML = `${onPageText}<span> / Newest posts</span>`;
    displayContacts();

    setTimeout(() => {
      adjustForSidebar(
        sidebar,
        feedAndContactsContaier,
        contacts,
        mainContainer
      );
    }, 2000);
  });

  window.addEventListener('resize', () => {
    setTimeout(() => {
      adjustForSidebar(
        sidebar,
        feedAndContactsContaier,
        contacts,
        mainContainer
      );
    }, 300);
  });

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      sessionStorage.clear();
      checkIfLoggedIn();
    });
  }

  profileLink.addEventListener('click', (e) => {
    // console.log('profile-link');
    setSessionStorage(
      true,
      globalSStorage.token,
      globalSStorage.name,
      globalSStorage.email,
      globalSStorage.avatar,
      globalSStorage.name
    );
  });

  menuBtn.addEventListener('click', (e) => {
    keepOlyOneSidebarOpen(e, contacts, sidebar, mainContainer);
  });

  submitPostBtn.addEventListener('click', () => {
    setTimeout(() => {
      isEditingPost = false;
    }, 1000);
  });

  contactBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      keepOlyOneSidebarOpen(e, contacts, sidebar, mainContainer);
      adjustForSidebar(
        sidebar,
        feedAndContactsContaier,
        contacts,
        mainContainer
      );
    });
  });

  searchFormPosts.addEventListener('submit', async (e) => {
    e.preventDefault();
    const sStorage = getSessionStorage();
    const searchValue = searchPostsInput.value;
    // const searchValueLowerCase = searchPostsInput.value.toLowerCase();
    if (searchValue) {
      const data = await getPosts(sStorage.token, '', 99999);
      const filteredData = data.filter((item) => {
        if (
          item.title.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.body.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.author.name
            .toLowerCase()
            .includes(
              searchValue.toLowerCase() || item.id.includes(searchValue)
            )
        ) {
          return item;
        }
      });
      if (filteredData.length > 0) {
        // remove load more btn here
        loadMoreBtn.remove();
        // console.log(filteredData);
        currentOffset = 0;
        displayAllPosts(allPosts, filteredData, false);
      } else {
        // displayAllPosts(allPosts, getPosts(sStorage.token, '', 99999), false);
      }
    } else {
      //**  display a warning here
      // displayAllPosts(allPosts, getPosts(sStorage.token, '', 99999), false);
    }
  });

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
    sidebar.classList.remove('show-sidebar');
    const onPageText = homeComponentHeading.textContent.split('/')[0];
    homeComponentHeading.innerHTML = `${onPageText}<span> / Oldest posts</span>`;
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
    sidebar.classList.remove('show-sidebar');
    const onPageText = homeComponentHeading.textContent.split('/')[0];
    homeComponentHeading.innerHTML = `${onPageText}<span> / Newest posts</span>`;
  });

  //
  //
  // load more
  loadMoreBtn.addEventListener('click', async () => {
    const sStorage = getSessionStorage();
    const data = await getPosts(sStorage.token, '', 99999);
    if (currentOffset < data.length) {
      currentOffset += 20;
      if (isDescending) {
        displayAllPosts(
          allPosts,
          getSortedPosts(
            sStorage.token,
            'created',
            'desc',
            currentOffset,
            limit
          ),
          true
        );
      } else {
        displayAllPosts(
          allPosts,
          getSortedPosts(
            sStorage.token,
            'created',
            'asc',
            currentOffset,
            limit
          ),
          true
        );
      }
    }
    if (currentOffset >= data.length) {
      loadMoreBtn.remove();
    }
  });
}

// end of global eventlisteners
//
//
//
//
//
//
// displayAllPosts

export async function displayAllPosts(list, fetchMethod, isAddingToPrevList) {
  const spinner = document.createElement('div');
  spinner.classList.add('spinner');
  list.appendChild(spinner);

  if (!isAddingToPrevList) {
    if (list) {
      list.innerHTML = '';
      list.appendChild(spinner);
    }
  }
  const data = await fetchMethod;
  // console.log('data in displayPosts', data);
  const sStorage = getSessionStorage();
  if (data) {
    spinner.remove();
    data.map((post) => {
      const { id, title, body, media, author } = post;
      // console.log(author.avatar && author.avatar );

      const listItem = `
      
    <li class="single-post-feed" data-id="${id}" data-user="${
        author && author.name
      }">
      
      <img
                      class="profile-image"
                      src="${author.avatar}"
                      alt="Profile image of ${author && author.name}"
                      onerror="this.src='https://www.pngitem.com/pimgs/m/30-307416_profile-icon-png-image-free-download-searchpng-employee.png';"
                    />
      

      <div class="title-body-image">
          <p class="post-author" data-name="${author && author.name}">
          ${author && author.name}
          </p>
          <p class="post-title">${title && title}</p>
          <p class="post-body">${body && body}</p>
          <div class="post-image-container">
          ${
            media &&
            `<img class="post-image" src=${media} alt="image posted by ${
              author && author.name
            }" onerror="this.style.display='none'" draggable="true"/>`
          }
          </div>
          <div class="react-comment-container">
                            ${
                              sStorage.name === author.name
                                ? '<button class="delete-post-btn" type="button" data-hoverMessage="Delete"><i class="fa-solid fa-trash"></i></button><button class="edit-post-btn" type="button" data-hoverMessage="Edit"><i class="fa-regular fa-pen-to-square"></i></button>'
                                : ''
                            }
                          </div>
      </div>

      
    </li>`;
      list.innerHTML += listItem;

      // eventlisteners
      const deletePostBtns = document.querySelectorAll('.delete-post-btn');
      const editPostBtns = document.querySelectorAll('.edit-post-btn');
      const postAuthor = document.querySelectorAll('.post-author');

      if (deletePostBtns && editPostBtns) {
        deletePostBtns.forEach((btn) => {
          btn.addEventListener('click', (e) => {
            const id = Number(
              e.target.parentNode.parentNode.parentNode.parentNode.dataset.id
            );
            deletePost(id);
          });
        });

        editPostBtns.forEach((btn) => {
          btn.addEventListener('click', (e) => {
            const id = Number(
              e.target.parentNode.parentNode.parentNode.parentNode.dataset.id
            );
            editID = id;
            isEditingPost = true;
            postTitleInput.focus();
            submitPostBtn.innerHTML = 'Edit post';
          });
        });
      }
      postAuthor.forEach((author) => {
        // !RETURN
        author.addEventListener('click', (e) => {
          const profileName = e.target.dataset.name;
          setSessionStorage(
            true,
            globalSStorage.token,
            globalSStorage.name,
            globalSStorage.email,
            globalSStorage.avatar,
            profileName
          );
          if (!window.location.href.includes('profile.html')) {
            window.location.href = '../profile.html';
          } else {
            displayProfileInfo(profileName);
          }
        });
      });

      //
      //
      //
      // single item
      const singlePostFeed = document.querySelectorAll('.single-post-feed');
      singlePostFeed.forEach((post) => {
        post.addEventListener('click', async (e) => {
          if (e.target.parentNode.className.includes('delete-post-btn')) {
            return;
          } else if (e.target.parentNode.className.includes('edit-post-btn')) {
            return;
          } else {
            const postID = Number(e.currentTarget.dataset.id);
            displaySinglePost(postID, list);
          }
        });
      });
    });
  }
}
//
//
//
// let commentingOnID;
export async function displaySinglePost(postID, list) {
  const spinner = document.createElement('div');
  spinner.classList.add('spinner');
  const sStorage = getSessionStorage();
  list.innerHTML = '';
  list.appendChild(spinner);
  const singleData = await getPosts(sStorage.token, postID, '');

  if (singleData) {
    spinner.remove();
    const { id, title, body, media, author, _count } = singleData;
    const singleListItem = `
              <li class="single-post-feed" data-id="${id}" data-user="${
      author && author.name
    }">
    <img
                      class="profile-image"
                      src="${author.avatar}"
                      alt="Profile image of ${author && author.name}"
                      onerror="this.src='https://www.pngitem.com/pimgs/m/30-307416_profile-icon-png-image-free-download-searchpng-employee.png';"
                    />
                <div class="title-body-image">
                         <p class="post-author" data-name="${
                           author && author.name
                         }">
                            ${author && author.name}
                          </p>
                          <p class="post-title">${title && title}</p>
                          <p class="post-body">${body && body}</p>

                          <div class="post-image-container">
                              ${
                                media &&
                                `<img class="post-image" src=${media} alt="image posted by ${
                                  author && author.name
                                }" onerror="this.style.display='none'" draggable="true" />`
                              }
                          </div>
                          
                          <div class="react-comment-container">
                            ${
                              sStorage.name === author.name
                                ? '<button class="delete-post-btn" type="button" data-hoverMessage="Delete"><i class="fa-solid fa-trash"></i></button><button class="edit-post-btn" type="button" data-hoverMessage="Edit"><i class="fa-regular fa-pen-to-square"></i></button>'
                                : ''
                            }
                          </div>
                <div class="comment-component">
                    <div class="profile-img-text-input">
                        <img
                        class="profile-image"
                        src="${globalSStorage.avatar}"
                        alt="Profile image of ${author && author.name}"
                        onerror="this.src='https://www.pngitem.com/pimgs/m/30-307416_profile-icon-png-image-free-download-searchpng-employee.png';"
                      />
                      <form class="comment-form" data-id="${id}">
                        <textarea
                          class="comment-textarea"
                          placeholder="Comment"
                        ></textarea>

                          <button class="submit-comment-btn" type="submit">Comment</button>
                      </form>
                    </div>
                </div>
              
                <ul class="list-of-comments"></ul>
                </div>
                
              </li>`;

    list.innerHTML = singleListItem;
    // <div class="edit-delete-btn-container"></div>
    const listOfComments = document.querySelector('.list-of-comments');
    const reactOrCommentComponent = document.querySelector(
      '.react-comment-container'
    );

    reactOrCommentComponent.innerHTML += `
              <button class="react-btn" data-hoverMessage="React">
              <p>${_count.reactions}</p>
              <span>
                <i class="fa-regular fa-thumbs-up"></i>
              </span>
              </button>
              <button class="comment-btn" data-hoverMessage="Comment">
                <p>${_count.comments}</p>
              <span>
                <i class="fa-regular fa-comment"></i>
              </span>
              </button>
              `;
    const commentBtn = document.querySelector('.comment-btn');
    const reactBtn = document.querySelector('.react-btn');
    if (listOfComments) {
      const sliceComments = singleData.comments.slice();
      const reversedComments = sliceComments.reverse();
      reversedComments.map(async (comment) => {
        listOfComments.innerHTML = '';
        const { body, owner } = comment;
        const ownerData = await getUsers(owner, '');
        const listItem = `<li>
                      
                      <img
                        class="profile-image"
                        src="${ownerData.avatar && ownerData.avatar}"
                        alt="Profile image of ${ownerData && ownerData.name}"
                        onerror="this.src='https://www.pngitem.com/pimgs/m/30-307416_profile-icon-png-image-free-download-searchpng-employee.png';"
                      />
                      <div class="comment-text">
                        <p><strong>${owner}</strong></p>
                        <p>${body}</p>
                      </div>
              </li>`;
        listOfComments.innerHTML += listItem;
      });

      const commentForm = document.querySelector('.comment-form');
      const textareaComment = document.querySelector('.comment-textarea');

      commentBtn.addEventListener('click', () => {
        textareaComment.focus();
      });
      reactBtn.addEventListener('click', () => {
        reactToPost(id, '👍', allPosts);
      });

      commentForm.addEventListener('submit', (e) => {
        const postID = Number(e.target.dataset.id);
        e.preventDefault();
        const body = textareaComment.value;
        commentOnPost({ postID, body, list });
      });

      textareaComment.addEventListener('keyup', (e) => {
        textareaComment.style.height = 'auto';
        textareaComment.style.height = `${e.target.scrollHeight}px`;
      });

      // loadMoreBtn.remove();
      const deletePostBtn = document.querySelector('.delete-post-btn');
      const editPostBtn = document.querySelector('.edit-post-btn');
      const postAuthor = document.querySelector('.post-author');

      if (deletePostBtn && editPostBtn) {
        deletePostBtn.addEventListener('click', (e) => {
          const id = Number(
            e.target.parentNode.parentNode.parentNode.parentNode.dataset.id
          );
          deletePost(id);
        });

        editPostBtn.addEventListener('click', (e) => {
          const id = Number(
            e.target.parentNode.parentNode.parentNode.parentNode.dataset.id
          );
          editID = id;
          isEditingPost = true;
          postTitleInput.focus();
          submitPostBtn.innerHTML = 'Edit post';
        });
      }
      postAuthor.addEventListener('click', (e) => {
        const profileName = e.target.dataset.name;
        setSessionStorage(
          true,
          globalSStorage.token,
          globalSStorage.name,
          globalSStorage.email,
          globalSStorage.avatar,
          profileName
        );
        if (!window.location.href.includes('profile.html')) {
          window.location.href = '../profile.html';
        } else {
          displayProfileInfo(profileName);
        }
      });
    }
  }
}

//
//
// body: JSON.stringify({
// symbol: symbol,
// count: 1,
// postId: id,
// }),
//

{
  /* <form class='post-form'>
  <input
    class='post-title-input'
    type='text'
    aria-label='post-title'
    placeholder='Title'
  />
  <textarea class='post-textarea' placeholder='Post something!'></textarea>
  <div class='display-image-container'></div>
  <div class='add-items-and-submit-btn-contianer'>
    <div class='add-items-btns'>
      <label class='custom-file-upload'>
        <input type='file' class='upload-img-input' />
        <i class='fa-solid fa-image'></i>
      </label>
    </div>
    <button class='submit-post-btn' type='submit'>
      post
    </button>
  </div>
</form>; */
}
//
// > 500

//
//
//
//
//
//
//
// editPost

//
//
//
//

//
//
//
//
// eventListeners

// press post
{
  /* <div class="react-comment-container">
                      <button class="react-btn">
                        <i class="fa-solid fa-heart"></i>
                      </button>
                      <button class="comment-btn">
                        <i class="fa-solid fa-comment"></i>
                      </button>
                    </div>
                    <form class="comment-form">
                      <img
                          class="profile-image"
                          src="${globalSStorage.avatar}"
                          alt="Profile image of ${globalSStorage.name}"
                          onerror="this.src='https://www.pngitem.com/pimgs/m/30-307416_profile-icon-png-image-free-download-searchpng-employee.png';"
                        />

                      <input class="comment-input" type="text" placeholder="Comment" />
                      <button class="submit-comment-btn" type="submit">Comment</button>
                    </form> */
}
