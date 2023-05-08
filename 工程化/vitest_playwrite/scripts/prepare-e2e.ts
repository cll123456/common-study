import path from 'path'
import fse from 'fs-extra'
import * as execa from 'execa'

const exampleDir = path.resolve(__dirname, '../e2e/basic')
const defaultExecaOpts = {
    cwd: exampleDir,
    stdout: process.stdout,
    stdin: process.stdin,
    stderr: process.stderr
}

async function prepareE2E() {
    // 确保前端打包的结果存在
    if (!fse.existsSync(path.resolve(__dirname, '../dist'))) {
        // exec build command
        execa.execaCommandSync('pnpm build', {
            cwd: path.resolve(__dirname, '../')
        })
    }

    // 安装无头浏览器
    execa.execaCommandSync('npx playwright install', {
        cwd: path.join(__dirname, '../'),
        stdout: process.stdout,
        stdin: process.stdin,
        stderr: process.stderr
    })

    // 安装依赖
    execa.execaCommandSync('pnpm i', {
        cwd: exampleDir,
        stdout: process.stdout,
        stdin: process.stdin,
        stderr: process.stderr
    })

    // exec dev command
    execa.execaCommandSync('pnpm dev', defaultExecaOpts)
}

prepareE2E()
