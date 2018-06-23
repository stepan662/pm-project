import React, { Component } from 'react';
import './Stream.css';


class TextField extends Component {
    handleSubmit = (e) => {
        e.preventDefault()
        this.props.onSend(this.ref.value)
        this.ref.value = ''
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <input ref={r => this.ref = r} />
                <input type='submit' value='Send' />
            </form>
        );
    }
  }

  export default TextField