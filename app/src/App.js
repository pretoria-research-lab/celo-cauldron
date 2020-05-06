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
const AsyncFaucet = AsyncComponent(() => import("./Faucet"));
const AsyncHome = AsyncComponent(() => import("./Home"));
const AsyncNotFound = AsyncComponent(() => import("./NotFound"));
const AsyncSignedBlocks = AsyncComponent(() => import("./SignedBlocks"));

const faucets = [/*"Alfajores",*/"Baklava"/*, "RC1", "Mainnet"*/];
const signedBlocks = ["RC1"];

class App extends Component {

	render() {

		return (
			<div className="App">				
				<Router> 
					<div className="App-content">         
						<Navigation faucets={faucets} signedBlocks={signedBlocks}/>
						<Switch>
							<Route exact path="/" render={(props) => <AsyncHome {...props} />} />              
							{faucets.map((faucet, i) => <Route key={i} path={"/" + faucet.toLowerCase() + "-faucet"} render={(props) => (<AsyncFaucet key={i} network={faucet} {...props} />)} />)}
							{signedBlocks.map((sb, i) => <Route key={i} path={"/" + sb.toLowerCase() + "-block-map"} render={(props) => (<AsyncSignedBlocks key={i} network={sb} lookback={100} {...props} />)} />)}
							<Route path="*" render={(props) => {return <AsyncNotFound {...props} />; }}/>              
						</Switch>
					</div>
					<Footer faucets={faucets} signedBlocks={signedBlocks}/>
				</Router>						
			</div>   
		);
	}
}

export default App;