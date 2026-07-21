from flask import request, jsonify
from werkzeug.utils import secure_filename
import boto3
import os

from extensions import db
from models import Employee

S3_BUCKET = os.getenv("S3_BUCKET")
S3_REGION = os.getenv("S3_REGION")

s3 = boto3.client("s3")


def register_routes(app):

    @app.route("/", methods=["GET"])
    def home():
        return jsonify({
            "message": "Employee Management Backend Running Successfully"
        })

    @app.route("/health", methods=["GET"])
    def health():
        return jsonify({
            "status": "UP"
        }), 200

    @app.route("/employees", methods=["GET"])
    def get_employees():

        employees = Employee.query.all()

        return jsonify([employee.to_dict() for employee in employees])

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
                    "ContentType": image.content_type
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

    @app.route("/employees/<int:id>", methods=["PUT"])
    def update_employee(id):

        try:

            employee = Employee.query.get(id)

            if employee is None:
                return jsonify({"message": "Employee Not Found"}), 404

            employee.name = request.form["name"]
            employee.department = request.form["department"]
            employee.email = request.form["email"]

            image = request.files.get("image")

            if image:

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
                "message": "Employee Updated Successfully"
            })

        except Exception as e:

            return jsonify({
                "error": str(e)
            }), 500

    @app.route("/employees/<int:id>", methods=["DELETE"])
    def delete_employee(id):

        try:

            employee = Employee.query.get(id)

            if employee is None:
                return jsonify({
                    "message": "Employee Not Found"
                }), 404

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
                "message": "Employee Deleted Successfully"
            })

        except Exception as e:

            return jsonify({
                "error": str(e)
            }), 500
