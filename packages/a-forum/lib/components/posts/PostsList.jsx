import { Components, registerComponent, withList, withCurrentUser, Utils } from 'meteor/vulcan:core';
import React from 'react';
import PropTypes from 'prop-types';
import { Posts } from '../../modules/posts/index.js';
import Alert from 'react-bootstrap/lib/Alert'
import { FormattedMessage, intlShape } from 'meteor/vulcan:i18n';
import classNames from 'classnames';

const Error = ({error}) => <Alert className="flash-message" bsStyle="danger"><FormattedMessage id={error.id} values={{value: error.value}}/>{error.message}</Alert>

class PostsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resultList: [],
      fixRender: 0
    }
  }

  componentWillMount() {
    if (this.props.results && this.props.results.length > 0) {
      this.setState({resultList: this.props.results.map(post => post._id)})
    }
  }
  componentWillUpdate(nextProps, nextState) {
    if (
      (this.props.terms.view !== nextProps.terms.view ||
      !this.props.results ||
      this.props.results.length !== nextProps.results.length
      ) && nextProps.results
    ) {
      this.setState({resultList: nextProps.results.map(post => post._id)})   
    }
  }

  render() {
    const {className, results, loading, count, totalCount, loadMore, showHeader = true, showLoadMore = true, networkStatus, currentUser, error, terms} = this.props;

    const loadingMore = networkStatus === 2;

    if (results && results.length) {

      const hasMore = totalCount > results.length;

      return (
        <div className={classNames(className, 'posts-list', `posts-list-${terms.view}`)}>
          {showHeader ? <Components.PostsListHeader/> : null}
          {error ? <Error error={Utils.decodeIntlError(error)} /> : null }
          <div className="posts-list-content">
            {this.state.resultList.map(id => {
              return results.filter(item => item._id === id).map(post => <Components.PostsItem post={post} key={post._id} currentUser={currentUser} terms={terms} />)
            })}            
            {/*
            {results.map(post => <Components.PostsItem post={post} key={post._id} currentUser={currentUser} terms={terms} />)}
            */}
          </div>
          {showLoadMore ? 
            hasMore ? 
              <Components.PostsLoadMore loading={loadingMore} loadMore={loadMore} count={count} totalCount={totalCount} /> : 
              <Components.PostsNoMore/> : 
            null
          }
        </div>
      )
    } else if (loading) {
      return (
        <div className={classNames(className, 'posts-list')}>
          {showHeader ? <Components.PostsListHeader /> : null}
          {error ? <Error error={Utils.decodeIntlError(error)} /> : null }
          <div className="posts-list-content">
            <Components.PostsLoading/>
          </div>
        </div>
      )
    } else {
      return (
        <div className={classNames(className, 'posts-list')}>
          {showHeader ? <Components.PostsListHeader /> : null}
          {error ? <Error error={Utils.decodeIntlError(error)} /> : null }
          <div className="posts-list-content">
            <Components.PostsNoResults/>
          </div>
        </div>
      )  
    }

  }
}

/*
const PostsList = ({className, results, loading, count, totalCount, loadMore, showHeader = true, showLoadMore = true, networkStatus, currentUser, error, terms}) => {

  const loadingMore = networkStatus === 2;

  if (results && results.length) {

    const hasMore = totalCount > results.length;

    return (
      <div className={classNames(className, 'posts-list', `posts-list-${terms.view}`)}>
        {showHeader ? <Components.PostsListHeader/> : null}
        {error ? <Error error={Utils.decodeIntlError(error)} /> : null }
        <div className="posts-list-content">
          <FlipMove duration={350} easing="ease-out">
          {results.map(post => <Components.PostsItem post={post} key={post._id} currentUser={currentUser} terms={terms} />)}
          </FlipMove>
        </div>
        {showLoadMore ? 
          hasMore ? 
            <Components.PostsLoadMore loading={loadingMore} loadMore={loadMore} count={count} totalCount={totalCount} /> : 
            <Components.PostsNoMore/> : 
          null
        }
      </div>
    )
  } else if (loading) {
    return (
      <div className={classNames(className, 'posts-list')}>
        {showHeader ? <Components.PostsListHeader /> : null}
        {error ? <Error error={Utils.decodeIntlError(error)} /> : null }
        <div className="posts-list-content">
          <FlipMove duration={350} easing="ease-out">
          <Components.PostsLoading/>
          </FlipMove>
        </div>
      </div>
    )
  } else {
    return (
      <div className={classNames(className, 'posts-list')}>
        {showHeader ? <Components.PostsListHeader /> : null}
        {error ? <Error error={Utils.decodeIntlError(error)} /> : null }
        <div className="posts-list-content">
          <FlipMove duration={350} easing="ease-out">
          <Components.PostsNoResults/>
          </FlipMove>
        </div>
      </div>
    )  
  }
  
};
*/

PostsList.displayName = "PostsList";

PostsList.propTypes = {
  results: PropTypes.array,
  terms: PropTypes.object,
  hasMore: PropTypes.bool,
  loading: PropTypes.bool,
  count: PropTypes.number,
  totalCount: PropTypes.number,
  loadMore: PropTypes.func,
  showHeader: PropTypes.bool,
};

PostsList.contextTypes = {
  intl: intlShape
};

// const options = {
//   collection: Posts,
//   queryName: 'postsListQuery',
//   fragmentName: 'PostsList',
// };
const options = {
  collection: Posts,
  queryName: 'postsListQuery',
  fragmentName: 'PostsList',
  limit: 5
};

registerComponent('PostsList', PostsList, withCurrentUser, [withList, options]);
