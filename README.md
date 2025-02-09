---

# Introduction:

This is a basic project to help you get started with Serverless.

# Technologies Used:

React+Vite, AWS API Gateway, AWS Lambda, AWS DynamoDB.

# Installation Guide:

### DynamoDB:

Create a new table with the primary key **"orderID"**.

### Lambda:

Create a new **Lambda function** and configure the necessary permissions to allow logging and read/write access to **DynamoDB**. 

> ⚠ However, in a real-world scenario, it is recommended to grant only the necessary permissions instead of full access.

<p align="center">
  <img src="./src/assets/permission.png" alt="Permission" width="80%" />
</p>

Upload the **function.zip** file (already included in the source) to the Lambda function. Once uploaded, your Lambda function is ready to use.

### API Gateway:

Create a new **API Gateway**, add a resource **/orders**, and set up a **POST** method.

<p align="center">
  <img src="./src/assets/API Gateway.png" alt="API Gateway" width="80%" />
</p>

Open the **Home.jsx** file located in **src/Component**, then replace the endpoint (the **Invoke URL** found in the API Gateway's **Stages** section) with your own:

<p align="center">
  <img src="./src/assets/InvokeURL.png" alt="Invoke URL" width="80%" />
</p>
<p align="center">
  <img src="./src/assets/pic1.jpg" alt="Code Example" width="80%" />
</p>

### Start the Web Project:

Navigate to the project directory and install dependencies by running:

```sh
npm install
```

Then, start the development server:

```sh
npm run dev
```

If everything is set up correctly, you should see the web interface, and you can start using its features:

<p align="center">
  <img src="./src/assets/demo1.png" alt="Demo Screenshot 1" width="80%" />
</p>
<p align="center">
  <img src="./src/assets/demo2.png" alt="Demo Screenshot 2" width="80%" />
</p>

After testing the functionality, check whether the data has been successfully stored in **DynamoDB**:

<p align="center">
  <img src="./src/assets/demo3.png" alt="DynamoDB Screenshot" width="80%" />
</p>

---
