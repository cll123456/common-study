import cac from 'cac'
const cli = cac()

// basic usage(基础用法)
// cli.option('--type <type>', 'choose a project type', {
//   default: 'node'
// })
// const parse = cli.parse()

// console.log(JSON.stringify(parse, null, 2))


// use help(添加--help)
// cli.option('--type [type]', 'choose a project type', {
//   default: 'node'
// })

// cli.option('--name <name>', 'Provide your name');

// cli.command('init [...files]', 'Lint files').action((files, options) => {
//   console.log(files, options, '------files')
// })

// cli.help()
// cli.version('1.0.0')

// cli.parse()


// command specific options(多个选项)
// cli.command('rm <dir>', 'Remove a directory')
//   .option('-r, --recursive', 'Remove recursively')
//   .action((dir, options) => {
//     console.log('remove ' + dir + (options.recursive ? ' recursively' : ''))
//   })
// cli.help()
// cli.parse()


// Dash in option names（小写转大写）
// cli.
//   command('dev', 'start no server').
//   option('--clear-screen', 'Clear screen').
//   action((options) => {
//     console.log(options.clearScreen)
//   })
// cli.help()
// cli.parse()



// brackets (括号) <> 必填 [] 选填
// cli
//   .command('deploy <folder>', 'deploy a folder to aws')
//   .option('--scale [level]', 'Scaling level')
//   .action((options, folder) => {
//     console.log(options, folder, '-----deploy')
//   })
// cli
//   .command('build <folder>', 'Build a project')
//   .option('--out [dir]', 'Output directory')
//   .action((options, folder) => {
//     console.log(options, folder, '-------build')
//   })

// cli.help()
// cli.parse()


// 否定选项（Negated Options）
// cli
//   .command('build <folder>', 'Build a project')
//   .option('--no-config', 'Disable config file')
//   .option('--config <file>', 'Use a custom config file')
//   .action((options, folder) => {
//     console.log(options, folder, '-------build')
//   })

// cli.parse()


// 变量参数（）
// cli
//   .command('build <entry> [...otherFiles]', 'build your app')
//   .option('--foo', 'Foo options')
//   .action((entry, otherFiles, options) => {
//     console.log(entry, otherFiles, options, '-------build')
//   })

// cli.help()
// cli.parse()


// Dot-nested Options (点嵌套选项)
// cli
//   .command('build', 'desc')
//   .option('--env <env>', 'Set environment')
//   .example('--env.API_SECRECT xxx')
//   .action((options) => {
//     console.log(options)
//   })

// cli.help()
// cli.parse()


// 
cli
  // Simply omit the command name, just brackets
  .command('[...files]', 'Build files')
  .option('--minimize', 'Minimize output')
  .action((files, options) => {
    console.log(files)
    console.log(options.minimize)
  })

cli.parse()




