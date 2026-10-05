import json
import os

import django
import pika

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'admin.settings')
django.setup()

from product.models import Product 
params = pika.URLParameters(os.environ['RABBITMQ_URL'])

connection = pika.BlockingConnection(params)

channel = connection.channel() 

channel.queue_declare(queue='admin')
 
def callback(ch, method, properties, body):
    print("Received in admin")
    data = json.loads(body)
    print(data)
    product = Product.objects.get(id = data)
    product.likes = product.likes + 1
    product.save()
    print('Product like increased.')

channel.basic_consume(queue='admin', on_message_callback=callback, auto_ack=True)

print('Started Consuming')

channel.start_consuming()

channel.close() 
