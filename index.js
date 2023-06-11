const express = require('express');

const app = express();

app.use(express.static('../pinglink/'))
app.use(express.static('/app/pinglink-ui'))

app.listen(3000, () => {
    console.log('Web server running at port 3000');
})