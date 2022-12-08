# import mysql.connector

# import mysql.connector
from flask import Flask
from flask import request
# from mysql.connector import Error
# from flask_cors import CORS, cross_origin


# # try:
# #     connection = mysql.connector.connect(host='localhost',
# #                                          database='cuic',
# #                                          user='root',
# #                                          password='', 
# #                                          port=3307)
# #     if connection.is_connected():
# #         db_Info = connection.get_server_info()
# #         print("Connected to MySQL Server version ", db_Info)
# #         cursor = connection.cursor()
# #         cursor.execute("select database();")
# #         record = cursor.fetchone()
# #         print("You're connected to database: ", record)

# # except Error as e:
# #     print("Error while connecting to MySQL", e)


# app = Flask(__name__)
# print("Hello")

# @app.route('/')
# def hello():
#     print("Hi")
#     return '<h1>Hello, Blah!</h1>'

# @app.route('/stanford')
# def stanford_page():
#     return """
#       <h1>Hello stanford!</h1>

#       <img src="https://maps.googleapis.com/maps/api/staticmap?size=700x300&markers=stanford" alt="map of stanford">
  
#       <img src="https://maps.googleapis.com/maps/api/streetview?size=700x300&location=stanford" alt="street view of stanford">
#     """

# @app.route('/newyork')
# def newyork_page():
#     return """
#       <h1>Hello newyork!</h1>

#       <img src="https://maps.googleapis.com/maps/api/staticmap?size=700x300&markers=newyork" alt="map of newyork">
  
#       <img src="https://maps.googleapis.com/maps/api/streetview?size=700x300&location=newyork" alt="street view of newyork">
#       """

# # @app.route('/signup')
# # def signup():
# #     return '<h1>Hello, Signup!</h1>'
#     # username = request.args.username
#     # print("username")
#     # email = 
#     # password = 

# # if __name__ == '__main__':    
# #     app.run(debug=True)

# from flask import Flask, render_template, request, redirect, url_for, session, flash
# import ibm_db

app = Flask(__name__)
# app.secret_key = 'qwdqwjdjecnwj'

# try:
#     conn = ibm_db.connect("DATABASE=bludb;HOSTNAME=b0aebb68-94fa-46ec-a1fc-1c999edb6187.c3n41cmd0nqnrk39u98g.databases.appdomain.cloud;PORT=31249;SECURITY=SSL;SSLServerCertificate=DigiCertGlobalRootCA.crt;UID=cqg39702;PWD=hIRRyoYSNHJxjqQq", "", "")
# except:
#     print("Unable to connect: ", ibm_db.conn_error())


@app.route("/")
def dash():
    return '<h1>Hello, Signup!</h1>'

@app.route('/login')
def login():
    return '<h1>Hello, Signup!</h1>'


@app.route('/welcome')
def welcome_page():
    return '<h1>Hello, Signup!</h1>'

app.run(debug=True)