const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

// 计算文件的MD5值
function calculateMD5(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = crypto.createHash('md5');
  hashSum.update(fileBuffer);
  return hashSum.digest('hex');
}

// 多种方式获取文件时间
function getFileTime(filePath) {
  const times = {
    git: null,
    gitAuthor: null,
    gitCommitter: null,
    fileCreation: null,
    fileModification: null,
    current: Math.floor(Date.now() / 1000)
  };
  
  const relativePath = path.relative(process.cwd(), filePath);
  
  // 1. 尝试获取Git提交时间
  try {
    times.git = parseInt(execSync(`git log -1 --format=%at -- "${relativePath}"`).toString().trim(), 10) || null;
    times.gitAuthor = parseInt(execSync(`git log -1 --format=%at -- "${relativePath}"`).toString().trim(), 10) || null;
    times.gitCommitter = parseInt(execSync(`git log -1 --format=%ct -- "${relativePath}"`).toString().trim(), 10) || null;
    
    // 打印诊断信息
    console.log(`文件 ${relativePath} 的Git信息:`);
    console.log(`- 提交时间戳: ${times.git} (${times.git ? new Date(times.git * 1000).toISOString() : 'N/A'})`);
    console.log(`- 作者时间戳: ${times.gitAuthor} (${times.gitAuthor ? new Date(times.gitAuthor * 1000).toISOString() : 'N/A'})`);
    console.log(`- 提交者时间戳: ${times.gitCommitter} (${times.gitCommitter ? new Date(times.gitCommitter * 1000).toISOString() : 'N/A'})`);
  } catch (error) {
    console.log(`无法获取文件 ${relativePath} 的Git提交时间: ${error.message}`);
  }
  
  // 2. 获取文件系统时间
  try {
    const stats = fs.statSync(filePath);
    times.fileCreation = Math.floor(stats.birthtime.getTime() / 1000);
    times.fileModification = Math.floor(stats.mtime.getTime() / 1000);
    
    console.log(`文件 ${relativePath} 的文件系统时间:`);
    console.log(`- 创建时间: ${new Date(times.fileCreation * 1000).toISOString()}`);
    console.log(`- 修改时间: ${new Date(times.fileModification * 1000).toISOString()}`);
  } catch (error) {
    console.log(`无法获取文件 ${relativePath} 的文件系统时间: ${error.message}`);
  }
  
  // 3. 根据可用性选择最合适的时间
  // 优先级: Git提交时间 > 文件修改时间 > 文件创建时间 > 当前时间
  const bestTime = times.git || times.fileModification || times.fileCreation || times.current;
  console.log(`选择的最佳时间: ${new Date(bestTime * 1000).toISOString()}`);
  
  return bestTime;
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
    // 可选：如果需要，可以在这里创建新的插件条目
  }
  
  console.log('-------------------');
}

// 写回package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
console.log('package.json 已更新');
