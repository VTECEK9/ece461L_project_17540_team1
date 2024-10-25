# Import necessary libraries and modules
from bson.objectid import ObjectId
from flask import Flask, request, jsonify
from pymongo.mongo_client import MongoClient
from flask_cors import CORS
import os

# Define the MongoDB connection string
uri = "mongodb+srv://shivanshmadan:fsha4TPS9mOeogmG@users.8d1mt.mongodb.net/?retryWrites=true&w=majority&appName=Users"

# Initialize the MongoDB client and connect to the server
client = MongoClient(uri)

# Confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(f"Connection failed: {e}")

# Initialize a new Flask web application
app = Flask(__name__)
CORS(app)

# Route for user login
@app.route('/login', methods=['POST'])
def login():
    # Extract data from request
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # Connect to the 'user_management' database and 'users' collection
    db = client['user_management']
    users_collection = db['users']
    print(users_collection)

    # Attempt to log in the user
    user = users_collection.find_one({'username': username})

    if user and user['password'] == password:
        response = {"message": "Login successful", "status": "success"}
    else:
        response = {"message": "Invalid username or password", "status": "error"}

    # Return a JSON response
    return jsonify(response)

# Route for adding a new user
@app.route('/add_user', methods=['POST'])
def add_user():
    # Extract data from request
    data = request.get_json()
    firstName = data.get('firstname')
    lastName = data.get('lastname')
    username = data.get('username')
    userId = data.get('userId')
    password = data.get('password')

    # Connect to the 'user_management' database and 'users' collection
    db = client['user_management']
    users_collection = db['users']

    # Check if the user already exists
    if users_collection.find_one({'userId': userId}):
        response = {"message": "User with this ID already exists.", "status": "error"}
    else:
        # Create a new user entry
        user = {
            'FirstName' : firstName,
            'LastName' : lastName,
            'username': username,
            'userId': userId,
            'password': password,
            'projects': []
        }
        # Insert the new user into the users collection
        users_collection.insert_one(user)
        response = {"message": "User added successfully.", "status": "success"}

    # Return a JSON response
    return jsonify(response)

# Route for getting the list of user projects
@app.route('/get_user_projects_list', methods=['POST'])
def get_user_projects_list():

    return 42

# Main entry point for the application
if __name__ == '__main__':
    app.run(debug=True)
