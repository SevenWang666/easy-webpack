## 手写简易版webpack

主要安装@babel/core,@babel/parser,@babel/preset-env,@babel/traverse四个模块

1. @babel/parser : 用于分析通过 fs.readFileSync  读取的文件内容，并返回 AST (抽象语法树) ；
2. @babel/traverse : 用于遍历 AST, 获取必要的数据；
3. @babel/core : babel 核心模块，提供 transformFromAst 方法，用于将 AST 转化为浏览器可运行的代码；
4. @babel/preset-env : 将转换后代码转化成 ES5 代码；


主要分为三步
1. 收集和处理文件中的代码;createAssets
2. 根据入口文件返回所有文件的依赖图;createGraph
3. 根据依赖图输出整个代码;bundle