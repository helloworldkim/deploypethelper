import { Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import React, { Component } from 'react';
import BoardApiService from '../ApiService/BoardApiService';
import JWTService from '../JWTService/JWTService';
import Pagenation from '../Pagenation/Pagenation';
import Board from './Board';

class Board_list extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNum: 1,
    };
    this.getBoardList(1);
  }

  componentDidMount() {}

  //해당 게시판의 글 정보를 받아오는 메소드
  getBoardList = (pageNum) => {
    console.log('getBoardLiST 메소드 호출');
    console.log(pageNum);

    BoardApiService.boardList(pageNum)
      .then((res) => {
        console.log(res);
        let BoardList = res.data.boardList;
        let BoardCount = res.data.boardCount;
        let TotalPage = res.data.totalPage;
        let LastPage = res.data.lastPage;
        this.setState({
          BoardList: BoardList,
          BoardCount: BoardCount,
          TotalPage: TotalPage,
          LastPage: LastPage,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //페이지핸들러
  pageHandler = ({ number }) => {
    if (number === this.state.pageNum) {
      alert('현재페이지입니다');
      return;
    }
    if (number > this.state.TotalPage) {
      alert('없는페이지입니다');
      return;
    }

    this.setState({ pageNum: number }, () => {
      this.getBoardList(this.state.pageNum);
    });
  };

  //해당 게시물의 상세정보를 불러오는 메소드
  //회원정보가 필요하므로 부르기전 토큰값 체크
  getDetailsPage = (boardid) => {
    let JWT = sessionStorage.getItem('Authorization');

    //JWT토큰으로 로그인 여부 체크
    //정상토큰의 경우에는 따로 리턴값을 받지않음 값이 존재한다면 만료 or 비정상토큰
    let result = JWTService.validateUser(JWT);
    if (result != null) {
      return;
    }

    console.log('getDetailsPage 메서드 호출');
    console.log(boardid);
    //디테일 페이지로 해당 게시글 인덱스 넘버를 가지고 이동한다
    this.props.history.push('/Board_details?boardid=' + boardid);
  };

  gotoBoardWrite = () => {
    const JWT = sessionStorage.getItem('Authorization');
    console.log('토큰값:', JWT);

    //토큰값체크 없으면 로그인페이지로 보냄
    JWTService.checkLogin(JWT);

    //로그인 상태라면 write페이지로 보냄
    this.props.history.push('/board_write');
  };

  render() {
    return (
      <Paper>
        <Table>
          {/* 해당하는 목록이 어딘지 표시하는 머리부분 */}
          <TableHead>
            <TableRow>
              <TableCell>글번호</TableCell>
              <TableCell>제목</TableCell>
              <TableCell>작성자</TableCell>
              <TableCell>조회수</TableCell>
              <TableCell>작성일</TableCell>
              <TableCell>댓글수</TableCell>
              <TableCell>내용보기</TableCell>
            </TableRow>
          </TableHead>
          {/* 게시글 10개 가져와서 렌더링 하는부분 */}
          <TableBody>
            {this.state.BoardList
              ? this.state.BoardList.map((board) => {
                  return <Board key={board.id} Board={board} toggle={this.toggle} getDetailsPage={this.getDetailsPage}></Board>;
                })
              : '게시글 로딩중입니다'}
          </TableBody>
        </Table>
        {/* 페이징 하는부분 */}
        <button className="btn btn-primary float-right mr-5 mt-2" onClick={this.gotoBoardWrite}>
          글쓰기
        </button>
        <div className="d-flex justify-content-center mt-2">
          <Pagenation page={this.state.pageNum} pageHandler={this.pageHandler} />
        </div>
      </Paper>
    );
  }
}

export default Board_list;
