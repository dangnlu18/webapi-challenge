const express = require('express')
const welcomeRouter = require('./routers/welcome')
const projectRouter = require('./routers/projects')

const server = express()
server.use(express.json())

server.use('/', welcomeRouter)
server.use('/api/projects', projectRouter)




const host = '0.0.0.0'
const port = 4000

server.listen(port, ()=>{
    console.log(`\n*** Server listening on ${host}:${port}`)
})