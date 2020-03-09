import React from 'react';
import Home from './index';
import renderer from 'react-test-renderer';

const faucets = ["Alfajores", "Baklava", "RC 1", "Mainnet"];

test('Home component matches snapshot', () => {
    const component = renderer.create(
      <Home faucets={faucets}/>,
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot(); 
  });