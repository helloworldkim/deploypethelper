import React, { Component } from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

class Board extends Component {
  constructor(props) {
    super(props);
    // console.log(props.Board.id);
    this.state = {
      modal: false,
    };
  }
  render() {
    return (
      <TableRow>
        <TableCell>{this.props.Board.id}</TableCell>
        <TableCell>{this.props.Board.title}</TableCell>
        <TableCell>{this.props.Board.username}</TableCell>
        <TableCell>{this.props.Board.count}</TableCell>
        <TableCell>{this.props.Board.createDate}</TableCell>
        <TableCell>{this.props.Board.replyCount ? this.props.Board.replyCount : '0'}</TableCell>
        <TableCell>
          <button
            className="btn btn-primary"
            onClick={() => {
              this.props.getDetailsPage(this.props.Board.id);
            }}
          >
            상세보기
          </button>
        </TableCell>
      </TableRow>
    );
  }
}

export default Board;
