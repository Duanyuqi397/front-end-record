import React, { Component } from 'react'

export class Page2 extends Component {
  constructor(props) {
    super(props)
    this.state = {
    };
  };
  render() {
    console.log("page3 context", this.props)
    return (
      <div style={{
        width: '100%',
        height: window.innerHeight,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <div
         onClick={()=>{
          this.props.history.push('/')
        }}
        style={{
          width: '500px',
          height: '200px',
        }}>
          我是页面三三三三三三三三三三三三三三三
          点我可以去页面一
        </div>
      </div>
    )
  }
}

export default Page2
