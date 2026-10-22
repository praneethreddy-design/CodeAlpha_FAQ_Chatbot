from flask import Flask, render_template, request, jsonify
import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)

# Load FAQ data
with open("faq_data.json", "r") as file:
    faq_data = json.load(file)

# Extract all questions
questions = [item["question"] for item in faq_data]

# Train TF-IDF Vectorizer
vectorizer = TfidfVectorizer()
question_vectors = vectorizer.fit_transform(questions)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/get_answer", methods=["POST"])
def get_answer():

    data = request.get_json()
    user_question = data["question"]

    # Convert user question into vector
    user_vector = vectorizer.transform([user_question])

    # Calculate similarity
    similarity = cosine_similarity(user_vector, question_vectors)

    # Find best match
    best_match = similarity.argmax()
    best_score = similarity[0][best_match]

    if best_score > 0.3:
        answer = faq_data[best_match]["answer"]
    else:
        answer = "Sorry, I don't know the answer."

    return jsonify({"answer": answer})


if __name__ == "__main__":
    app.run(debug=True)