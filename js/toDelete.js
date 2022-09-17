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
        render(comments, currentUser);
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

const createReplyButtonElement = (user) => {
    const replyButton = document.createElement('button');
    replyButton.classList.add('reply-btn');
    replyButton.setAttribute('data-user', `${user}`)
    replyButton.innerHTML = "<img class='reply-btn__image' src='../images/icon-reply.svg' alt='reply button icon'/> Reply";
    replyButton.addEventListener('click', () => replyComment(replyButton))

    return replyButton;
};

const createDeleteButtonElement = (id) => {
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-btn');
    deleteButton.innerHTML = "<img class='delete-btn__image' src='../images/icon-delete.svg' alt='delete button icon'/> Delete";
    deleteButton.addEventListener('click', () => deleteCommentModal(id));

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
        commentContainer.appendChild(createDeleteButtonElement(comment.id));
        commentContainer.appendChild(createEditButtonElement());
    } else {
        commentContainer.appendChild(createReplyButtonElement(comment.user));
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
        replyContainer.appendChild(createDeleteButtonElement(reply.id));
        replyContainer.appendChild(createEditButtonElement());
    } else {
        replyContainer.appendChild(createReplyButtonElement(reply.user.username));
    }
    replyContainer.appendChild(createContentElement(reply.content, reply.replyingTo));

    return replyContainer;
}

const createDeleteCommentModalElement = (id, cancelModal, deleteComment) => {
    const modalELement = document.createElement('div');
    modalELement.classList.add('modal');

    const modalHeadElement = document.createElement('strong');
    modalHeadElement.classList.add('modal__heading');
    modalHeadElement.innerText = 'Delete comment';
    modalELement.appendChild(modalHeadElement);

    const modalTextElement = document.createElement('span');
    modalTextElement.classList.add('modal__text');
    modalTextElement.innerText = 'Are you sure you want delete this comment? This will remove the comment and can`t be undone.';
    modalELement.appendChild(modalTextElement);

    const cancelButtonElement = document.createElement('button');
    cancelButtonElement.classList.add('modal__cancel-btn');
    cancelButtonElement.innerText = 'no, cancel';
    cancelButtonElement.addEventListener('click', cancelModal);
    modalELement.appendChild(cancelButtonElement);

    const deleteButtonElement = document.createElement('button');
    deleteButtonElement.classList.add('modal__delete-btn');
    deleteButtonElement.innerText = 'yes, delete';
    deleteButtonElement.addEventListener('click', () => deleteComment(id));
    modalELement.appendChild(deleteButtonElement)

    return modalELement
}

const createReplyFormELement = () => {
    const formContainer = document.createElement('form');
    // formContainer.classList.add('');
    const textElement = document.createElement('textarea');
    formContainer.appendChild(textElement);

    const replyButtonElement = document.createElement('button');
    replyButtonElement.setAttribute('type', 'submit');
    replyButtonElement.innerText = 'reply';
    replyButtonElement.addEventListener('click', (event) => {
        event.preventDefault()
        
    })
    formContainer.appendChild(replyButtonElement);

    return formContainer
}

const render = (comments, currentUser) => {
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

    // const index = comments.findIndex(element => element.id === );

    // comments[0].replies.push({
    //     id: 11,
    //     user: {
    //         image: {
    //           webp: currentUser.avatar,
    //         } ,
    //         username: currentUser.userName,
    //     } ,
    //     createdAt: '2 years ago',
    //     content: value,
    //     replyingTo: 'ramsesmiron',
    // })
    
    render(comments, currentUser);
};

const replyComment = (replyButton) => {
    if(replyButton.parentElement.dataset.user === replyButton.dataset.user) {
        replyButton.parentElement.nextElementSibling.appendChild(createReplyFormELement());
    }
    // comments[0].replies.push({
    //     id: 11,
    //     user: {
    //         image: {
    //           webp: currentUser.avatar,
    //         } ,
    //         username: currentUser.userName,
    //     } ,
    //     createdAt: '2 years ago',
    //     content: value,
    //     replyingTo: 'ramsesmiron',
    // })
};

const deleteCommentModal = (id) => {
    const cancelModal = () => {
        document.body.removeChild(modalContainer);
    };

    const deleteComment = (id) => {
        commentsContainer.innerHTML = "";
    
        const newCommentsArray = comments.filter(comment => comment.id !== id);
        comments = newCommentsArray;

        comments.forEach(comment => {
            const newRepliesArray = comment.replies.filter(reply => reply.id !== id);
            comment.replies = newRepliesArray
    })
        render(comments, currentUser)
        document.body.removeChild(modalContainer);
    }
    
    const modalContainer = document.createElement('div');
    modalContainer.classList.add('modal-container');
    modalContainer.appendChild(createDeleteCommentModalElement(id, cancelModal, () => deleteComment(id)));
    document.body.appendChild(modalContainer);
}

addForm.addEventListener('submit', addNewComment);


