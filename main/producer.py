import json
import os

import pika

url = os.environ['RABBITMQ_URL']
params = pika.URLParameters(url)

connection = pika.BlockingConnection(params)
channel = connection.channel() 
channel.queue_declare(queue='admin')

def publish(method, body):
    global connection, channel
    
    # 2. Safety check: If the connection ever drops, open a fresh one on the spot
    if connection.is_closed:
        connection = pika.BlockingConnection(params)
        channel = connection.channel()
        channel.queue_declare(queue='admin')

    properties = pika.BasicProperties(method)

    # 3. Shoot the message down the pipe instantly (no closing at the end!)
    channel.basic_publish(exchange='', routing_key='admin', body=json.dumps(body), properties=properties)
