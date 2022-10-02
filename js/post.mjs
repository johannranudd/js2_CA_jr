import {
  post,
  getPosts,
  getSessionStorage,
  editPost,
  uploadImageToContainer,
} from './utils.mjs';
import { displayAllPosts, isEditingPost, editID } from './layout.mjs';

const postForm = document.querySelector('.post-form');

const postTitleInput = document.querySelector('.post-title-input');
const textareaPost = document.querySelector('.post-textarea');
const displayImageContainer = document.querySelector(
  '.display-image-container'
);
const uploadImgeInput = document.querySelector('.upload-img-input');

const homeComponent = document.querySelector('.home-component');
const feedContainer = document.querySelector('.feed');

const allPosts = document.querySelector('.all-posts');
const submitPostBtn = document.querySelector('.submit-post-btn');
const postImage = document.querySelector('.post-image');
// const dropBox = document.querySelector('#div1');

function adjustHomeComponent() {
  const feedRect = feedContainer.getBoundingClientRect();
  homeComponent.style.width = `${feedRect.width}px`;
}
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    adjustHomeComponent();
  }, 2000);
});
window.addEventListener('resize', () => {
  adjustHomeComponent();
});

// eventlistener for textarea

if (textareaPost) {
  textareaPost.addEventListener('keyup', (e) => {
    textareaPost.style.height = 'auto';
    textareaPost.style.height = `${e.target.scrollHeight}px`;
  });
}

// upload image
if (uploadImgeInput) {
  uploadImgeInput.addEventListener('drop', (e) => {
    setTimeout(() => {
      uploadImageToContainer(displayImageContainer, uploadImgeInput);
    }, 100);
  });
  uploadImgeInput.addEventListener('keyup', (e) => {
    setTimeout(() => {
      uploadImageToContainer(displayImageContainer, uploadImgeInput);
    }, 100);
  });
}

// !moved to utils
// export function uploadImageToContainer(container) {
//   const reader = new FileReader();
//   reader.onload = function () {
//     const img = new Image();
//     img.src = reader.result;
//     const alt = document.createAttribute('alt');
//     alt.value = 'Your uploaded image';
//     img.setAttributeNode(alt);
//     container.appendChild(img);
//   };
//   reader.readAsDataURL(uploadImgeInput.files[0]);
// }

// postForm
if (postForm) {
  postForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const titleInputValue = postTitleInput.value;
    const textareaValue = textareaPost.value;
    const image = displayImageContainer.querySelector('img');
    // }
    if (titleInputValue && textareaValue) {
      const submitObject = {
        title: titleInputValue, // Required
        body: textareaValue, // Required
        tags: ['test'], // Optional
        // media: image ? image.src : '',
      };

      if (image) {
        submitObject.media = image.src;
      }

      if (!isEditingPost) {
        post(submitObject);
        postForm.reset();
        if (image) {
          displayImageContainer.removeChild(image);
        }
      } else {
        editPost(editID, submitObject);
        postForm.reset();
        submitPostBtn.innerHTML = 'Post';
        if (image) {
          displayImageContainer.removeChild(image);
        }
      }
    }
  });
}

//
//
//

// {
//       title: 'njbr test_3 title',
//       body: 'njbr test_body_3',
//       tags: ['test2'],
//     }
