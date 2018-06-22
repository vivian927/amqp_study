var amqp = require("amqplib/callback_api");

amqp.connect("amqp://localhost:5672", function(err, conn) {
    if(err) {
	console.log(err);
    }
    else {
	conn.createChannel(function( err, ch) {
	    var q = "hello";
	    ch.assertQueue(q, {durable: false});
	    ch.sendToQueue(q, new Buffer("Hello zw"));
            console.log("  [x] send 'Hello World'");
        });
       setTimeout( function() {conn.close(); process.exit(0) }, 500);
    }
});

