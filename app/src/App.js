import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import AsyncComponent from "./AsyncComponent";
import Navigation from './Navigation';
import Footer from './Footer';
import history from './history';
import './App.css';

// Use AsyncComponent to code split for Javascript load size, only load components on matching route
// See: https://serverless-stack.com/chapters/code-splitting-in-create-react-app.html
// and https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#analyzing-the-bundle-size
// 
const AsyncFaucet = AsyncComponent(() => import("./Faucet"));
const AsyncHome = AsyncComponent(() => import("./Home"));
const AsyncNotFound = AsyncComponent(() => import("./NotFound"));

const faucets = ["Alfajores" /*, "Baklava", "RC 1", "Mainnet"*/];

class App extends Component {
  
  goTo(route) {
    this.props.history.replace(`/${route}`)
  }

  render() {
    return (
      <div className="App">
        <Router history={history}>
          <div className="App-content">
          <Navigation faucets={faucets}/>
            <Switch>
              <Route exact path="/" render={(props) => <AsyncHome {...props} />} />              
              {faucets.map((faucet, i) => <Route key={i} path={"/" + faucet.toLowerCase() + "-faucet"} render={(props) => (<AsyncFaucet key={i} network={faucet} {...props} />)} />)}
              <Route path="*" render={(props) => <AsyncHome {...props} />}/>
            </Switch>
            </div>
        </Router>
        <Footer />
      </div>                        
    );
  }
}

export default App;