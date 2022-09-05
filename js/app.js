const commentsContainer = document.querySelector('.comments-container');

let comments;
let currentUser;

fetch('../data.json')
    .then(res => res.json())
    .then(data => {
        comments = data.comments.map(comment => {
            return {
                id: comment.id,
                content: comment.content,
                date: comment.createdAt,
                like: comment.score,
                avatar: comment.user.image.webp,
                user: comment.user.username,
                replies: comment.replies,
            }
        });
        currentUser = {
            avatar: data.currentUser.image.webp,
            userName: data.currentUser.username,
        }
        init(comments, currentUser);
    });

const createLikesElement = (score) => {
    const likeContainer = document.createElement('div');
    likeContainer.classList.add('like__container');

    const plusBtn = document.createElement('button');
    plusBtn.classList.add('like__btn-plus');
    plusBtn.innerHTML = "<img class='comment__plus-image' src='../images/icon-plus.svg' alt='adding like icon'/>";
    likeContainer.appendChild(plusBtn);

    const like = document.createElement('span');
    like.classList.add('like__score');
    like.innerText = `${score}`;
    likeContainer.appendChild(like);

    const minusBtn = document.createElement('button');
    minusBtn.classList.add('like__btn-minus');
    minusBtn.innerHTML = "<img class='comment__plus-image' src='../images/icon-minus.svg' alt='subtracting like icon'/>";
    likeContainer.appendChild(minusBtn);

    return likeContainer;
};

const createUserInfoElement = (avatar, name, date) => {
    const userInfoContainer = document.createElement('div');
    userInfoContainer.classList.add('user__container');

    const userAvatar = document.createElement('div');
    userAvatar.classList.add('user__avatar');
    userAvatar.innerHTML = `<img class='comment__user-image' src="${avatar}" alt="${name} avatar"/>`;
    userInfoContainer.appendChild(userAvatar);

    const userName = document.createElement('span');
    userName.classList.add('user__name');
    userName.innerText = `${name}`;
    userInfoContainer.appendChild(userName);

    if(currentUser.userName === name) {
        const currentUserElement = document.createElement('span');
        currentUserElement.classList.add('user__current-user');
        currentUserElement.innerText = 'you';
        userInfoContainer.appendChild(currentUserElement);
    }

    const userDate = document.createElement('span');
    userDate.classList.add('user__date');
    userDate.innerText = `${date}`;
    userInfoContainer.appendChild(userDate);

    return userInfoContainer;
};

const createReplyButtonElement = () => {
    const replyButton = document.createElement('button');
    replyButton.classList.add('reply-btn');
    replyButton.innerHTML = "<img class='reply-btn__image' src='../images/icon-reply.svg' alt='reply button icon'/> Reply";

    return replyButton;
};

const createDeleteButtonElement = () => {
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-btn');
    deleteButton.innerHTML = "<img class='delete-btn__image' src='../images/icon-delete.svg' alt='delete button icon'/> Delete";

    return deleteButton;
}

const createEditButtonElement = () => {
    const editButton = document.createElement('button');
    editButton.classList.add('edit-btn');
    editButton.innerHTML = "<img class='edit-btn__image' src='../images/icon-edit.svg' alt='edit button icon'/> Edit";

    return editButton;
};

const createContentElement = (content, replyingTo='') => {
    const userContent = document.createElement('p');
    userContent.classList.add('content');
    const replyUser = replyingTo ? `<span class='content__reply-user'>@${replyingTo}</span>` : '';
    userContent.innerHTML = `${replyUser} ${content}`;

    return userContent;
}

const createCommentContainerElement = (comment) => {
    const commentContainer = document.createElement('div');
    commentContainer.classList.add('comment');
    commentContainer.setAttribute('data-user', `${comment.user}`);

    commentContainer.appendChild(createLikesElement(comment.like));
    commentContainer.appendChild(createUserInfoElement(comment.avatar, comment.user, comment.date));
    if(currentUser.userName === comment.user) {
        commentContainer.appendChild(createDeleteButtonElement());
        commentContainer.appendChild(createEditButtonElement());
    } else {
        commentContainer.appendChild(createReplyButtonElement());
    }
    commentContainer.appendChild(createContentElement(comment.content));

    comment.replies.forEach(reply => {
        commentContainer.appendChild(createReplyCommentElement(reply));
    })

    return commentContainer;
}


const createSingleCommentElement = (comment) => {
    commentsContainer.appendChild(createCommentContainerElement(comment, currentUser));
};

const createReplyCommentElement = (reply) => {
    const replyContainter = document.createElement('div');
    replyContainter.classList.add('comment__reply');
    replyContainter.setAttribute('data-user', `${reply.user.username}`);
    replyContainter.setAttribute('data-reply', `${reply.replyingTo}`);

    replyContainter.appendChild(createLikesElement(reply.score));
    replyContainter.appendChild(createUserInfoElement(reply.user.image.webp, reply.user.username, reply.createdAt));
    if(currentUser.userName === reply.user.username) {
        replyContainter.appendChild(createDeleteButtonElement());
        replyContainter.appendChild(createEditButtonElement());
    } else {
        replyContainter.appendChild(createReplyButtonElement());
    }
    replyContainter.appendChild(createContentElement(reply.content, reply.replyingTo));

    return replyContainter;
}

const init = (comments, currentUser) => {
    comments.forEach(comment => {
        createSingleCommentElement(comment, currentUser);
    });
}; 
