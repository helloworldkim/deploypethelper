import React, { Component } from 'react';
import './ViewCardPets.css';

class ViewCardPets extends Component {

    constructor(props) {
        super(props);
        // console.log("props값:", props);
        this.state = {
            ...props
        }
        console.log(this.state.total);
    }
    componentDidMount() {

    }

    render() {
        return (
            <>
                <li className="petsList">
                    <div className="img">
                        <img className='imgsize' src={this.state.pet.popfile} alt="pet images" />
                    </div>
                    <div className="info">
                        <h4>유기동물 발견장소:{this.state.pet.happenPlace}</h4>
                        <p >중성화 여부(U=미상):{this.state.pet.neuterYn}</p>
                        <p >입양 여부:{this.state.pet.processState}</p>
                        <p >성별:{this.state.pet.sexCd}</p>
                        <p >무게:{this.state.pet.weight}</p>
                        <p >나이:{this.state.pet.age}</p>
                        <p >특이사항:{this.state.pet.specialMark}</p>
                        <p >보호소 이름:{this.state.pet.careNm}</p>
                        <p >보호소 주소:{this.state.pet.careAddr}</p>
                        <p >보호소 전화번호:{this.state.pet.careTel}</p>
                        <p >공고시작일:{this.state.pet.noticeSdt}</p>
                        <p >공고종료일:{this.state.pet.noticeEdt}</p>
                    </div>
                </li>
            </>

        );
    }
}
export default ViewCardPets;
