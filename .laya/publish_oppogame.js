// v1.8.1
const ideModuleDir = global.ideModuleDir;
const workSpaceDir = global.workSpaceDir;

//引用插件模块
const gulp = require(ideModuleDir + "gulp");
const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");
const del = require(ideModuleDir + "del");
const revCollector = require(ideModuleDir + 'gulp-rev-collector');
const iconv =  require(ideModuleDir + "iconv-lite");

let copyLibsTask = ["copyPlatformLibsJsFile"];
let versiontask = ["version2"];

let 
    config,
	releaseDir,
    toolkitPath,
    tempReleaseDir, // OPPO临时拷贝目录
	projDir; // OPPO快游戏工程目录
let versionCon; // 版本管理version.json
let commandSuffix,
	adbPath,
	opensslPath,
	layarepublicPath;

// 创建OPPO项目前，拷贝OPPO引擎库、修改index.js
gulp.task("preCreate_OPPO", copyLibsTask, function() {
	releaseDir = global.releaseDir;
	config = global.config;
	commandSuffix = global.commandSuffix;
	adbPath = global.adbPath;
	opensslPath = global.opensslPath;
	layarepublicPath = global.layarepublicPath;
	tempReleaseDir = global.tempReleaseDir;

    toolkitPath = path.join(layarepublicPath, "oppo", "quickgame-toolkit");
});

gulp.task("copyPlatformFile_OPPO", ["preCreate_OPPO"], function() {
	return;
});

// 新建OPPO项目-OPPO项目与其他项目不同，需要安装OPPO quickgame node_modules，并打包成.rpk文件
gulp.task("installModules_OPPO", versiontask, function() {
	releaseDir = path.dirname(releaseDir);
	projDir = path.join(releaseDir, config.oppoInfo.projName);
    // 如果IDE里对应OPPO包已经install node_modules了，忽略这一步
    if (fs.existsSync(path.join(toolkitPath, "node_modules"))) {
        return;
    }
	// 安装OPPO quickgame node_modules
	return new Promise((resolve, reject) => {
		console.log("开始安装OPPO quickgame node_modules，请耐心等待...");
		let cmd = `npm${commandSuffix}`;
		let args = ["install"];
        let opts = {
			cwd: toolkitPath,
			shell: true
		};
        let cp = childProcess.spawn(cmd, args, opts);
        
		cp.stdout.on('data', (data) => {
			console.log(`stdout: ${data}`);
		});
		
		cp.stderr.on('data', (data) => {
			console.log(`stderr: ${data}`);
			// reject();
		});
		
		cp.on('close', (code) => {
			console.log(`子进程退出码：${code}`);
			resolve();
		});
	});
});

// 拷贝文件到OPPO快游戏
gulp.task("copyFileToProj_OPPO", ["installModules_OPPO"], function() {
	// 将临时文件夹中的文件，拷贝到项目中去
	let originalDir = `${tempReleaseDir}/**/*.*`;
	let stream = gulp.src(originalDir);
	return stream.pipe(gulp.dest(path.join(projDir)));
});

// 拷贝icon到OPPO快游戏
gulp.task("copyIconToProj_OPPO", ["copyFileToProj_OPPO"], function() {
	let originalDir = config.oppoInfo.icon;
	let stream = gulp.src(originalDir);
	return stream.pipe(gulp.dest(path.join(projDir)));
});

// 清除OPPO快游戏临时目录
gulp.task("clearTempDir_OPPO", ["copyIconToProj_OPPO"], function() {
	// 删掉临时目录
	return del([tempReleaseDir], { force: true });
});

// 生成release签名(私钥文件 private.pem 和证书文件 certificate.pem )
gulp.task("generateSign_OPPO", ["clearTempDir_OPPO"], function() {
    if (!config.oppoSign.generateSign) {
        return;
    }
	// https://doc.quickapp.cn/tools/compiling-tools.html
	return new Promise((resolve, reject) => {
		let cmd = `${opensslPath}`;
		let args = ["req", "-newkey", "rsa:2048", "-nodes", "-keyout", "private.pem", 
					"-x509", "-days", "3650", "-out", "certificate.pem"];
		let opts = {
			cwd: projDir,
			shell: true
		};
		let cp = childProcess.spawn(cmd, args, opts);
		cp.stdout.on('data', (data) => {
			console.log(`stdout: ${data}`);
		});

		cp.stderr.on('data', (data) => {
			console.log(`stderr: ${data}`);
			data += "";
			if (data.includes("Country Name")) {
				cp.stdin.write(`${config.oppoSign.countryName}\n`);
				console.log(`Country Name: ${config.oppoSign.countryName}`);
			} else if (data.includes("Province Name")) {
				cp.stdin.write(`${config.oppoSign.provinceName}\n`);
				console.log(`Province Name: ${config.oppoSign.provinceName}`);
			} else if (data.includes("Locality Name")) {
				cp.stdin.write(`${config.oppoSign.localityName}\n`);
				console.log(`Locality Name: ${config.oppoSign.localityName}`);
			} else if (data.includes("Organization Name")) {
				cp.stdin.write(`${config.oppoSign.orgName}\n`);
				console.log(`Organization Name: ${config.oppoSign.orgName}`);
			} else if (data.includes("Organizational Unit Name")) {
				cp.stdin.write(`${config.oppoSign.orgUnitName}\n`);
				console.log(`Organizational Unit Name: ${config.oppoSign.orgUnitName}`);
			} else if (data.includes("Common Name")) {
				cp.stdin.write(`${config.oppoSign.commonName}\n`);
				console.log(`Common Name: ${config.oppoSign.commonName}`);
			} else if (data.includes("Email Address")) {
				cp.stdin.write(`${config.oppoSign.emailAddr}\n`);
				console.log(`Email Address: ${config.oppoSign.emailAddr}`);
				// cp.stdin.end();
			}
			// reject();
		});

		cp.on('close', (code) => {
			console.log(`子进程退出码：${code}`);
			resolve();
		});
	});
});

// 拷贝sign文件到指定位置
gulp.task("copySignFile_OPPO", ["generateSign_OPPO"], function() {
    if (config.oppoSign.generateSign) { // 新生成的签名
        // 移动签名文件到项目中（Laya & OPPO快游戏项目中）
        let 
            privatePem = path.join(projDir, "private.pem"),
            certificatePem = path.join(projDir, "certificate.pem");
        let isSignExits = fs.existsSync(privatePem) && fs.existsSync(certificatePem);
        if (!isSignExits) {
            return;
        }
        let 
            xiaomiDest = `${projDir}/sign/release`,
            layaDest = `${workSpaceDir}/sign/release`;
        let stream = gulp.src([privatePem, certificatePem]);
        return stream.pipe(gulp.dest(xiaomiDest))
                    .pipe(gulp.dest(layaDest));
    } else if (config.oppoInfo.useReleaseSign && !config.oppoSign.generateSign) { // 使用release签名，并且没有重新生成
        // 从项目中将签名拷贝到OPPO快游戏项目中
        let 
            privatePem = path.join(workSpaceDir, "sign", "release", "private.pem"),
            certificatePem = path.join(workSpaceDir, "sign", "release", "certificate.pem");
        let isSignExits = fs.existsSync(privatePem) && fs.existsSync(certificatePem);
        if (!isSignExits) {
            return;
        }
        let 
            xiaomiDest = `${projDir}/sign/release`;
        let stream = gulp.src([privatePem, certificatePem]);
        return stream.pipe(gulp.dest(xiaomiDest));
    }
});

gulp.task("deleteSignFile_OPPO", ["copySignFile_OPPO"], function() {
	if (config.oppoSign.generateSign) { // 新生成的签名
		let 
            privatePem = path.join(projDir, "private.pem"),
            certificatePem = path.join(projDir, "certificate.pem");
		return del([privatePem, certificatePem], { force: true });
	}
});

gulp.task("modifyFile_OPPO", ["deleteSignFile_OPPO"], function() {
	// 修改manifest.json文件
	let manifestPath = path.join(projDir, "manifest.json");
	let IDEManifestPath = path.join(toolkitPath, "tpl", "manifest.json");
	if (!fs.existsSync(IDEManifestPath) && !fs.existsSync(manifestPath)) {
		return;
	}
	let manifestContent;
	if (fs.existsSync(manifestPath)) {
		manifestContent = fs.readFileSync(manifestPath, "utf8");
	} else {
		manifestContent = fs.readFileSync(IDEManifestPath, "utf8");
	}
	let manifestJson = JSON.parse(manifestContent);
	manifestJson.package = config.oppoInfo.package;
	manifestJson.name = config.oppoInfo.name;
	manifestJson.orientation = config.oppoInfo.orientation;
	manifestJson.config.logLevel = config.oppoInfo.logLevel || "off";
	manifestJson.versionName = config.oppoInfo.versionName;
	manifestJson.versionCode = config.oppoInfo.versionCode;
	manifestJson.minPlatformVersion = config.oppoInfo.minPlatformVersion;
	manifestJson.icon = `./${path.basename(config.oppoInfo.icon)}`;
	if (config.oppoInfo.subpack) {
		manifestJson.subpackages = config.oppoSubpack;
	} else {
		delete manifestJson.subpackages;
	}
	fs.writeFileSync(manifestPath, JSON.stringify(manifestJson, null, 4), "utf8");

	if (config.version) {
		let versionPath = projDir + "/version.json";
		versionCon = fs.readFileSync(versionPath, "utf8");
		versionCon = JSON.parse(versionCon);
	}
	let indexJsStr = (versionCon && versionCon["index.js"]) ? versionCon["index.js"] :  "index.js";
	// OPPO项目，修改main.js
	let filePath = path.join(projDir, "main.js");
	if (!fs.existsSync(filePath)) {
		let fileContent = `window.navigator.userAgent = 'Mozilla/5.0 (Linux; Android 5.1.1; Nexus 6 Build/LYZ28E) AppleWebKit/603.1.30 (KHTML, like Gecko) Mobile/14E8301 OPPO MiniGame NetType/WIFI Language/zh_CN';
require("./libs/laya.quickgamemini.js");\nrequire("index.js");`;
		fs.writeFileSync(filePath, fileContent, "utf8");
	}

	// OPPO项目，修改index.js
	let indexFilePath = path.join(projDir, indexJsStr);
	if (!fs.existsSync(indexFilePath)) {
		return;
	}
	let indexFileContent = fs.readFileSync(indexFilePath, "utf8");
	indexFileContent = indexFileContent.replace(/loadLib(\(['"])/gm, "require$1./");
	fs.writeFileSync(indexFilePath, indexFileContent, "utf8");
});

gulp.task("modifyMinJs_OPPO", ["modifyFile_OPPO"], function() {
	let fileJsPath = path.join(projDir, "main.js");
	let content = fs.readFileSync(fileJsPath, "utf-8");
	if (!config.useMinJsLibs) { // 默认保留了平台文件，如果同时取消使用min类库，就会出现文件引用不正确的问题
		content = content.replace(/min\/laya(-[\w\d]+)?\.quickgamemini\.min\.js/gm, "laya.quickgamemini.js");
	} else {
		content = content.replace(/(min\/)?laya(-[\w\d]+)?\.quickgamemini(\.min)?\.js/gm, "min/laya.quickgamemini.min.js");
	}
	fs.writeFileSync(fileJsPath, content, 'utf-8');
});

gulp.task("version_OPPO", ["modifyMinJs_OPPO"], function () {
	// main.js默认不覆盖，如果同时开启版本管理，就会出现文件引用不正确的问题
	let fileJsPath = path.join(projDir, "main.js");
	let content = fs.readFileSync(fileJsPath, "utf-8");
	content = content.replace(/laya(-[\w\d]+)?\.quickgamemini/gm, "laya.quickgamemini");
	content = content.replace(/index(-[\w\d]+)?\.js/gm, "index.js");
	fs.writeFileSync(fileJsPath, content, 'utf-8');

	if (config.version) {
		let versionPath = projDir + "/version.json";
		let mainJSPath = projDir + "/main.js";
		let srcList = [versionPath, mainJSPath];
		return gulp.src(srcList)
			.pipe(revCollector())
			.pipe(gulp.dest(projDir));
	}
});

// 打包rpk
gulp.task("buildRPK_OPPO", ["version_OPPO"], function() {
	// 在OPPO轻游戏项目目录中执行:
    // quickgame pack || quickgame pack release
    // quickgame subpack --no-build-js || quickgame subpack release --no-build-js
	let cmdStr = "";
	let packStr = "pack";
	let nobuildjs = "";
	if (config.oppoInfo.subpack) {
		packStr = "subpack";
		nobuildjs = "--no-build-js";
	}
    if (config.oppoInfo.useReleaseSign) {
        cmdStr = "release";
    }
	return new Promise((resolve, reject) => {
		let cmd = path.join(toolkitPath, "lib", "bin", `quickgame${commandSuffix}`);
		let args = [packStr, cmdStr, nobuildjs];
		let opts = {
			cwd: projDir,
			shell: true
		};
		let cp = childProcess.spawn(`"${cmd}"`, args, opts);
		// let cp = childProcess.spawn('npx.cmd', ['-v']);
		cp.stdout.on('data', (data) => {
			console.log(`stdout: ${data}`);
		});

		cp.stderr.on('data', (data) => {
			console.log(`stderr: ${data}`);
			console.log(`stderr(iconv): ${iconv.decode(data, 'gbk')}`);
			// reject();
		});

		cp.on('close', (code) => {
			console.log(`子进程退出码：${code}`);
			resolve();
		});
	});
});

gulp.task("pushRPK_OPPO", ["buildRPK_OPPO"], function() {
	if (!config.oppoInfo.adbDebug) {
        return;
    }
	// 在OPPO轻游戏项目目录中执行:
    // adb push dist/game.rpk sdcard/games
	// adb push layarepublicPath/oppo/instant_app_settings.properties
	// adb shell am start -n com.nearme.instant.platform/com.oppo.autotest.main.InstantAppActivity
	return new Promise((resolve, reject) => {
		let cmd = `${adbPath}`;
		let sdGamesPath = config.oppoInfo.subpack ? "sdcard/subPkg" : "sdcard/games";
		let args = ["push", `dist/${config.oppoInfo.package}${config.oppoInfo.useReleaseSign ? ".signed" : ""}.rpk`, sdGamesPath];
		let opts = {
			cwd: projDir,
			shell: true
		};
		let cp = childProcess.spawn(cmd, args, opts);
		// let cp = childProcess.spawn('npx.cmd', ['-v']);
		cp.stdout.on('data', (data) => {
			console.log(`stdout: ${data}`);
		});

		cp.stderr.on('data', (data) => {
			console.log(`stderr: ${data}`);
			// reject();
		});

		cp.on('close', (code) => {
			console.log(`1) push_RPK 子进程退出码：${code}`);
			resolve();
		});
	}).then(() => {
		return new Promise((resolve, reject) => {
			// 如果是分包，需要修改里面的内容
			let oppoPropPath = path.join(layarepublicPath, "oppo", "instant_app_settings.properties");
			if (config.oppoInfo.subpack) {
				fs.writeFileSync(oppoPropPath, "default_tab_index=4", "utf8");
			} else {
				fs.writeFileSync(oppoPropPath, "default_tab_index=2", "utf8");
			}
			let cmd = `${adbPath}`;
			let args = ["push", oppoPropPath, "sdcard/"];
			let opts = {
				cwd: projDir,
				shell: true
			};
			let cp = childProcess.spawn(cmd, args, opts);
			// let cp = childProcess.spawn('npx.cmd', ['-v']);
			cp.stdout.on('data', (data) => {
				console.log(`stdout: ${data}`);
			});
	
			cp.stderr.on('data', (data) => {
				console.log(`stderr: ${data}`);
				// reject();
			});
	
			cp.on('close', (code) => {
				console.log(`2) push_RPK 子进程退出码：${code}`);
				resolve();
			});
		});
	}).then(() => {
		return new Promise((resolve, reject) => {
			let cmd = `${adbPath}`;
			let args = ["shell", "am", "start", "-n", "com.nearme.instant.platform/com.oppo.autotest.main.InstantAppActivity"];
			let opts = {
				cwd: projDir,
				shell: true
			};
			let cp = childProcess.spawn(cmd, args, opts);
			// let cp = childProcess.spawn('npx.cmd', ['-v']);
			cp.stdout.on('data', (data) => {
				console.log(`stdout: ${data}`);
			});
	
			cp.stderr.on('data', (data) => {
				console.log(`stderr: ${data}`);
				// reject();
			});
	
			cp.on('close', (code) => {
				console.log(`3) push_RPK 子进程退出码：${code}`);
				resolve();
			});
		});
	});
});

gulp.task("buildOPPOProj", ["pushRPK_OPPO"], function() {
	console.log("all tasks completed");
});