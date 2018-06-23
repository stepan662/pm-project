import React, { Component } from 'react';
import client from '../client'

import Stream from './Stream'
import TextField from './TextField'
import './Chat.css'


class Chat extends Component {
    state = {
        user: null
    }

    componentDidMount() {
        client({
            url: '/get_or_create_user.json',
            method: 'post',
            data: {
                userId: localStorage.getItem('userId')
            }
        }).then(r => {
            this.setState({
                user: r.data.user
            })
            localStorage.setItem('userId', r.data.user._id)
        })
    }

    handleSend = (message) => {
        client({
            url: '/post_chat_event.json',
            method: 'post',
            data: {
                userId: localStorage.getItem('userId'),
                message: message,
                fromUser: true,
            }
        }).then(r => {
            this.setState({
                user: r.data.user
            })
        })
    }



    render() {
        const user = this.state.user || { history:[] }
        return (
            <div className="Chat">
                <div className="container">
                    <Stream messages={user.history}/>
                    <TextField onSend={this.handleSend} />
                </div>
            </div>
        );
    }
  }

  export default Chat