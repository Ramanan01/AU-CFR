import mysql.connector
import mysql.connector
from flask import Flask
from flask import request, session, send_file
from mysql.connector import Error
from flask_cors import CORS, cross_origin
from flask_mysqldb import MySQL
import json


try:
    connection = mysql.connector.connect(host='localhost',
                                         database='cuic',
                                         user='root',
                                         password='', 
                                         port=3307)
    if connection.is_connected():
        db_Info = connection.get_server_info()
        print("Connected to MySQL Server version ", db_Info)
        cursor = connection.cursor(buffered=True)
        cursor.execute("select database();")
        record = cursor.fetchone()
        print("You're connected to database: ", record)


except Error as e:
    print("Error while connecting to MySQL", e)



app = Flask(__name__)
CORS(app, support_credentials=True)


print("Hello")

@app.route('/')
def hello():
    print("Hi")
    return '<h1>Hello, Blah!</h1>'

@app.route('/signup',methods=['POST'])
@cross_origin(supports_credentials=True)
def signup():
    print("Hi")
    request_data = request.get_json()
    print(request_data)
    res = cursor.execute(''' INSERT INTO account (email, password,name) VALUES (%s, %s, %s) ''',(request_data['email'], request_data['password'],request_data['username']))
    connection.commit()
    # username = request.args.username
    # print("username")
    # email = 
    # password = 
    return '<h1>Hi</h1>'

@app.route('/signin',methods=['POST'])
@cross_origin(supports_credentials=True)
def signin():
    request_data = request.get_json()
    print(request_data)
    res = cursor.execute('''SELECT id,email,password,name
	FROM 
				account
			WHERE
				email=%s AND password=%s''',(request_data['email'], request_data['password']))
    connection.commit()
    account = cursor.fetchone()
    print(account)
    if account:
        res = dict({
            "id": account[0],
			"name": account[3],
			"tokenString": "sample_token",
			"response": {
                "status": 200,
                "message": {
                    "message" : "Successful",
                    "error": ""
                }
            },
			"email": account[1],
        })
    else:
        # Account doesnt exist or username/password incorrect
         res = dict({
			"response": {
                "status": 400,
                "message": {
                    "message" : "Invalid Login Credentials",
                    "error": "Error"
                }
            }
        })
    return res

@app.route('/getexpert', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_expert():
    request_data = request.get_json()
    offset = request.args.get("offset", type=int)
    print(type(offset))
    res = cursor.execute('''SELECT 
				app_gen_id,
				name,
				title,
				dc_members,
				dco_members,
				selected_dc_member,
				selected_dco_member
			FROM
				membersdata
			LIMIT 1
			OFFSET ''' + str(offset))
    connection.commit()
    experts = cursor.fetchone()

    if experts:
        res = dict({
            "expert": {          
                "app_gen_id": experts[0],      
                "name": experts[1],          
                "title": experts[2],         
                "dc_members":json.loads(experts[3]),
                "dco_members":json.loads(experts[4]),
                "selected_expert": experts[5],
            }
        })
    else:
        # Account doesnt exist or username/password incorrect
         res = dict({
			"response": {
                "status": 400,
                "message": {
                    "message" : "Error occured",
                    "error": "Error"
                }
            }
        })
    return res

@app.route('/updateexpert', methods=['PUT'])
@cross_origin(supports_credentials=True)
def update_expert():
    request_data = request.get_json()
    try:
        res = cursor.execute(f'''
                UPDATE
                    membersdata
                SET
                    selected_dc_member = {request_data['expert_id1']}, 
                    selected_dco_member = {request_data['expert_id2']}
                WHERE
                    app_gen_id = {request_data['app_gen_id']}
                ''')
        connection.commit()

        res = dict({
                "response": {
                    "status": 200,
                    "message": {
                        "message" : "Successful",
                        "error": ""
                    }
                }
            })
    except:
        res = dict({
                "response": {
                    "status": 400,
                    "message": {
                        "message" : "Error occured",
                        "error": "Error"
                    }
                }
            })
    
    return res

@app.route('/getfile', methods=['POST'])
@cross_origin(supports_credentials=True)
def get_file():
    request_data = request.get_json()
    print(request_data)

    return send_file('pubs\\jan23-Ice\\' + request_data['pdfName'] )


app.run(debug=True,port=8080)