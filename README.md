📦 Karibu Groceries API

A fully functional RESTful API built with Node.js, Express, and MongoDB for managing procurement and sales operations at Karibu Groceries Ltd.

🚀 Project Overview

Karibu Groceries Ltd is a wholesale produce distributor with two branches:

Maganjo
Matugga
This system digitizes procurement, cash sales, credit sales, and staff management using a modular 3-router architecture.


🏗️ Architecture
The application follows a clean modular structure:


src/

├── config/

├── models/

├── routes/

├── middleware/

├── swagger/

└── app.js

🔹 Routers Implemented

/procurement – Records produce purchased (Managers only)

/sales – Handles Cash and Credit Sales (Sales Agents only)

/users – User management & Login

🛠️ Technologies Used

Node.js
Express.js
MongoDB
Mongoose
Swagger (swagger-jsdoc & swagger-ui-express)
dotenv

⚙️ Installation & Setup

1️⃣ Clone the Repository

git clone https://github.com/mazinahmed2010/KGL-Backend-API.git

cd karibu-groceries-api

2️⃣ Install Dependencies


npm install


3️⃣ Create Environment File

Create a .env file using the provided .env.example


PORT=3000
NODE_ENV=development
DATABASE_URI=mongodb://localhost:27017/karibu_groceries_db
JWT_SECRET=your_jwt_secret_here

4️⃣ Run the Server

Development mode:

npm run dev

Production mode:


npm start

Server runs on:


http://localhost:3000


📚 API Documentation
Swagger documentation is available at:
Copy code

http://localhost:3000/api-docs
The documentation includes:

Request body format

Parameters

Response status codes

Endpoint descriptions

🔐 Authentication & Authorization

Login Endpoint

Copy code

POST /users/login

Returns 200 if user exists

Returns 401 if credentials are invalid

Role-Based Access

Manager → Can record Procurement

Sales Agent → Can record Sales
Role is validated using middleware.

📌 Functional Modules

1️⃣ Procurement (/procurement)

Managers record:

Produce name

Type

Date & Time

Tonnage

Cost

Dealer details

Branch

Contact

Selling price


2️⃣ Sales (/sales)

Cash Sale

POST /sales/cash

Credit Sale

POST /sales/credit

Includes:

Buyer details

Amount paid / due

Produce info

Dates

Sales agent

3️⃣ Users (/users)

Create User

Login

Role assignment (Manager / Sales Agent)



👨‍💻 Author

Mazin Ahmed Ibrahim

mazin.ahmed.i.m@gmail.com


