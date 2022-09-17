const commentsContainer = document.querySelector('.comments-container');

const createLikesElement = (like) => {
    let likeNumber = like ? like : 0;

    const likeContainer = document.createElement('div');
    likeContainer.classList.add('comment__like-container');

    const plusButton = document.createElement('button');
    plusButton.classList.add('comment__plus-btn');
    plusButton.innerHTML = "<img class='like__btn-plus-image' src='../images/icon-plus.svg' alt='adding like icon'/>";
    plusButton.addEventListener('click', () => {
        likeNumber += 1;
        likeElement.innerText = likeNumber;
        minusButton.disabled = false;
    });
    likeContainer.appendChild(plusButton);

    const likeElement = document.createElement('span');
    likeElement.classList.add('comment__like-number');
    likeElement.innerText = `${likeNumber}`;
    likeContainer.appendChild(likeElement);

    const minusButton = document.createElement('button');
    minusButton.classList.add('comment__minus-btn');
    minusButton.innerHTML = "<img class='like__minus-image' src='../images/icon-minus.svg' alt='subtracting like icon'/>";
    minusButton.addEventListener('click', () => {
        likeNumber -= 1;
        if(likeNumber == 0) {
            likeElement.innerText = 0;
            minusButton.disabled = true;
        } else {
        likeElement.innerText = likeNumber;
        
        };
    });
    likeContainer.appendChild(minusButton);

    return likeContainer;
};

const createCommentItemELement = (comment, currentUser) => {
    const commentMainElement = document.createElement('div');
    commentMainElement.classList.add('comment', 'comment__main');
    commentMainElement.setAttribute('data-user', `${comment.name}`);

    commentMainElement.appendChild(createLikesElement(comment.like));

    return commentMainElement;
};

const createCommentElement = (comment, currentUser) => {
    const commentItemElement = document.createElement('div');
    commentItemElement.classList.add('comments__item');
    commentItemElement.appendChild(createCommentItemELement(comment, currentUser));

    commentsContainer.appendChild(commentItemElement);

    return commentsContainer;
};

export const renderCommentsList =(comments, currentUser) => {
    comments.forEach(comment => {
        createCommentElement(comment, currentUser);
    });
};