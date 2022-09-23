import { post } from './utils.js';

const postForm = document.querySelector('.post-form');
const postTitleInput = document.querySelector('.post-title-input');
const textareaPost = document.querySelector('.post-textarea');
const displayImageContainer = document.querySelector(
  '.display-image-container'
);
const uploadImgeInput = document.querySelector('.upload-img-input');

const homeComponent = document.querySelector('.home-component');
const feedContainer = document.querySelector('.feed');

function adjustHomeComponent() {
  const feedRect = feedContainer.getBoundingClientRect();
  homeComponent.style.width = `${feedRect.width}px`;
}
window.addEventListener('DOMContentLoaded', () => {
  adjustHomeComponent();
});
window.addEventListener('resize', () => {
  adjustHomeComponent();
});

// eventlistener for textarea

textareaPost.addEventListener('keyup', (e) => {
  textareaPost.style.height = 'auto';
  textareaPost.style.height = `${e.target.scrollHeight}px`;
});

// upload image
uploadImgeInput.addEventListener('change', () => {
  // console.log(uploadImgeInput.files);
  const reader = new FileReader();
  reader.onload = function () {
    const img = new Image();
    img.src = reader.result;
    const alt = document.createAttribute('alt');
    alt.value = 'Your uploaded image';
    img.setAttributeNode(alt);
    displayImageContainer.appendChild(img);
    // console.log(displayImageContainer);
  };
  // console.log(uploadImgeInput.files[0]);
  reader.readAsDataURL(uploadImgeInput.files[0]);
});

// postForm

postForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const titleInputValue = postTitleInput.value;
  const textareaValue = textareaPost.value;
  const image = displayImageContainer.querySelector('img');
  // console.log(image.src);
  // console.log(textareaValue);
  // console.log(titleInputValue);
  const submitObject = {
    title: titleInputValue, // Required
    body: textareaValue, // Required
    media: image.src, // Optional
  };
  // console.log(submitObject);
  post(submitObject);

  // organize submitted values above
  // make sure its JSON
  // submit to a POST req, look in docs
  // look in feed to see if works
});
