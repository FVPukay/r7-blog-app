const app = require('./app');
const port = process.env.PORT || 3023;

app.listen(port, () => {
    console.log('The server is running');
});
