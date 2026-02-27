# 🚀 Job Tracker — Full Stack Web Application

A full-stack Job Application Tracker built with **ASP.NET Core Web API (.NET 6)** and **Vanilla JavaScript**.

The application allows users to manage job applications through a clean and responsive interface, demonstrating REST API integration, CRUD operations, and frontend–backend communication.

---

## 📸 Preview

> (Add screenshots later)
- Application dashboard
- Create / Edit modal
- Filtering & search

---

## ✨ Features

✅ Create job applications  
✅ Edit existing applications  
✅ Delete applications  
✅ Filter by status  
✅ Search by company or position  
✅ Responsive UI  
✅ RESTful API integration  
✅ Live frontend deployment via GitHub Pages  

---

## 🧱 Tech Stack

### Backend
- ASP.NET Core Web API (.NET 6)
- REST API
- Swagger
- In-Memory data storage
- CORS configuration

### Frontend
- HTML5
- CSS3
- Vanilla JavaScript (ES6)
- Fetch API
- DOM manipulation

### Deployment
- Frontend: **GitHub Pages**
- Backend: **Render**

---

## 🏗 Architecture
Frontend (GitHub Pages)
↓
Fetch API requests
↓
ASP.NET Core Web API
↓
InMemory Data Store


The project follows a simple layered approach:

- Controller → API endpoints
- Models / DTOs → data contracts
- Service logic inside API
- Frontend consumes REST endpoints

---

## 📂 Project Structure

The project follows a simple layered approach:

- Controller → API endpoints
- Models / DTOs → data contracts
- Service logic inside API
- Frontend consumes REST endpoints

---

## 📂 Project Structure
JobTracker/
│
├── backend/
│ └── JobTracker.Api/
│
├── docs/ # GitHub Pages frontend
│ ├── index.html
│ ├── style.css
│ └── app.js
│
└── README.md


---

## 🎯 Learning Goals

This project demonstrates:

- Building REST APIs with ASP.NET Core
- Frontend ↔ Backend communication
- CRUD operations
- State handling in Vanilla JS
- Basic application architecture
- Deployment of full-stack applications

---

## 🔮 Future Improvements

- SQLite / Entity Framework Core
- Authentication (JWT)
- DTO separation
- Service layer abstraction
- Pagination
- Dark/light theme toggle

---

## 👨‍💻 Author

Created as a portfolio project for a **Junior Frontend Developer** position.
