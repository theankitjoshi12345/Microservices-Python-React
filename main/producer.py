import json, pika

params = pika.URLParameters('amqps://hiuhbesd:aA-CQT_jRl3hR57Mh53EgDBKapmKWuUr@shark.rmq.cloudamqp.com/hiuhbesd')

def publish(method, body):
    connection = pika.BlockingConnection(params)

    try:
        channel = connection.channel()
        channel.queue_declare(queue='main')

        channel.basic_publish(
            exchange='',
            routing_key='admin',
            body=json.dumps(body),
            properties=pika.BasicProperties(type=method),
        )
    finally:
        if connection.is_open:
            connection.close()
