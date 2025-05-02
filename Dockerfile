# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container at /app
COPY ./scripts/requirements.txt /app/

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the script directory into the container at /app/scripts
# (Alternatively, use docker-compose volumes for development)
COPY ./scripts /app/scripts

# Make port 80 available to the world outside this container (if needed later)
# EXPOSE 80

# Define environment variable
# ENV NAME World

# Run script when the container launches (can be overridden by docker-compose)
# CMD ["python", "/app/scripts/ingest.py"] 