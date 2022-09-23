const textareaPost = document.querySelector('.post-textarea');
const feedContainer = document.querySelector('.feed');
const homeComponent = document.querySelector('.home-component');
const addImageContainer = document.querySelector('.add-image-container');
const addImageBtn = document.querySelector('.add-image-btn');

window.addEventListener('resize', () => {
  const feedRect = feedContainer.getBoundingClientRect();
  homeComponent.style.width = `${feedRect.width}px`;
});

// eventlistener for textarea

textareaPost.addEventListener('keyup', (e) => {
  textareaPost.style.height = 'auto';
  textareaPost.style.height = `${e.target.scrollHeight}px`;
});

// addImageContainer

addImageBtn.addEventListener('click', () => {
  console.log('open');
});

// !test
// imgInput.addEventListener('change', () => {
//   // console.log(imgInput.files);
//   const reader = new FileReader();
//   reader.onload = function () {
//     const img = new Image();
//     img.src = reader.result;
//     imgDisplayer.style.backgroundImage = `url(${img.src})`;
//   };
//   reader.readAsDataURL(imgInput.files[0]);
//   imgDisplayer.style.height = '300px';
//   imgDisplayer.style.width = '300px';
// });
// !test
