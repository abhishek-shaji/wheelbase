#!/bin/bash
# Activate virtual environment and run the app
source .venv/bin/activate
uvicorn app.main:app --reload 