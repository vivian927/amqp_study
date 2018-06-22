var amqp = require("amqplib/callback_api");

amqp.connect("amqp://localhost:5672", function(err, conn) {
    conn.createChannel(function(err, ch) {
	var ex = "logs";
	var q = "log"
	ch.assertExchange(ex, 'fanout', {durable: false});
	
	ch.assertQueue(q, {exclusive:true}, function(err, q) {
	    console.log(" [z] wait for messages in %s: ", q.queue);
	    ch.bindQueue(q.queue, ex,'');
	    ch.consume( q.queue, function(msg) {
		console.log(" [x] %s", msg.content.toString());
		}, {noAck: true});
		
	});
    });
});
