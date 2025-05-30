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

// 获取文件的修改时间戳（秒）
function getFileModificationTime(filePath) {
  const stats = fs.statSync(filePath);
  return Math.floor(stats.mtime.getTime() / 1000);
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
  const fileUpdateTime = getFileModificationTime(zipPath);
  
  // 查找与ZIP文件名匹配的插件条目
  const pluginIndex = packageJson.data.plugins.findIndex(plugin => plugin.name === pluginName);
  
  if (pluginIndex !== -1) {
    // 更新现有插件信息
    packageJson.data.plugins[pluginIndex].md5 = md5;
    packageJson.data.plugins[pluginIndex].update_time = fileUpdateTime;
    console.log(`更新插件信息: ${pluginName}, MD5: ${md5}, 更新时间: ${new Date(fileUpdateTime * 1000).toISOString()}`);
  } else {
    console.log(`未找到匹配的插件条目: ${pluginName}`);
    // 可选：如果需要，可以在这里创建新的插件条目
  }
}

// 写回package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
console.log('package.json 已更新');
