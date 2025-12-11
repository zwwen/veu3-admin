// ...existing code...
import type { MenuData } from '@/api/type';

export type TreeNode = MenuData & {
  children?: TreeNode[];
};

/**
 * 根据后端返回的菜单列表生成树状结构，
 * parend_id / parent_id / parentId 为空或者是 0 则视为根节点
 * 第二个参数 withMeta: 如果为 true，会根据常见字段构建 meta 字段（title/icon/hidden/alwaysShow）
 */
export const generateTree = (
  list: MenuData[],
  withMeta: boolean = false
): TreeNode[] => {
  if (!Array.isArray(list) || list.length === 0) return [];

  // 复制节点，避免修改原始数据
  const nodes: TreeNode[] = list.map((item) => ({ ...item }));

  // 建立 id -> node 映射，id 使用字符串形式以兼容数字/字符串类型
  const map = new Map<string, TreeNode>();
  nodes.forEach((node) => {
    const id = String((node as any).id ?? (node as any).menu_id ?? '');
    map.set(id, node);
    node.children = []; // 先初始化避免判断
  });

  const roots: TreeNode[] = [];

  nodes.forEach((node) => {
    // 支持多种后端字段名：parend_id / parent_id / parentId
    const rawParent =
      (node as any).parend_id ??
      (node as any).parent_id ??
      (node as any).parentId;
    const parentId =
      rawParent === null || typeof rawParent === 'undefined'
        ? ''
        : String(rawParent);

    const isRoot =
      parentId === '' ||
      parentId === '0' ||
      parentId === 'null' ||
      parentId === 'undefined';

    if (isRoot) {
      roots.push(node);
    } else {
      const parent = map.get(parentId);
      if (parent) {
        parent.children = parent.children || [];
        parent.children.push(node);
      } else {
        // 找不到父节点的当作根节点处理（防止丢失）
        roots.push(node);
      }
    }
  });

  // 如果需要生成 meta 字段，根据常见字段构建 meta（title/icon/hidden/alwaysShow）
  if (withMeta) {
    const buildMeta = (n: TreeNode) => {
      const raw = n as any;
      // 如果已有 meta，则保留已有的并补充缺失字段
      const existMeta =
        raw.meta && typeof raw.meta === 'object' ? { ...(raw.meta || {}) } : {};
      const title =
        existMeta.title ??
        raw.title ??
        raw.name ??
        raw.menu_name ??
        raw.label ??
        '';
      const icon = existMeta.icon ?? raw.icon ?? '';
      const hidden =
        typeof existMeta.hidden !== 'undefined'
          ? !!existMeta.hidden
          : !!raw.hidden;
      const alwaysShow =
        typeof existMeta.alwaysShow !== 'undefined'
          ? !!existMeta.alwaysShow
          : !!raw.alwaysShow;

      raw.meta = {
        ...existMeta,
        title,
        icon,
        hidden,
        alwaysShow
      };
      if (n.children && n.children.length > 0) {
        n.children.forEach(buildMeta);
      }
    };
    roots.forEach(buildMeta);
  }

  // 清理没有子节点的 children 字段（可选）
  const clean = (arr: TreeNode[]) => {
    arr.forEach((n) => {
      if (!n.children || n.children.length === 0) {
        delete n.children;
      } else {
        clean(n.children);
      }
    });
  };
  clean(roots);

  return roots;
};
// ...existing code...
