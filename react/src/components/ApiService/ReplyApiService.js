import axios from 'axios';

const REPLY_URL = 'http://15.164.214.226:8080/reply'; //spring boot 접속 url

class ReplyApiService {
  //게시판글에 달린 댓글을 불러오는 메서드
  ReplyList(boardid, replyPageNum) {
    return axios.get(REPLY_URL + `?boardid=${boardid}&pageNum=${replyPageNum}`);
  }

  //댓글 생성하는부분 post방식
  ReplyWrite(JWT, Reply) {
    return fetch(REPLY_URL + '/write', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: JWT,
      },
      body: JSON.stringify(Reply),
    });
  }

  //댓글 삭제하는 메서드 delete
  ReplyDelete(JWT, Reply) {
    return fetch(REPLY_URL + '/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: JWT,
      },
      body: JSON.stringify(Reply),
    });
  }

  ReplyUpdate(JWT, Reply) {
    return fetch(REPLY_URL + '/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: JWT,
      },
      body: JSON.stringify(Reply),
    });
  }
}

export default new ReplyApiService();
