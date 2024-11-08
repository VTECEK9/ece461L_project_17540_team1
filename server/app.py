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
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3000"],  # Specifically allow your React app's origin
        "methods": ["GET", "POST", "PUT", "DELETE"],  # Allow specific methods
        "allow_headers": ["Content-Type"]  # Allow specific headers
    }
})
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

        response = {
            "message": "Login successful",
            "status": "success",
            "projects": user['projects'],
            "userId": user['userId'],
            "username": user['username']
        }
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

@app.route('/create_project', methods=['POST'])
def create_project():
    data = request.get_json()
    project_name = data.get('projectName')
    project_description = data.get('projectDescription')
    project_id = data.get('projectId')
    user_id = data.get('userId')

    # Connect to the database
    db = client['user_management']
    projects_collection = db['projects']
    users_collection = db['users']

    # Check if project ID already exists
    if projects_collection.find_one({'projectId': project_id}):
        return jsonify({
            "status": "error",
            "message": "Project ID already exists"
        })

    # Create new project document
    project = {
        'projectName': project_name,
        'projectDescription': project_description,
        'projectId': project_id,
        'createdBy': user_id,
        'members': [user_id]  # Initialize with creator as first member
    }

    try:
        # Insert project into projects collection
        projects_collection.insert_one(project)

        # Update user's projects array - note the change in the query
        result = users_collection.update_one(
            {'userId': user_id},  # This stays the same
            {'$push': {'projects': project_id}}
        )

        # Add debug prints
        print(f"Update result: {result.modified_count} documents modified")

        # Verify the update
        updated_user = users_collection.find_one({'userId': user_id})
        print(f"Updated user projects: {updated_user['projects']}")

        return jsonify({
            "status": "success",
            "message": "Project created successfully"
        })
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({
            "status": "error",
            "message": f"Error creating project: {str(e)}"
        })




# Route for getting the list of user projects
@app.route('/get_user_projects', methods=['POST'])
def get_user_projects():
    data = request.get_json()
    user_id = data.get('userId')

    db = client['user_management']
    users_collection = db['users']
    projects_collection = db['projects']

    # First get the user's project IDs from their document
    user = users_collection.find_one({'userId': user_id})
    if not user:
        return jsonify({
            'status': 'error',
            'message': 'User not found'
        })

    user_project_ids = user.get('projects', [])

    # Find only the projects that are in the user's projects array
    projects = list(projects_collection.find({
        'projectId': {'$in': user_project_ids}
    }))

    # Format projects to match what exists in MongoDB
    formatted_projects = [{
        'id': str(project['_id']),
        'name': project['projectName'],
        'description': project['projectDescription'],
        'projectId': project['projectId'],
        'createdBy': project['createdBy'],
        'users': project['members'],
        'authorized': True
    } for project in projects]

    return jsonify({
        'status': 'success',
        'projects': formatted_projects
    })

# Main entry point for the application
if __name__ == '__main__':
    app.run(debug=True)
