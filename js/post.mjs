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
  adjustHomeComponent();
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
  console.log(uploadImgeInput);
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
    // const uploadedFile = uploadImgeInput.files[0];
    const titleInputValue = postTitleInput.value;
    const textareaValue = textareaPost.value;
    const image = displayImageContainer.querySelector('img');
    // const formData = new FormData();
    // formData.append('title', titleInputValue);
    // formData.append('body', textareaValue);
    // if (uploadedFile) {
    //   formData.append('media', uploadedFile);
    // }
    if (titleInputValue && textareaValue) {
      const submitObject = {
        title: titleInputValue, // Required
        body: textareaValue, // Required
        tags: ['test'], // Optional
        // media: image ? image.src : '', // Optional
        media: image && image.src,
      };

      console.log(submitObject);
      // function dataURItoBlob(dataURI) {
      //   // convert base64/URLEncoded data component to raw binary data held in a string
      //   let byteString;
      //   if (dataURI.split(',')[0].indexOf('base64') >= 0)
      //     byteString = atob(dataURI.split(',')[1]);
      //   else byteString = unescape(dataURI.split(',')[1]);

      //   // separate out the mime component
      //   let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

      //   // write the bytes of the string to a typed array
      //   let ia = new Uint8Array(byteString.length);
      //   for (let i = 0; i < byteString.length; i++) {
      //     ia[i] = byteString.charCodeAt(i);
      //   }

      //   return new Blob([ia], { type: mimeString });
      // }
      // const blob = dataURItoBlob(image.src);
      // console.log('blob::', blob.type);
      // if (blob) {
      //   submitObject.media = blob.type;
      // }
      // console.log(submitObject);
      // From there, appending the data to a form such that it will be uploaded as a file is easy:

      // let dataURL = canvas.toDataURL('image/jpeg', 0.5);
      // let blob = dataURItoBlob(dataURL);
      // let fd = new FormData(document.forms[0]);
      // fd.append('canvasImage', blob);
      // console.log(fd);
      // media:
      //   'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg',
      // console.log('before:: ', submitObject);

      if (!isEditingPost) {
        post(submitObject);
        postForm.reset();
        // if (image) {
        //   displayImageContainer.removeChild(image);
        // }
      } else {
        editPost(editID, submitObject);
        postForm.reset();
        submitPostBtn.innerHTML = 'Post';
        // if (image) {
        //   displayImageContainer.removeChild(image);
        // }
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
