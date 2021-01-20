# Divvy Homework Assignment

I developed a simple crud application. All of my work can be viewed in the webserver directory. I used this application starter code as I am most familiar with Express and MongoDB.

## Challenges

I am new to GraphQL so this proved to be the most difficult part of the assignment. Using documentation and some online tutorials I was able to figure how to use the Apollo library to provide a client to my express application for GraphQL queries and resolvers.

## React

I did not use create-react-app. The React application was created from scratch and all configurations including webpack were writtent from scratch as well.

## Features

The application has a full user authentication system using bcryptjs and jsonwebtoken. A user can register and log in using the app. There are form validations. Try submitting a form without filling in the required fields. You can also try submitting an incorrect password or username.

Transactions can only be viewed and created/edited by a user who is logged in. Transactions are specific to that user. Each user will view their own transactions.

## env file

Please add the env file to the webserver/backend directory. This provides the MONGODB_URL environment variable as the application uses MONGODB_ATLAS and not a local version of MONGODB. There is already one user created that can be used for testing purposes: (username: user@email.com, password: password)

## Bugs

Refreshing the homepage (localhost:8000) works just fine however refreshing the page on any of the other routes results in an error. I believe this is due to using react-router-dom in conjunction with Apollo provider. I am still working on this bug. The application does however function correctly when the links are clicked and used as expected.


