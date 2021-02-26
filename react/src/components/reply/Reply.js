import React, { Component } from 'react';
import './Reply.css';

class Reply extends Component {
  constructor(props) {
    super(props);
    //id, content, boardid, userid,createDate
    console.log(props);
  }
  componentDidMount() {}

  render() {
    return (
      <>
        <div className="d-flex flex-column rounded border mb-1">
          <p className="p-2">{this.props.reply.username}</p>
          <p className="p-2 overFlowWord">{this.props.reply.content}</p>
          <div className="d-flex justify-content-between">
            <p className="p-2 overFlowWord">{this.props.reply.createDate}</p>
            <div className="d-flex m-1">
              {/* 작성자 userid와 현재 로그인한 사용자 userid가 동일할때만 보여준다 */}
              {this.props.reply.userid === this.props.UserDetails.id ? (
                <>
                  <button
                    className="btn btn-sm btn-primary rounded m-1"
                    onClick={() => this.props.toggleModalReply(this.props.reply.id)}
                  >
                    수정
                  </button>
                  <button
                    className="btn btn-sm btn-primary rounded m-1"
                    onClick={() => this.props.ReplyDelete(this.props.reply.id)}
                  >
                    삭제
                  </button>
                </>
              ) : (
                ''
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Reply;
