1. 依次点击npm脚本的 安装全局包，安装本地包，安装工具包【会有点慢】。

2. 然后就可以用esbuild，webpack，和laya的直接编译了，前提是要用vscode编辑器

3. 如果觉得编译的提示不全，可以自己加，esbuild的再.node/esbuild目录下，webpack有个插件在.node/gulpfile/webpack下

4. esbuild可能不太稳定，所以这里外加了一个非常稳的webpack

5. 由于esbuild用的是另一个主页，所以在bin/index.js中加的类库要反馈到/bin/esbuild.js上

6. 所有提示给出的主页都要用按f5打开的窗口访问