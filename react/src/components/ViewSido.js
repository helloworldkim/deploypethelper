import React, { Component } from 'react';

class ViewSido extends Component {

    constructor(props) {
        super(props);
        // console.log("props값:", props);
        this.state = {
            orgCd: Number,
            orgdownNm: '',
        }
    }
    componentDidMount() {
        this.setState({
            orgCd: this.props.item.orgCd,
            orgdownNm: this.props.item.orgdownNm,
        })
    }

    render() {
        return (
            <ul className="navbar-nav tempStyle">
                <li class="nav-item">
                    <div class="nav-link" onClick={() => this.props.findSigungu(this.state.orgCd)}>{this.state.orgdownNm}</div>
                </li>
            </ul >
        );
    }
}
export default ViewSido;