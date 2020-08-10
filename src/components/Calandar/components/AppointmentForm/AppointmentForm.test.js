import React from 'react';
import { shallow } from 'enzyme';
import AppointmentForm from './AppointmentForm';

describe('AppointmentForm', () => {
  test('matches snapshot', () => {
    const wrapper = shallow(<AppointmentForm />);
    expect(wrapper).toMatchSnapshot();
  });
});
