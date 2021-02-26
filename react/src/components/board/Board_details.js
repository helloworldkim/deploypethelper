import React, { Component } from 'react';
import queryString from 'query-string';
import BoardApiService from '../ApiService/BoardApiService';
import JWTService from '../JWTService/JWTService';
import ReplyApiService from '../ApiService/ReplyApiService';
import Reply from '../reply/Reply';
import MoreReply from '../reply/MoreReply';
import UserApiService from '../ApiService/UserApiService';
import './Board_details.css';
import { Modal } from 'reactstrap';

class Board_details extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //모달창 띄워줄 기본값 설정
      modalReply: false,
      modalBoard: false,
      //호출시 기본값 설정없으면 오류 발생함 기본값 설정해둠
      BoardDetails: {
        id: Number,
        title: String,
        userid: Number,
        count: Number,
        content: String,
        createDate: String,
      },
      //기본 보여줄 댓글페이지 5개 기준 1페이지
      replyPageNum: 1,
      //this.state 초기값 없는경우 삼항연산에서 오류발생함 기초값 설정
      UserDetails: {
        id: Number,
        username: String,
      },
    };
  }

  //컴포넌트를 다 그린뒤 수행
  componentDidMount() {
    console.log('======================================');
    let query = this.getQueryString();
    console.log(Number(query.boardid));
    //해당 게시물의 상세정보와 게시글 정보를 다 가져온다
    this.getUserDetails(Number(query.boardid));
  }

  //JWT 토큰으로 해당 유저정보 호출
  getUserDetails = (boardid) => {
    const JWT = sessionStorage.getItem('Authorization');
    console.log('board에서 체크하는 토큰값:', JWT);

    //만약 사용자가 로그인 안한상태라면(JWT토큰없다면) 메서드 실행X
    if (JWT == null) {
      return;
    }

    //해당 유저정보 받는부분
    UserApiService.getUserDetails(JWT)
      .then((res) => {
        console.log(res);
        //전달받은 User정보
        let UserDetails = res.data.userDetails;
        this.setState(
          {
            UserDetails: UserDetails,
          },
          //정보를 받고 콜백함수
          () => {
            //작성자 이름과 현재 로그인 사용자의 이름이 동일한경우 삭제,수정을 보여주는 형식이라 여기서 호출해야함
            this.getBoardDetails(boardid);
            //댓글에 수정,삭제 부분을 위해서 현재 회원정보가 호출된 후에 댓글정보를 불러와야함
            this.getReplyList(boardid);
          }
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //queryString에 있는 정보를 가져와 전달 객체형태로 반환받는다
  getQueryString = () => {
    let query = queryString.parse(this.props.location.search);
    // console.log(query);
    return query;
  };

  // 해당 게시물의 정보를 불러오는 메서드
  getBoardDetails = (boardid) => {
    console.log('getBoardDetails 메서드 호출');
    // console.log(boardid);
    BoardApiService.boardDetails(boardid)
      .then((res) => {
        console.log(res);
        let BoardDetails = res.data;
        this.setState({ BoardDetails: BoardDetails });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  //목록 누르면 이전페이지로 돌아가는 메서드
  gotoBoardList = () => {
    console.log('gotoBoardList 메서드 호출');
    this.props.history.goBack();
  };
  //state 값 변경 등록 메서드
  onChangeValues = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  // REPLY 작성 메서드
  ReplyWrite = () => {
    console.log('ReplyWrite 메서드 호출');
    let content = this.state.content;
    let boardid = this.state.BoardDetails.id;
    //로그인된 사용자만 이용가능 JWT토큰 확인
    let JWT = sessionStorage.getItem('Authorization');

    //토큰값이 없는경우 login 페이지로 보내버림
    JWTService.checkLogin(JWT);

    // Reply 객체 생성(등록할 게시글의 아이디, 작성한 댓글의 내용을 전달한다)
    let Reply = {
      boardid: boardid,
      content: content,
    };
    //댓글 내용과 보낼 JWT토큰을 같이 전달
    ReplyApiService.ReplyWrite(JWT, Reply)
      .then((res) => {
        console.log(res);
      })
      .then(() => {
        //작성된 댓글을 지우고 해당 게시물의 댓글을 새로 받아온다
        this.setState(
          {
            content: '',
          },
          () => {
            this.getReplyList(this.state.BoardDetails.id);
          }
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };
  //해당 리스트의 댓글들을 가져온다
  getReplyList = (boardid) => {
    let replyPageNum = this.state.replyPageNum;
    console.log('getReplyList 메서드 호출');
    ReplyApiService.ReplyList(boardid, replyPageNum)
      .then((res) => {
        console.log(res);
        let replyList = res.data.replyList;
        let replyCount = res.data.replyCount;
        this.setState({
          replyList: replyList,
          replyCount: replyCount,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // 댓글 더 보기를 눌렀을때 해당 메서드 호출
  getMoreReply = () => {
    console.log('getMoreReply 메소드 호출');
    console.log(this.state.replyPageNum);
    let replyPageNum = this.state.replyPageNum;

    //현재 페이지넘버를 1증가 시키고, 다시 댓글을 호출해서 그려준다
    this.setState(
      {
        replyPageNum: replyPageNum + 1,
      },
      () => {
        this.getReplyList(this.state.BoardDetails.id);
      }
    );
  };
  //댓글 삭제 수행 메서드
  ReplyDelete = (replyid) => {
    console.log('ReplyDelete 메서드 호출');
    console.log('전달받은 댓글 id값:', replyid);

    //삭제확인
    if (!window.confirm('정말로 삭제하시겠습니까?')) {
      return;
    }

    //토큰불러오기
    const JWT = sessionStorage.getItem('Authorization');
    console.log('ReplyDelete에서 체크하는 토큰값:', JWT);

    //Reply 객체생성
    let Reply = {
      id: replyid,
    };

    //삭제메서드 수행
    ReplyApiService.ReplyDelete(JWT, Reply)
      .then((res) => {
        console.log(res);
        // 새로이 랜더링 시작
        this.getReplyList(this.state.BoardDetails.id);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //게시글 삭제 수행 메서드
  BoardDelete = (boardid) => {
    console.log('BoardDelete 메서드 호출');
    console.log('전달받은 댓글 id값:', boardid);

    //삭제확인
    if (!window.confirm('정말로 삭제하시겠습니까?')) {
      return;
    }

    //토큰불러오기
    const JWT = sessionStorage.getItem('Authorization');
    console.log('ReplyDelete에서 체크하는 토큰값:', JWT);

    //Reply 객체생성
    let Board = {
      id: boardid,
    };

    //삭제메서드 수행
    BoardApiService.boardDelete(JWT, Board)
      .then((res) => {
        console.log(res);
        // 응답이 제대로 오면 게시판 목록으로
        this.gotoBoardList();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //전달받은 id값이 존재할경우 replyid값을 state에 저장한다
  toggleModalReply = (replyid) => {
    console.log('toggleModalReply 메서드 호출');
    //그외에 그냥 모달창을 닫을때!
    //모달창 상태변경
    this.setState({ modalReply: !this.state.modalReply });

    //전달받은 값이 존재한다면 해당값을 state에 저장한다(모달창맨 처음 열었을때)
    if (typeof replyid === 'number') {
      this.setState({ modalReply: !this.state.modalReply, replyid: replyid });
    }
  };

  //댓글 수정하는 메서드
  ReplyUpdate = () => {
    //댓글 수정내용 및 해당 댓글 아이디
    // console.log(this.state.replyContent);
    // console.log(this.state.replyid);

    let replyid = this.state.replyid;
    let replyContent = this.state.replyContent;

    //객체생성
    let Reply = {
      id: replyid,
      content: replyContent,
    };

    let JWT = sessionStorage.getItem('Authorization');
    //JWT토큰으로 로그인 여부 체크
    //정상토큰의 경우에는 따로 리턴값을 받지않음 값이 존재한다면 만료 or 비정상토큰
    let result = JWTService.validateUser(JWT);
    if (result != null) {
      return;
    }

    //댓글 수정 수행하는 메서드
    ReplyApiService.ReplyUpdate(JWT, Reply)
      .then((res) => {
        console.log(res);

        //댓글 모달창을 닫는다
        this.toggleModalReply();
        //수정 이후에 페이지를 새로 랜더링 맨 처음 부르는건 사용자 정보임
        this.getUserDetails(this.state.BoardDetails.id);
        //이전에 작성한 replyContent값을 초기화시킴
        this.setState({
          replyContent: '',
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //게시글 수정 메서드
  BoardUpdate = () => {
    let boardId = this.state.BoardDetails.id;
    let boardTitle = this.state.boardTitle;
    let boardContent = this.state.boardContent;

    //객체생성
    let Board = {
      id: boardId,
      title: boardTitle,
      content: boardContent,
    };

    let JWT = sessionStorage.getItem('Authorization');
    //JWT토큰으로 로그인 여부 체크
    //정상토큰의 경우에는 따로 리턴값을 받지않음 값이 존재한다면 만료 or 비정상토큰
    let result = JWTService.validateUser(JWT);
    if (result != null) {
      return;
    }

    //게시글 수정 수행하는 메서드
    BoardApiService.boardUpdate(JWT, Board)
      .then((res) => {
        console.log(res);

        //댓글 모달창을 닫는다
        this.toggleModalBoard();
        //수정 이후에 페이지를 새로 랜더링 맨 처음 부르는건 사용자 정보임
        this.getUserDetails(boardId);
        //이전에 작성한 값들을 초기화시킴
        this.setState({
          boardContent: '',
          boardTitle: '',
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //true,false 값을 반대로 전환시키는 메서드
  toggleModalBoard = () => {
    console.log('toggleModalBoard 메서드 호출');
    this.setState({ modalBoard: !this.state.modalBoard });
  };
  render() {
    return (
      <div className="container">
        <div className="row">
          <table className="table">
            <thead>
              <tr>
                <th className="text-justify">상세보기</th>
                <td>
                  {/* 작성자(username)와 현재 로그인한 사용자(username)가 동일할때만 보여준다 */}
                  {this.state.BoardDetails.username === this.state.UserDetails.username ? (
                    <>
                      <div
                        className="btn float-right m-2"
                        onClick={() => this.BoardDelete(this.state.BoardDetails.id)}
                      >
                        삭제
                      </div>
                      <div className="btn float-right m-2" onClick={this.toggleModalBoard}>
                        수정
                      </div>
                    </>
                  ) : (
                    ''
                  )}
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>글번호</th>
                <td>{this.state.BoardDetails.id}</td>
              </tr>
              <tr>
                <th>제목</th>
                <td>
                  <h2>{this.state.BoardDetails.title}</h2>
                </td>
              </tr>
              <tr>
                <th>작성자</th>
                <td>{this.state.BoardDetails.username}</td>
              </tr>
              <tr>
                <th>조회수</th>
                <td>{this.state.BoardDetails.count}</td>
              </tr>
              <tr>
                <th>작성일</th>
                <td>{this.state.BoardDetails.createDate}</td>
              </tr>
              <tr>
                <th>글내용</th>
                <td className="p-2 overFlow form-group">
                  <textarea
                    readOnly
                    value={this.state.BoardDetails.content}
                    className="form-control"
                    rows="10"
                  >
                    {this.state.BoardDetails.content}
                  </textarea>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <textarea
            placeholder="댓글을 입력해주세요"
            className="form-control"
            rows="2"
            cols="100"
            name="content"
            value={this.state.content}
            onChange={this.onChangeValues}
          />
          <div className="d-flex justify-content-center">
            <button
              className="btn btn-danger btn-lg"
              onClick={this.ReplyWrite}
              style={{ margin: 10 }}
            >
              댓글
            </button>
            <button
              className="btn btn-primary btn-lg"
              onClick={this.gotoBoardList}
              style={{ margin: 10 }}
            >
              목록
            </button>
          </div>
        </div>
        {this.state.replyList
          ? this.state.replyList.map((reply) => {
              return (
                <Reply
                  key={reply.id}
                  reply={reply}
                  toggleModalReply={this.toggleModalReply}
                  UserDetails={this.state.UserDetails}
                  ReplyDelete={this.ReplyDelete}
                />
              );
            })
          : ''}
        {/* 댓글 갯수가 5개 이상, 현재 불러온 댓글 갯수가 총 갯수보다 작아야지만 댓글 더 보기를 보여준다 */}
        {this.state.replyCount > 5 && this.state.replyPageNum * 5 < this.state.replyCount ? (
          <MoreReply getMoreReply={this.getMoreReply}></MoreReply>
        ) : (
          ''
        )}
        {/* 댓글 수정 모달창 구현부분 */}
        <Modal
          isOpen={this.state.modalReply}
          toggle={this.toggleModalReply}
          size="lg"
          className="my-modal"
          style={{ maxWidth: '900px', width: '80%' }}
        >
          <div className="container">
            <div className="row">
              <div className="col">
                <h2 className="text-center">댓글수정</h2>
              </div>

              <textarea
                placeholder="수정하실 내용을 입력하세요"
                className="form-control"
                rows="2"
                cols="100"
                name="replyContent"
                value={this.state.replyContent}
                onChange={this.onChangeValues}
              />
              <div className="d-flex flex-row justify-content-end">
                <div className="col-xs">
                  <button className="btn btn-primary m-1" onClick={this.ReplyUpdate}>
                    수정하기
                  </button>
                  <button className="btn btn-danger m-1" onClick={this.toggleModalReply}>
                    닫기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Modal>
        {/* 게시글 수정 모달창 구현부분 */}
        <Modal
          isOpen={this.state.modalBoard}
          toggle={this.toggleModalBoard}
          size="lg"
          className="my-modal"
          style={{ maxWidth: '900px', width: '80%' }}
        >
          <div className="container">
            <div className="d-flex flex-column">
              <div className="col">
                <h2 className="text-center p-3">게시글 수정</h2>
              </div>
            </div>
            <div className="form-group">
              <label>제목</label>
              <input
                type="text"
                className="form-control"
                placeholder="수정할 제목을 입력해주세요"
                name="boardTitle"
                value={this.state.boardTitle}
                onChange={this.onChangeValues}
              />
            </div>

            <div className="form-group">
              <label>게시글 내용</label>
              <textarea
                placeholder="수정할 내용을 입력하세요"
                className="form-control"
                rows="5"
                name="boardContent"
                value={this.state.boardContent}
                onChange={this.onChangeValues}
              />
            </div>
            <div className="d-flex flex-row justify-content-end">
              <div className="col-xs">
                <button className="btn btn-primary m-1" onClick={this.BoardUpdate}>
                  게시글 수정
                </button>
                <button className="btn btn-danger m-1" onClick={this.toggleModalBoard}>
                  닫기
                </button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default Board_details;
