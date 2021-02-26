import React, { Component } from 'react';

class ViewSido extends Component {

    constructor(props) {
        super(props);
        // console.log("props값:", props);
        this.state = {
            orgCd: Number,
            orgdownNm: '',
            uprCd: Number,
        }
    }
    componentDidMount() {
        this.setState({
            orgCd: this.props.item.orgCd,
            orgdownNm: this.props.item.orgdownNm,
            uprCd: this.props.item.uprCd,
        })
    }

    render() {
        return (
            <ul className="navbar-nav tempStyle">
                <li class="nav-item">
                    <div class="nav-link" onClick={() => { this.props.findShelter(this.state.orgCd, this.state.uprCd) }}>{this.state.orgdownNm}</div>
                </li>
            </ul >
        );
    }
}
export default ViewSido;