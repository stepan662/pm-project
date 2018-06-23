import React, { Component } from 'react';
import './Message.css';


class Message extends Component {
    render() {
        const { text='' } = this.props
        return (
            <div className="Message">
                {text}
            </div>
        );
    }
  }

  export default Message