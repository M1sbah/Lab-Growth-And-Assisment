import os

from flask import *
import jsonify
import nltk
nltk.download('punkt')
nltk.download('stopwords')
import sys
import numpy as np
from gensim.models.keyedvectors import KeyedVectors
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

from gensim.models import Word2Vec

import math

import language_tool_python


from pymongo import MongoClient

def get_database():
    mongo_uri = os.environ['MONGO_URI']
    client = MongoClient(mongo_uri)
    return client['FirstApi']

def GrammerChecker(answer):

    my_tool = language_tool_python.LanguageTool('en-US')

    matches =my_tool.check(answer)
    myMistakes=[]
    for rules in matches:
        if len(rules.replacements) > 0:
            myMistakes.append(answer[rules.offset: rules.errorLength + rules.offset])
    return len(myMistakes)


def KeyWordmatching(X, Y_lst):
    # tokenization
    result = 0
    X_list = word_tokenize(X)

    # sw contains the list of stopwords
    sw = stopwords.words('english')
    sw.append('.')
    sw.append(',')
    l1 = []
    l2 = []

    # remove stop words from string
    X_set = {w for w in X_list if not w in sw}

    km=[]


    Y_list = word_tokenize(Y_lst)
    Y_set = {w for w in Y_list if not w in sw}
    # form a set containing keywords of both strings
    rvector = X_set.union(Y_set)
    for w in rvector:
        if w in X_set and w in Y_set:
            km.append(w)

        if w in X_set:
            l1.append(1)  # create a vector
        else:
            l1.append(0)
        if w in Y_set:
            l2.append(1)
        else:
            l2.append(0)
    c = 0

    # cosine formula
    for i in range(len(rvector)):
        c += l1[i] * l2[i]

    try:
        cosine = c / ((float((sum(l1) * sum(l2))) ** 0.5))
    except:
        cosine=0
    #print(float((sum(l1) * sum(l2)) ** 0.5))
    #print(math.sqrt(sum(l1)*sum(l2)))
    #cosine= c/math.sqrt(sum(l1)*sum(l2))
    cosine = cosine * 100
    #print(cosine)
    result = result + cosine
    # print('result',result)
    # print("similarity: ", cosine)
    print(result)


    # cosine = result / 3

    if int(cosine)==0:
        return 0

    kval = 0
    if cosine > 70:
        kval = 1
    elif cosine > 60:
        kval = 2
    elif cosine > 50:
        kval = 3
    elif cosine > 40:
        kval = 4
    elif cosine > 20:
        kval = 5
    else:
        kval = 6
    return kval



def CheckLenght(client_answer):
    client_ans = len(client_answer.split())
    # return client_ans
    kval1 = 0
    if client_ans > 50:
        kval1 = 1
    elif client_ans > 40:
        kval1 = 2
    elif client_ans > 30:
        kval1 = 3
    elif client_ans > 20:
        kval1 = 4
    elif client_ans > 10:
        kval1 = 5
    else:
        kval1 = 6
    return kval1


class DocSim:
    def __init__(self, w2v_model, stopwords=None):
        self.w2v_model = w2v_model
        self.stopwords = stopwords if stopwords is not None else []

    def vectorize(self, doc: str) -> np.ndarray:
        doc = doc.lower()
        words = [w for w in doc.split(" ") if w not in self.stopwords]
        word_vecs = []
        for word in words:
            try:
                vec = self.w2v_model[word]
                word_vecs.append(vec)
            except KeyError:
                # Ignore, if the word doesn't exist in the vocabulary
                pass

        # Assuming that document vector is the mean of all the word vectors
        # PS: There are other & better ways to do it.
        vector = np.mean(word_vecs, axis=0)
        return vector

    def _cosine_sim(self, vecA, vecB):
        csim = np.dot(vecA, vecB) / (np.linalg.norm(vecA) * np.linalg.norm(vecB))
        if np.isnan(np.sum(csim)):
            return 0
        return csim

    def calculate_similarity(self, source_doc, target_docs=None, threshold=0):
        if not target_docs:
            return []

        if isinstance(target_docs, str):
            target_docs = [target_docs]

        source_vec = self.vectorize(source_doc)
        results = []
        result=[]
        for doc in target_docs:
            target_vec = self.vectorize(doc)
            sim_score = self._cosine_sim(source_vec, target_vec)
            result.append(sim_score)
            if sim_score > threshold:
                results.append({"score": sim_score, "doc": doc})
            # Sort results by score in desc order
            results.sort(key=lambda k: k["score"], reverse=True)

        return result


def check(sans, tans):
    key_match = KeyWordmatching(sans, tans)
    if key_match == 0:
        return int(0)
    sim_scores = ds.calculate_similarity(sans, tans)
    # print((sum(sim_scores) / len(sim_scores)) * 70)

    key_Error = GrammerChecker(sans)
    key_length = CheckLenght(sans)
    marks2 = (sim_scores[0]* 70) + (10 / key_match) + (15 * key_Error) + (5 / key_length)
    print(marks2)
    return int(marks2)


googlenews_model_path = 'GoogleNews-vectors-negative300.bin'
stopwords_path = "stopwords.txt"

try:
    model = KeyedVectors.load("wv.model")
except:
    model = KeyedVectors.load_word2vec_format(googlenews_model_path, binary=True)
    model.save('wv.model')

with open(stopwords_path, 'r') as fh:
    stopwrds = fh.read().split(",")
ds = DocSim(model,stopwords=stopwrds)





app = Flask(__name__)

@app.route("/", methods=['GET'])
def display():
    # query = request.args.to_dict(flat=False)
    # print(query)
    print(request.args.get("tans"))
    print(request.args.get("sans"))
    return "success"

@app.route("/", methods=['POST'])
def index():
    # print(request.args.get("tans"))
    # print(request.args.get("sans"))
    # content_type = request.headers.get('Content-Type')
    # data = json.loads(request.data)
    data=request.get_json(force=True)

    if isinstance(data['ques'], str):
        x=1
    else:
        x=len(data['ques'])

    # result=(check(data['tans'], data['sans']))
    dbname = get_database()
    asgnQues = dbname["assignmentques"]

    ansSheet = dbname["answersheets"]

    asgnSheet = dbname["marksheets"]

    AsgnItems= asgnQues.find({"paperID": data['Pid']})


    marks=0

    if x==1:
        sans = data['ans']
        tans = AsgnItems[0]['ans']
        result = check(sans, tans) * 0.2
        sheet = {
            "paperID": data['Pid'],
            "email": data['email'],
            "username": data['username'],
            "ques": data['ques'],
            "ans": data['ans'],
            "subject": data['subject'],
            "marks": int(result)
        }
        ansSheet.insert_one(sheet)
        AsgnMarkSheet = {
            "paperID": data['Pid'],
            "email": data['email'],
            "username": data['username'],
            "subject": data['subject'],
            "marks": int(result)
        }
        print(sheet)
        asgnSheet.insert_one(AsgnMarkSheet)

        return "success"

    for i in range(x):
        sans=data['ans'][i]
        tans=AsgnItems[i]['ans']

        result=check(sans, tans)*0.2
        marks+=result

        sheet={
            "paperID":data['Pid'],
            "email":data['email'],
            "username":data['username'],
            "ques":data['ques'][i],
            "ans":data['ans'][i],
            "subject":data['subject'],
            "marks":int(result)
        }
        print(sheet)
        ansSheet.insert_one(sheet)

    AsgnMarkSheet={
        "paperID": data['Pid'],
        "email": data['email'],
        "username": data['username'],
        "subject": data['subject'],
        "marks":marks//x
    }
    asgnSheet.insert_one(AsgnMarkSheet)


    return "success"



if __name__=='__main__':
    app.run(debug=True)
