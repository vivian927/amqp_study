#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
/*
1、connect： 连接的rabbitmq-server服务的url
  如果连接失败，返回err，否则，返回conn连接对象。
2、createChannel：创建一个channel。生产者的一切行为都将在channel中进行。
3、assertQueue：声明一个queue，sendToQueue：将消息发送到改队列中。
4、setTimeout：5秒之后关闭连接，并退出。
*/
amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function(err, ch) {
    var q = 'hello';
    var msg = 'Hello World!';

    ch.assertQueue(q, {durable: false});
    // Note: on Node 6 Buffer.from(msg) should be used
    ch.sendToQueue(q, new Buffer(msg));
    console.log(" [x] Sent %s", msg);
  });
  setTimeout(function() { conn.close(); process.exit(0) }, 500);
});
