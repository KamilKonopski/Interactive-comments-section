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
        init(comments, currentUser)
    });

const createLikesElement = (score) => {
    const likeContainer = document.createElement('div');
    likeContainer.classList.add('like__container')

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

    return likeContainer
};

const createUserInfoElement = (avatar, name, date) => {
    const userInfoContainer = document.createElement('div');
    userInfoContainer.classList.add('user__container');

    const userAvatar = document.createElement('div');
    userAvatar.classList.add('user__avatar');
    userAvatar.innerHTML = `<img class='comment__user-image' src="${avatar}" alt="${name} avatar"/>`
    userInfoContainer.appendChild(userAvatar)

    const userName = document.createElement('span');
    userName.classList.add('user__name');
    userName.innerText = `${name}`;
    userInfoContainer.appendChild(userName);

    const userDate = document.createElement('span');
    userDate.classList.add('user__date');
    userDate.innerText = `${date}`;
    userInfoContainer.appendChild(userDate);

    return userInfoContainer
};

const createReplyButtonElement = () => {
    const replyButton = document.createElement('button');
    replyButton.classList.add('reply-btn');
    replyButton.innerHTML = "<img class='comment__reply-btn-image' src='../images/icon-reply.svg' alt='reply button icon'/> Reply";

    return replyButton
};

const createContentElement = (content) => {
    const userContent = document.createElement('p');
    userContent.classList.add('content');
    userContent.innerText = `${content}`;

    return userContent;
}

const createCommentContainerElement = (comment) => {
    const commentContainer = document.createElement('div');
    commentContainer.classList.add('comment');
    commentContainer.setAttribute('data-user', `${comment.user}`);

    commentContainer.appendChild(createLikesElement(comment.like));
    commentContainer.appendChild(createUserInfoElement(comment.avatar, comment.userName, comment.date));
    commentContainer.appendChild(createReplyButtonElement());
    commentContainer.appendChild(createContentElement(comment.content));

    comment.replies.forEach(reply => {
        commentContainer.appendChild(createReplyCommentElement(reply))
    })

    return commentContainer
}


const createSingleCommentElement = (comment) => {
    commentsContainer.appendChild(createCommentContainerElement(comment));
};

const createReplyCommentElement = (reply) => {
    const replyContainter = document.createElement('div');
    replyContainter.classList.add('comment__reply');
    replyContainter.setAttribute('data-user', `${reply.replyingTo}`)

    replyContainter.appendChild(createLikesElement(reply.score));
    replyContainter.appendChild(createUserInfoElement(reply.user.image.webp, reply.user.username, reply.createdAt));
    replyContainter.appendChild(createReplyButtonElement())
    replyContainter.appendChild(createContentElement(reply.content))

    return replyContainter
}

const init = (comments, currentUser) => {
    comments.forEach(comment => {
        createSingleCommentElement(comment, currentUser);
    });
}; 
