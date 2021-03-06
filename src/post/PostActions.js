import axios from 'axios';
import uuidv4 from 'uuid/v4';

export const RECEIVE_POST_LIST = 'RECEIVE_POST_LIST';
export const RECEIVE_CURRENT_POST = 'RECEIVE_CURRENT_POST';
export const UPDATE_POST = 'UPDATE_POST';
export const SET_COMMENT_COUNT = 'SET_COMMENT_COUNT';

export const receivePostList = posts => ({
  type: RECEIVE_POST_LIST,
  posts,
});

export const receiveCurrentPost = post => ({
  type: RECEIVE_CURRENT_POST,
  post,
});

export const fetchComments = postId => () =>  fetch(`/posts/${postId}/comments`, {
    method: 'GET',
    headers: {
      Authorization: 'saviojoseph',
    },
  })
    .then(res => res.json())

export const updateCommentCount = payload => ({
  type: SET_COMMENT_COUNT,
  payload,
})

// export const fetchCommentCount = postId => dispatch =>
//   fetch(`/posts/${postId}/comments`, {
//     method: 'GET',
//     headers: {
//       Authorization: 'saviojoseph',
//     },
//   })
//   .then(res => res.json())
//   .then(comments => dispatch(updateCommentCount({postId: postId, commentCount: comments.length})))

export const fetchCommentCount = postId => dispatch =>
  axios
  .get(`/posts/${postId}/comments`, { headers: { Authorization: 'saviojoseph' }})
  .then(res => console.log(postId, res.data))
  //.then(res => dispatch(updateCommentCount({postId: postId, commentCount: res.data.length})))


export const fetchPosts = () => dispatch =>
  axios
    .get('/posts', { headers: { Authorization: 'saviojoseph' } })
    .then(res => dispatch(receivePostList(res.data.filter(post => post.deleted === false))))
    .catch(err => console.log(err));

export const createPost = data => dispatch =>
  axios
    .post(
      '/posts',
      {
        id: uuidv4(),
        timestamp: Date.now(),
        title: data.title,
        body: data.body,
        author: data.author,
        category: data.category
      },
      { headers: { Authorization: 'saviojoseph' } },
    )
    .then(() => dispatch(fetchPosts()))
    .catch(err => console.log(err));

export const editPost = (postId, data) => dispatch =>
  axios
    .put(
      `/posts/${postId}`,
      {
        title: data.title,
        body: data.body,
      },
      { headers: { Authorization: 'saviojoseph' } },
    )
    .then(res => console.log(res));

export const deletePost = postId => dispatch =>
  axios
    .delete(
      `/posts/${postId}`,
      { headers: { Authorization: 'saviojoseph' }}
    )
    .then(res => res.data)
    .then(() => dispatch({type:RECEIVE_CURRENT_POST, post: {}}))


export const fetchPost = id => dispatch =>
  axios.get(`/posts/${id}`, { headers: { Authorization: 'saviojoseph' } }).then(res => dispatch(receiveCurrentPost(res.data)));

export const voteUpPost = id => dispatch =>
    axios.post(`/posts/${id}`, {option: 'upVote'}, { headers: { Authorization: 'saviojoseph' }})

export const voteDownPost = id => dispatch =>
    axios.post(`/posts/${id}`, {option: 'downVote'}, { headers: { Authorization: 'saviojoseph' }})
