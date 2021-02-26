import React, { Component } from 'react';

class ViewShelter extends Component {

    constructor(props) {
        super(props);
        // console.log("props값:", props);
        this.state = {
            careNm: '',  //보호소 이름  
            careRegNo: Number,   //보호소 코드번호
        }
    }
    componentDidMount() {
        this.setState({
            careNm: this.props.item.careNm,
            careRegNo: this.props.item.careRegNo,

        })
    }

    render() {
        return (
            <ul className="navbar-nav tempStyle">
                <li class="nav-item">
                    <div class="nav-link">{this.state.careNm}</div>
                </li>
            </ul >
        );
    }
}
export default ViewShelter;