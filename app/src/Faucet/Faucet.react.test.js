import React from "react";
import Faucet from "./index";
import renderer from "react-test-renderer";

const props = {
	network: "Alfajores"
};

test("Faucet component matches snapshot", () => {
	const component = renderer.create(
		<Faucet {...props}/>,
	);

	let tree = component.toJSON();
	expect(tree).toMatchSnapshot(); 
});