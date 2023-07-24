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
