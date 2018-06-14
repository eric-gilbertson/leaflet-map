import React from 'react';
import ProjectName from './ProjectName';
import { shallow, mount } from 'enzyme';

it('showsDefaultName', () => {
  let changeHandler = function(event) {
      console.log("chang handler: ", event.target.name, ", ", event.target.value);
  }
  let projectName = 'foobar';

  const wrapper = shallow(<ProjectName name={projectName} updateName={changeHandler} />);
  console.log("value1: ", wrapper.find('input').props().value);
  expect(wrapper.find('input').props().value).toEqual(projectName);

});

it('updatesName', () => {
  let projectName = 'foobar';
  let projectName2 = '-'
  let changeHandler = function(event) {
      console.log("chang handler: ", event.target.value);
      projectName2 = event.target.value;
  }

  const wrapper = shallow(<ProjectName name={projectName} updateName={changeHandler} />);
  const nameElem = wrapper.find('input');
  nameElem.simulate('change', {target: {name:'projectName', value: projectName}});



  let val = wrapper.find('input').props().value;
  console.log("value2: ", val, ", ", projectName2);
  expect(val).toEqual(projectName2);

});

