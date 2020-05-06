import React from "react";
import SignedBlocks from "./index";
import renderer from "react-test-renderer";

const props = {
	network: "RC1"
};

test("Signed Blocks component matches snapshot", () => {
	const component = renderer.create(
		<SignedBlocks {...props}/>,
	);

	let tree = component.toJSON();
	expect(tree).toMatchSnapshot(); 
});