# Import necessary libraries and modules
from pymongo import MongoClient
from flask import jsonify
from encryption import decrypt

from hardwareDatabase import queryHardwareSet, requestSpace


# lets manage the projects here

'''
Structure of Project entry:
Project = {
    'projectName': projectName,
    'projectId': projectId,
    'description': description,
    'hwSets': {HW1: 0, HW2: 10, ...},
    'users': [user1, user2, ...]
}
'''

def connect():
    uri = "mongodb+srv://shivanshmadan:fsha4TPS9mOeogmG@users.8d1mt.mongodb.net/?retryWrites=true&w=majority&appName=Users"

    client = MongoClient(uri)

    return client




# Function to query a project by its ID
def queryProject(client, projectId):

    db = client['user_management']

    projects = db['projects']

    document = projects.find_one({'projectId': projectId})

    document.pop('_id')

    return document


def clean_projects(client):
    db = client['user_management']
    projects = db['projects']

    result = projects.update_many( {'HardwareSet_Usage' : {'$exists' : False}}, {'$set': {'HardwareSet_Usage' : {}}}
    )




# Function to create a new project
def createProject(client, projectName, projectId, description, user):
    # Connect to the database
    db = client['user_management']

    projects = db['projects']

    users = db['users']

    # Check if project ID already exists
    if projects.find_one({'projectId': projectId}):
        response = {
            "status": "error",
            "message": "Project ID already exists"
        }
    else:
        # Create new project document
        projects.insert_one(
            {
                'projectName': projectName,
                'projectDescription': description,
                'projectId': projectId,
                'createdBy': decrypt(user),
                'members': [decrypt(user)],
                'HardwareSet_Usage': {
                    'HWSet1': 0,  # Initially no hardware checked out
                    'HWSet2': 0   # Initially no hardware checked out
                }
            }
        )
        

        response = {
            "status": "success",
            "message": "Project created successfully"
        }

        users.update_one(
            {'username': user},  # This stays the same
            {'$push': {'projects': projectId}}
        )

    return response

def addUser(client, projectId, user):
    db = client['user_management']
    projects = db['projects']
    projects.update_one({'projectId': projectId}, {'$addToSet': {'members' : user}})
    

# Function to add a user to a project
def addUsertoProject(client, projectId, user):
    db = client['user_management']

    projects = db['projects']
    
    if projects.find_one({'projectId': projectId}):

        userdb = db['users']
        
        userdb.update_one({'username': user}, {'$addToSet': {'projects': projectId}})

        projects.update_one({'projectId': projectId}, {'$addToSet': {'members' : user}})
        
        response = {
                "status": "success",
                "message": "Project joined successfully"
        }
    else:
        response = {
                "status": "error",
                "message": "Project ID does not exist"
        }
    
    return response

def deleteProject(client, projectId):
    db = client['user_management']
    projects = db['projects']
    projects.delete_one({'projectId': projectId})


# Function to update hardware usage in a project
def updateUsage(client, projectId, hwSetName):
    # Update the usage of a hardware set in the specified project
    pass

# Function to check out hardware for a project
def checkOutHW(client, projectId, hwSetName, qty, userId):
    # Check out hardware for the specified project and update availability
    pass

# Function to check in hardware for a project
def checkInHW(client, projectId, hwSetName, qty, userId):
    # Check in hardware for the specified project and update availability
    pass


def main():
    client = connect()

    clean_projects(client)


    # user = "Jake Paul"
    #
    # project = "Team 10"
    #
    # projectID = "jpt10"
    #
    # description = "It's everyday bro"
    #
    # # createProject(client, project, projectID, description, user)
    #
    # addUser(client, projectID, "Logan Paul")
    #
    # query = queryProject(client, 'jpt10')
    #
    # print(query)




if __name__ == '__main__':
    main()