import { renderCommentsList } from './dom-utils.js'

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