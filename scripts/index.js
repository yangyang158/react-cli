#!/usr/bin/env node

const program = require('commander');
const shell = require('shelljs');
const fs = require('fs');
const inquirer = require('inquirer');
const promptFunc = require('./prompt.js')
shell.config.silent = true;

program
    .version(require('../package').version)
    .command('init <proName>')
    .description('创建项目')
    .option('-a, --author <author>', '项目作者')
    .option('-o, --ordigin <origin>', '项目地址')
    .option('-d, --desc <desc>', '项目描述')
    .action((proName, options) => {
        // process 对象是一个全局变量, 提供有关Node.js进程的信息并对其进行控制
        // 作为一个全局变量, 它始终可供 Node.js 应用程序使用,无需require,也可以使用require显式地访问
        if(fs.existsSync(`${process.cwd()}/${proName}`)){
            inquirer.prompt([{
                type: 'confirm',
                name: 'delete',
                message: `当前目录下存在 ${proName} 文件夹，是否删除，并继续执行操作？`
            }]).then(function(result){
                if(result.delete){
                    shell.rm('-rf', `${proName}`);
                    promptFunc(options, proName)
                }else{
                    return console.error(`${proName} 文件夹已经存在，操作无法进行，请删除该文件夹或修改文件名参数后重新执行。`);
                }
            });
        }else{
            promptFunc(options, proName)
        }
    });

program.parse(process.argv);
//当参数不足时，显示帮助信息
if(process.argv.length < 3){
    program.help();
}
