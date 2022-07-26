import React from "react";
import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import Breadcrumbs from "./ShardDocsMainBreadcrumbs";

const breadcrumbs = [
  { name: "~", path: "/", isActive: false },
  { name: "Examples", path: "/examples", isActive: false },
  { name: "Hello world", path: "/examples/hello-world", isActive: true }
];

test("<Breadcrumbs /> renders with default props", () => {
  mount(<Breadcrumbs />);
});

test("<Breadcrumbs /> renders breadcrumbs", () => {
  const wrapper = mount(
    <MemoryRouter>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
    </MemoryRouter>
  );

  expect(wrapper.find("nav a").length).toBe(3);
  expect(wrapper.find("nav a").at(0).prop("href")).toBe("/");
  expect(wrapper.find("nav a").at(1).prop("href")).toBe("/examples");
  expect(wrapper.find("nav a").at(2).prop("href")).toBe("/examples/hello-world");
  expect(wrapper.find("nav a").at(0).text()).toBe("~");
  expect(wrapper.find("nav a").at(1).text()).toBe("Examples");
  expect(wrapper.find("nav a").at(2).text()).toBe("Hello world");
  expect(wrapper.find("nav a").at(0).prop("className")).toBe(undefined);
  expect(wrapper.find("nav a").at(1).prop("className")).toBe(undefined);
  expect(wrapper.find("nav a").at(2).prop("className")).toBe("active");
});