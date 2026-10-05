import json
import os

import pika
# 1. Make sure to import 'app' alongside Product and db!
from main import app, Product, db 
 
params = pika.URLParameters(os.environ['RABBITMQ_URL'])

connection = pika.BlockingConnection(params)
channel = connection.channel() 

channel.queue_declare(queue='main')
 
def callback(ch, method, properties, body):
    print("Received in main")
    data = json.loads(body)
    print(data)

    # 2. Wrap ALL database operations inside the Flask app context!
    with app.app_context():
        if properties.content_type == 'product_created':
            product = Product(id=data['id'], title=data["title"], image=data['image'])
            db.session.add(product)
            db.session.commit()
            print('Product created.')

        elif properties.content_type == 'product_updated':
            # Updated to db.session.get for modern SQLAlchemy compatibility
            product = db.session.get(Product, data['id'])
            if product:
                product.title = data['title']
                product.image = data['image']
                db.session.commit()
                print('Product updated.')

        elif properties.content_type == "product_deleted":
            product = Product.query.get(data)
            db.session.delete(product) 
            db.session.commit() 
            print('Product deleted.')


channel.basic_consume(queue='main', on_message_callback=callback, auto_ack=True)

print('Started Consuming')

channel.start_consuming()

channel.close()
