var amqp = require("amqplib/callback_api");
var args = process.argv.slice(2);
if(args.length < 0) {
    console.log(" Usage: please input like'err.info' routing key ");
    process.exit(1);
}
amqp.connect("amqp://localhost:5672", function(err,conn) {
    conn.createChannel(function(err,ch) {
        var ex = "logs_topic";
        
        ch.assertExchange(ex,"topic",{durable: false});
        ch.assertQueue('',{exclusive:true},function(err,q){
            console.log(" [c] Waiting fo message.");

            args.forEach(function(key) {
                ch.bindQueue(q.queue, ex, key);
            });
            ch.consume(q.queue, function(msg){
                console.log(" [c] %s: '%s'",msg.fields.routingKey, msg.content.toString());
            },{noAck: true});
        });
    });
});
