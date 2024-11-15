# Import necessary libraries and modules
from bson.objectid import ObjectId
from flask import Flask, request, jsonify
from pymongo.mongo_client import MongoClient
from flask_cors import CORS
import os
from usersDatabase import addUser, login_user
from projectsDatabase import createProject, addUsertoProject
from hardwareDatabase import queryHardwareSet
from encryption import encrypt, decrypt

# this is the flask app that helps us interface with the frontend and will call the appropriate backend functions

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
    
    # username = decrypt(username)
    # password = decrypt(password)

    response = login_user(client, username, password)

    print(response)

    # Return a JSON response
    return jsonify(response)

# Route for adding a new user
@app.route('/add_user', methods=['POST'])
def add_user():
    # Extract data from request
    data = request.get_json()

    firstName = data.get('firstname') # we dont do anything with their name lol
    lastName = data.get('lastname')
    username = data.get('username')
    userId = data.get('userId')
    password = data.get('password')

    # call add user function to add the user, and return the appropriate response
    response = addUser(client, username, password)

    # Return a JSON response
    return jsonify(response)

@app.route('/create_project', methods=['POST'])
def create_project():
    data = request.get_json()

    print(f"Received data: {data}")  # Log the received payload

    project_name = data.get('projectName')
    project_description = data.get('projectDescription')
    project_id = data.get('projectId')
    username = data.get('username')

    response = createProject(client, project_name, project_id, project_description, username)

    return jsonify(response)

@app.route('/get_hw_sets', methods=['GET'])
def get_hw_sets():
    HWset1_query = queryHardwareSet(client, 'HWSet1')
    HWset2_query = queryHardwareSet(client, 'HWSet2')

    response = {
        'HWset1': HWset1_query,
        'HWset2': HWset2_query
    }

    return jsonify(response)

@app.route('/join_project', methods=['POST'])
def join_project():
    data = request.get_json()
    username = data.get('username')
    project_id = data.get('projectId')
    response = addUsertoProject(client, project_id, username)
    return jsonify(response)



# Route for getting the list of user projects
@app.route('/get_user_projects', methods=['POST'])
def get_user_projects():
    data = request.get_json()
    username = data.get('username')
    print(f"Fetching projects for username: {username}")

    db = client['user_management']
    users_collection = db['users']
    projects_collection = db['projects']

    # Fetch user document
    user = users_collection.find_one({'username': username})
    if not user:
        return jsonify({
            'status': 'error',
            'message': 'User not found'
        })

    user_project_ids = user.get('projects', [])
    print(f"User Project IDs: {user_project_ids}")

    # Fetch all matching projects
    projects_cursor = projects_collection.find({
        'projectId': {'$in': user_project_ids}
    })
    projects = list(projects_cursor)
    print(f"Fetched Projects from Database: {projects}")

    # Format projects for response
    formatted_projects = [{
        'id': str(project['_id']),
        'name': project.get('projectName', 'Unnamed Project'),
        'description': project.get('projectDescription', ''),
        'projectId': project.get('projectId', ''),
        'createdBy': project.get('createdBy', 'Unknown'),
        'users': project.get('members', []),
        'authorized': True,
        'HardwareSet_Usage': project.get('HardwareSet_Usage', {})
    } for project in projects]

    print(f"Formatted Projects: {formatted_projects}")

    return jsonify({
        'status': 'success',
        'projects': formatted_projects
    })







# Main entry point for the application
if __name__ == '__main__':
    app.run(debug=True)
