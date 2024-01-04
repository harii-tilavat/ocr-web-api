function asyncFunction(callback) {
    setTimeout(() => {
        let randomNum = Math.floor(Math.random() * 100);
        let error = '';
        let data = '';
        if (randomNum > 50) {
            error = new Error('Operation failed');
        } else {
            data = 'Operation success';
        }
        // console.log(msg);
        callback(error, data);
    }, 1000)
}
asyncFunction((err, data) => {
    if(err) throw err;
    console.log(data);
});
