<!-- INTRO -->
<br/>
<h1 align="center">Local Shoppers</h1>
<p align="center">Online Store for locals, by locals</p>

<p align="center">Local Shoppers is an e-commerce website for users to buy daily household products from the local vendors</p>

<!-- TABLE OF CONTENTS -->
<br/>

## Table of Contents

1. [Demo](#demo)
2. [Installation](#installation)
3. [Technology Stack](#technology-stack)
4. [Authors](#authors)

<br/>

## Demo

[Live Demo](https://local-shoppers-backend-dev.herokuapp.com/api/v1/hello)

<br/>

## Installation

1. Clone the repo

   ```sh
   git clone https://github.com/zuber-shekh7/local_shopers_backend local_shopers_backend
   ```

2. Create .env file and set follwing enviroment variables.

NODE_ENV=development<br/>
HOST=http://localhost</br>
PORT=4000</br>
SECRET=<br/>
MONGODB_URL=<br/>
GOOGLE_OAUTH_CLIENT_ID=<br/>
AWS_S3_BUCKET_NAME=<br/>
AWS_S3_BUCKET_REGION=<br/>
AWS_ACCESS_KEY=<br/>
AWS_SECRET_KEY=<br/>
SMTP_HOST=<br/>
SMTP_PORT=<br/>
SMTP_USER=<br/>
SMTP_PASS=<br/>
FORGOT_PASSWORD_LINK=<br/>

3. Install NPM packages
   ```sh
   cd local_shopers_backend && yarn
   ```
4. Run
   ```sh
   yarn dev
   ```
5. Open http://localhost:4000 to view it in the browser

6. Run Test cases
   ```sh
   yarn test
   ```
   <br/>

<br/>

## Technology Stack

- [Express](http://expressjs.com/)
- [Mongoose](https://mongoosejs.com/)
- [Nodemailer](https://nodemailer.com/about/)

<br/>

## Authors

- [Zuber Shekh](https://github.com/zuber-shekh7)
- [Shubham Garg](https://github.com/shbhm6496)
