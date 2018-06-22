var amqp = require("amqplib/callback_api");

amqp.connect("amqp:localhost:5672", function(err, conn){
    conn.createChannel(function(err,ch) {
        var ex = "str";
        var q = "str";

        ch.assertExchange(ex,"fanout",{durable:false});
        ch.assertQueue(q,{exclusive:true}, function(err,q){
            console.log(" [r_s_c] Waiting for str message in %s",q.queue);
            ch.bindQueue(q.queue,ex,'');
            ch.consume(q.queue,function(msg){
                console.log(" [str_c] %s ",msg.content.toString());
            },{noAck:false});
        });        
    });
});