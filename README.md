# XArrPay 商户版插件仓库源
XArrPay 非官方收集的第三方插件仓库

欢迎提交 PR

# 使用方式

在XArrPay 商户版中填写插件源
`https://raw.githubusercontent.com/touchear/xarr-pay-plugins/refs/heads/main/package.json`

国内用户可在系统设置中设置加速地址
`https://ghp.ci/`


# 程序集
所有依赖程序都在 `https://github.com/touchear/xarr-pay-plugins/releases`

### X.xxx.apk (推荐)
X 转发器: 安卓监控端
全新全能通知管理软件

### SmsF_xxx.apk
短信转发器: 安卓监控端
此软件是开源程序

### xarr-xxx
此为对应的 Go 网关程序,使用方式在宝塔使用go项目创建即可 (直接下载后上传使用主程序 什么配置都不需要改)

### imacv3
前提: 需要在Centos 宝塔中安装 进程守护管理器 Redis

1.环境安装（必看）
步骤总结：
一、打开宝塔终端,输入信息
二、输入执行命令
三、等待安装成功

步骤详解：
1.打开宝塔终端,输入服务器信息
![image](https://github.com/user-attachments/assets/f07b8520-6cb2-4938-a1b7-df37588281be)


2.输入执行命令,回车安装,正确提示如下图

`sudo rpm -Uvh https://packages.microsoft.com/config/rhel/7/packages-microsoft-prod.rpm`

![image](https://github.com/user-attachments/assets/bab0e005-e51f-412e-a9bc-09a1438d448b)


3.完成2后输入执行命令,回车安装,中途会提示你输入全部输入y回车即可【选择自己安装得对应系统即可】
centos 7.N版本执行以下

`sudo yum install dotnet-sdk-3.1`

centos 8.N版本执行以下

`sudo dnf install dotnet-sdk-3.1`

![image](https://github.com/user-attachments/assets/1ad67df8-29f6-4674-8a10-92588d19a384)


4.后续出现一下提示代表已经部署成功了,随机可以去安装前台了
![image](https://github.com/user-attachments/assets/4ab052ab-1d69-4165-8aa6-ecd55b496b8b)

5. 宝塔守护程序设置
   启动命令 dotnet XMS.WeChat.Api.dll
   进程目录 填写你上传的包解压后的目录

7. 端口: 82
  端口(阿里云和自己的服务器内部都要放行)自行放行或自己建立反向代理

# 使用声明

本仓库所包含的代码和内容仅供学习与研究用途。我们无法保证本仓库中的内容不涉及违法或侵犯他人权益。在使用本仓库内的任何内容时，请您务必遵守相关法律法规，并自行承担所有可能的后果。

## 免责声明

- 本仓库作者不对任何因使用本仓库而引发的法律责任承担责任。
- 本仓库的内容可能会包含相关知识产权或其他法律保护的条款，请在使用前确保您拥有相应的合法权利。

## 违规处理

如发现本仓库中存在任何违法或侵权内容，请及时联系我进行处理。您可以通过以下方式联系我：

- 邮箱: [gerui434@gmail.com](mailto:gerui434@gmail.com)

谢谢你的理解与配合。
