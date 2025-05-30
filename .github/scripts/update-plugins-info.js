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

// 获取文件系统时间
function getFileTime(filePath) {
  try {
    const stats = fs.statSync(filePath);
    
    // 获取文件修改时间和创建时间
    const modTime = Math.floor(stats.mtime.getTime() / 1000);
    const createTime = Math.floor(stats.birthtime.getTime() / 1000);
    
    console.log(`文件 ${path.basename(filePath)} 的文件系统时间:`);
    console.log(`- 修改时间: ${new Date(modTime * 1000).toISOString()}`);
    console.log(`- 创建时间: ${new Date(createTime * 1000).toISOString()}`);
    
    // 优先使用修改时间，因为它通常更准确地反映文件的更新时间
    return modTime;
  } catch (error) {
    console.error(`无法获取文件 ${filePath} 的时间: ${error.message}`);
    return Math.floor(Date.now() / 1000); // 如果出错，返回当前时间
  }
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
  const updateTime = getFileTime(zipPath);
  
  // 查找与ZIP文件名匹配的插件条目
  const pluginIndex = packageJson.data.plugins.findIndex(plugin => plugin.name === pluginName);
  
  if (pluginIndex !== -1) {
    // 更新现有插件信息
    packageJson.data.plugins[pluginIndex].md5 = md5;
    packageJson.data.plugins[pluginIndex].update_time = updateTime;
    console.log(`更新插件信息: ${pluginName}, MD5: ${md5}, 更新时间: ${new Date(updateTime * 1000).toISOString()}`);
  } else {
    console.log(`未找到匹配的插件条目: ${pluginName}`);
    // 如果需要创建新条目，可以取消下面代码的注释
    /*
    packageJson.data.plugins.push({
      name: pluginName,
      md5: md5,
      update_time: updateTime
    });
    console.log(`创建新插件条目: ${pluginName}`);
    */
  }
  
  console.log('-------------------');
}

// 写回package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
console.log('package.json 已更新');
