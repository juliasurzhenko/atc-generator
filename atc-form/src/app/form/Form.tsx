import React, { useState } from "react";
import DynamicInput from "../../components/shared/input/DynamicInput.tsx";

const questions = [
  { id: 1, type: "text", question: "What is your name?" },
  { id: 2, type: "number", question: "How old are you?" },
  { id: 3, type: "select", question: "What is your favorite color?", options: ["Red", "Green", "Blue"] },
];

const Form = () => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    questions.forEach((q) => {
      const fieldName = `question_${q.id}`;
      if (!formData[fieldName] || formData[fieldName].trim() === "") {
        newErrors[fieldName] = `${q.question} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form submitted successfully:", formData);
    } else {
      console.log("Validation errors:", errors);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">Dynamic Form</h2>
      {questions.map((q) => (
        <div key={q.id} className="mb-4">
          <DynamicInput
            type={q.type}
            question={q.question}
            options={q.options}
            name={`question_${q.id}`}
            value={formData[`question_${q.id}`] || ""}
            onChange={handleChange}
          />
          {errors[`question_${q.id}`] && (
            <p className="text-red-500 text-sm mt-1">{errors[`question_${q.id}`]}</p>
          )}
        </div>
      ))}
      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Submit
      </button>
    </form>
  );
};

export default Form;
