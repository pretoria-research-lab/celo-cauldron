import React from 'react';
import renderer from 'react-test-renderer';
import App from './App';

it('renders without crashing and matches snapshot', async () => {
  const component = renderer.create(
    <App />,
  );  
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
