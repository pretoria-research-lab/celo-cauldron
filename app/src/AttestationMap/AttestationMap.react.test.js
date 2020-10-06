import React from "react";
import renderer from "react-test-renderer";
import AttestationMap from "./index";

const props = {
	network: "Mainnet"
};

test("Attestation Map component matches snapshot", () => {
	const component = renderer.create(
		<AttestationMap {...props}/>,
	);

	let tree = component.toJSON();
	expect(tree).toMatchSnapshot(); 
});