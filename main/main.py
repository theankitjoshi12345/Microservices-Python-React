from flask import Flask, jsonify, abort
from dataclasses import dataclass
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
import requests
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = (
    f"mysql://root:{os.environ['DB_PASSWORD']}@db/main"
)
CORS(app)

db = SQLAlchemy(app)
migrate = Migrate(app, db)

@dataclass
class Product(db.Model):
    id: int
    title: str
    image: str 
     
    id = db.Column(db.Integer, primary_key=True, autoincrement=False)
    title = db.Column(db.String(200))
    image = db.Column(db.String(200))
 
@dataclass
class ProductUser(db.Model):
    id: int = db.Column(db.Integer, primary_key=True)
    user_id: int = db.Column(db.Integer)
    product_id: int = db.Column(db.Integer)

    # NOTICE THE PARENTHESES AND THE TRAILING COMMA AT THE END!
    __table_args__ = (db.UniqueConstraint('user_id', 'product_id', name='user_product_unique'),)

@app.route('/api/products')
def index():
    return jsonify(Product.query.all() )

@app.route('/api/products/<int:id>/like', methods=['POST'])
def like(id):
    req = requests.get('http://docker.for.mac.localhost:8000/api/user')
    json = req.json()
    try: 
        productUser = ProductUser(user_id=json['id'], product_id=id)
        db.session.add(productUser)
        db.session.commit()
    except:
        abort(400, "You already liked this product.")     
    return jsonify({
        "message": "Successful."
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001) 
