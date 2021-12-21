import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
import postcss from "rollup-plugin-postcss";
import { terser } from "rollup-plugin-terser";

const extensions = [".js", ".jsx", ".ts", ".tsx"];

const pkg = require("./package.json");

const version = pkg.version;
const license = pkg.license;
const author = pkg.author;

const banner =
    "/**\n" +
    ` * ${pkg.name} v${version}\n` +
    ` * (c) 2021 ${author}\n` +
    ` * Released under the ${license} License.\n` +
    " */";

module.exports = {
    input: "src/index.ts",
    output: [
        // 文件输出配置
        {
            file: "dist/index.umd.js", // 打包后生产的文件位置，及文件名
            format: "umd",
            name: "r-pload", // 包的全局变量名称
            banner
        },
        {
            file: "dist/index.esm.js", // 打包后生产的文件位置，及文件名
            format: "esm",
            name: "r-pload", // 包的全局变量名称
            banner
        }
    ],
    plugins: [
        nodeResolve({
            extensions,
            modulesOnly: true
        }),
        typescript(),
        babel({
            babelHelpers: "runtime",
            include: "src/**",
            exclude: "node_modules/**",
            extensions
        }),
        commonjs(),
        postcss({
            plugins: [require("autoprefixer")],
            minimize: true,
            sourceMap: false,
            extensions: [".sass", ".scss", ".css"]
        })
        // terser()
    ]
};
