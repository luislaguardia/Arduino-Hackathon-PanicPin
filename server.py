from flask import Flask, request, jsonify
import json

from flask_cors import CORS

app = Flask(__name__)
CORS(app)
SOS_FILE = "sos_data.json"

# Load existing SOS data
def load_sos_data():
    try:
        with open(SOS_FILE, "r") as file:
            return json.load(file)
    except FileNotFoundError:
        return []

# Save new SOS data
def save_sos_data(data):
    with open(SOS_FILE, "w") as file:
        json.dump(data, file, indent=4)

@app.route("/sos", methods=["POST"])
def receive_sos():
    data = request.json
    sos_list = load_sos_data()

    # Check if user already sent an SOS (update instead of duplicate)
    for entry in sos_list:
        if entry["user_id"] == data["user_id"]:
            entry["lat"] = data["lat"]
            entry["lon"] = data["lon"]
            break
    else:
        sos_list.append(data)  # Add new SOS if user not in list

    save_sos_data(sos_list)
    return jsonify({"message": "SOS received"}), 200

@app.route("/get_sos", methods=["GET"])
def send_sos_data():
    return jsonify(load_sos_data())

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5001)