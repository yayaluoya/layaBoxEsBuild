/**
 * 设置LayaNative屏幕方向，可设置以下值
 * landscape           横屏
 * portrait            竖屏
 * sensor_landscape    横屏(双方向)
 * sensor_portrait     竖屏(双方向)
 */
window.screenOrientation = "sensor_landscape";

//和index.js同步
loadLib("libs/laya.core.js");//laya核心包
//----- 换成esbuild打包后的主页 -------
loadLib("http://localhost:3060/Main", 'module');
