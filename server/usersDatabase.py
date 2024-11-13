# Import necessary libraries and modules
from pymongo import MongoClient


'''
Structure of User entry:
User = {
    'username': username,
    'userId': userId,
    'password': password,
    'projects': [project1_ID, project2_ID, ...]
}
'''

# Function to add a new user
def addUser(client, username, password):
    db = client['user_management']
    users_collection = db['users']

    # Check if the user already exists
    if users_collection.find_one({'username': username}):
        response = {"message": "User with this ID already exists.", "status": "error"}
    else:
        # Create a new user entry
        user = {
            'username': username,
            'password': password,
            'projects': []
        }
        # Insert the new user into the users collection
        users_collection.insert_one(user)
        response = {"message": "User added successfully.", "status": "success"}

    return response

# Helper function to query a user by username and userId
def __queryUser(client, username, userId):
    # Query and return a user from the database
    pass

# Function to log in a user
def login(client, username, password):
    # Connect to the 'user_management' database and 'users' collection
    db = client['user_management']
    users_collection = db['users']

    # Attempt to log in the user
    user = users_collection.find_one({'username': username})

    if user and user['password'] == password:

        response = {
            "message": "Login successful",
            "status": "success",
            "projects": user['projects'],
            "username": user['username']
        }
    else:
        response = {"message": "Invalid username or password", "status": "error"}

    return response

# Function to add a user to a project
def joinProject(client, userId, projectId):
    # Add a user to a specified project
    pass

# Function to get the list of projects for a user
def getUserProjectsList(client, userId):
    # Get and return the list of projects a user is part of
    pass

