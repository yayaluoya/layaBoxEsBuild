import PackageConfig from "../config/PackageConfig";

/**
 * sw工具
 */
export default class SwT {
    /** swURL */
    private static m_swURL: string;

    /** swURL */
    public static get swURL(): string {
        if (!this.m_swURL) {
            this.m_swURL = `esbuildSw@${PackageConfig.package.version}`;
        }
        return this.m_swURL;
    }
}