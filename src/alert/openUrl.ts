import { exec } from 'child_process';

/**
 * 打开一个url
 * @param _url 该url
 */
export function openUrl(_url: string) {
    let ch_p = exec(`start ${_url}`);
    ch_p.on('error', (mes) => {
        // console.log(mes);
    });
}
