import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        environment: 'node', // 环境是node环境
        passWithNoTests: true, // 如果没有找到测试，Vitest 不会失败。
        exclude: ['**/node_modules/**', '**/dist/**'], // 不需要进行测试的文件夹
        threads: true // 是否开启多线程
    }
})
