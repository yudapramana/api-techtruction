const express = require('express')
const cors = require('cors')


const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const db = require('./app/models/')
db.mongoose
    .connect(db.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log(`Connected to database`)
    }).catch(err => {
        console.log(`Error: ${err}`)
        process.exit()
    })

app.get('/', (req, res) => {
    res.json({
        'message': 'Hello World'
    })
})

require('./app/routes/task.routes')(app)

const PORT = 3000
app.listen(process.env.PORT || PORT, () => {
 console.log(`Server is running on port ${PORT}`)   
})