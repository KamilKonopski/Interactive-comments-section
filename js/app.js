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
                image: comment.user.image.webp,
                user: comment.user.username,
                replies: comment.replies,
            }
        });
        currentUser = {
            image: data.currentUser.image.webp,
            userName: data.currentUser.username,
        }

        init(comments)
    });

const createLikesCommentElement = (comment) => {
    const likeContainer = document.createElement('div');
    likeContainer.classList.add('comment__like-container')

    const plusBtn = document.createElement('button');
    plusBtn.classList.add('comment__plus');
    plusBtn.innerHTML = "<img class='comment__plus-image' src='../images/icon-plus.svg' alt='adding like icon'/>";
    likeContainer.appendChild(plusBtn);

    const like = document.createElement('span');
    like.classList.add('comment__like');
    like.innerText = comment.like;
    likeContainer.appendChild(like);

    const minusBtn = document.createElement('button');
    minusBtn.classList.add('comment__minus');
    minusBtn.innerHTML = "<img class='comment__plus-image' src='../images/icon-minus.svg' alt='subtracting like icon'/>";
    likeContainer.appendChild(minusBtn);

    return likeContainer
};

const createUserInfoElement = (comment) => {
    const userInfoContainer = document.createElement('div');
    userInfoContainer.classList.add('comment__user-container');

    const userAvatar = document.createElement('div');
    userAvatar.classList.add('comment__user-avatar');
    userAvatar.innerHTML = `<img class='comment__user-image' src="${comment.image}" alt="${comment.user} avatar"/>`
    userInfoContainer.appendChild(userAvatar)

    const userName = document.createElement('span');
    userName.classList.add('comment__user-name');
    userName.innerText = comment.user;
    userInfoContainer.appendChild(userName);

    const userDate = document.createElement('span');
    userDate.classList.add('comment__user-date');
    userDate.innerText = comment.date;
    userInfoContainer.appendChild(userDate);

    return userInfoContainer
};

const createReplyButtonElement = () => {
    const replyButton = document.createElement('button');
    replyButton.classList.add('comment__reply-btn');
    replyButton.innerHTML = "<img class='comment__reply-btn-image' src='../images/icon-reply.svg' alt='reply button icon'/> Reply";

    return replyButton
};

const createContentElement = (comment) => {
    const userContent = document.createElement('p');
    userContent.classList.add('comment__content');
    userContent.innerText = comment.content;

    return userContent;
}

const createSingleCommentElement = (comment) => {
    const commentContainer = document.createElement('div');
    commentContainer.classList.add('comment')

    commentContainer.appendChild(createLikesCommentElement(comment));
    commentContainer.appendChild(createUserInfoElement(comment));
    commentContainer.appendChild(createReplyButtonElement());
    commentContainer.appendChild(createContentElement(comment));

    commentsContainer.appendChild(commentContainer);
};

const init = () => {
    comments.forEach(comment => {
        createSingleCommentElement(comment);
        
    });
}; 