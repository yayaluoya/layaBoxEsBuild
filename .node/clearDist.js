const fs = require('fs');
const path = require('path');

try {
    fs.rmSync(path.join(__dirname, '../dist'), {
        recursive: true,
    });
    console.log('dist目录已删除');
} catch (e) {
    console.log('删除错误', e);
}
