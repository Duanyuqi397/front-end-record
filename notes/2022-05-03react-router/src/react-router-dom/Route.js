import React,{Component} from "react";
import context from "./context";
import { pathToRegexp,match } from "path-to-regexp";

/**
 * Route工作原理
 * 通过比较BrowserRouter中Context.Provider提供的location和当前Route传入的to进行比较
 * 如果匹配成功，则跳转到Route传入的component，不成功则展示空组件或其他逻辑
 */
export default class Route extends Component {
    static contextType = context;
    render(){
        const currentRoutePath = this.context.location.pathname;//从上下文context中获取到当前路由
        const { path,component:Component,exact = false } = this.props;//获取Route组件props的路由
        const paramsRegexp = match(path,{ end:exact });//生成获取params的表达式
        const paramsResult = paramsRegexp(currentRoutePath);
        this.context.match.params = paramsResult.params;
        const props = {
            ...this.context
        }
        const pathRegexp = pathToRegexp(path,[],{end:exact});//生成路径匹配表达式
        if(pathRegexp.test(currentRoutePath)){
            return (<Component {...props}></Component>)//将当前上下文路由信息当作props传入组件
        }
        return null;
    }
}