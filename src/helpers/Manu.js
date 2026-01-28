import { MENU_ITEMS } from '@/assets/data/menu-items';
import { ROLES } from '@/assets/data/roles';

export const getMenuItems = (role) => {
  if (role === ROLES.SELLER) {
    return MENU_ITEMS.filter((item) => ['dashboard', 'projects', 'sales', 'report'].includes(item.key))
  }
  if (role === ROLES.SALES) {
    return MENU_ITEMS.filter((item) => ['dashboard', 'sales', 'inventory'].includes(item.key))
  }
  if (role === ROLES.MANAGER) {
    return MENU_ITEMS.filter((item) => ['dashboard', 'projects', 'sales', 'inventory', 'purchases', 'sellers', 'report'].includes(item.key))
  }
  if (role === ROLES.WAREHOUSE) {
    return MENU_ITEMS.filter((item) => ['dashboard', 'inventory', 'purchases', 'sales'].includes(item.key))
  }
  return MENU_ITEMS
}
export const findAllParent = (menuItems, menuItem) => {
  let parents = [];
  const parent = findMenuItem(menuItems, menuItem.parentKey);
  if (parent) {
    parents.push(parent.key);
    if (parent.parentKey) {
      parents = [...parents, ...findAllParent(menuItems, parent)];
    }
  }
  return parents;
};
export const getMenuItemFromURL = (items, url) => {
  if (items instanceof Array) {
    for (const item of items) {
      const foundItem = getMenuItemFromURL(item, url);
      if (foundItem) {
        return foundItem;
      }
    }
  } else {
    if (items.url == url) return items;
    if (items.children != null) {
      for (const item of items.children) {
        if (item.url == url) return item;
      }
    }
  }
};
export const findMenuItem = (menuItems, menuItemKey) => {
  if (menuItems && menuItemKey) {
    for (const item of menuItems) {
      if (item.key === menuItemKey) {
        return item;
      }
      const found = findMenuItem(item.children, menuItemKey);
      if (found) return found;
    }
  }
  return null;
};