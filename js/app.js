import { renderCommentsList } from './dom-utils.js'

const addForm = document.querySelector('.add-comment__form');
const textAreaForm = document.querySelector('.add-comment__text');
const commentsContainer = document.querySelector('.comments-container');

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

    const addNewComment = (event) => {
        event.preventDefault();
        console.log(textAreaForm.value);
        commentsContainer.innerHTML = "";
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

    addForm.addEventListener('submit', addNewComment)