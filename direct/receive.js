var amqp = require("amqplib/callback_api");

var args = process.argv.slice(2);
if(args.length < 0){
    console.log("Usage: severity [num] [str]");
    process.exit(1);
}

amqp.connect("amqp://localhost",function(err, conn){
    conn.createChannel(function(err,ch){
        var ex = "logs";
        
        ch.assertExchange(ex,'direct',{durable:false});
    
        ch.assertQueue('',{exclusive:true}, function(err,q){
            console.log(" [c] Waiting for logs.");
            args.forEach(function(serverity) {
                ch.bindQueue(q.queue,ex,serverity);
            });
            ch.consume(q.queue,function(msg){
                console.log(" [x[ %s: %s",msg.fields.routingKey,msg.content.toString());
            },{noAck:true});
        });
    });
});