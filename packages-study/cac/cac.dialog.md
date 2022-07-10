# 目录
> 该文件是由`CAC`自动生成的，请不要修改。目录是在原仓库下面生成了，这里主要对各个目录来做介绍

```
cac
├─ .editorconfig       让使用不同编辑器的开发者在共同开发一个项目时，处理不同编辑器带来的差异。
├─ .gitattributes      每当一个文件被创建或保存，git 会按照这些属性所指定的自动化的保存文件,处理不同操作系统直接文档格式带来的差异
├─ .github             github相关文件
│  ├─ FUNDING.yml      github线上赞助的按钮
│  └─ ISSUE_TEMPLATE.md  github的issue模板
├─ .gitignore           忽视需要提交的文件
├─ .prettierrc          prettier的配置文件，格式化代码时使用
├─ circle.yml           circleci的配置文件，用于提交代码后的自动测试和部署
├─ examples             示例代码
│  ├─ basic-usage.js    基本使用
│  ├─ command-examples.js   命令的示例
│  ├─ command-options.js  命令的参数
│  ├─ dot-nested-options.js  嵌套的参数
│  ├─ help.js                  --help的实现
│  ├─ ignore-default-value.js   忽视默认值的参数
│  ├─ negated-option.js          取消的参数
│  ├─ sub-command.js            子命令的使用
│  └─ variadic-arguments.js     可变参数（多个参数）
├─ index-compat.js              兼容node的index.js的写法
├─ jest.config.js    jest的配置文件，配置测试
├─ LICENSE           许可证
├─ mod.js            对deno的支持
├─ mod.ts            对deno的支持
├─ mod_test.ts        deno的测试文件
├─ package.json       项目主入口，依赖信息，依赖的版本，以及其他信息
├─ README.md          项目的描述
├─ rollup.config.js   rollup的配置文件，配置打包
├─ scripts            脚本，用于执行某些操作
│  └─ build-deno.ts   deno的打包
├─ src                源码
├─ tsconfig.json        TypeScript的配置文件，用于编译TypeScript
└─ yarn.lock          yarn的配置文件，用于锁定依赖
```



# git的目录说明

```
.git 
├─ config               git的配置文件, 
├─ description              文件主要用于 GitWeb 的描述
├─ FETCH_HEAD               git的提取文件,
├─ HEAD               判断当前工作分支的。如果你切换了当前分支，那么这个文件的内容也会随之发生改变
├─ hooks              当前git的钩子集合 详细查看 https://git-scm.com/docs/githooks
│  ├─ applypatch-msg                该脚本最先被触发，该脚本可以修改文件中保存的提交说明，以便规范提交说明以符合项目标准。如果提交说明不符合规定的标准，脚本返回非零值，git终止提交。和commit-msg的作用是一样的
│  ├─ applypatch-msg.sample          这个hooks还没有启用的状态,启用就是把 .sample 给去掉就行
│  ├─ commit-msg                  该脚本可以用来验证提交说明的规范性，如果作者写的提交说明不符合指定路径文件中的规范，提交就会被终止
│  ├─ commit-msg.sample                   这个hooks还没有启用的状态
│  ├─ fsmonitor-watchman.sample                  Git 将根据给定的路径名​​限制它检查更改的文件以及检查未跟踪文件的目录
│  ├─ post-applypatch                  脚本会在补丁应用并提交之后运行,该脚本可以用来向工作组成员或补丁作者发送通知
│  ├─ post-checkout                  这个脚本可以用于为自己的项目设置合适的工作区，比如自动生成文档、移动一些大型二进制文件等，也可以用于检查版本库的有效性
│  ├─ post-commit                  脚本发生在整个提交过程完成之后。这个脚本不包含任何参数，也不会影响commit的运行结果，可以用于发送new commit通知
│  ├─ post-merge                   该脚本可以用来验证提交说明的规范性，如果作者写的提交说明不符合指定路径文件中的规范，提交就会被终止
│  ├─ post-receive                  该脚本可以用于对其他镜像版本库的更新，或向用户发送提示（直接通过服务器端的echo命令）,如： Git实现生产代码的自动化部署
│  ├─ post-rewrite                  该脚本由重写提交的命令调用
│  ├─ post-update                  此钩子主要用于通知，不能影响git receive-pack的结果
│  ├─ post-update.sample                  更新后的钩子还没有启动的状态
│  ├─ pre-applypatch                     会在补丁应用后但尚未提交前运行。这个脚本没有参数，可以用于对应用补丁后的工作区进行测试，或对git tree进行检查。
│  ├─ pre-applypatch.sample                  补丁hook没有启用的标志
│  ├─ pre-auto-gc                  这个钩子由git-gc --auto调用， git gc 的作用是 清理不必要的文件并优化本地版本库
│  ├─ pre-commit                  在提交信息前运行，最先触发运行的脚本。被用来检查即将提交的代码快照。例如，检查是否有东西被遗漏、运行一些自动化测试、以及检查代码规范
│  ├─ pre-commit.sample                   pre-commit钩子还没有启动的状态
│  ├─ pre-merge-commit.sample                 合并前提交钩子还没有启动的状态
│  ├─ pre-push                  该脚本用于阻止push的发生
│  ├─ pre-push.sample                  pre-push钩子还没有启动的状态
│  ├─ pre-rebase                  由git rebase命令调用，运行在rebase执行之前.可用于阻止git rebase的执行
│  ├─ pre-rebase.sample                  git rebase钩子没有启动的状态
│  ├─ pre-receive                  由服务器端的git receive-pack命令调用，当从本地版本库完成一个推送之后，远端服务器开始批量更新之前，该脚本被触发执行.
│  ├─ pre-receive.sample                  钩子未启用状态
│  ├─ prepare-commit-msg                  脚本会在默认的提交信息准备完成后但编辑器尚未启动之前运行。 这个脚本的作用是用来编辑commit的默认提交说明
│  ├─ prepare-commit-msg.sample                 prepare-commit-msg钩子还没有启动的状态               
│  ├─ push-to-checkout                  
│  ├─ push-to-checkout.sample                  未启动钩子的状态
│  ├─ sendemail-validate                  此钩子由git send-email调用,即保存要发送的电子邮件的文件的名称。退出非零状态导致git send-email在发送任何电子邮件之前中止。
│  ├─ update                  它和pre-recieve有些类似，只是它会为推送过来的更新中涉及到的每一个分支都做一次检查，而后者则至始至终只有一次检查
│  └─ update.sample                  未启动钩子的状态
├─ index                index也称为stage，是一个索引文件。当执行git add后，文件就会存入Git的对象objects里，并使用索引进行定位index也称为stage，是一个索引文件。当执行git add后，文件就会存入Git的对象objects里，并使用索引进行定位
├─ info 
│  └─ exclude 
├─ logs                 保存所有更新操作的引用记录，主要用于git reflog
│  ├─ HEAD 
│  └─ refs 
│     ├─ heads 
│     │  └─ master 
│     └─ remotes 
│        └─ origin 
│           └─ HEAD 
├─ objects                所有文件的存储对象
│  ├─ info 
│  └─ pack 
│     ├─ pack-cdf2ea3030cbf647baa5d3f7b348e231824cf1ff.idx 
│     └─ pack-cdf2ea3030cbf647baa5d3f7b348e231824cf1ff.pack 
├─ packed-refs 
└─ refs                具体的引用，主要存储分支和标签的引用
   ├─ heads 
   │  └─ master 
   ├─ remotes 
   │  └─ origin 
   │     └─ HEAD 
   └─ tags
```


