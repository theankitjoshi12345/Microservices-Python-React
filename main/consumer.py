import json

import pika

from main import app, Product, db

params = pika.URLParameters('amqps://hiuhbesd:aA-CQT_jRl3hR57Mh53EgDBKapmKWuUr@shark.rmq.cloudamqp.com/hiuhbesd')
connection = pika.BlockingConnection(params)
channel = connection.channel()
channel.queue_declare(queue='main')

def callback(ch, method, properties, body):
    print("Received in main.")
    data = json.loads(body)
    print(data)

    with app.app_context():
        try:
            if properties.type == "product_created":
                product = Product(
                    id=data["id"],
                    title=data["title"],
                    image=data["image"],
                )
                db.session.add(product)
                print("Product Created")

            elif properties.type == "product_updated":
                product = db.session.get(Product, data["id"])
                if product is None:
                    raise ValueError(f"Product {data['id']} does not exist")
                product.title = data["title"]
                product.image = data["image"]
                print("Product Updated")


            elif properties.type == "product_deleted":
                product = db.session.get(Product, data)
                if product is not None:
                    db.session.delete(product)
                print("Product Deleted")

            else:
                raise ValueError(f"Unsupported message type: {properties.type}")

            db.session.commit()
        except Exception:
            db.session.rollback()
            raise

    ch.basic_ack(delivery_tag=method.delivery_tag)


channel.basic_consume(queue='main', on_message_callback=callback, auto_ack=False)
print('Started Consuming')
channel.start_consuming()

channel.close()
