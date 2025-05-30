const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// 计算文件的MD5值
function calculateMD5(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = crypto.createHash('md5');
  hashSum.update(fileBuffer);
  return hashSum.digest('hex');
}

// 获取当前时间的UNIX时间戳（秒）
function getCurrentTimestamp() {
  return Math.floor(Date.now() / 1000);
}

// 读取package.json
const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// 确保data和plugins字段存在
if (!packageJson.data) packageJson.data = {};
if (!packageJson.data.plugins) packageJson.data.plugins = [];

// 扫描plugins目录中的ZIP文件
const pluginsDir = path.join(process.cwd(), 'plugins');
const pluginFiles = fs.readdirSync(pluginsDir)
  .filter(file => file.endsWith('.zip'));

// 处理每个ZIP文件
for (const zipFile of pluginFiles) {
  const zipPath = path.join(pluginsDir, zipFile);
  const pluginName = path.basename(zipFile, '.zip');
  const md5 = calculateMD5(zipPath);
  const currentTime = getCurrentTimestamp();
  
  // 查找与ZIP文件名匹配的插件条目
  const pluginIndex = packageJson.data.plugins.findIndex(plugin => plugin.name === pluginName);
  
  if (pluginIndex !== -1) {
    // 更新现有插件信息
    packageJson.data.plugins[pluginIndex].md5 = md5;
    packageJson.data.plugins[pluginIndex].update_time = currentTime;
    console.log(`更新插件信息: ${pluginName}, MD5: ${md5}`);
  } else {
    console.log(`未找到匹配的插件条目: ${pluginName}`);
    // 可选：如果需要，可以在这里创建新的插件条目
  }
}

// 写回package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
console.log('package.json 已更新');
