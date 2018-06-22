var amqp = require("amqplib/callback_api");

amqp.connect("amqp://localhost:5672", function(err, conn) {
    conn.createChannel(function(err,ch){
        var ex = "logs_topic";
        var args = process.argv.slice(2);
        
        var severity = (args.length > 0) ? args[0] : "err.info";
        var msg = args.slice(1).join('') || "hello";

        ch.assertExchange(ex,"topic",{durable: false});
        ch.publish(ex,severity,new Buffer(msg));

        console.log(" [p] send %s message: %s", severity, msg);
    });
    setTimeout(function(){
        conn.close();
        process.exit(0);
    }, 5000);
});
