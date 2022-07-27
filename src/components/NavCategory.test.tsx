import React from "react";
import { mount } from "enzyme";
import { MemoryRouter } from "react-router-dom";
import NavCategory from "./NavCategory";
import contentTool from "../utils/contentTool";

const { items } = contentTool.parseContent([
  {
    type: 'category', 
    name: "Category",
    items: [{ type: 'document', name: "Document", document: <h1>Hello world</h1> }]
  }
]);

test("<NavCategory /> renders correctly", () => {
  const wrapper = mount(
    <MemoryRouter>
      <NavCategory item={items[0] as categoryItem} />
    </MemoryRouter>
  );

  expect(wrapper.find('NavTree').exists()).toBe(true);

  wrapper.find('.sd-NavCategory__header a').first().simulate('click')

  expect(wrapper.find('NavTree').exists()).toBe(false);
});