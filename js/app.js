const commentsContainer = document.querySelector('.comments-container');
const addForm = document.querySelector('.add-comment__form');
const textAreaForm = document.querySelector('.add-comment__input');

let comments = [];
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

    const randomId = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
    };

const createLikesElement = (score) => {
    let likeNumber = score ? score : counter = 0;

    const likeContainer = document.createElement('div');
    likeContainer.classList.add('like__container');

    const plusBtn = document.createElement('button');
    plusBtn.classList.add('like__btn-plus');
    plusBtn.innerHTML = "<img class='like__btn-plus-image' src='../images/icon-plus.svg' alt='adding like icon'/>";
    plusBtn.addEventListener('click', () => {
        likeNumber += 1;
        likeElement.innerText = likeNumber;
        minusBtn.disabled = false;
    });
    likeContainer.appendChild(plusBtn);
    
    
    const likeElement = document.createElement('span');
    likeElement.classList.add('like__score');
    likeElement.innerText = `${likeNumber}`;
    likeContainer.appendChild(likeElement);

    const minusBtn = document.createElement('button');
    minusBtn.classList.add('like__btn-minus');
    minusBtn.innerHTML = "<img class='like__minus-image' src='../images/icon-minus.svg' alt='subtracting like icon'/>";
    minusBtn.addEventListener('click', () => {
        likeNumber -= 1;
        if(likeNumber == 0) {
            likeElement.innerText = 0;
            minusBtn.disabled = true;
        } else {
        likeElement.innerText = likeNumber;
        
        }
    })
    likeContainer.appendChild(minusBtn);

    return likeContainer;
};

const createUserInfoElement = (avatar, name, date) => {
    const userInfoContainer = document.createElement('div');
    userInfoContainer.classList.add('user__container');

    const userAvatar = document.createElement('div');
    userAvatar.classList.add('user__avatar');
    userAvatar.innerHTML = `<img class='user__avatar-image' src="${avatar}" alt="${name} avatar"/>`;
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
    commentContainer.classList.add('comment', 'main-comment');
    if(currentUser.userName === comment.user) {
        commentContainer.classList.add('comment', 'main-comment', 'current-user-comment')
    }
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

    return commentContainer;
}


const createSingleCommentElement = (comment, currentUser) => {
    const commentElement = document.createElement('div');
    commentElement.classList.add('comment-container');
    commentElement.appendChild(createCommentContainerElement(comment, currentUser))

    const repliesContainer = document.createElement('div');
    repliesContainer.classList.add('replies-container');

    comment.replies.forEach(reply => {
        repliesContainer.appendChild(createReplyCommentElement(reply));
    })

    commentElement.appendChild(repliesContainer)

    commentsContainer.appendChild(commentElement);
};

const createReplyCommentElement = (reply) => {
    const replyContainer = document.createElement('div');
    replyContainer.classList.add('comment', 'reply-comment');
    if(currentUser.userName === reply.user.username) {
        replyContainer.classList.add('comment', 'reply-comment', 'current-user-comment')
    }
    replyContainer.setAttribute('data-user', `${reply.user.username}`);
    replyContainer.setAttribute('data-reply', `${reply.replyingTo}`);

    replyContainer.appendChild(createLikesElement(reply.score));
    replyContainer.appendChild(createUserInfoElement(reply.user.image.webp, reply.user.username, reply.createdAt));
    if(currentUser.userName === reply.user.username) {
        replyContainer.appendChild(createDeleteButtonElement());
        replyContainer.appendChild(createEditButtonElement());
    } else {
        replyContainer.appendChild(createReplyButtonElement());
    }
    replyContainer.appendChild(createContentElement(reply.content, reply.replyingTo));

    return replyContainer;
}

const init = (comments, currentUser) => {
    comments.forEach(comment => {
        createSingleCommentElement(comment, currentUser);
    });
}; 

const addNewComment = (event) => {
    event.preventDefault();
    commentsContainer.innerHTML = "";
    const value = textAreaForm.value
     comments.push({
        id: randomId(),
        content: value,
        date: 'now',
        like: 0,
        avatar: currentUser.avatar,
        user: currentUser.userName,
        replies: [],
    })
     textAreaForm.value = "";

    init(comments, currentUser);
    console.log(comments);
};

addForm.addEventListener('submit', addNewComment);
