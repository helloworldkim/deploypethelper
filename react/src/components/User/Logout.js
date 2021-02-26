import React, { Component } from 'react';

class Logout extends Component {

    componentDidMount() {
        this.logout();
    }
    logout = () => {
        //세션에 존재하는 JWT토큰 삭제
        sessionStorage.removeItem("Authorization");
        //홈경로로
        // let home = 'http://localhost:3000/';
        let home = '/';
        window.location.assign(home);
    }

    render() {
        return (
            <div>
                로그아웃중입니다
            </div>
        );
    }
}

export default Logout;