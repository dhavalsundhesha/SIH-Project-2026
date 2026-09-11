"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import api from "../../lib/api";

export default function QuizPage() {
  const [topic, setTopic] = useState("Dholavira");
  const [difficulty, setDifficulty] = useState("Medium");
  const [questionCount, setQuestionCount] = useState(5);

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Generate AI Quiz
  async function generateQuiz() {
    setLoading(true);
    setError("");
    setQuiz(null);
    setResult(null);
    setAnswers({});

    try {
      const { data } = await api.post("/ai/quiz", {
        topic,
        difficulty,
        questionCount: Number(questionCount),
      });

      setQuiz(data);
    } catch (error) {
      console.error("AI Quiz Error:", error);

      setError(
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Failed to generate AI quiz"
      );
    } finally {
      setLoading(false);
    }
  }

  // Select answer
  function selectAnswer(questionIndex, optionIndex) {
    if (result) return;

    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  }

  // Submit quiz
  function submitQuiz() {
    let correct = 0;

    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctIndex) {
        correct++;
      }
    });

    const total = quiz.questions.length;

    const scorePct = Math.round((correct / total) * 100);

    const xpEarned = Math.round(
      (correct / total) * quiz.xpReward
    );

    setResult({
      correct,
      total,
      scorePct,
      xpEarned,
    });
  }

  // Generate another quiz
  function resetQuiz() {
    setQuiz(null);
    setResult(null);
    setAnswers({});
    setError("");
  }

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* HEADER */}

        <h1 className="font-display text-3xl font-bold text-dharo-gold text-center">
          QUIZ ARENA
        </h1>

        <p className="text-center text-dharo-muted mt-1">
          Test what you've learned about Bharat's heritage.
        </p>


        {/* =========================
            AI QUIZ GENERATOR
        ========================== */}

        {!quiz && (
          <div className="panel p-6 mt-8">

            <h2 className="font-display text-xl font-bold text-dharo-text">
              ✨ AI Quiz Generator
            </h2>

            <p className="text-dharo-muted text-sm mt-1">
              Choose a topic and let AI generate a fresh quiz.
            </p>


            {/* TOPIC */}

            <div className="mt-6">

              <label className="block text-sm font-semibold text-dharo-text mb-2">
                Choose Topic
              </label>

              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full rounded-xl border border-dharo-border bg-dharo-panel px-4 py-3 text-dharo-text"
              >
                <option value="Dholavira">
                  Dholavira
                </option>

                <option value="Harappan Civilization">
                  Harappan Civilization
                </option>

                <option value="Hampi">
                  Hampi
                </option>

                <option value="Taj Mahal">
                  Taj Mahal
                </option>

                <option value="Ajanta Caves">
                  Ajanta Caves
                </option>

                <option value="Konark Sun Temple">
                  Konark Sun Temple
                </option>

                <option value="Sanchi Stupa">
                  Sanchi Stupa
                </option>

                <option value="Nalanda">
                  Nalanda
                </option>

                <option value="Indian Heritage">
                  Indian Heritage
                </option>
              </select>

            </div>


            {/* DIFFICULTY */}

            <div className="mt-5">

              <label className="block text-sm font-semibold text-dharo-text mb-2">
                Difficulty
              </label>

              <div className="grid grid-cols-3 gap-3">

                {["Easy", "Medium", "Hard"].map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    className={`rounded-xl border px-4 py-3 font-semibold transition ${difficulty === level
                        ? "border-dharo-gold bg-dharo-gold/10 text-dharo-gold"
                        : "border-dharo-border text-dharo-text hover:border-dharo-gold/40"
                      }`}
                  >
                    {level}
                  </button>
                ))}

              </div>

            </div>


            {/* QUESTION COUNT */}

            <div className="mt-5">

              <label className="block text-sm font-semibold text-dharo-text mb-2">
                Number of Questions
              </label>

              <select
                value={questionCount}
                onChange={(e) =>
                  setQuestionCount(Number(e.target.value))
                }
                className="w-full rounded-xl border border-dharo-border bg-dharo-panel px-4 py-3 text-dharo-text"
              >
                <option value={5}>5 Questions</option>
                <option value={10}>10 Questions</option>
                <option value={15}>15 Questions</option>
                <option value={20}>20 Questions</option>
              </select>

            </div>


            {/* ERROR */}

            {error && (
              <div className="mt-5 rounded-xl border border-red-500/40 bg-red-500/5 p-4 text-red-400">
                {error}
              </div>
            )}


            {/* GENERATE BUTTON */}

            <button
              onClick={generateQuiz}
              disabled={loading}
              className="gold-btn w-full py-3 mt-6"
            >
              {loading
                ? "✨ Generating AI Quiz..."
                : "✨ Generate AI Quiz"}
            </button>

          </div>
        )}


        {/* =========================
            GENERATED QUIZ
        ========================== */}

        {quiz && !result && (
          <div className="mt-8">

            <div className="text-center">

              <h2 className="font-display text-2xl font-bold text-dharo-gold">
                {quiz.title}
              </h2>

              <p className="text-dharo-muted mt-2">
                {quiz.description}
              </p>

              <p className="text-sm text-dharo-muted mt-2">
                {quiz.difficulty} · +{quiz.xpReward} XP
              </p>

            </div>


            <div className="space-y-5 mt-8">

              {quiz.questions.map((question, questionIndex) => (

                <div
                  key={questionIndex}
                  className="panel p-5"
                >

                  <p className="font-semibold text-dharo-text">
                    {questionIndex + 1}.{" "}
                    {question.prompt}
                  </p>


                  <div className="space-y-2 mt-4">

                    {question.options.map(
                      (option, optionIndex) => (

                        <button
                          key={optionIndex}
                          onClick={() =>
                            selectAnswer(
                              questionIndex,
                              optionIndex
                            )
                          }
                          className={`w-full text-left px-4 py-3 rounded-xl border transition ${answers[questionIndex] === optionIndex
                              ? "border-dharo-gold bg-dharo-gold/10"
                              : "border-dharo-border hover:border-dharo-gold/40"
                            }`}
                        >

                          <span className="font-semibold mr-2">
                            {String.fromCharCode(
                              65 + optionIndex
                            )}.
                          </span>

                          {option}

                        </button>

                      )
                    )}

                  </div>

                </div>

              ))}

            </div>


            {/* SUBMIT */}

            <button
              onClick={submitQuiz}
              disabled={
                Object.keys(answers).length !==
                quiz.questions.length
              }
              className="gold-btn w-full py-3 mt-6"
            >
              Submit Answers
            </button>


            <button
              onClick={resetQuiz}
              className="w-full py-3 mt-3 rounded-xl border border-dharo-border text-dharo-muted hover:text-dharo-text"
            >
              ← Generate Another Quiz
            </button>

          </div>
        )}


        {/* =========================
            RESULT
        ========================== */}

        {result && (
          <div className="mt-8">

            <div className="panel p-8 text-center">

              <div className="text-5xl">
                {result.scorePct >= 60
                  ? "🎉"
                  : "📚"}
              </div>

              <h2 className="font-display text-2xl font-bold text-dharo-gold mt-3">
                {result.correct}/{result.total} Correct
              </h2>

              <p className="text-dharo-text mt-1">
                Score: {result.scorePct}%
              </p>

              <p className="text-dharo-text mt-1">
                +{result.xpEarned} XP earned
              </p>

            </div>


            {/* REVIEW */}

            <div className="space-y-4 mt-6">

              {quiz.questions.map(
                (question, index) => {

                  const selected = answers[index];

                  const correct =
                    selected === question.correctIndex;

                  return (
                    <div
                      key={index}
                      className={`panel p-5 border ${correct
                          ? "border-emerald-500/40"
                          : "border-red-500/40"
                        }`}
                    >

                      <p
                        className={
                          correct
                            ? "text-emerald-400 font-semibold"
                            : "text-red-400 font-semibold"
                        }
                      >
                        {correct
                          ? "✓ Correct"
                          : "✕ Incorrect"}
                      </p>


                      <p className="text-dharo-text mt-2 font-semibold">
                        {index + 1}.{" "}
                        {question.prompt}
                      </p>


                      <p className="text-dharo-muted text-sm mt-2">
                        Correct answer:{" "}
                        {question.options[
                          question.correctIndex
                        ]}
                      </p>


                      <p className="text-dharo-muted text-sm mt-2">
                        {question.explanation}
                      </p>

                    </div>
                  );
                }
              )}

            </div>


            <button
              onClick={resetQuiz}
              className="gold-btn w-full py-3 mt-6"
            >
              ✨ Generate Another Quiz
            </button>

          </div>
        )}

      </div>
    </main>
  );
}