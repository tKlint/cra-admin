/**
 * 生成文件base64
 */
export const createFileBase64 = (file: File): Promise<[undefined, ProgressEvent<FileReader>] | [string, undefined]> => {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve([reader.result as string, undefined]);
    reader.onerror = error => resolve([void 0, error]);
  });
};

export const generateRoutesChildren = (
  originRoutes: UserRouter[],
  parentId?: number | null
): UserRouterWithChildren[] => {
  const withChildrenRoutes = [];
  for (const item of originRoutes) {
    if (item.parentId === parentId) {
      const children = generateRoutesChildren(originRoutes, item.id);
      const routerWithChildre: UserRouterWithChildren = { ...item };
      if (children.length > 0) {
        routerWithChildre.children = children;
      }
      if (routerWithChildre.path.startsWith('/') && parentId) {
        routerWithChildre.path = routerWithChildre.path.substring(1);
      }
      withChildrenRoutes.push(routerWithChildre);
    }
  }
  return withChildrenRoutes;
};
