/* eslint jsx-a11y/anchor-is-valid: off */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Container, Header, Comment, Segment, Button, Icon, Modal, Divider } from 'semantic-ui-react';
import values from 'lodash/values';
import { Link } from 'react-router-dom';
import orderBy from 'lodash/orderBy';
import Layout from '../app/Layout';
import { fetchPost, fetchPosts, deletePost, voteUpPost, voteDownPost } from './PostActions';
import CommentBlock from '../comment/CommentBlock';
import AddCommentForm from '../comment/AddCommentForm';
import PageHeader from '../app/PageHeader';
import { fetchComments, createComment, deleteComment } from '../comment/CommentActions';

class PageDetail extends Component {
  state = {
    modalOpen: false
  };

  componentDidMount() {
    const { boundFetchPost, boundFetchComments, match } = this.props;
    boundFetchPost(match.params.id)
      .then(() => boundFetchComments(match.params.id))
  }

  onDeletePost = e => {
    e.preventDefault();
    const { match, boundDeletePost } = this.props;
    boundDeletePost(match.params.id).then(this.props.history.push('/'));
  };

  onDeleteComment = id => {
    this.props.boundDeleteComment(id)
    // this.props.boundFetchComments(this.props.match.params.id)
  }

  onClickVoteUpButton = e => {
    const { boundVoteUpPost, match, boundFetchPost } = this.props;
    boundVoteUpPost(match.params.id).then(() => boundFetchPost(match.params.id));
  };

  onClickVoteDownButton = e => {
    const { boundVoteDownPost, match, boundFetchPost } = this.props;
    boundVoteDownPost(match.params.id).then(() => boundFetchPost(match.params.id));
  };

  closeModal = () => {
    this.setState({
      modalOpen: false,
    });
  };

  openModal = () => {
    this.setState({
      modalOpen: true,
    });
  };

  render() {
    const { modalOpen } = this.state;
    const postId = this.props.match.params.id;
    const post = this.props.posts[postId]
    return (
      <Layout>
        <Container text style={{ marginBottom: '20px' }}>
        {!this.props.post.id && (
          <Segment massive raised>
            <Header>404</Header>
            <Header>Page Not Found</Header>
          </Segment>
        )}
        {this.props.post.deleted && (
          <Segment massive raised>
            <Header>404</Header>
            <Header>Page Not Found</Header>
          </Segment>
        )}
          {this.props.post && this.props.post.id && (
            <div>
              <PageHeader icon="book" title={this.props.post.title} />
              <Segment clearing basic>
                <Button.Group floated="right">
                  <Button color="pink" onClick={this.onClickVoteUpButton}>
                    <Icon name="thumbs outline up" />
                  </Button>
                  <Button color="pink" onClick={this.onClickVoteDownButton}>
                    <Icon name="thumbs outline down" />
                  </Button>
                  <Button color="pink">
                    <Icon name="edit" />
                    <Link to={`/edit-post/${postId}`} role={Button}>
                      Edit Post
                    </Link>
                  </Button>
                  <Modal
                    open={modalOpen}
                    onClose={this.closeModal}
                    trigger={
                      <Button color="pink" onClick={this.openModal}>
                        <Icon name="remove circle" />Delete Post
                      </Button>
                    }
                    basic
                    size="small"
                  >
                    <Header icon="remove" content="Delete Post" />
                    <Modal.Content>
                      <p>Are you sure you want to delete this post?</p>
                    </Modal.Content>
                    <Modal.Actions>
                      <Button basic color="red" inverted onClick={this.closeModal}>
                        <Icon name="remove" /> No
                      </Button>
                      <Button color="green" inverted onClick={this.onDeletePost}>
                        <Icon name="checkmark" /> Yes
                      </Button>
                    </Modal.Actions>
                  </Modal>
                </Button.Group>
              </Segment>
              <Divider />
              <Segment clearing basic size="massive">
                <Header as="h1" floated="left">
                  <Header.Subheader style={{ paddingTop: '2px' }}>Votes Received: {this.props.post.voteScore}
                  Comment Count: {this.props.comments.length}
                  </Header.Subheader>
                </Header>
              </Segment>
              <p>{this.props.post.body}</p>
              <Comment.Group size="big">
                <Header as="h5" dividing>
                  Comments
                </Header>
                {this.props.comments.map(comment => <CommentBlock onDeleteComment={this.onDeleteComment} key={comment.id} {...comment} postId={postId} />)}
                <AddCommentForm submit={createComment} postId={postId} />
              </Comment.Group>
            </div>
          )}
        </Container>
      </Layout>
    );
  }
}

PageDetail.propTypes = {
  boundFetchPost: PropTypes.func.isRequired,
  boundFetchComments: PropTypes.func.isRequired,
  boundDeletePost: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  comments: PropTypes.objectOf(PropTypes.objects).isRequired,
  post: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  match: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  boundVoteDownPost: PropTypes.func.isRequired,
  boundVoteUpPost: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  posts: state.posts.postList,
  post: state.posts.currentPost,
  comments: orderBy(values(state.comments), comment => comment.voteScore, 'desc'),
});

const mapDispatchToProps = dispatch => ({
  boundFetchPosts: () => dispatch(fetchPosts()),
  boundFetchPost: id => dispatch(fetchPost(id)),
  boundFetchComments: id => dispatch(fetchComments(id)),
  boundDeletePost: id => dispatch(deletePost(id)),
  boundVoteUpPost: id => dispatch(voteUpPost(id)),
  boundVoteDownPost: id => dispatch(voteDownPost(id)),
  boundDeleteComment: id => dispatch(deleteComment(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(PageDetail);
