import React, { Component } from 'react'
// import { Link } from 'react-router-dom'; 
import Link from "../react-router-dom/Link";

export class Page1 extends Component {
    constructor(props) {
        super(props)
        this.state = {
        };
    };
    render() {
        console.log("page1 context", this.props)

        return (
            <div style={{
                width: '100%',
                height: window.innerHeight,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
            }}>
                <div
                    onClick={() => {
                        this.props.history.push({ pathname: '/page2' })
                    }}
                    style={{
                        width: '500px',
                        height: '200px',
                        backgroundColor:'green',
                        cursor:'pointer',
                        border: '1px red solid',
                        display: 'flex',
                        alignItems: 'center',
                        
                    }}>
                    我是页面一一一一一一一
                    点我可以去页面二

                </div>
                <Link to="/page3">点我前往页面3</Link>
            </div>
        )
    }
}

export default Page1
