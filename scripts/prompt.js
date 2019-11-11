const chalk = require('chalk');
const inquirer = require('inquirer');
const shell = require('shelljs');
const spinner = require('ora')();
const templates =  require('./templates');
const utils = require('./utils.js');
const package = require('./package.js');
const dependency = require('./dependency.js');

module.exports = function(options, proName){
    let answers = {
        proName: proName,
        description: options.desc,
        author: options.author,
        origin: options.origin
    }
    let prompts = [];

    if(templates.length > 1){
        templates.forEach((item)=>{
            item.name =  chalk.green('★ ') + chalk.green(item.name) + ' (desc: ' + chalk.yellow(item.description) + ')'
        })
        prompts.push({
            type: 'list',
            name: 'template',
            message: '请选择要生成的项目模板',
            choices: templates
        });
    }
    if(options.desc === undefined){
        prompts.push({
            type: 'input',
            name: 'description',
            message: '请输入项目描述',
        });
    }
    if(options.author === undefined){
        prompts.push({
            type: 'input',
            name: 'author',
            message: '请输入项目作者',
            default: utils.getDefaultAuthor,
        });
    }
    if(options.origin === undefined){
        const template = 'git@github.com:fansgithub/${project_name}.git';
        prompts.push({
            type: 'input',
            name: 'origin',
            message: `请输入项目的仓库地址（比如 ${template}）`,
            validate: (origin) => {
                return !origin
                    || /git@.*\.git/.test(origin)
                    || `项目地址格式是 ${template}，如果还没有创建，请不要填写。`;
            }
        });
    }
    inquirer.prompt(prompts).then(async(result) => {
        answers = Object.assign(answers, result);
        try {
            //下载代码
            spinner.start('下载代码');
            await utils.shellPromiseify(`git clone ${answers.template} "${answers.proName}"`)
            spinner.succeed();

            // 修改package.json
            shell.cd(answers.proName)
            spinner.start('修改 package.json');
            package.update(answers);
            spinner.succeed();

            //提示用户是否安装依赖
            let installDependence = await inquirer.prompt([{
                type: 'confirm',
                name: 'dependency',
                message: '是否安装依赖？'
            }])
            if (installDependence.dependency) {
                spinner.start('开始安装依赖...');
                await dependency.install(answers);
                spinner.succeed(chalk.green(`依赖安装完成，快去${answers.proName}文件夹下查看readme.md文件启动项目吧！`));
            } else{
                spinner.info(chalk.yellow(`您放弃安装依赖, 请依照${answers.proName}文件夹下的readme.md文档启动项目！`))
            }
        } catch (error) {
            spinner.info(chalk.red(`执行过程中发生错误，错误信息为：${error}`))
            shell.exit(1)
        }
    })
}