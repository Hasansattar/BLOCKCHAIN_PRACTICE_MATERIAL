import React, { Component } from 'react'

class ClassCounter extends Component {
    constructor(props) {
        super(props)

        this.state = {
            count: 0
        }
    }

    incrementCount = ()=> {
        this.setState(prevCount => {
            return {
            count: prevCount.count + 1 // using prevCount in Class components
            }
        })
    }

    render() {
        return (
            <div>
                <button onClick={this.incrementCount}>Count {this.state.count}</button>
            </div>
        )
    }
}

export default ClassCounter
