import type { PlaywrightTestConfig } from '@playwright/test'

const config: PlaywrightTestConfig = {
    testDir: './e2e', // 测试的目录
    fullyParallel: true, // 开启多线程
    timeout: 50000, // 每个测试最大的执行时间
    webServer: {
        url: 'http://localhost:5173', //在进行测试启动的本地服务
        command: 'pnpm dev' // 使用启动服务的脚本
    },
    use: {
        headless: true // 是否使用无头浏览器来进行测试
    }
}

export default config
