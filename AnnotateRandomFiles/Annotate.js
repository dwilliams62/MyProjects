// Get all elements by class name
const likesButtons = document.getElementsByClassName('likes button');
const commentButtons = document.getElementsByClassName('comments button');

// Add event listeners to likes buttons
Array.from(likesButtons).forEach(button => {
  button.addEventListener('click', () => {
    // Add likes logic here
    const likesSpan = button.parentNode.querySelector('span');
    const currentLikes = parseInt(likesSpan.textContent);
    likesSpan.textContent = currentLikes + 1;
  });
});

// Add event listeners to comment buttons
Array.from(commentButtons).forEach(button => {
  button.addEventListener('click', () => {
    // Add comments logic here
    const textarea = button.parentNode.querySelector('textarea');
    const comment = textarea.value;
    console.log(comment);
    // Clear the textarea after posting a comment
    textarea.value = '';
  });
});