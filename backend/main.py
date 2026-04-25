from pyexpat import features

import pandas as pd
import numpy as np
from fastapi import FastAPI
from pydantic import BaseModel,Field
import joblib
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()

origins = [
    "http://localhost:3000",
    "https://your-frontend.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

model_path = os.path.join("model","Salary_model.pkl")
model = joblib.load(model_path) 


class SalaryInput(BaseModel):
    age:int
    gender:str
    education_level:str
    job_title:str
    year_of_experience:int

@app.get("/")
def home():
    return {"message": "Salary Prediction API Running"}

@app.post("/predict")
def predict_salary(data:SalaryInput):
    try:
        input_dict = {
        "Age": data.age,
        "Gender": data.gender,
        "Education Level": data.education_level,
        "Job Title": data.job_title,
        "Years of Experience": data.year_of_experience
        }

        df = pd.DataFrame([input_dict])

        prediction = model.predict(df)
        return {"predicted_salary": float(prediction[0])}
    except Exception as e:
        return {"error": str(e)}
    



data_path = os.path.join("data.csv")
df = pd.read_csv(data_path)


education_levels = sorted(df['Education Level'].dropna().unique().tolist())
job_titles = sorted(df['Job Title'].dropna().unique().tolist())

@app.get("/options")
def get_options():
    return {
        "education_levels": education_levels,
        "job_titles": job_titles
    }