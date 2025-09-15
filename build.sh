#!/bin/bash

# 定义文件路径
PACKAGE_JSON="package.json"

# 定义要替换的旧 URL
OLD_URL="https://raw.githubusercontent.com/touchear/xarr-pay-plugins/refs/heads/main/"
# 使用环境变量 RE_URL
NEW_URL="${RE_URL}"

# 检查环境变量是否已设置
if [ -z "$NEW_URL" ]; then
    echo "错误: 环境变量 RE_URL 未设置。"
    exit 1
fi

# 使用 sed 命令进行替换
if [ -f "$PACKAGE_JSON" ]; then
    sed -i "s|$OLD_URL|$NEW_URL|g" "$PACKAGE_JSON"
    echo "URL 替换成功！"
else
    echo "文件 $PACKAGE_JSON 不存在。"
fi
