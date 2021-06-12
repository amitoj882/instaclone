const express = require('express')
const app = express()
const mongoose = require('mongoose')
const PORT = process.env.PORT || 2000
//password:::mongoDBCompass:::KWHjwD4juu4e8Jv
//password:::mongoDBCompass:::eHw3OZgaMFO0nJwY
//mongodb+srv://amitoj:<password>@cluster0.ouvlw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
const {MONGOURI} = require('./config/keys')  

mongoose.connect(MONGOURI,{
    useNewUrlParser:true,
    useUnifiedTopology: true
})
mongoose.connection.on('connected', ()=>{
    console.log("successful")
})
mongoose.connection.on('error', (err)=>{
    console.log("successful", err)
})

require('./models/user')
require('./models/post')


app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))

if(process.env.NODE_ENV=="production"){
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

app.listen(PORT, ()=>{
    console.log("server is running on ",PORT)
})