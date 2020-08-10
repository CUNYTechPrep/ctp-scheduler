import React from 'react';
import { shallow } from 'enzyme';
import InReview from './InReview';

describe('InReview', () => {
  test('matches snapshot', () => {
    const wrapper = shallow(<InReview />);
    expect(wrapper).toMatchSnapshot();
  });
});
