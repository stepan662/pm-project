import React, { Component } from 'react';
import Message from './Message';
import './Stream.css';


class Stream extends Component {
    render() {
        const { messages=[] } = this.props
        return (
            <div className="Stream">
                {messages.map(message => (
                    <div 
                        key={message.timestamp} 
                        className={message.fromUser ? 'client' : 'server'}
                    >
                        <Message text={message.message}/>
                    </div>
                ))}
            </div>
        );
    }
  }

  export default Stream