const sayHi = (name, ...args) => {
    console.log(`Hey there! I am ${name}`);
    if (args.length > 0) {
        console.log(args);
        return;
    }
}

module.exports = { sayHi }