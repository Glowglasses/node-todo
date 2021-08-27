const db = require('./db.js')
const inquirer = require('inquirer')

module.exports.add = async (title) => {
  // 读取之前的任务
  const list = await db.read()
  // 往里面添加一个 title 任务
  list.push({title, done: false})
  // 存储任务到文件
  await db.write(list)
}

module.exports.clear = async () => {
  await db.write([])
}

async function markAsDone(list, index) {
  list[index].done = true
  await db.write(list)
}

async function markAsUndone(list, index) {
  list[index].done = false
  await db.write(list)
}

function updateTitle(list, index) {
  inquirer.prompt({
    type: 'input',
    name: 'title',
    message: '新的标题',
    default: list[index].title
  }).then(async answer => {
    list[index].title = answer.title
    await db.write(list)
    printTasks(await db.read())
  })
}

async function remove(list, index) {
  list.splice(index, 1)
  await db.write(list)
}

function askForAction(list, index) {
  const actions = {markAsUndone, markAsDone, remove, updateTitle}
  inquirer.prompt({
    type: 'list', name: 'action',
    message: '请选择操作',
    choices: [
      {name: '退出', value: 'quit'},
      {name: '已完成', value: 'markAsDone'},
      {name: '未完成', value: 'markAsUndone'},
      {name: '改标题', value: 'updateTitle'},
      {name: '删除', value: 'remove'},
    ]
  }).then(async answer2 => {
    const action = actions[answer2.action]
    await action && await action(list, index)
    if (answer2.action !== 'quit' && answer2.action !== 'updateTitle'){
      printTasks(await db.read())
    }
  })
}

function askForCreateTask(list) {
  inquirer.prompt({
    type: 'input',
    name: 'title',
    message: '输入任务标题'
  }).then(async answer => {
    list.push({
      title: answer.title,
      done: false
    })
    await db.write(list)
    printTasks(await db.read())
  })
}

function printTasks(list) {
  inquirer
    .prompt({
      type: 'list',
      name: 'index',
      message: '请选择你想操作的任务',
      choices: [{name: '退出', value: '-1'}, ...list.map((task, index) => {
        return {name: `${task.done ? '[x]' : '[_]'} ${index + 1} - ${task.title}`, value: index.toString()}
      }), {name: '+ 创建任务', value: '-2'}]
    })
    .then(answer => {
      const index = parseInt(answer.index)
      if (index >= 0) {
        askForAction(list, index)
      } else if (index === -2) {
        askForCreateTask(list)
      }
    })
}

module.exports.showAll = async () => {
  // 读取之前的任务
  const list = await db.read()
  // 打印之前的任务
  // printTasks
  printTasks(list)
}