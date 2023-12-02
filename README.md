Survey API Solution with Express

This repository contains a robust survey API solution built with Express, integrating JWT-based basic authentication, role-based access control, and seamless MySQL database interaction.
Features

    JWT-Based Authentication: Secure communication is ensured through JSON Web Tokens (JWT), providing a reliable authentication mechanism.

    Role-Based Access Control (RBAC): Administrators and enumerators have distinct roles, allowing precise control over API endpoints and operations based on user roles.

    Database Interaction with MySQL: Leveraging the mysql2/promise library ensures asynchronous interactions with the MySQL database.

    Dynamic Assignment and Control Distribution: Enumerators can dynamically request survey assignments and geographical information through API calls, facilitating efficient data collection.

Libraries Used

    Express: A fast, unopinionated, minimalist web framework for Node.js.

    MySQL2: A promise-based MySQL library for Node.js, enabling seamless database interactions.

    Bcrypt: A library for securely hashing passwords, enhancing user data protection.

    JSON Web Tokens (JWT): Used for secure authentication and information exchange between parties.

Setup

    Clone the repository: git clone [repository_link]
    Install dependencies: npm install
    Set up your MySQL database and update dbConfig in the code with your database credentials.
    Create a .env file and define ACCESS_TOKEN_SECRET for JWT token generation.

Usage

    Run the server: npm start
    Access the API at http://localhost:3000

Endpoints

    POST /api/login: Authenticate users and generate JWT tokens.

    GET /api/user/:username: Retrieve user information (authenticated).

    GET /api/assignment: Retrieve assignments for enumerators (authenticated).

    POST /register: Register new users (admin only, authenticated).

Contributions

Contributions are welcome! Feel free to open issues or submit pull requests.
License

This project is licensed under the MIT License.
