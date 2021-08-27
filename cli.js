#!/usr/bin/env node
const { program } = require('commander')
const api = require('./index.js')
if (process.argv.length === 2){
  // 显示任务
  void api.showAll()
}else {
  program
    .command('add')
    .description('添加一个任务')
    .action((source, destination) => {
      // 添加任务
      api.add(destination.parent.args.slice(1).join(' ')).then(()=>'添加成功').catch(()=>'添加失败')
    });
  program
    .command('clear')
    .description('清除任务列表')
    .action(() => {
      // 添加任务
      api.clear().then(()=>'清除成功').catch(()=>'清除失败')
    });
  program.parse(process.argv)
}