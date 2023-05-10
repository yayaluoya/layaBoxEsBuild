/** bug提示 */
export default [
    {
        describe: '终端提示：Error: esbuild: Failed to install correctly',
        resolve:
            '可能是node版本过低npm版本过高，尝试升高node版本，降低npm版本。推荐使用node 12。',
    },
    {
        describe: '终端提示：esbuild打包错误',
        resolve: '可能是ts文件中的语法错误或者不规范导致的，尝试修改对应的ts文件即可。',
    },
    {
        describe: '其他错误',
        resolve:
            '可以在评论区里面找到，或者提问。https://github.com/yayaluoya/layaBoxEsBuild/issues',
    },
] as {
    /** 描述 */
    describe: string;
    /** 解决方法 */
    resolve: string;
}[];
