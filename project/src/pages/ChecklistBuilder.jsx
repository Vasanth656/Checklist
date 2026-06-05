import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Save,
  ClipboardList,
} from "lucide-react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import API from "../config/api";
import axios from "axios";

export default function TemplateBuilder() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [templateName, setTemplateName] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);

  const navigate = useNavigate();

  // ---------------- LOAD FOR EDIT ----------------
  useEffect(() => {
    if (id) {
      fetch(
        `http://localhost:5000/api/templates/${id}`
      )
        .then((res) => res.json())
        .then((data) => {
          setTemplateName(data.templateName);
          setDescription(data.description);
          setQuestions(data.questions || []);
        });
    } else {
      setQuestions([
        {
          id: Date.now(),
          question: "",
          type: "text",
          required: false,
          options: [],
        },
      ]);
    }
  }, [id]);

  // ---------------- QUESTION ACTIONS ----------------
  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: Date.now(),
        question: "",
        type: "text",
        required: false,
        options: [],
      },
    ]);
  };

  const updateQuestion = (qid, field, value) => {
    setQuestions(
      questions.map((q) =>
        q.id === qid ? { ...q, [field]: value } : q
      )
    );
  };

  const deleteQuestion = (qid) => {
    setQuestions(
      questions.filter((q) => q.id !== qid)
    );
  };

  // ---------------- OPTIONS ----------------
  const addOption = (qid) => {
    setQuestions(
      questions.map((q) =>
        q.id === qid
          ? {
            ...q,
            options: [...q.options, ""],
          }
          : q
      )
    );
  };

  const updateOption = (qid, idx, value) => {
    setQuestions(
      questions.map((q) =>
        q.id === qid
          ? {
            ...q,
            options: q.options.map((o, i) =>
              i === idx ? value : o
            ),
          }
          : q
      )
    );
  };

  const removeOption = (qid, idx) => {
    setQuestions(
      questions.map((q) =>
        q.id === qid
          ? {
            ...q,
            options: q.options.filter(
              (_, i) => i !== idx
            ),
          }
          : q
      )
    );
  };

  // ---------------- SAVE ----------------
  const saveTemplate = async () => {
    const payload = {
      templateName,
      description,
      questions,
    };

    const url = id
      ? `${API?.updateTemplate}/${id}`
      : API?.addTemplate;

    if (id) {
      await axios.put(url, payload);
    } else {
      await axios.post(url, payload);
    }

    navigate("/checklist");
  };

  // ---------------- UI ----------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">

      {/* HEADER */}
      <div className="bg-white/70 backdrop-blur-md border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center gap-3">
          <ClipboardList className="text-purple-600" />
          <h1 className="text-2xl font-bold text-purple-700">
            Template Builder
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6">

        {/* TEMPLATE INFO */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100">
          <h2 className="text-xl font-bold text-purple-700 mb-4">
            Template Information
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              value={templateName}
              onChange={(e) =>
                setTemplateName(e.target.value)
              }
              placeholder="Template Name"
              className="p-3 rounded-xl border focus:ring-2 focus:ring-purple-400 outline-none"
            />

            <input
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="Description"
              className="p-3 rounded-xl border focus:ring-2 focus:ring-purple-400 outline-none"
            />
          </div>
        </div>

        {/* QUESTIONS HEADER */}
        <div className="flex justify-between items-center mt-8 mb-4">
          <h2 className="text-2xl font-bold text-purple-700">
            Questions
          </h2>

          <button
            onClick={addQuestion}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 py-3 rounded-xl shadow-lg hover:scale-105 transition"
          >
            <Plus className="inline mr-1" size={18} />
            Add Question
          </button>
        </div>

        {/* QUESTIONS */}
        <div className="space-y-6">
          {questions.map((q, index) => (
            <div
              key={q.id}
              className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100"
            >

              {/* HEADER */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-purple-600">
                  Question {index + 1}
                </h3>

                <button
                  onClick={() =>
                    deleteQuestion(q.id)
                  }
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 />
                </button>
              </div>

              {/* QUESTION INPUT */}
              <input
                value={q.question}
                onChange={(e) =>
                  updateQuestion(
                    q.id,
                    "question",
                    e.target.value
                  )
                }
                placeholder="Enter question"
                className="w-full p-3 border rounded-xl mb-3"
              />

              {/* TYPE */}
              <select
                value={q.type}
                onChange={(e) =>
                  updateQuestion(
                    q.id,
                    "type",
                    e.target.value
                  )
                }
                className="w-full p-3 border rounded-xl"
              >
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="dropdown">Dropdown</option>
                <option value="checkbox">Checkbox</option>
                <option value="date">Date</option>
              </select>

              {/* REQUIRED */}
              <div className="mt-3 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={q.required}
                  onChange={(e) =>
                    updateQuestion(
                      q.id,
                      "required",
                      e.target.checked
                    )
                  }
                />
                <span>Required</span>
              </div>

              {/* OPTIONS */}
              {(q.type === "dropdown" ||
                q.type === "checkbox") && (
                  <div className="mt-4 border-t pt-4">
                    <button
                      onClick={() => addOption(q.id)}
                      className="text-sm bg-blue-500 text-white px-3 py-2 rounded-lg"
                    >
                      + Add Option
                    </button>

                    {q.options.map((opt, i) => (
                      <div
                        key={i}
                        className="flex gap-2 mt-2"
                      >
                        <input
                          value={opt}
                          onChange={(e) =>
                            updateOption(
                              q.id,
                              i,
                              e.target.value
                            )
                          }
                          className="flex-1 p-2 border rounded-lg"
                        />

                        <button
                          onClick={() =>
                            removeOption(q.id, i)
                          }
                          className="text-red-500"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          ))}
        </div>

        {/* SAVE */}
        <div className="flex justify-end mt-10">
          <button
            onClick={saveTemplate}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-xl shadow-xl hover:scale-105 transition font-semibold"
          >
            <Save className="inline mr-2" size={18} />
            {id ? "Update Template" : "Save Template"}
          </button>
        </div>
      </div>
    </div>
  );
}