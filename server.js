var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var mongoose=require('mongoose')
const {MongoClient} = require('mongodb');


app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))//to encode msgs on browser

var dbUrl = 'mongodb+srv://<username>:<password>@cluster0.w9paw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
const client = new MongoClient(dbUrl);

var Message = mongoose.model('Message', {

    name : String,
    message : String
})

var messages = [

    {name: "Jasmine",message:"Hello"},
    {name: "Johny",message:"Hi"}
]

app.get('/messages', (req,res)=>{
    Message.find({},(err,messages)=>{
        res.send(messages)
    })
    //res.send(messages)
})

app.post('/messages',(req,res)=>{
    var message = new Message(req.body)
    message.save((err)=>{
            if(err)
                sendStatus(500)

            //messages.push(req.body)
            io.emit('message',req.body)
            res.sendStatus(200)
    })
    
})
io.on('connection',(socket)=>{
    console.log(' user connected')
})
mongoose.connect(dbUrl,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true,
    useFindAndModify:false
}).then(()=>{
    console.log(`Database connected`)
}).catch((err)=>{
    console.log(err);
    console.log(`not connected`)
});

var server = http.listen(3010, ()=>{
    console.log("server is  listening on port ",server.address().port)
})

