import mapKeys from 'lodash/mapKeys';
import { RECEIVE_POST_LIST } from './PostActions';

function postReducer(state = {}, action) {
  switch (action.type) {
    case RECEIVE_POST_LIST:
      const newPosts = mapKeys(action.posts, 'id');
      return {
        ...state,
        ...newPosts
      };
    default:
      return state;
  }
}

export default postReducer;
