# Base image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Copy requirements
COPY requirements.txt .

# Install dependencies
# Added --no-cache-dir to keep image small
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY . .

# Expose port
EXPOSE 8000

# Start command
# Assuming main.py has `app` instance. Host 0.0.0.0 is crucial for docker networking.
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
