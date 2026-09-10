"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import api from "../../lib/api";
import { getStoredUser, saveSession, getToken } from "../../lib/auth";

export default function QuizPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [active, setActive] = useState(null); // full playable quiz
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/quiz").then(({ data }) => setQuizzes(data));
  }, []);

  async function startQuiz(quizId) {
    setResult(null);
    setAnswers({});
    const { data } = await api.get(`/quiz/${quizId}/play`);
    setActive(data);
  }

  function selectAnswer(questionId, index) {
    setAnswers((prev) => ({ ...prev, [questionId]: index }));
  }

  async function submitQuiz() {
    setLoading(true);
    try {
      const payload = {
        answers: Object.entries(answers).map(([questionId, selectedIndex]) => ({ questionId, selectedIndex })),
      };
      const { data } = await api.post(`/quiz/${active._id}/submit`, payload);
      setResult(data);
      const user = getStoredUser();
      if (user) {
        user.xp += data.xpEarned;
        user.level = data.newLevel;
        saveSession(getToken(), user);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        {!active && (
          <>
            <h1 className="font-display text-3xl font-bold text-dharo-gold text-center">QUIZ ARENA</h1>
            <p className="text-center text-dharo-muted mt-1">Test what you've learned about Bharat's heritage.</p>

            <div className="space-y-4 mt-8">
              {quizzes.map((q) => (
                <div key={q._id} className="panel p-5 flex items-center justify-between">
                  <div>
                    <p className="font-display font-bold text-dharo-text">{q.title}</p>
                    <p className="text-dharo-muted text-sm mt-0.5">
                      {q.questionCount} questions · {q.difficulty} · +{q.xpReward} XP
                    </p>
                  </div>
                  <button onClick={() => startQuiz(q._id)} className="gold-btn px-5 py-2">
                    Play
                  </button>
                </div>
              ))}
              {quizzes.length === 0 && (
                <p className="text-center text-dharo-muted">No quizzes yet — seed the database to add some!</p>
              )}
            </div>
          </>
        )}

        {active && !result && (
          <div>
            <h2 className="font-display text-2xl font-bold text-dharo-gold text-center">{active.title}</h2>
            <div className="space-y-6 mt-6">
              {active.questions.map((q, i) => (
                <div key={q._id} className="panel p-5">
                  <p className="font-semibold text-dharo-text">{i + 1}. {q.prompt}</p>
                  <div className="space-y-2 mt-3">
                    {q.options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => selectAnswer(q._id, idx)}
                        className={`w-full text-left px-4 py-2 rounded-lg border transition ${
                          answers[q._id] === idx
                            ? "border-dharo-gold bg-dharo-gold/10"
                            : "border-dharo-border hover:border-dharo-gold/40"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={submitQuiz}
              disabled={loading || Object.keys(answers).length < active.questions.length}
              className="gold-btn w-full py-3 mt-6"
            >
              {loading ? "Submitting…" : "Submit Answers"}
            </button>
          </div>
        )}

        {result && (
          <div className="panel p-8 text-center mt-6">
            <div className="text-4xl">{result.scorePct >= 60 ? "🎉" : "📚"}</div>
            <h2 className="font-display text-2xl font-bold text-dharo-gold mt-2">
              {result.correctCount}/{result.total} Correct ({result.scorePct}%)
            </h2>
            <p className="text-dharo-text mt-1">+{result.xpEarned} XP earned · Level {result.newLevel}</p>

            <div className="text-left mt-6 space-y-3">
              {result.results.map((r) => (
                <div key={r.questionId} className={`p-3 rounded-lg border text-sm ${r.correct ? "border-emerald-500/40 bg-emerald-500/5" : "border-red-500/40 bg-red-500/5"}`}>
                  <p className={r.correct ? "text-emerald-400" : "text-red-400"}>{r.correct ? "Correct" : "Incorrect"}</p>
                  <p className="text-dharo-muted mt-1">{r.explanation}</p>
                </div>
              ))}
            </div>

            <button onClick={() => { setActive(null); setResult(null); }} className="gold-btn px-6 py-2.5 mt-6">
              Back to Quizzes
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
