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
                answers: comment.replies,
            }
        });
        currentUser = {
            image: data.currentUser.image.webp,
            user: data.currentUser.username,
        }
    });



    