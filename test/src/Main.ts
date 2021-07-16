import _module from './module.txt';
import './js.test.js';
import './com/test';
import 'src/ts';

import axios from 'axios';
const dayjs = require('dayjs');
import 'dayjs/locale/zh-cn';
import lodash from "lodash";
import * as dfasdfasd from "lodash";
dfasdfasd;
import thenby, { firstBy } from "thenby";

import { Test, Modle__ } from './test';

console.log(_module);
console.log('测试', 310);

let a: Test = new Test();
let b: Modle__.M = new Modle__.M();

console.log('d.ts文件内容', a, b);

console.log(dayjs.locale('zh-cn'));
console.log({ thenby, firstBy });
console.log('npm包测试', { axios, dayjs, lodash });