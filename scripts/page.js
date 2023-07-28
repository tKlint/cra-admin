const fs =  require('fs');

/*---------------------README----------------
  运行npm run page [pagePath]
  自动生成页面组件模板
  执行命令位置在src/pages/xxx下时 也将会在src/pages/xxx穿件页面组件模板
  其他位置则在src/pages下创建页面组件魔板
  支持自动生成文件夹
---------------------------------------------*/

const scriptCWD = process.env.INIT_CWD;
const projectCWD = process.env.npm_config_local_prefix + '/src/pages';
const pathArg = process.argv[2];
const compoentFileType = process.argv[3] || '.tsx';

if (fs.existsSync(projectCWD + '/' + pathArg + compoentFileType)) {
  console.log('compoent has existed');
  process.exit(1);
}

function toUpperCase(str, index) {
  const firstWord = str.slice(index, 1).toUpperCase();
  return firstWord + str.slice(1);
}
const template = `import React from 'react';

import './style.less';

type IProps = {}
const $compoentName: React.FC<IProps> = (props) => {
  return (
    <div className="page-$compoentName">$compoentName</div>
  )
}
export default $compoentName;

`;
const styleTemplate = `
  .page-$compoentName {

  }
`;
const compontName = pathArg.endsWith('/index') ? toUpperCase(pathArg.split('/')[0], 0) : toUpperCase(pathArg);
const output = template.replaceAll('$compoentName', compontName);
const styleOutput = styleTemplate.replaceAll('$compoentName', compontName);
if (pathArg.split('/').length > 1) {
  const folderPath = pathArg.slice(0, pathArg.lastIndexOf('/'));
  fs.mkdirSync(projectCWD + '/' + folderPath);
}

let compoentPath = projectCWD + '/' + pathArg + compoentFileType;

if (scriptCWD.startsWith(projectCWD)) {
  compoentPath = scriptCWD + '/' + pathArg + compoentFileType;
}
const stylePath = compoentPath.slice(0, compoentPath.lastIndexOf('/')) + '/style.less';
fs.writeFileSync(compoentPath, output);
fs.writeFileSync(stylePath, styleOutput);
process.exit(0);
