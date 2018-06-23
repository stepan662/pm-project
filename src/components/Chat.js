import React, { Component } from 'react';
import client from '../client'

import Stream from './Stream'
import TextField from './TextField'
import './Chat.css'


class Chat extends Component {
    state = {
        user: null,
        loading: false
    }

    loading = (state) => {
        this.setState({
            loading: state
        })
    }

    componentDidMount() {
        this.loading(true)
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
            this.loading(false)
        })
    }

    handleSend = (message) => {
        this.loading(true)
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
            this.loading(false)
        })
    }



    render() {
        const user = this.state.user || { history:[] }
        const loading = this.state.loading
        return (
            <div className="Chat">
                <div className="container">
                    <Stream messages={user.history}/>
                    {loading ?
                        <div className='loading'>🤔</div> :
                        <TextField onSend={this.handleSend} />
                    }
                </div>
            </div>
        );
    }
  }

  export default Chat