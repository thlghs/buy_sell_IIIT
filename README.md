Buy-Sell Website @ IIITH

Welcome to the Buy-Sell Website designed exclusively for the IIIT Community. This MERN stack application allows all members of IIIT to engage in seamless buying and selling of items within the campus, eliminating the need for third-party platforms and avoiding additional taxes imposed by external services.


Project Structure
```
<buy_sell_IIIT>/
├── backend/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── package-lock.json
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
└── README.md
```


Tech Stack

    Frontend: React.js, Bootstrap, FontAwesome, CSS
    Backend: Node.js, Express.js, MongoDB (Mongoose ODM)
    Authentication: JSON Web Tokens (JWT), bcrypt.js 
    Security: Google reCAPTCHA, CAS Authentication (Bonus)
    Database: local MongoDB instance

Installation & Setup

1. Backend Setup

        cd backend
        npm install            
        npm start             

            The backend runs on http://localhost:5000 
            Ensure MongoDB is running locally 

2. Frontend Setup (Using Vite)

        cd frontend
        npm install           
        npm run dev           

            The frontend runs on http://localhost:5173 by default (Vite’s default port).

3. Environment Variables

        Create a .env file inside the backend/ directory:

        MONGO_URI = <your_mongo_db_connection_string>
        JWT_SECRET = <your_secret_key>
        RECAPTCHA_SECRET_KEY = <your_recaptcha_secret_key>

            Note: Replace placeholders with your actual MongoDB URI, JWT secret, and reCAPTCHA key.



User Roles

    Buyer: Can browse items, add to cart, place orders
    Seller: Can list items for sale, manage orders, and complete a transaction

        Note: A user can act as both Buyer and Seller.

Authentication & Authorization

    Registration: Only IIIT emails are accepted (@iiit.ac.in, @students.iiit.ac.in, @research.iiit.ac.in).
    Password Security: Passwords are hashed using bcrypt.js.
    JWT Authentication: All protected routes require a valid JWT token.
    Session Persistence: User remains logged in until explicitly logged out.
    reCAPTCHA Integration: Protects against bots during login/registration.
    CAS Login: (Bonus) CAS Authentication system for IIIT users.



Features & Use Cases
1️. Dashboard

    Navbar with links to all major pages.
    Dynamic background animation for an engaging user interface.

2️. Profile Page

    Displays user details with an edit option.
    Logout functionality.

3️.  Search Items Page

    Search bar with case-insensitive search.
    Category-based filters (multi-select).
    Displays item details like name, price, seller info.

4️. Item Details Page

    Detailed description of the selected item.
    Add to Cart functionality.

5️. My Cart

    Displays all items added to the cart.
    Option to remove items.
    Shows total cost.
    Final Order button to place orders for all items.

6️. Order History

    Pending Orders: Shows orders with pending OTP confirmation.
    Completed Orders: Displays past transactions.
    Sold Orders: Displays items sold by the user.

7️. Deliver Items Page

    Displays orders received by the seller.
    OTP-based order completion mechanism.

8. Support Chatbot (Bonus)

    Integrated AI-powered chatbot for user support (using Gemini API).
    Real-time chat interface with session-based memory.



Database Models
    User Model
    Order Model
    Items Model
    Chatsessions model  
    Cart Model

Security Measures

    JWT Token-based route protection (both frontend and backend).
    Password hashing using bcrypt.
    Google reCAPTCHA for bot prevention.
    Protected API routes with middleware authentication.

Bonus Features Implemented

     Google reCAPTCHA Integration
    CAS Login System
    Support Chatbot using Gemini API
    Dynamic Background Animations on Dashboard



Author:Tejasvini Ramaswamy
Email: tejasvini.ramaswamy@research.iiit.ac.in
Submission Deadline: 4th February, 2025