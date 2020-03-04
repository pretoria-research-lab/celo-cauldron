import React from 'react';
import Home from './index';
import renderer from 'react-test-renderer';

test('Home component matches snapshot', () => {
    const component = renderer.create(
      <Home />,
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot(); 
  });