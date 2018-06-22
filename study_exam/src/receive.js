#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
/*
1、消费者在声明一个队列时要与生产者里声明方式匹配。
2、send.js中开发者是向队列中发送消息，调用sendToQueue；
  消费者调用consume从队列中获取信息
*/
amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function(err, ch) {
    var q = 'hello';

    ch.assertQueue(q, {durable: false});
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
    ch.consume(q, function(msg) {
      console.log(" [x] Received %s", msg.content.toString());
    }, {noAck: true});
  });
});
