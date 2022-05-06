import Page1 from './pages/page1'
import Page2 from './pages/page2'
import Page3 from './pages/page3'
import React, { Component } from 'react'
// import { Route, Switch, withRouter, BrowserRouter } from 'react-router-dom';
import { Route, BrowserRouter } from './react-router-dom';

console.log(Route, BrowserRouter)

class Router extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    return (
      <div>
      <BrowserRouter>
        <Route exact path="/" component={(Page1)} />
        <Route exact path="/page2" component={(Page2)} />
        <Route exact path="/page3" component={(Page3)} />
      </BrowserRouter>
      </div>
      // <BrowserRouter>
      //   <Switch>
      //     <Route exact path="/" component={withRouter(Page1)} />
      //     <Route exact path="/page2" component={withRouter(Page2)} />
      //     <Route exact path="/page3" component={withRouter(Page3)} />
      //   </Switch>
      // </BrowserRouter>
    )
  }
}
export default Router