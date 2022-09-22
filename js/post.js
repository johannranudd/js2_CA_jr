const textareaPost = document.querySelector('.post-textarea');
const feedContainer = document.querySelector('.feed');
const homeComponent = document.querySelector('.home-component');

window.addEventListener('resize', () => {
  const feedRect = feedContainer.getBoundingClientRect();
  homeComponent.style.width = `${feedRect.width}px`;
});

// eventlistener for textarea
