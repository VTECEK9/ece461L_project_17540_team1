# Import necessary libraries and modules
from pymongo import MongoClient

'''
Structure of Hardware Set entry:
HardwareSet = {
    'hwName': hwSetName,
    'capacity': initCapacity,
    'availability': initCapacity
}
'''
# def connect():
#     uri = "mongodb+srv://shivanshmadan:fsha4TPS9mOeogmG@users.8d1mt.mongodb.net/?retryWrites=true&w=majority&appName=Users"
#
#     client = MongoClient(uri)
#
#     return client

def deleteHardwareSet(client, hwSetName):
    db = client['HardwareSet']

    db.drop_collection(hwSetName)

# Function to create a new hardware set
def createHardwareSet(client, hwSetName, initCapacity):
    db = client['HardwareSet']

    db.create_collection(hwSetName)

    collection = db[hwSetName]

    collection.insert_one({'Capacity': initCapacity, 'Availability': initCapacity})

# Function to query a hardware set by its name
def queryHardwareSet(client, hwSetName):
    db = client['HardwareSet']

    collection = db[hwSetName]

    document = collection.find()

    query = {}

    for item in document:
        query.update(item)

    query.pop('_id')

    query.pop('Capacity')

    return query




# Function to update the availability of a hardware set
def updateAvailability(client, hwSetName, newAvailability):
    db = client['HardwareSet']

    HWSet = db[hwSetName]

    document = HWSet.find_one()

    document['Availability'] = newAvailability

    HWSet.replace_one({'_id' : document['_id']}, document)





# Function to request space from a hardware set
def requestSpace(client, hwSetName, amount):

    print(f"Requesting {amount} from {hwSetName}")

    db = client['HardwareSet']
    HWSet = db[hwSetName]

    document = HWSet.find_one()
    availableAmount = document['Availability']

    print(f"Current Capacity of {hwSetName} is {availableAmount}")

    if availableAmount >= amount and amount > 0:
        print(f"SUFFICIENT AVAILABILITY: INITIATING TRANSACTION")
        updateAvailability(client, hwSetName, availableAmount - amount)
        return amount
    else:
        print(f"INSUFFICIENT AVAILABILITY: CAN ONLY RETURN: {availableAmount}")
        updateAvailability(client, hwSetName, 0)
        return availableAmount



# Function to get all hardware set names
def getAllHwNames(client):
    # Get and return a list of all hardware set names
    pass

# def main():
#     client = connect()
#
#
#
#     deleteHardwareSet(client, 'HWSet3')
#
#
#
#
# if __name__ == '__main__':
#     main()
