from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

import boto3
import pymysql
import os

from werkzeug.utils import secure_filename

# -------------------------------------------------
# Configure PyMySQL
# -------------------------------------------------

pymysql.install_as_MySQLdb()

# -------------------------------------------------
# Flask App
# -------------------------------------------------

app = Flask(__name__)

CORS(app)

# -------------------------------------------------
# RDS Configuration
# -------------------------------------------------

app.config["SQLALCHEMY_DATABASE_URI"] = \
"mysql+pymysql://admin:admin123@officedb.c1ksc204yo6w.ap-southeast-1.rds.amazonaws.com/officedb"

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

# -------------------------------------------------
# Amazon S3 Configuration
# -------------------------------------------------

S3_BUCKET = "employee-profile-images-tamilselvan-2026"

S3_REGION = "ap-southeast-1"

s3 = boto3.client("s3")

# -------------------------------------------------
# Employee Model
# -------------------------------------------------

class Employee(db.Model):

    __tablename__ = "employees"

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(100), nullable=False)

    department = db.Column(db.String(100), nullable=False)

    email = db.Column(db.String(100), nullable=False)

    image_url = db.Column(db.Text)

    def to_dict(self):

        return {

            "id": self.id,

            "name": self.name,

            "department": self.department,

            "email": self.email,

            "image_url": self.image_url

        }

# -------------------------------------------------
# Create Table
# -------------------------------------------------

with app.app_context():

    db.create_all()

# -------------------------------------------------
# Home API
# -------------------------------------------------

@app.route("/", methods=["GET"])
def home():

    return jsonify({

        "message": "Employee Management Backend Running Successfully"

    })


# -------------------------------------------------
# GET ALL EMPLOYEES
# -------------------------------------------------

@app.route("/employees", methods=["GET"])
def get_employees():

    employees = Employee.query.all()

    return jsonify([employee.to_dict() for employee in employees])


# -------------------------------------------------
# ADD EMPLOYEE
# -------------------------------------------------

@app.route("/employees", methods=["POST"])
def add_employee():

    try:

        name = request.form["name"]

        department = request.form["department"]

        email = request.form["email"]

        image = request.files["image"]

        filename = secure_filename(image.filename)

        s3.upload_fileobj(

            image,

            S3_BUCKET,

            filename,

            ExtraArgs={

                "ContentType": image.content_type,
                

            }

        )

        image_url = f"https://{S3_BUCKET}.s3.{S3_REGION}.amazonaws.com/{filename}"

        employee = Employee(

            name=name,

            department=department,

            email=email,

            image_url=image_url

        )

        db.session.add(employee)

        db.session.commit()

        return jsonify({

            "message": "Employee Added Successfully"

        }), 201

    except Exception as e:

        return jsonify({

            "error": str(e)

        }), 500

# -------------------------------------------------
# UPDATE EMPLOYEE
# -------------------------------------------------

@app.route("/employees/<int:id>", methods=["PUT"])
def update_employee(id):

    try:

        employee = Employee.query.get(id)

        if employee is None:

            return jsonify({

                "message": "Employee Not Found"

            }),404

        employee.name = request.form["name"]

        employee.department = request.form["department"]

        employee.email = request.form["email"]

        image = request.files.get("image")

        if image:

            # Delete old image from S3

            if employee.image_url:

                old_file = employee.image_url.split("/")[-1]

                try:

                    s3.delete_object(

                        Bucket=S3_BUCKET,

                        Key=old_file

                    )

                except:

                    pass

            filename = secure_filename(image.filename)

            s3.upload_fileobj(

                image,

                S3_BUCKET,

                filename,

                ExtraArgs={

                    "ContentType": image.content_type

                }

            )

            employee.image_url = f"https://{S3_BUCKET}.s3.{S3_REGION}.amazonaws.com/{filename}"

        db.session.commit()

        return jsonify({

            "message":"Employee Updated Successfully"

        })

    except Exception as e:

        return jsonify({

            "error":str(e)

        }),500

# -------------------------------------------------
# DELETE EMPLOYEE
# -------------------------------------------------

@app.route("/employees/<int:id>", methods=["DELETE"])
def delete_employee(id):

    try:

        employee = Employee.query.get(id)

        if employee is None:

            return jsonify({

                "message":"Employee Not Found"

            }),404

        if employee.image_url:

            filename = employee.image_url.split("/")[-1]

            try:

                s3.delete_object(

                    Bucket=S3_BUCKET,

                    Key=filename

                )

            except:

                pass

        db.session.delete(employee)

        db.session.commit()

        return jsonify({

            "message":"Employee Deleted Successfully"

        })

    except Exception as e:

        return jsonify({

            "error":str(e)

        }),500
# -------------------------------------------------
# Run Flask
# -------------------------------------------------

if __name__ == "__main__":

    app.run(

        host="0.0.0.0",

        port=5000,

        debug=True

    )
