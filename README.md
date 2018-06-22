# amqp_study

## send/receive
####初识rabbitmq
#####定义
> Rabbitmq：消息代理。 可用于接收和转发消息。
> 生产者：用于发送消息的程序。
> 生产：可用于表示发送消息的动作。
> 队列：用于存储消息。
> 工作过程：生产者向消息队列发送消息，消费者等待从队列中接收消息。
> 
> 注：在大多数程序中， P、C代理都不会只属于一个host。
 
#### task Queue
##### worker_queue_send/worker
*	RabbitMQ 将对生产者接收到的消息或task进行随机且平均分法给各个worker（消费者），并确保各个task分配到的task任务数量相近。
* 	为了避免出现某个worker由于异常退出，并造成消息丢失的情况，需要将每个worker的ack机制启动。如果RabbitMQ未收到来自worker的ack消息，则将对该messag或task进行重新分发。
*  	为了解决由于RabbitMQ异常退出导致的消息或任务丢失的情况，可对Queue和消息进行durable和persisten参数设置。
*   为了防止某个Worker发生任务堆积的情况，使用prefetch(n)进行设置，表示不要让worker中有超过n个待处理的task或message。

####publisher/subscribe
##### emit_logs/receive_logs*   &&    mult_ex_emit/num_receive&&str_receive
>	可将messages通过广播的方式分发给多个消费者。设置了一个exchange机制，可用于从生产者接收message，并将其push到与其绑定的Queue中。exchange需要：

*	需要确切地知道接收到的消息的类型，并将其push到相应的Queue中。
* 	需要知道将接受的消息push到哪个Queue中， 或丢弃。

>这些判断逻辑都需要在生产者中实现。
>
>对于exchange一个简单的应用，如果一个消费者声明的Queue绑定到了生产者的exchange上，则该生产者发送的所有消息都会通过RabbitMQ转发到该client上。

#### direct RoutingKey
> 为每种消息和每个Queue都绑定了routingkey，publisher在发送消息时，每次都只发送一种类型（即绑定了一个routingkey的msg），并由相应的Queue来接收。

##### Publisher
> 在向publisher传入需要发送的消息时，需要附加一个severity，即routingkey。serverity可使RabbitMQ了解需要将message发送到哪个（即带有相同severity）队列中。 ch.publish(ex,serverity,new Buffer(msg));

##### consume
>在将声明好的Queue与exchange绑定时，提供相应的severity。实现了消息分类的功能，即只有带有该severity的消息才能通过exhcange发送到该Queue，并在Consume中对message进行处理。

#### Topic
>RoutingKey的引入虽然为RabbitMQ实现了将message按类分发到不同的Queue中，但它一次只能发送一种类型的消息。如果我们需要对消息更灵活的分发活动，如一个message，它同时可以归到两种类别上，那么RoutingKey就显得吃力。
>而Topic这一概念，就说对消息和Queue可附属多个RoutingKey，用 "." 分割。 severity1.severity2.severity3.......
	
> 举例：
	如果一个日志消息有三个标签： err.warning.info，则publisher在发送某一条info日志消息时，同时附加的routingKey为： \*.\*.info
	
>而如果启动的consume程序，想让其处理info日志，则也需要向其传入 ： \*.\*.info。
 
>	\* : 表示代替一个severity词
>	
>	\# ：表示代替0个或多个severity词。

#### RPC实现
> RPC的实现种，需要有两个队列：
> 
> 1、queue1: Consume需要向里面传入需要处理的数据，传递给publisher，传递的message需要包括：传递返回结果的队列reply_to、标志该request 的correlationId和待处理的数据。该队列需要publisher和consumer都定义。
> 
> 2、queue2:	publisher将返回结果传递到该队列（即上面提到的reply_to），consumer从里面读取数据。该队列由consumer传递给publisher。
