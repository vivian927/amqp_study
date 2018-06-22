var amqp = require("amqplib/callback_api");

amqp.connect("amqp:localhost",function(err, conn){
    conn.createChannel(function(err,ch){
        var ex = "logs";
        var args = process.argv.slice(2);
        var severity = args.slice(1).join('') || "hello";
        var msg = (args.length > 0) ? args[0] : "num";

        ch.assertExchange(ex,'direct', {durable: false});
        ch.publish(ex, severity, new Buffer(msg));

        console.log(" [p] send %s: %s",severity, msg);
    });
    setTimeout(function(){
        conn.close();
        process.exit(0);
    },5000);
});
