import typescript from 'rollup-plugin-typescript2';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';



const pkg = require("./package.json");

export default {
  input:"src/platform.ts",
  output:{
    file:"platform.umd.js",
    format:"umd",
    name:"platForm",
  },
  sourcemap:true,
  watch: {
    include: 'src/**',
    exclude: 'node_modules/**'
  },
  plugins:[
    typescript(/*{ plugin options }*/),
    resolve(),  //  import的文件 不再只是转化为 require 或者 而是直接去拉取 node 的依赖
    commonjs(),  // 引用的库  如lodash  库里的代码时requirejs  这种代码 rollup本身是处理不了的 需要插件预检并转换。
  ],
  external:[], // 外部依赖
  banner: '/* appconfigure version ' + pkg.version + ' */',
  footer: '/* follow me on github! @ ' + pkg.repository.url + ' */'
}