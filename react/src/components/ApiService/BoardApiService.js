import axios from 'axios';

const BOARD_URL = 'http://15.164.214.226:8080/board'; //spring boot 접속 url

class BoardApiService {
  //게시글 작성에 사용되는 메서드
  boardWrite(token, Board) {
    // return axios.post(BOARD_URL+"/write",Board,{header:{Authorization: token}});
    return fetch(BOARD_URL + '/write', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(Board),
    });
  }

  //페이지 넘버를 전달해서 10개씩 게시글을 받아오는 메서드
  boardList(pageNum) {
    return axios.get(BOARD_URL + '/list?pageNum=' + pageNum);
  }
  //해당 게시글의 정보를 받아오는 메서드
  boardDetails(boardid) {
    return axios.get(BOARD_URL + '/details?boardid=' + boardid);
  }

  //댓글 삭제하는 메서드 delete
  boardDelete(JWT, Board) {
    return fetch(BOARD_URL + '/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: JWT,
      },
      body: JSON.stringify(Board),
    });
  }
  boardUpdate(JWT, Board) {
    return fetch(BOARD_URL + '/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: JWT,
      },
      body: JSON.stringify(Board),
    });
  }
}

export default new BoardApiService();
