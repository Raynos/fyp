var bouncy = require('bouncy')

bouncy(function (req, bounce) {
    if (req.headers.host === 'fyp.raynos.org') {
        bounce(8080)
    } else {
        bounce(8081)
    }
}).listen(8000)