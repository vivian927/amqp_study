var amqp = require("amqplib/callback_api")
var _ = require("underscore")
amqp.connect("amqp://localhost:5672", function(err, conn){
    conn.createChannel(function(err, ch) {
        var ex1 = "num";
        var ex2 = "str";
        var msg = process.argv.slice(2).join(' ');

        if(_.isNaN(+msg)){
            ch.assertExchange(ex2,"fanout",{durable: false});
            ch.publish(ex2,'', new Buffer(msg));
            console.log(" [p] send string message %s: ",msg);
        } else {
            ch.assertExchange(ex1, "fanout", {durable: false});
            ch.publish(ex1,'',new Buffer(msg));
            console.log(" [p] send number message %s: ",msg);
        }
    });
    setTimeout(function() {
        conn.close();
        process.exit(0);
    }, 5000);
});

