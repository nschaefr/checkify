# Checkify
Checkify is a **Full Stack Todo Application**, which enables the user to organise his day by clearly listing **Todos**, ticking them off and dividing them into categories.

### Functionalities

#### Authentication
The user has the option of authenticating themselves with a username and password. When logging in for the first time, the user can choose a username (provided that it is not already taken) and a password (at least 8 digits). If the user is already registered, they must be in possession of the password associated with the username in order to access the account.

#### Working with todos
The user has the option of creating a todo with the corresponding description, editing the todo (click in the todo description), deleting it and marking it as completed. Furthermore, all todos are clearly presented in a list.

#### Categorising todos
The user has the option of categorising his todos in order to create a better overview.

#### Consistent database storage
All activities and data performed by the user are persistent and are stored in a database. 

## Technology stack
- Frontend: ReactJS
- Backend: NodeJS with ExpressJS
- Database: MongoDB

## Installation and use
#### Docker
Change to `root` and execute the following command:
```bash
docker-compose up -d
```

#### Node - npm
Switch to frontend and execute the following command:
```bash
npm install
npm run dev
```

Switch to backend and execute the following command:

```bash
npm install
nodemon index.js
```

The frontend is now accessible via <http://localhost:3000>, while the backend runs via <http://localhost:4040>
