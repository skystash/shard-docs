import React from 'react'
import { mount } from 'enzyme'
import NavSectionHeader from './NavSectionHeader'

test('<NavSectionHeader /> renders correctly', () => {
  const onToggleMock = jest.fn()
  const wrapper = mount(
    <NavSectionHeader title="Hello world" expanded={true} onToggle={onToggleMock} />
  )

  expect(wrapper.find('.NavSectionHeader').exists()).toBe(true)
  expect(wrapper.find('.NavSectionHeader__title').text()).toBe('Hello world')
  expect(
    wrapper
      .find('.NavSectionHeader__arrow-icon')
      .hostNodes()
      .hasClass('NavSectionHeader__arrow-icon--expanded')
  ).toBe(true)

  wrapper.setProps({ expanded: false })

  expect(
    wrapper
      .find('.NavSectionHeader__arrow-icon')
      .hostNodes()
      .hasClass('NavSectionHeader__arrow-icon--expanded')
  ).toBe(false)

  wrapper.find('Link').simulate('click')

  expect(onToggleMock.mock.calls[0].length).toBe(1)
})
