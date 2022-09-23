const textareaPost = document.querySelector('.post-textarea');
const feedContainer = document.querySelector('.feed');
const homeComponent = document.querySelector('.home-component');
const displayImageContainer = document.querySelector(
  '.display-image-container'
);
const uploadImgeInput = document.querySelector('.upload-img-input');

window.addEventListener('resize', () => {
  const feedRect = feedContainer.getBoundingClientRect();
  homeComponent.style.width = `${feedRect.width}px`;
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
    console.log(displayImageContainer);
  };
  reader.readAsDataURL(uploadImgeInput.files[0]);
});
