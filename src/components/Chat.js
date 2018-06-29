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

    scrollToBottom = () => {
      this.el.scrollIntoView({ behavior: "smooth" });
    }

    componentDidMount() {
        this.loading(true)
        client({
            url: '/get_or_create_user.json',
            method: 'post',
            data: {
                userId: localStorage.getItem('userId'),
            }
        }).then(r => {
            this.setState({
                user: r.data.user
            })
            console.log(r.data)
            localStorage.setItem('userId', r.data.user._id)
            localStorage.setItem('watsonContext', JSON.stringify(r.data.watsonContext))
            this.scrollToBottom();
            this.loading(false)
        })
    }

    componentDidUpdate() {
      this.scrollToBottom();
    }

    handleSend = (message) => {
        this.loading(true)
        client({
            url: '/post_chat_event.json',
            method: 'post',
            data: {
                userId: localStorage.getItem('userId'),
                message: message,
                watsonContext: {
                    context: JSON.parse(localStorage.getItem('watsonContext'))
                }
            }
        }).then(r => {
            this.setState({
                user: r.data.user
            })
            localStorage.setItem('conversation_id', JSON.stringify(r.data.conversation_id))
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
                    <div ref={el => { this.el = el; }} />
                </div>
                <div className="textField">
                    <TextField onSend={this.handleSend} />                
                </div>
            </div>
        );
    }
  }

  export default Chat
