# rudtechproject

A full-stack real-time application using React + TypeScript (Vite), Node.js (Express), Socket.io, JWT Auth, and MongoDB, fully Dockerized with CI/CD via GitHub Actions.

## Project Structure

rudtechproject/
├── backendrud/ # Node.js + Express + Socket.io 
├── frontend/ # React + TypeScript (Vite)
├── docker-compose.yml # Docker multi-service config
└── .github/
└── workflows/
└── ci-cd.yml # GitHub Actions workflow

## Run Without Docker (Dev Mode)

cd backendrud
npm install
npm run dev

## Frontend

cd frontend
npm install
npm run dev

## URl

    Backend: http://localhost:5000
    Frontend: http://localhost:5173

## Tech Stack

     Frontend: React, TypeScript, Vite

    Backend: Node.js, Express, Socket.io,
    Database: MongoDB

    Auth: JWT Token

    WebSockets: Binary socket transactions + encryption/decryption

    CI/CD: GitHub Actions

    Containers: Docker, Docker Compose

## Features

    JWT-based Sign Up / Login

    Protected API to get current user

    Rate limiting with Redis (10 req/min)

    Global WebSocket connection validation

    Encrypted binary socket events

    Dockerized services

    GitHub Actions for CI/CD

    Set Environment Variables

## backendrud/.env

    PORT=5000
    JWT_SECRET=your_secret_key
    MONGO_URI=mongodb://mongo:27017/rudtechdb
    REDIS_URL=redis://redis:6379

## Build and run the full stack using Docker Compose:

    docker-compose up --build
