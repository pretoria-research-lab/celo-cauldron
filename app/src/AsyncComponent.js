import React, { Component } from "react";
import ReactGA from "react-ga";
import {GA_TAG} from "./Utils/config";

export default function asyncComponent(importComponent) {
	class AsyncComponent extends Component {
		constructor(props) {
			super(props);

			this.state = {
				component: null
			};
		}

		async componentDidMount() {
			const { default: component } = await importComponent();

			ReactGA.initialize(GA_TAG);
			ReactGA.pageview(window.location.pathname + window.location.search);

			this.setState({
				component: component
			});
		}

		render() {
			const C = this.state.component;

			return C ? <C {...this.props} /> : null;
		}
	}

	return AsyncComponent;
}