const { shellPromiseify } = require('./utils')

exports.install = async ()=>{
    return shellPromiseify('npm install')
}