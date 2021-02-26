import React, { Component } from 'react';
import BoardApiService from '../ApiService/BoardApiService';
import JWTService from '../JWTService/JWTService';
class Board_write extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      content: '',
    };
  }

  Board_write = () => {
    const JWT = sessionStorage.getItem('Authorization');
    console.log('board에서 체크하는 토큰값:', JWT);
    //토큰값체크
    JWTService.checkLogin(JWT);
    //Board 객체생성
    let Board = {
      title: this.state.title,
      content: this.state.content,
    };
    BoardApiService.boardWrite(JWT, Board)
      .then((res) => {
        console.log(res);
        let status = res.status;
        console.log(status);
        if (status === 200) {
          alert('글 작성완료');
          window.location.assign('/board'); //redirect형식으로 보내버림
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  onChangeValues = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  render() {
    return (
      <div className="container">
        <div className="form-group">
          <label>제목</label>
          <input type="text" className="form-control" placeholder="제목" name="title" onChange={this.onChangeValues} />
        </div>
        <div className="form-group">
          <label>내용</label>
          <textarea className="form-control" rows="5" name="content" value={this.state.content} onChange={this.onChangeValues}></textarea>
        </div>
        <button type="button" className="btn btn-primary" onClick={this.Board_write}>
          글쓰기
        </button>
      </div>
    );
  }
}

export default Board_write;
