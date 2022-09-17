const commentsContainer = document.querySelector('.comments-container');

const createLikesElement = (like) => {
    let likeNumber = like ? like : 0;

    const likeContainer = document.createElement('div');
    likeContainer.classList.add('comment__like-container');

    const plusButton = document.createElement('button');
    plusButton.classList.add('comment__plus-btn');
    plusButton.innerHTML = "<img class='comment__plus-btn-image' src='../images/icon-plus.svg' alt='adding like icon'/>";
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
    minusButton.innerHTML = "<img class='comment__minus-btn-image' src='../images/icon-minus.svg' alt='subtracting like icon'/>";
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
    userAvatar.innerHTML = `<img class='comment__user-avatar-image' src="${avatar}" alt="${username} avatar"/>`;
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

const createDeleteButtonElement = () => {
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('comment__delete-btn');
    deleteButton.innerHTML = "<img class='delete-btn__image' src='../images/icon-delete.svg' alt='delete button icon'/> Delete";
    // deleteButton.addEventListener('click', () => deleteCommentModal(id));

    return deleteButton;
}

const createEditButtonElement = () => {
    const editButton = document.createElement('button');
    editButton.classList.add('comment__edit-btn');
    editButton.innerHTML = "<img class='edit-btn__image' src='../images/icon-edit.svg' alt='edit button icon'/> Edit";

    return editButton;
};

const createCommentItemELement = (comment, currentUser) => {
    const commentMainElement = document.createElement('div');
    if(currentUser.name === comment.name) {
        commentMainElement.classList.add('comment', 'comment__main', 'comment__current-user');
        commentMainElement.setAttribute('data-user', `${currentUser.name}`);
    } else {
        commentMainElement.classList.add('comment', 'comment__main');
        commentMainElement.setAttribute('data-user', `${comment.name}`);
    }

    commentMainElement.appendChild(createLikesElement(comment.like));
    commentMainElement.appendChild(createUserInfoElement(comment.avatar, comment.name, comment.date, currentUser.name));
    commentMainElement.appendChild(createContentElement(comment.content));
    if(currentUser.name === comment.name) {
        commentMainElement.appendChild(createDeleteButtonElement());
        commentMainElement.appendChild(createEditButtonElement());
    } else {
        commentMainElement.appendChild(createReplyButtonElement(comment.name));
    }
    
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
    commentsContainer.innerHTML = "";
    
    comments.forEach(comment => {
        createCommentElement(comment, currentUser);
    });
};