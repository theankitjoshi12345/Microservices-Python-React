import json, pika
import os, django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "admin.settings")
django.setup()

from product.models import Product

params = pika.URLParameters('amqps://hiuhbesd:aA-CQT_jRl3hR57Mh53EgDBKapmKWuUr@shark.rmq.cloudamqp.com/hiuhbesd')

connection = pika.BlockingConnection(params)
channel = connection.channel()

channel.queue_declare(queue='admin')

def callback(ch, method, properties, body):
    print('Received in admin')
    id = json.loads(body)
    print(id)
    product = Product.objects.get(pk=id)
    product.likes += 1
    product.save()
    print("Product likes increased")

channel.basic_consume(queue='admin', on_message_callback=callback, auto_ack=True )

print('Started Consuming')
channel.start_consuming()

channel.close()
