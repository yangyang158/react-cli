const fs = require('fs');
const os = require('os');

exports.update = function(answers){
    const name = answers.proName;
    const description = answers.description;
    const author = answers.author;
    const origin = answers.origin;
    // 读取package.json的内容
    let path = require('path').join('package.json');
    let data = JSON.parse(fs.readFileSync(path, 'utf8'));
    data.name = name;
    data.description = description;
    data.author = author;
    data.repository.url = origin;
    // 重新写入package.json的内容
    data = JSON.stringify(data, null, '\t');
    fs.writeFileSync(path, data + os.EOL);
};
