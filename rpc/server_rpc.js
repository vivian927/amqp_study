var amqp = require("amqplib/callback_api");

amqp.connect("amqp://localhost:5672", function(err, conn){
    conn.createChannel(function(err,ch) {
        var q = "rpc_queue2";

        ch.assertQueue(q,{durable:false});
        ch.prefetch(1);

        ch.consume(q, function reply(msg){
            var n = parseInt(msg.content.toString());
            console.log(" [s] get fib(%d).",n);
            var r = fibonacci(n);

            ch.sendToQueue(msg.properties.replyTo, new Buffer(r.toString()), {correlationId: msg.properties.correlationId});
            ch.ack(msg);
        });
    });
});

function fibonacci(n){
    if(n == 0 || n == 1){
        return n;
    } else {
        return fibonacci(n-1) + fibonacci(n-2);
    }
}