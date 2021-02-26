import React, { Component } from 'react';
import ViewSido from './ViewSido';
import ViewSigugun from './ViewSigugun';
import ViewShelter from './ViewShelter';
import ViewCardPets from './ViewCardPets';
import JWTService from './JWTService/JWTService';

const axios = require('axios');

class PetFinder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidos: [],
      siguguns: [],
      shelters: [],
      pets: [
        { kind: '강아지', code: 417000 },
        { kind: '고양이', code: 422400 },
        { kind: '다른동물들', code: 429900 },
      ],
      bgnde: '',
      endde: '',
      findedPets: [],
      pageNo: 1,
      // totalCount: 0, 초기값 굳이 안필요함
      // totalPage: Number,
    };
  }

  findSido = async () => {
    let res = await axios.default.get('http://localhost:8080/sido').catch((err) => {
      console.log(err);
    });
    const result = res.data.response.body.items.item;
    this.setState({ sidos: result });
  };

  findSigungu = async (orgCd) => {
    if (this.state.siguguns !== []) {
      this.setState({ siguguns: [], shelters: [] });
    }
    // console.log("orgCd값:", orgCd);
    let res = await axios.default
      .get('http://localhost:8080/sigungu?orgCd=' + orgCd)
      .catch((err) => {
        console.log(err);
      });
    const result = res.data.response.body.items.item;
    this.setState({ siguguns: result });
    // console.log(result);
  };
  findShelter = async (orgCd, uprCd) => {
    if (this.state.shelters !== []) {
      this.setState({ shelters: [] });
    }
    // console.log("uprCd값:", uprCd);
    // console.log("orgCd값:", orgCd);
    let res = await axios.default
      .get('http://localhost:8080/shelter?orgCd=' + orgCd + '&uprCd=' + uprCd)
      .catch((err) => {
        console.log(err);
      });
    console.log('쉘터정보요청 response:', res);
    if (res.data.response.body.items === '') {
      //해당구역에 쉘터가 하나도 없을때
      alert('해당 구역에는 쉘터가없습니다');
      return;
    }
    console.log(res);
    // console.log("length", res.data.response.body.items.item.length);
    const result = res.data.response.body.items.item; //필요한 쉘터 데이터
    if (res.data.response.body.items.item.length > 1) {
      //1개 이상일때
      this.setState({ shelters: result });
    } else {
      //한개일때 배열로 보내기위해 처리함
      let temp = [];
      temp.push(result);
      this.setState({ shelters: temp });
    }
    console.log('현재 쉘터정보!:', this.state.shelters);
  };

  findPet = async (code) => {
    let res = await axios.default
      .get('http://localhost:8080/kindofpet?up_kind_cd=' + code)
      .catch((err) => {
        console.log(err);
      });
    // console.log("fidpet결과값:", res);
    let result = res.data.response.body.items.item;
    // console.log("result값:", result);
    this.setState({ findedPets: result });
  };
  inputHandler = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  //유기동물 날짜로 검색해주는 메서드
  findAbandonmentPublic = async () => {
    let JWT = sessionStorage.getItem('Authorization');
    //jwt없으면 로그인하라고 로그인페이지로 보낸다!
    if (JWTService.checkLogin(JWT) === false) {
      return;
    }
    //기존에 데이터가있으면 새로 랜더링 하도록 초기화
    this.setState({
      findedPets: [],
      pageNo: 1,
    });
    if (this.state.bgnde === '' || this.state.endde === '') {
      alert('검색일을 입력해주세요');
      return;
    }
    //요청전에 토큰 유효성 검사
    JWTService.validateUser(JWT);
    //api 데이터 요청
    let URL = `http://localhost:8080/abandonmentPublic?bgnde=${this.state.bgnde}&endde=${this.state.endde}&pageNo=${this.state.pageNo}`;
    let res = await axios.default.get(URL, { headers: { Authorization: JWT } }).catch((err) => {
      console.log(err);
    });
    console.log('findAbandonmentPublic:', res);
    if (res.data.response.body.items === '') {
      alert('검색결과가 없습니다');
      return;
    }
    let result = res.data.response.body.items.item;
    let totalCount = res.data.response.body.totalCount;
    let pageNo = res.data.response.body.pageNo;
    this.setState({
      findedPets: result,
      totalCount: totalCount,
      pageNo: pageNo,
      totalPage: Math.round(totalCount / 9),
    });
  };
  //페이지 넘버 변경 메서드
  nextPageLoad = () => {
    if (this.state.pageNo === this.state.totalPage) {
      alert('다음페이지가 없습니다');
    } else {
      //setstate의 경우 비동기로 처리됨 뒤에 콜백함수로 해당 비동기함수가 실행된 다음 값을 확실히 넘겨받아서 실행가능
      this.setState({ pageNo: this.state.pageNo + 1 }, () => {
        console.log('변경된 페이지값:', this.state.pageNo);
        this.findAbandonmentPublic();
      });
    }
  };
  prevPageLoad = () => {
    if (typeof this.state.bgnde) {
      console.log(typeof this.state.bgnde);
    }
    if (this.state.pageNo === 1) {
      alert('이전페이지가 없습니다');
    } else {
      this.setState({ pageNo: this.state.pageNo - 1 }, () => {
        console.log('변경된 페이지값:', this.state.pageNo);
        this.findAbandonmentPublic();
      });
    }
  };
  render() {
    return (
      <div className="container">
        <nav className="navbar navbar-expand-sm bg-light">
          {this.state.sidos
            ? this.state.sidos.map((item, index) => {
                return <ViewSido findSigungu={this.findSigungu} key={index} item={item}></ViewSido>;
              })
            : ''}
        </nav>
        <nav className="navbar navbar-expand-sm bg-light">
          {this.state.siguguns
            ? this.state.siguguns.map((item, index) => {
                return (
                  <ViewSigugun findShelter={this.findShelter} key={index} item={item}></ViewSigugun>
                );
              })
            : ''}
        </nav>
        <nav className="navbar navbar-expand-sm bg-light">
          {this.state.shelters
            ? this.state.shelters.map((item, index) => {
                return <ViewShelter key={index} item={item}></ViewShelter>;
              })
            : ''}
        </nav>
        <button className="btn btn-primary" onClick={this.findSido}>
          유기동물 보호센터 위치 조회하기
        </button>
        <button className="btn btn-primary">유기동물 정보 조회하기</button>
        {/* 검색창 부분 */}
        <div className="form-group">
          <label>검색시작일(YYYYMMDD)</label>
          <input type="date" name="bgnde" className="form-control" onChange={this.inputHandler} />
        </div>
        <div className="form-group">
          <label>검색종료일(YYYYMMDD)</label>
          <input type="date" name="endde" className="form-control" onChange={this.inputHandler} />
        </div>
        <button className="btn btn-primary" onClick={this.findAbandonmentPublic}>
          검색
        </button>
        {/* 검색창 종료부분 */}
        {this.state.totalCount ? <p>검색된 유기동물 수:{this.state.totalCount}</p> : ''}
        {this.state.totalPage ? <p>총 페이지 수:{this.state.totalPage}</p> : ''}
        {/* 유기동물들 프로필 나오는부분 */}
        <div className="flexContainer">
          {this.state.findedPets
            ? this.state.findedPets.map((pet, index) => {
                return <ViewCardPets key={index} pet={pet} />;
              })
            : ''}
        </div>
        <div className="buttonContainer">
          <button children="이전페이지" className="btn btn-primary" onClick={this.prevPageLoad} />
          <button children="다음페이지" className="btn btn-primary" onClick={this.nextPageLoad} />
        </div>
      </div>
    );
  }
}

export default PetFinder;
