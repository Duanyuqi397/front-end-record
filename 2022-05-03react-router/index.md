1.react-router和react-router-dom
    react-router可以说是react-router-dom的超集，可以用于跨平台路由的实现，react-router-dom是react-router在浏览器端的实现，
    文档：https://v5.reactrouter.com/web/guides/quick-start 

2.react-router实现原理
    在app的根节点使用<Route></Route>包裹，其实就等于一个Provider，全局的数据就存储在Provider的value中，
    然后将数据共享到context中，这样就可以通过props的方式下发到每一个路由的子组件中，
    这样就可以在任意一个路由的子组件中拿到当前的路由状态，实现前进、后退等
3.<Link>标签实现原理
    通过a标签跳转，https://v5.reactrouter.com/web/guides/quick-start/1st-example-basic-routing，
    Note: Behind the scenes a <Link> renders an <a> with a real href, so people using the keyboard for navigation or screen readers will still be able to use this app.

4.There are three primary categories of components in React Router:
    routers, like <BrowserRouter> and <HashRouter>，
    route matchers, like <Route> and <Switch>，
    and navigation, like <Link>, <NavLink>, and <Redirect>
5.router hooks
    useHistory:可以用来操作history
```JavaScript
function HomeButton() {
  let history = useHistory();

  function handleClick() {
    history.push("/home");
  }

  return (
    <button type="button" onClick={handleClick}>
      Go home
    </button>
  );
}
```
    useParams
```JavaScript
function BlogPost() {
  let { slug } = useParams();
  return <div>Now showing post {slug}</div>;
}

ReactDOM.render(
  <Router>
    <Switch>
      <Route exact path="/">
        <HomePage />
      </Route>
      <Route path="/blog/:slug">
        <BlogPost />
      </Route>
    </Switch>
  </Router>,
  node
);
```