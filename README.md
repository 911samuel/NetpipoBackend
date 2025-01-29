# NETPIPO BACKEND 👋

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000)
![Documentation](https://img.shields.io/badge/documentation-yes-brightgreen.svg)
![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)
[![Twitter: AbayizeraSam](https://img.shields.io/twitter/follow/AbayizeraSam.svg?style=social)](https://twitter.com/AbayizeraSam)
[![Coverage](https://codecov.io/gh/911samuel/my-express-app/graph/badge.svg?token=DESP42A6WI)](https://codecov.io/gh/911samuel/my-express-app)

## 🚀 About the Project

Netpipo Backend is a RESTful API for managing employees within a company. It supports **CRUD operations**, **authentication**, and follows **Object-Oriented Programming (OOP) principles**. The API is built with **Node.js, Express, MongoDB, TypeScript**, and includes JWT authentication for security.

## 🛠 Features
- **Employee Management** (Create, Read, Update, Delete employees)
- **JWT Authentication** for secure API access
- **Role-based Authorization** (Admin & Employee roles)
- **MongoDB Database** integration with Mongoose
- **Unit Tests** for core functionalities
- **Swagger API Documentation** (Bonus)

---

## 🔧 Installation

### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/911samuel/NetpipoBackend.git
cd NetpipoBackend
```

### **2️⃣ Install Dependencies**
```sh
npm install
```

### **3️⃣ Set Up Environment Variables**
Create a `.env` file in the root directory and add the following:
```sh
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### **4️⃣ Run the Application**
```sh
npm run start
```

For development with **Nodemon**:
```sh
npm run dev
```

---

## 📌 API Endpoints
### **Authentication**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/employees/signUp` | Register a new employee |
| `POST` | `/employees/signIn` | Authenticate and get a JWT token |

### **Employee Management**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/employees/all` | Get all registered employees |
| `GET` | `/employees/single/:id` | Get an employee by ID |
| `PUT` | `/employees/update/:id` | Update an employee (Authenticated only) |
| `DELETE` | `/employees/delete/:id` | Delete an employee (Authenticated only) |
| `DELETE` | `/employees/deleteAll` | Delete all employees (Authenticated only) |

---

## 🛠 Running Tests
To run unit tests, execute:
```sh
npm run test
```

---

## 🚀 Deployment
### **Deploy to Render, Railway, or DigitalOcean**
- Ensure environment variables are correctly set.
- Use **PM2** for process management:
```sh
npm install -g pm2
npm run build
npm start
```
- Deploy using **Docker**:
```sh
docker build -t netpipo-backend .
docker run -p 5000:5000 netpipo-backend
```

---

## 📝 License
This project is licensed under the **ISC License**.

---

## 👤 Author

👤 **Abayizera Samuel**
- 🌐 Website: **ABAYIZERA Samuel**
- 🐦 Twitter: [@AbayizeraSam](https://twitter.com/AbayizeraSam)
- 💻 Github: [@911samuel](https://github.com/911samuel)
- 🔗 LinkedIn: [@abayizera-samuel](https://linkedin.com/in/abayizera-samuel)

---

## 🎯 Contribution
Contributions, issues, and feature requests are welcome!

1. Fork the repo
2. Create a new branch (`git checkout -b feature-branch`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature-branch`)
5. Open a Pull Request

---

## ⭐ Show Your Support
Give a ⭐ if you like this project!

