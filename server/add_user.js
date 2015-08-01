var storage = require('./storage');

storage.createUser({
    email:    process.argv[2],
    password: process.argv[3]
})
.catch(function(error){
    console.error(error);
})
.done(process.exit);
