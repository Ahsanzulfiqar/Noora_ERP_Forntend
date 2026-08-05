import { MENU_ITEMS, SELLER_MENU_ITEMS, WAREHOUSE_MENU_ITEMS, SALES_MENU_ITEMS } from '@/assets/data/menu-items';
import { ROLES } from '@/assets/data/roles';
import { isPathAllowedForRole } from '@/routes/roleAccess';

const filterMenuByAllowedPaths = (items, role) =>
  items
    .map((item) => {
      if (item.isTitle) return item;
      if (item.children) {
        const kids = filterMenuByAllowedPaths(item.children, role);
        return kids.length ? { ...item, children: kids } : null;
      }
      return item.url && isPathAllowedForRole(role, item.url) ? item : null;
    })
    .filter(Boolean);

export const getMenuItems = (role) => {
  if (role === ROLES.SELLER) {
    return SELLER_MENU_ITEMS;
  }
  if (role === ROLES.WAREHOUSE) {
    return WAREHOUSE_MENU_ITEMS;
  }
  if (role === ROLES.SALES) {
    return SALES_MENU_ITEMS;
  }
  if (role === ROLES.MANAGER) {
    return MENU_ITEMS.filter((item) => ['dashboard', 'projects', 'sales', 'inventory', 'purchases', 'sellers', 'report'].includes(item.key))
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