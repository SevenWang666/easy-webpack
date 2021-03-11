## 手写简易版webpack

主要安装@babel/core,@babel/parser,@babel/preset-env,@babel/traverse四个模块

1. @babel/parser : 用于分析通过 fs.readFileSync  读取的文件内容，并返回 AST (抽象语法树) ；
2. @babel/traverse : 用于遍历 AST, 获取必要的数据；
3. @babel/core : babel 核心模块，提供 transformFromAst 方法，用于将 AST 转化为浏览器可运行的代码；
4. @babel/preset-env : 将转换后代码转化成 ES5 代码；


主要分为四步
1. 收集和处理文件中的代码;createAssets
2. 根据入口文件返回所有文件的依赖图;createGraph
3. 根据依赖图输出整个代码;bundle
4. 将代码写入至至bundle.js;writeFile


### eval输出值
```

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
    })({
            0: [
                function (require, module, exports){
                    "use strict";

var _log = _interopRequireDefault(require("./log.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

//import info from './info.js'
console.log('abc'); //console.log(info().log)
// log()
                },
                {"./log.js":1}
            ],
        
            1: [
                function (require, module, exports){
                    "use strict";

console.log('log'); // export function log(){
//     console.log('log')
// }
                },
                {}
            ],
        })
```