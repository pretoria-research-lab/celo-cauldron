import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import AsyncComponent from "./AsyncComponent";
import Navigation from "./Navigation";
import Footer from "./Footer";
import "./App.css";

// Use AsyncComponent to code split for Javascript load size, only load components on matching route
// See: https://serverless-stack.com/chapters/code-splitting-in-create-react-app.html
// and https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#analyzing-the-bundle-size
// 
const AsyncFaucet = AsyncComponent(() => {import("./Faucet");});
const AsyncHome = AsyncComponent(() => {import("./Home");});
const AsyncNotFound = AsyncComponent(() => {import("./NotFound");});

const faucets = ["Alfajores" /*, "Baklava", "RC 1", "Mainnet"*/];

class App extends Component {

	render() {
		return (
			<div className="App">
				<div className="App-content">
					<Router>          
						<Navigation faucets={faucets}/>
						<Switch>
							<Route exact path="/" render={(props) => <AsyncHome {...props} />} />              
							{faucets.map((faucet, i) => <Route key={i} path={"/" + faucet.toLowerCase() + "-faucet"} render={(props) => (<AsyncFaucet key={i} network={faucet} {...props} />)} />)}
							<Route path="*" render={(props) => {return <AsyncNotFound {...props} />; }}/>              
						</Switch>
					</Router>
				</div>
				<Footer />
			</div>                        
		);
	}
}

export default App;