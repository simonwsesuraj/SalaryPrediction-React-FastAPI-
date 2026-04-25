import { useState, useEffect } from 'react'
import './App.css'
import { FaBriefcase } from "react-icons/fa";

function App() {
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [educationLevel, setEducationLevel] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [yearsOfExperience, setYearsOfExperience] = useState('')
  const [salary, setSalary] = useState(null)
  const [loading, setLoading] = useState(false)
  const [educationOptions, setEducationOptions] = useState([])
  const [jobOptions, setJobOptions] = useState([])

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await fetch('https://salaryprediction-react-fastapi.onrender.com/options')
        const data = await res.json()
        setEducationOptions(data.education_levels)
        setJobOptions(data.job_titles)
      } catch (err) {
        console.error("Error loading dropdown data", err)
      }
    }

    fetchOptions()
  }, [])

  const predictSalary = async () => {
    if (!age || !gender || !educationLevel || !jobTitle || !yearsOfExperience) {
      alert("Please fill all fields")
      return
    }

    setLoading(true)

    try {
      const response = await fetch('https://salaryprediction-react-fastapi.onrender.com/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          age: parseInt(age),
          gender,
          education_level: educationLevel,
          job_title: jobTitle,
          year_of_experience: parseInt(yearsOfExperience)
        })
      })

      const data = await response.json()
      setSalary(data.predicted_salary)

    } catch (error) {
      console.error("Error:", error)
    }

    setLoading(false)
  }

  return (
    <div className="app">
      <div className="card">
        <h1 className="title">
          <FaBriefcase className="icon" /> Employee Salary Prediction
        </h1>

        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />

        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
        </select>

        <select value={educationLevel} onChange={(e) => setEducationLevel(e.target.value)}>
          <option value="">Education Level</option>
          {educationOptions.map((edu, i) => (
            <option key={i}>{edu}</option>
          ))}
        </select>

        <select value={jobTitle} onChange={(e) => setJobTitle(e.target.value)}>
          <option value="">Job Title</option>
          {jobOptions.map((job, i) => (
            <option key={i}>{job}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Years of Experience"
          value={yearsOfExperience}
          onChange={(e) => setYearsOfExperience(e.target.value)}
        />

        <button onClick={predictSalary}>
          {loading ? "Predicting..." : "Predict Salary"}
        </button>

        {salary && (
          <div className="result">
            ₹ {salary.toFixed(2)}
          </div>
        )}
      </div>
    </div>
  )
}

export default App