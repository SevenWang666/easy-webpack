const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
// 由于 traverse 采用的 ES Module 导出，我们通过 requier 引入的话就加个 .default
const babel = require("@babel/core");

let moduleId = 0;
//收集和处理文件中的代码createAssets
const createAssets = (filename) => {
  const content = fs.readFileSync(filename, "utf-8"); // 根据文件名，同步读取文件流

  const dependencies = []; // 用于收集文件依赖的路径
  // 将读取文件流 buffer 转换为 AST
  const ast = parser.parse(content, {
    sourceType: "module", // 指定源码类型
  });
  traverse(ast, {
    //收集每个模块的依赖
    ImportDeclaration: ({ node }) => {
      dependencies.push(node.source.value);
    },
  });
  // 通过 AST 将 ES6 代码转换成 ES5 代码
  const { code } = babel.transformFromAstSync(ast, null, {
    presets: ["@babel/preset-env"],
  });

  let id = moduleId++; // 设置当前处理的模块ID
  return {
    id,
    filename,
    code,
    dependencies,
  };
  // console.log(ast);
  // console.log(dependencies)
};
function bundle(graph) {
  let modules = "";
  graph.forEach((item) => {
    modules += `
            ${item.id}: [
                function (require, module, exports){
                    ${item.code}
                },
                ${JSON.stringify(item.mapping)}
            ],
        `;
  });

  return `
    (function(modules){
        function require(id){
            const [fn, mapping] = modules[id];
          
            function localRequire(relativePath){
                return require(mapping[relativePath]);
            }
            const module = {
                exports: {}
            }
            fn(localRequire, module, module.exports);
            return module.exports;
        }
        require(0);
    })({${modules}})
`;
}
function createGraph(entry) {
  const mainAsset = createAssets(entry); // 获取入口文件下的内容
  const queue = [mainAsset]; // 入口文件的结果作为第一项
  for (const asset of queue) {
    const dirname = path.dirname(asset.filename);
    asset.mapping = {};
    asset.dependencies.forEach((relativePath) => {
      const absolutePath = path.join(__dirname, dirname, relativePath); // 转换文件路径为绝对路径

      const child = createAssets(absolutePath);
      asset.mapping[relativePath] = child.id; // 保存模块ID
      queue.push(child); // 递归去遍历所有子节点的文件
    });
  }
  return queue;
}
//生成一个编译后的文件
function writeFile(result) {
  fs.mkdir("./dist", (error) => {
    if (error && error.code!='EEXIST') { 
      console.error(error);
      throw error;
    }
    fs.writeFile("./dist/bundle.js", result, function (error) {
      if (error) {
        console.error(error);
        throw error;
      }
      console.log("打包完成");
    });
  });
}

let graph = createGraph("./src/index.js"); //收集文件依赖

let result = bundle(graph);//收集代码

writeFile(result); //输出至./dist/bundle.js

// createAssets('./src/index.js');
