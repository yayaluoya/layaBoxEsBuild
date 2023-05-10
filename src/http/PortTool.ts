import portfinder from 'portfinder';
import MainConfig from '../config/MainConfig';
/**
 * 端口工具
 */
export default class PortTool {
    /** 当前获取端口的任务 */
    private static onGetPortTask: Promise<any> = Promise.resolve();

    /**
     * 获取一个未使用的端口
     * @param name 使用端口的描述
     */
    public static getPool(describe: string): Promise<number> {
        MainConfig.config.ifLog && console.log(`${describe}-申请端口`);
        this.onGetPortTask = this.onGetPortTask.then(() => {
            return portfinder.getPortPromise().then((prot) => {
                MainConfig.config.ifLog && console.log(`${describe}得到端口`, prot);
                return prot;
            });
        });
        return this.onGetPortTask;
    }
}
