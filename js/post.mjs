import { post, editPost, uploadImageToContainer } from './utils.mjs';
import { isEditingPost, editID } from './layout.mjs';

const postForm = document.querySelector('.post-form');
const postTitleInput = document.querySelector('.post-title-input');
const textareaPost = document.querySelector('.post-textarea');
const displayImageContainer = document.querySelector(
  '.display-image-container'
);
const uploadImgeInput = document.querySelector('.upload-img-input');
const homeComponent = document.querySelector('.home-component');
const feedContainer = document.querySelector('.feed');
const submitPostBtn = document.querySelector('.submit-post-btn');

/**
 * adjusts home component to be the same with as feed
 * @example
 * ```js
 * // call function
 * adjustHomeComponent()
 *  homeComponent.style.width = `${feedRect.width}px`;
 * ```
 */
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
