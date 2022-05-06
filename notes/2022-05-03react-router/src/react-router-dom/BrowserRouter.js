import React from "react";
import Context from "./context";

export default class BrowserRouter extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            location:{
                pathname: window.location.pathname || "/",
                search: undefined
            },
            match:{

            }
        }
    }
    componentWillMount(){
        window.addEventListener("popstate",() => {
            this.setState({//添加监听，当路由发生变化的时候，通过setState改变路径
                location: {
                    pathname: window.location.pathname
                }
            })
        })
    }

    render(){
        const currentRoute = {
            location: this.state.location,
            match: this.state.match,
            history: {
                push: (to) => {
                    //根据当前的to去匹配路由，实现路由切换
                    if(typeof to === 'object'){
                        let { pathname,query } = to;
                        this.setState({
                            location:{
                                query: to.query,
                                pathname: to.pathname
                            }
                        })
                        // this.state.location.query = query;//通过state直接修改而不是通过setState，是因为只需要将当前的
                        // this.state.location.pathname = pathname;//currentRouter传递给子组件
                        window.history.pushState({},{},pathname);
                    } else {
                        //如果是字符串可以直接用
                        this.setState({
                            location:{
                                pathname: to
                            }
                        })
                        window.history.pushState({},{},to);
                    }
                    //setState({}),react中通过通过setState去改变值，是为了页面能够及时更新,这里只是触发了数据更新
                }
            }
        }
        return (
            <Context.Provider value={currentRoute}>{this.props.children}</Context.Provider>
        )
    }
}