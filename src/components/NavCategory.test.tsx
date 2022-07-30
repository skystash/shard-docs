import React from 'react'
import { mount } from 'enzyme'
import { MemoryRouter } from 'react-router-dom'
import NavCategory from './NavCategory'
import dataTools from '../utils/dataTools'

const items = dataTools.parse([
  {
    name: 'Category',
    content: [{ name: 'Page', content: <h1>Hello world</h1> }],
  },
])

test('<NavCategory /> renders correctly', () => {
  const wrapper = mount(
    <MemoryRouter>
      <NavCategory item={items[0] as category} />
    </MemoryRouter>
  )

  expect(wrapper.find('NavTree').exists()).toBe(true)

  wrapper.find('.NavCategory__header-link').first().simulate('click')

  expect(wrapper.find('NavTree').exists()).toBe(false)
})
