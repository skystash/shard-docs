import slugify from "slugify";
import kebabCase from "lodash/kebabCase";
import isArray from "lodash/isArray";

export default function fromSource(source, basePath = "/") {
  source = addTypes(source);
  source = addPaths(source, basePath);
  source = addBreadcrumbs(source, [{ link: basePath, text: "~" }]);
  source = shapeItems(source, basePath);
  source = combineTopLevelAdjacentItems(source);
  return source;
}

/**
 * Loops through each item, child and grandchild detecting and injecting each
 * items type.
 * @param  {array} items Source tree.
 * @return {array}
 */
export function addTypes(items) {
  for (let i in items) {
    let type = false;

    if (items[i].children) type = "folder";
    else if (items[i].document) type = "document";
    else if (items[i].externalLink) type = "external";

    if (type === "folder") items[i].children = addTypes(items[i].children);

    items[i].type = type;
  }

  return items;
}

/**
 * Combine all top level adjacent items (except folders) into discrete folders.
 * @param  {array} items Requires types to have been added to array with addTypes().
 * @return {array}
 */
export function combineTopLevelAdjacentItems(items) {
  const isDiscreteFolder = item => item && item.type === "folder" && !item.title;

  items = items.map(item => {
    return item.type !== "folder" ? { title: null, children: [item], type: "folder" } : item;
  });

  return items.reduce((accumulator, item) => {
    const lastItem = accumulator[accumulator.length - 1];

    if (isDiscreteFolder(item) && isDiscreteFolder(lastItem)) {
      lastItem.children = [...lastItem.children, ...item.children];
      accumulator[accumulator.length - 1] = lastItem;
    } else {
      accumulator = [...accumulator, item];
    }
    return accumulator;
  }, []);
}

/**
 * Loops through each item, child and grandchild detecting and calculating and
 * and each items path.
 * @param  {array} items Expects result of fromSource/combineTopLevelAdjacentDocuments().
 * @return {array}
 */
export function addPaths(items, basePath) {
  const getSlug = title => slugify(kebabCase(title), { lower: true });

  return items.map(item => {
    // Generate path and remove trailing / duplicate slashes
    item.path = `${basePath}/${getSlug(item.title)}`.replace(/\/+$/, "").replace(/\/+/g, "/");

    if (item.type === "folder") {
      item.children = addPaths(item.children, item.path);
    }

    return item;
  });
}

/**
 * Recursively loops through source tree adding breadcrumbs to all documents / folders.
 * @param  {array} items Expects result of fromSource/ shapeItems().
 * @return {array}
 */
export function addBreadcrumbs(items, breadcrumbs = []) {
  return items.map(item => {
    const crumb = { text: item.title, link: item.path };
    if (item.type === "folder") {
      if (item.title) {
        item.children = addBreadcrumbs(item.children, [...breadcrumbs, crumb]);
      } else {
        item.children = addBreadcrumbs(item.children, breadcrumbs);
      }
    } else if (item.type === "document") {
      return { ...item, breadcrumbs: [...breadcrumbs, crumb] };
    }
    return item;
  });
}

/**
 * Loops through each item, child and grandchild shaping each item to the specs of its given type.
 * @param  {array} items Expects result of fromSource/combineTopLevelAdjacentDocuments().
 * @return {array}
 */
export function shapeItems(items) {
  return items
    .map(item => {
      const { type, title, path } = item;
      if (type === "external") {
        const link = item.externalLink;
        return { type, title, link };
      } else if (type === "folder" && title) {
        const isEmpty = !item.children.length;
        const children = shapeItems(item.children);
        return { type, path, title, isEmpty, children };
      } else if (type === "folder" && !title) {
        const children = shapeItems(item.children);
        return { type, path, children };
      } else if (type === "document") {
        const isEmpty = !isArray(item.document) || item.document.length <= 0;
        const document = item.document;
        const breadcrumbs = item.breadcrumbs;
        return { type, path, title, isEmpty, breadcrumbs, document };
      }
      return null;
    })
    .filter(Boolean);
}
