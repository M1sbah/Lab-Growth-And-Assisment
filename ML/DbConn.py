import os

from pymongo import MongoClient

def get_database():
    mongo_uri = os.environ['MONGO_URI']
    client = MongoClient(mongo_uri)
    return client['FirstApi']


if __name__ == "__main__":
    # Get the database
    dbname = get_database()
    collection_name = dbname["assignmentques"]
    item_details = collection_name.find({"paperID": "1684988002194"})
    for item in item_details:
        # This does not give a very readable output
        print(item['ques'])