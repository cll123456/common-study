
> 在大前端时代，前端的各种工具链穷出不断，有`eslint`, `prettier`, `husky`, `commitlint` 等, 东西太多有的时候也是`trouble`😂😂😂,怎么正确的使用这个是每一个前端开发者都需要掌握的内容，请上车🚗🚗🚗


# eslint

> 本次前端工程化的项目是基于react来的，vue用户也是同样的道理，只是有个别的依赖包不一样。

使用`eslint`的生态链来规范开发者对`js/ts`基本语法的规范。防止团队的成员乱写.

这里主要使用到的eslint的包有以下几个：
```json
"eslint": "^8.33.0",  // 这个是eslint的主包
"eslint-plugin-react": "^7.32.2",  // 这是react基于eslint来做的语法规范插件
"eslint-plugin-react-hooks": "^4.6.0", // 这是 react-hooks 语法基于eslint做的插件
"@typescript-eslint/eslint-plugin": "^5.50.0",  // typescript 基于eslint来做的插件
"@typescript-eslint/parser": "^5.50.0",  // typescript 基于eslint做的语法解析器，使得eslint可以约束ts语法
```

使用的以下语句来按照依赖：
```js
pnpm i eslint eslint-plugin-react eslint-plugin-react-hooks @typescript-eslint/parser @typescript-eslint/eslint-plugin -D
```

接下来需要对eslint的规范写入配置文件中，可以在项目的根目录下面建立一个 `.eslintrc.cjs`

```js
module.exports = {
    'env': {
        'node': true,   // 标志当前的环境，不然使用module.exports 会报错
        'es2021': true
    },
    extends: [
      'eslint:recommended',  // 使用eslint推荐的语法规范
      'plugin:react/recommended',  // react推荐的语法规范
      'plugin:@typescript-eslint/recommended' // ts推荐的语法规范
    ],
    parser: '@typescript-eslint/parser',  // 使用解析器来解析ts的代码，使得eslint可以规范ts的代码
    parserOptions: {
      ecmaFeatures: {
        jsx: true  // 允许使用jsx的语法
      },
      ecmaVersion: 'latest',  // es的版本为最新版本
      sourceType: 'module'  // 代码的模块化方式，使用module的模块方式
    },
    plugins: ['react', '@typescript-eslint', 'react-hooks'],  // 使用对应的react, react-hooks, @typescript-eslint 等插件
    rules: {
      quotes: ['error', 'single'],  // 配置单引号的规则，如果不是单引号，报错
      semi: 'off',  //  不需要使用分号；
      'react/react-in-jsx-scope': 'off'  // 在jsx中不需要导入 react的包
    }
  }
```

接下来在package.json 的 scripts 中加入一条命令

```json
"lint": "eslint --ext .ts,.tsx,.js,.jsx ./" // 使用eslint 规范 ts,tsx,js,jsx的代码
```


## 效果

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/454f9a9bf4264bc28632a0cc736e0f41~tplv-k3u1fbpfcp-watermark.image?)
> 代码中的不规范的格式就暴露出来了，现在可以来修复并且格式化代码。但是在格式化代码方面，`prettier`做的更好点，所以咱们来使用 `prettier`来进行代码格式化


# prettier

`prettier` 是一款开源的代码格式化包，支持多种代码编写工具，常见的 `vscode`, `webstorm` 等，他都是支持的，那么怎么给他集成起来呢？

使用下面语句来安装依赖：

```ts
pnpm i prettier eslint-plugin-prettier eslint-config-prettier
```

下面来解释下，这些包是干啥用的，不然稀里糊涂安装了它

```json
"prettier": "^2.8.3",  // prettier 主包
"eslint-config-prettier": "^8.6.0",  // eslint 和prettier的共同配置
"eslint-plugin-prettier": "^4.2.1",  // 在eslint当中，使用prettier为插件，才能一起使用
```

安装好依赖后，咱们还需要在 `eslitrc.cjs`中加入prettier的配置如下：

```diff 
{
 extends:[
 ...,
+ 'prettier', // prettier
+ 'plugin:prettier/recommended' // prettier推荐的配置  
 ],
+ plugins:[...,'prettier'],
rules: {
+    'prettier/prettier': 'error', // eslint 和prettier 用prettier的错误
    }
}
```

接下来在`package.json`中添加一段脚本

```diff
+ "prettier": "eslint --fix --ext .ts,.tsx,.js,.jsx --quiet ./"
```

此时，咱们还需要配置哪些文件是不需要进行代码格式化的，所以在根目录下面建立 `.prettierignore`增加如下内容：

```json
node_modules
package.json
pnpm-lock.yaml
dist
```

## 效果


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fec475690c384d6cbc8d389fa5283aa1~tplv-k3u1fbpfcp-watermark.image?)

修复成功，但是这里还报了一个警告，这个的解决办法如下：

在`eslintrc.cjs`的最后增加上一段配置如下：

```diff
+ settings: {
+    react: {
+      version: 'detect'
+    }
+  }
```


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/872e2124ea704fc4855bf0e90e474dae~tplv-k3u1fbpfcp-watermark.image?)

# 配置自动格式化
每一次都需要在终端执行脚本，有点小复杂，能不能设置自动格式化呢？

> 答案是可以的

1. 打开设置

 ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/349f32145594456d86a09a01704c9304~tplv-k3u1fbpfcp-watermark.image?)

2. 输入`fomatter`,然后选中**文本编译器**后，选择`prettier-Code formatter`

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/93b79d2b483248e6909212411e70cbbc~tplv-k3u1fbpfcp-watermark.image?)

3. 然后搜索 `formate on save`,选中即可

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b23073e83f7242c18ff42bf370840872~tplv-k3u1fbpfcp-watermark.image?)

就可以出现下面的效果了：

![first-3three3-17.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d459f7d4794a4b1a8a50a6f6b327d05a~tplv-k3u1fbpfcp-watermark.image?)

> 按 `ctrl + s` 会自动的格式化代码哦🤠🤠🤠
# husky
到上面为止，代码的格式化工具和代码规范检查就好了,这是本地的，所以咱们还需要在提交代码的时候，在commit 之前，进行 prettier 操作，就不需要手动啦。

使用脚本安装下面的依赖包

```ts
pnpm i husky -D
```

我们在终端通过` npx husky install` 来初始化` husky`

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0407404a060b4958bd11ed3413020ba0~tplv-k3u1fbpfcp-watermark.image?)

我们还需要生成`pre-commit`钩子的时候来执行`npm run lint`

```TS
npx husky add .husky/pre-commit "npm run lint"  // 这句话的意思是说，在commit之前先执行 npm run lint脚本
```
安装完成后，会在 .husky 目录中新增一个文件 `pre-commit`

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2aceef546d0144699c552e809c4542b5~tplv-k3u1fbpfcp-watermark.image?)

需要注意的是，我们需要在 `package.json` 注册 `prepare` 命令，在项目进行 `pnpm i` 之后就行 `Huksy` 的安装，命令如下:

```diff
+ "prepare": "husky install"
```

> 上面咱们是自己手动 `npx husky install`的，我们需要让后面使用咱们配置的人自动来初始化 `husky`

但是大家如果再深入一步，就会想到🤔🤔🤔。既然我内容都管控好了，是不是需要把 `commit -m 'xxx'` 中的`msg` 也管控下呀😉😉😉

使用下面的命令来安装包：
```ts
pnpm i commitlint @commitlint/cli @commitlint/config-conventional -D
```

包意思解析

```json
 "@commitlint/cli": "^17.4.2", // 规范提交信息
 "@commitlint/config-conventional": "^17.4.2",  // commitlint 常用的msg配置
 "commitlint": "^17.4.2" // commitlint 主包
```
安装好这些包后，需要在根目录添加一个 `.commitlintrc.cjs`来配置咱们的`commitlint`的配置:

```js
module.exports = {
  extends: ['@commitlint/config-conventional']
}
```
有了这些配置，commit是否生效呢？ 

> 答案是 `no`, 还需要在` git hooks `中添加一个方法

在终端执行下面的命令

```ts
npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'
```
然后会在` .husky `中生成一个新的文件**commit-msg**


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d5bfdbdb77cf4cb5a55d15f9b849113e~tplv-k3u1fbpfcp-watermark.image?)

## 效果
接下来就是见证奇迹的时刻😎😎😎


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2126571640784091aaf71ee63fc3e16f~tplv-k3u1fbpfcp-watermark.image?)

对于乱写commit 信息就过不了哦🤠🤠🤠

# lint-staged
对于细心的同学可能会发现，我们每一次提交都会` prettier`整个目录的所有问题，大大的降低了咱们编码的速度。所以咱们还需要做一件事情，那就是 `只格式化需要提交的代码，其他的就不需要格式化了`

使用下面命令安装依赖

```ts
pnpm i lint-staged -D
```

然后在`package.json`中新增如下内容
```diff
+ "lint-staged": {
+     "**/*.{js,jsx,tsx,ts}": [  
+          "eslint --fix"
+       ]
+    }
```
> 上面那段脚本的意思是 只对 `.js,.jsx, .ts,.tsx` 后缀文件进行eslint的修复，其他的就不进行格式化和修复了

有了这个，还需要对 `pre-commit` 这个钩子就行修改内容

```diff
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

- npm run lint
+ npx --no -- lint-staged
```

如此就大功告成啦🎉🎉🎉

> 不给源码的文章就是耍流氓，前端源码：[源码]( https://github.com/cll123456/common-study/tree/master/%E5%B7%A5%E7%A8%8B%E5%8C%96/formate_react_ts)


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/363bc738752b434e9f147c34d7e7ad96~tplv-k3u1fbpfcp-watermark.image?)
# 结尾引言
感谢优秀的你正在努力奋斗，加油吧，少年🎈🎆🎇🧨✨🎉