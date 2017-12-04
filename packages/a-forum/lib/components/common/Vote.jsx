import { Components, registerComponent, withMessages } from 'meteor/vulcan:core';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withVote, hasVotedClient } from 'meteor/vulcan:voting';
import { FormattedMessage, intlShape } from 'meteor/vulcan:i18n';

class Vote extends PureComponent {

  constructor() {
    super();
    this.getActionClass = this.getActionClass.bind(this);
  }

  componentWillReceiveProps(nextProps) {
  }

  vote(e, voteType) {
    e.preventDefault();

    const document = this.props.document;
    const collection = this.props.collection;
    const user = this.props.currentUser;

    if(!user){
      this.props.flash(this.context.intl.formatMessage({id: 'users.please_log_in'}));
    } else {
      this.props.vote({document, voteType: voteType, collection, currentUser: this.props.currentUser});
    } 
  }

  myCurrentVoteScore() {
    let myVoteScore = 0;
    if (hasVotedClient({document: this.props.document, voteType: 'upvote'})) myVoteScore++;
    if (hasVotedClient({document: this.props.document, voteType: 'downvote'})) myVoteScore--;
    return myVoteScore;
  }
  hasVoted(voteType) {
    return hasVotedClient({document: this.props.document, voteType: voteType})
  }

  getActionClass() {
    const actionsClass = classNames({
      'vote-button': true,
      'upvoted': this.hasVoted('upvote'),
      'downvoted': this.hasVoted('downvote')
    });

    return actionsClass;
  }

  render() {
    const {baseScore} = this.props.document;
    const voteScore = baseScore;
    // const voteScore = baseScore + this.myCurrentVoteScore();

    return (
      <div className={this.getActionClass()}>
        <a className="button-upvote" onClick={ev => this.vote(ev, 'upvote')}>
          <Components.Icon name="upvote" />
          <div className="sr-only"><FormattedMessage id="voting.upvote"/></div>
        </a>
        <div className="vote-count">{voteScore || 0}</div>
        <a className="button-downvote" onClick={ev => this.vote(ev, 'downvote')}>
          <Components.Icon name="downvote" />
          <div className="sr-only"><FormattedMessage id="voting.downvote"/></div>
        </a>
      </div>
    )
  }

}

Vote.propTypes = {
  document: PropTypes.object.isRequired, // the document to upvote
  collection: PropTypes.object.isRequired, // the collection containing the document
  vote: PropTypes.func.isRequired, // mutate function with callback inside
  currentUser: PropTypes.object, // user might not be logged in, so don't make it required
};

Vote.contextTypes = {
  intl: intlShape
};

registerComponent('Vote', Vote, withMessages, withVote);
