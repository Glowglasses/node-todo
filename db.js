const fs = require('fs')
const p = require('path')
let homeDir = require('os').homedir()
homeDir = process.env.HOME || homeDir
const dbPath = p.join(homeDir, '.todo')
const db = {
  write(list, path = dbPath) {
    return new Promise((resolve, reject) => {
      const string = JSON.stringify(list)
      fs.writeFile(path, string + '\n', (error) => {
        if (error) return reject(error)
        resolve()
      })
    })
  },
  read(path = dbPath) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, {flag: 'a+'}, (error, data) => {
        if (error) return reject(error)
        let list
        try {
          list = JSON.parse(data.toString())
        } catch (error2) {
          list = []
        }
        resolve(list)
      })
    })
  },
}
module.exports = db