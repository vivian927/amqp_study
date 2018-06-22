var amqp = require("amqplib/callback_api");

amqp.connect("amqp://localhost:5672", function(err, conn){
    conn.createChannel(function(err, ch){
        var ex = "num";
        var q = "num";

        ch.assertExchange(ex,"fanout",{durable:false});
        ch.assertQueue(q,{exclusive:false}, function(err, q){
            console.log(" [r_n_c] waiting for num massage in %s", q.queue);
            ch.bindQueue(q.queue, ex, '');
            ch.consume(q.queue, function(msg){
                console.log(" [c_num] %s", parseInt(msg.content));
            },{noAck:false});
        });
    });
});