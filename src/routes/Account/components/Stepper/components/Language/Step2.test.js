import React from 'react';
import { shallow } from 'enzyme';
import Step2 from './Language';

describe('Step2', () => {
  test('matches snapshot', () => {
    const wrapper = shallow(<Step2 />);
    expect(wrapper).toMatchSnapshot();
  });
});
