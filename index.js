const express = require('express');

const app = express();

app.use(express.static('/app/ping-ui'))

app.listen(3000, () => {
    console.log('Web server running at port 3000');
})