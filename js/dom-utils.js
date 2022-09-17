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

const createUserInfoElement = (avatar, username, date, currentName) => {
    const userInfoElement = document.createElement('div');
    userInfoElement.classList.add('comment__user-container');

    const userAvatar = document.createElement('div');
    userAvatar.classList.add('comment__user-avatar');
    userAvatar.innerHTML = `<img class='user__avatar-image' src="${avatar}" alt="${username} avatar"/>`;
    userInfoElement.appendChild(userAvatar);

    const userName = document.createElement('span');
    userName.classList.add('comment__user-name');
    userName.innerText = `${username}`;
    userInfoElement.appendChild(userName);
    if(currentName === username) {
        const currentUserElement = document.createElement('span');
        currentUserElement.classList.add('comment__current-user-id');
        currentUserElement.innerText = 'you';
        userInfoElement.appendChild(currentUserElement);
    }

    const userDate = document.createElement('span');
    userDate.classList.add('comment__user-date');
    userDate.innerText = `${date}`;
    userInfoElement.appendChild(userDate);

    return userInfoElement;
};

const createContentElement = (content, replyingTo='') => {
    const userContent = document.createElement('p');
    userContent.classList.add('comment__content');
    const replyUser = replyingTo ? `<span class='content__reply-user'>@${replyingTo}</span>` : '';
    userContent.innerHTML = `${replyUser} ${content}`;

    return userContent;
}


const createReplyButtonElement = (username) => {
    const replyButton = document.createElement('button');
    replyButton.classList.add('comment__reply-btn');
    replyButton.setAttribute('data-user', `${username}`);
    replyButton.innerHTML = "<img class='reply-btn__image' src='../images/icon-reply.svg' alt='reply button icon'/> Reply";
    // replyButton.addEventListener('click', () => replyComment(replyButton))

    return replyButton;
};

const createCommentItemELement = (comment, currentUser) => {
    const commentMainElement = document.createElement('div');
    commentMainElement.classList.add('comment', 'comment__main');
    if(currentUser.name === comment.user) {
        commentMainElement.classList.add('comment', 'comment__main', 'comment__current-user');
    } else {
        commentMainElement.setAttribute('data-user', `${comment.name}`);
    }

    commentMainElement.appendChild(createLikesElement(comment.like));
    commentMainElement.appendChild(createUserInfoElement(comment.avatar, comment.name, comment.date, currentUser.name));
    commentMainElement.appendChild(createContentElement(comment.content));
    commentMainElement.appendChild(createReplyButtonElement(comment.name));

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