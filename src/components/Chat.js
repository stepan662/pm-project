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
                userId: localStorage.getItem('userId'),
            }
        }).then(r => {
            this.setState({
                user: r.data.user
            })
            console.log(r.data)
            localStorage.setItem('userId', r.data.user._id)
            localStorage.setItem('conversation_id', JSON.stringify(r.data.conversation_id))
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
                watsonContext: {
                    context: {
                        conversation_id: JSON.parse(localStorage.getItem('conversation_id'))
                    }
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