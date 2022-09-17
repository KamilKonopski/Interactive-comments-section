const commentsContainer = document.querySelector('.comments-container');
const addForm = document.querySelector('.add-comment__form');
const textAreaForm = document.querySelector('.add-comment__text');

let comments;
let currentUser;

const randomId = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
};

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
                name: comment.user.username,
                replies: comment.replies
            }
        });
        currentUser = {
            avatar: data.currentUser.image.webp,
            name: data.currentUser.username
        };
        renderCommentsList(comments, currentUser);
    });

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
    
    const createDeleteButtonElement = (id) => {
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('comment__delete-btn');
        deleteButton.innerHTML = "<img class='delete-btn__image' src='../images/icon-delete.svg' alt='delete button icon'/> Delete";
        deleteButton.addEventListener('click', () => deleteCommentModal(id));
    
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
            commentMainElement.appendChild(createDeleteButtonElement(comment.id));
            commentMainElement.appendChild(createEditButtonElement());
        } else {
            commentMainElement.appendChild(createReplyButtonElement(comment.name));
        }
        
        return commentMainElement;
    };

    const createReplyCommentElement = (reply) => {
        const replyContainer = document.createElement('div');
        if(currentUser.name === reply.user.username) {
         replyContainer.classList.add('comment', 'comment__reply', 'current-user-comment')
        } else {
            replyContainer.classList.add('comment', 'comment__reply');
        }
        replyContainer.setAttribute('data-user', `${reply.user.username}`);
        replyContainer.setAttribute('data-reply', `${reply.replyingTo}`);

        replyContainer.appendChild(createLikesElement(reply.score));
        replyContainer.appendChild(createUserInfoElement(reply.user.image.webp, reply.user.username, reply.createdAt));
        if(currentUser.name === reply.user.username) {
            replyContainer.appendChild(createDeleteButtonElement(reply.id));
            replyContainer.appendChild(createEditButtonElement());
        } else {
            replyContainer.appendChild(createReplyButtonElement(reply.user.username));
        }
        replyContainer.appendChild(createContentElement(reply.content, reply.replyingTo));

        return replyContainer;
    };
    
    const createCommentElement = (comment, currentUser) => {
        const commentItemElement = document.createElement('div');
        commentItemElement.classList.add('comments__item');
        commentItemElement.appendChild(createCommentItemELement(comment, currentUser));

        const repliesItemElement = document.createElement('div');
        repliesItemElement.classList.add('comments__replies');

        comment.replies.forEach(reply => repliesItemElement.appendChild(createReplyCommentElement(reply)));

        commentItemElement.appendChild(repliesItemElement);
    
        commentsContainer.appendChild(commentItemElement);
    
        return commentsContainer;
    };
    
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

     const renderCommentsList = (comments, currentUser) => {
        commentsContainer.innerHTML = "";
    
        comments.forEach(comment => {
            createCommentElement(comment, currentUser);
        });
    };

    const addNewComment = (event) => {
        event.preventDefault();
         comments.push({
            id: randomId(),
            content: textAreaForm.value,
            date: 'now',
            like: 0,
            avatar: currentUser.avatar,
            name: currentUser.name,
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
        
        renderCommentsList(comments, currentUser);
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
         });

            renderCommentsList(comments, currentUser);
            document.body.removeChild(modalContainer);
        };
        
        const modalContainer = document.createElement('div');
        modalContainer.classList.add('modal-container');
        modalContainer.appendChild(createDeleteCommentModalElement(id, cancelModal, () => deleteComment(id)));
        document.body.appendChild(modalContainer);
    };

    addForm.addEventListener('submit', addNewComment);