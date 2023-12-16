const app=require('./socket-server.js').app;
const io=require('./socket-server.js').io;
const server=require('./socket-server.js').server;
const hashMap=require('./socket-server.js').hashMap;
const robot=require('robotjs')
const { Socket } = require('dgram');
const path=require('path');


app.get('/home',(req,res)=>{
        res.sendFile(path.join(__dirname ,"index.html"));
})


app.get('/control',(req,res)=>{
        res.sendFile(path.join(__dirname ,"controller.html"));
})

io.on('connection',user=>{
       console.log("user connected");
       user.on('keyUp',(data)=>{
        console.log("released: ",data);
       })
       user.on('keyDown',(data)=>{
        robot.keyTap(data);
        console.log("pressed : ",data);
       })
})




server.listen(9000,()=>{
    console.log("started server");
})


