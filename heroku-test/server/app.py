from flask import Flask, request, jsonify
from dotenv import load_dotenv

#additional imports (testing)
from bson.objectid import ObjectId
from pymongo.mongo_client import MongoClient
from flask_cors import CORS

from usersDatabase import addUser, login_user
from projectsDatabase import createProject, addUsertoProject
from hardwareDatabase import queryHardwareSet, requestSpace, checkInHardware, queryHardwareSet
from encryption import encrypt, decrypt

import os


load_dotenv()

#testing initial 
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


#Set up app
app = Flask(__name__, static_folder = '../client/build', static_url_path='/')

#Set up index route
@app.route('/')
def index():
    return app.send_static_file('index.html')


#additional
CORS(app)
# Route for user login
@app.route('/login', methods=['POST'])
def login():
    # Extract data from request
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

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

@app.route('/join_project', methods=['POST'])
def join_project():
    data = request.get_json()
    username = data.get('username')
    project_id = data.get('projectId')
    response = addUsertoProject(client, project_id, username)
    return jsonify(response)

@app.route('/create_project', methods=['POST'])
def create_project():
    data = request.get_json()

    print(f"Received data: {data}")  # Log the received payload

    project_name = data.get('projectName')
    project_description = data.get('projectDescription')
    project_id = data.get('projectId')
    username = data.get('username')

    response = createProject(client, project_name,project_id ,project_description,  username)

    return jsonify(response)

@app.route('/request_HWset1', methods=['POST'])
def request_HWset1():
    
    data = request.get_json()
    project_id = data.get('projectId')
    amount = int(data.get('amount', 0))

    if amount < 0:
        return jsonify({
            'status': 'error',
            'message': 'Request amount cannot be negative'
        })

    response = requestSpace(client, "HWSet1", amount)

    amount = response['amount']
    
    # Update project's HardwareSet_Usage
    db = client['user_management']
    projects_collection = db['projects']
    
    project = projects_collection.find_one({'projectId': project_id})
    current_usage = project.get('HardwareSet_Usage', {}).get('HWSet1', 0)
    
    projects_collection.update_one(
        {'projectId': project_id},
        {'$set': {
            'HardwareSet_Usage.HWSet1': current_usage + amount
        }}
    )
        
    return jsonify(response)
    
@app.route('/request_HWset2', methods=['POST'])
def request_HWset2():
    data = request.get_json()
    project_id = data.get('projectId')
    amount = int(data.get('amount', 0))

    if amount < 0:
        return jsonify({
            'status': 'error',
            'message': 'Request amount cannot be negative'
        })

    response = requestSpace(client, "HWSet2", amount)

    amount = response['amount']
    
    # Update project's HardwareSet_Usage
    db = client['user_management']
    projects_collection = db['projects']
    
    project = projects_collection.find_one({'projectId': project_id})
    current_usage = project.get('HardwareSet_Usage', {}).get('HWSet2', 0)
    
    projects_collection.update_one(
        {'projectId': project_id},
        {'$set': {
            'HardwareSet_Usage.HWSet2': current_usage + amount
        }}
    )
        
    return jsonify(response)

@app.route('/checkin_HWset1', methods=['POST'])
def checkin_HWset1():
    try:
        data = request.get_json()
        project_id = data.get('projectId')
        amount = int(data.get('amount', 0))
        
        response = checkInHardware(client, "HWSet1", amount)
        
        if response['status'] == 'success':
            # Update project's HardwareSet_Usage
            db = client['user_management']
            projects_collection = db['projects']
            
            project = projects_collection.find_one({'projectId': project_id})
            current_usage = project.get('HardwareSet_Usage', {}).get('HWSet1', 0)
            
            projects_collection.update_one(
                {'projectId': project_id},
                {'$set': {
                    'HardwareSet_Usage.HWSet1': max(0, current_usage - amount)
                }}
            )
        return jsonify(response)
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        })

@app.route('/checkin_HWset2', methods=['POST'])
def checkin_HWset2():
    try:
        data = request.get_json()
        project_id = data.get('projectId')
        amount = int(data.get('amount', 0))
        
        response = checkInHardware(client, "HWSet2", amount)
        
        if response['status'] == 'success':
            # Update project's HardwareSet_Usage
            db = client['user_management']
            projects_collection = db['projects']
            
            project = projects_collection.find_one({'projectId': project_id})
            current_usage = project.get('HardwareSet_Usage', {}).get('HWSet2', 0)
            
            projects_collection.update_one(
                {'projectId': project_id},
                {'$set': {
                    'HardwareSet_Usage.HWSet2': max(0, current_usage - amount)
                }}
            )


        return jsonify(response)
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        })

@app.route('/query_HW_set', methods = ['POST'])
def query_HWSet_availability():
    try:
        data = request.get_json()
        HWSet = data.get('HWSet')
        response = queryHardwareSet(client, HWSet)
        if 'Availability' in response:
            return jsonify({
                "status": "success",
                "availability": response['Availability']
            })
        else:
            return jsonify({
                "status": "error",
                "message": f"HWSet {HWSet} not found"
            })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        })


# Route for getting the list of user projects
@app.route('/get_user_projects', methods=['POST'])
def get_user_projects():
   data = request.get_json()
   username = data.get('username')

   db = client['user_management']
   users_collection = db['users']  
   projects_collection = db['projects']


   HWSet1_availability = queryHardwareSet(client, 'HWSet1')
   
   HWSet2_availability = queryHardwareSet(client, 'HWSet2')

   print(f"Availability of HWSet1 is {HWSet1_availability}")
   print(f"Availability of HWSet2 is {HWSet2_availability}")


   user = users_collection.find_one({'username': username})
   if not user:
       return jsonify({
           'status': 'error',
           'message': 'User not found'
       })

   user_project_ids = user.get('projects', [])

   projects = list(projects_collection.find({
       'projectId': {'$in': user_project_ids}
   }))

   formatted_projects = []
   for project in projects:
       # Get members array and decrypt each member
       members = project.get('members', [])
       decrypted_members = []
       for member in members:
           decrypted_member = decrypt(member)  # Using your decrypt function
           decrypted_members.append(decrypted_member)
           
       formatted_project = {
           'id': str(project['_id']),
           'name': project['projectName'], 
           'description': project['projectDescription'],
           'projectId': project['projectId'],
           'createdBy': project['createdBy'],
           'users': decrypted_members,  # Use decrypted members
           'authorized': True,
           'HardwareSet_Usage': project.get('HardwareSet_Usage', {}),
            'HWSet1_Availability' : HWSet1_availability ,
            'HWSet2_Availability' : HWSet2_availability 
       }
       formatted_projects.append(formatted_project)

   return jsonify({
       'status': 'success',
       'projects': formatted_projects
   })


if __name__ == '__main__':
    app.run(port=(os.getenv('PORT') if os.getenv('PORT')else 8000), debug=False)