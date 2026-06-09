\# NoteVault API



A secure and scalable Notes Management REST API built with Node.js, Express.js, MongoDB, and JWT Authentication.



\## Features



\* User Registration

\* User Login

\* Email Verification using Nodemailer

\* JWT Authentication

\* Access Token \& Refresh Token

\* Session Management

\* Create Notes

\* Get All Notes

\* Get Single Note

\* Update Notes

\* Delete Notes

\* Delete All Notes

\* Pin / Unpin Notes

\* Search Notes using Keywords

\* Pagination

\* Request Validation

\* Protected Routes

\* MongoDB Database Integration



\## Tech Stack



\* Node.js

\* Express.js

\* MongoDB

\* Mongoose

\* JWT

\* Nodemailer

\* Yup Validation



\## API Endpoints



\### Authentication



```http

POST /user/register

POST /user/login

POST /user/logout

POST /user/refresh-token

GET /user/verify-email/:token

```



\### Notes



```http

POST /note/create

GET /note/get-all

GET /note/get-single/:id

PATCH /note/update/:id

DELETE /note/delete/:id

DELETE /note/delete-all

PATCH /note/pin/:id

GET /note/search?keyword=value

```



\## Installation



```bash

git clone <repository-url>



cd NoteVault-API



npm install



npm run dev

```



\## Environment Variables



Create a `.env` file in the root directory:



```env

PORT=5000



MONGO\_URI=your\_mongodb\_connection\_string



SECRET\_KEY=your\_jwt\_secret



EMAIL=your\_email



PASS=your\_email\_app\_password

```



\## Future Improvements



\* File Uploads with Multer

\* Cloud Storage Integration

\* Note Categories

\* Advanced Filtering

\* Soft Delete Functionality



\## Author



Siddhartha Banerjee



Electronics and Communication Engineering Student



Frontend \& Backend Developer



