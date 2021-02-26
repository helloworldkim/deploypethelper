import React, { Component } from 'react';

class MoreReply extends Component {
  render() {
    return (
      <div className="row m-1 d-flex justify-content-center">
        <button className="btn btn-primary btn-sm" onClick={this.props.getMoreReply}>
          댓글 더보기
        </button>
      </div>
    );
  }
}

export default MoreReply;
