const shell = require('shelljs');

function exec(cmd){
    return shell.exec(cmd).stdout.trim();
}

module.exports = {

    exec,

    getDefaultAuthor: function(){
        let author = exec('npm get init-author-name');
        if( author ){
            let email = exec('npm get init-author-email');
            if( email ) author = `${author} <${email}>`;
            let url = exec('npm get init-author-url');
            if( url ) author = `${author} (${url})`;
        }else{
            author = exec('git config --global user.name');
            if( author ){
                let email = exec('git config --global user.email');
                if( email ) author = `${author} <${email}>`;
            }
        }
        return author;
    },

    shellPromiseify: function(cmd){
        return new Promise((resolve, reject)=>{
            shell.exec(cmd, {
                async: true,
                silent: true
            }, function(code, stdout, stderr){
                if(code === 0){
                    resolve(stdout)
                }else{
                    reject(stderr)
                }
            })
        })
    }
};
