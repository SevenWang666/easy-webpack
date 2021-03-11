const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
// 由于 traverse 采用的 ES Module 导出，我们通过 requier 引入的话就加个 .default
const babel = require("@babel/core");

let moduleId = 0;
const createAssets = filename => {
    const content = fs.readFileSync(filename, "utf-8"); // 根据文件名，同步读取文件流
    console.log(content)
    const dependencies = []; // 用于收集文件依赖的路径
   // 将读取文件流 buffer 转换为 AST
    const ast = parser.parse(content, {
        sourceType: "module" // 指定源码类型
    })
    traverse(ast, {    //收集每个模块的依赖
        ImportDeclaration: ({node}) => {
            console.log(node)
            dependencies.push(node.source.value);
        }
    });
    
    // console.log(ast);
    // console.log(dependencies)
}

createAssets('./src/index.js');