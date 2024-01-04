const fs = require('fs');
const getText = (path) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf-8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        })
    })
    // fs.readFile(path,)
}
getText('./files/loop.txt').then((response) => {
    console.log(response);
}).catch((err) => {
    console.log(err);
});