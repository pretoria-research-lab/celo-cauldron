import React from "react";
import NotFound from "./index";
import renderer from "react-test-renderer";

test("NotFound component matches snapshot", () => {
	const component = renderer.create(
		<NotFound />,
	);

	let tree = component.toJSON();
	expect(tree).toMatchSnapshot(); 
});