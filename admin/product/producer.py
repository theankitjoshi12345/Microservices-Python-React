import pika, json

# 1. Added ?heartbeat=600 to the URL string. 
# This tells CloudAMQP: "Keep this connection alive permanently, I am still here!"
url = 'amqps://hiuhbesd:aA-CQT_jRl3hR57Mh53EgDBKapmKWuUr@shark.rmq.cloudamqp.com/hiuhbesd?heartbeat=600'
params = pika.URLParameters(url)

connection = pika.BlockingConnection(params)
channel = connection.channel() 
channel.queue_declare(queue='main')

def publish(method, body):
    global connection, channel
    
    # 2. Safety check: If the connection ever drops, open a fresh one on the spot
    if connection.is_closed:
        connection = pika.BlockingConnection(params)
        channel = connection.channel()
        channel.queue_declare(queue='main')

    properties = pika.BasicProperties(method)

    # 3. Shoot the message down the pipe instantly (no closing at the end!)
    channel.basic_publish(exchange='', routing_key='main', body=json.dumps(body), properties=properties)