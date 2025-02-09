# Giới thiệu:

Đây là một project cơ bản để bạn có thể bắt đầu tìm hiểu về Serverless.

# Công nghệ sử dụng:

React+Vite, AWS API Gateway, AWS Lambda, AWS DynamoDB.

# Hướng dẫn cài đặt:

### DynamoDB:

Tạo mới 1 bảng với primary key "orderID".

### Lambda:

Tạo mới 1 Lambda function, thiết lập các permissions để có thể ghi log và đọc, ghi với DynamoDB (Tuy nhiên trong thực tế, ta sẽ không nên để các permissions là fullaccess mà chỉ chọn lọc những quyền cần dùng ).

<p align="center">
<image src="./src/assets/permission.png" alt ="Permission" width="60%" />
</p>
Đẩy function.zip (đã để trong source) vào Lambda function, vậy là ta đã có 1 Lambda function.

### API Gateway:

Tạo mới 1 API Gateway, tạo 1 resources /orders và tạo POST method.

<p align="center">
<image src="./src/assets/API Gateway.png" alt= "Permission" width="60%" />
</p>

Mở file Home.jsx trong src/Component, sau đó thay thế endpoint (Invoke URL trong mục Stages API Gateway) của bạn vào trong code :

<!-- <p align="center">
<image src="./src/assets/pic1.jpg
" alt= "Permission" width="60%" />
</p> -->

<p align="center">
  <img src="./src/assets/InvokeURL.png" alt="Image 2" width="60%" />
</p>
<p align="center">
  <img src="./src/assets/pic1.jpg" alt="Image 1" width="60%" />
</p>

### Khởi động dự án web:

Di chuyển vào thư mục project, cài đặt các phụ thuộc bằng câu lệnh

```sh
npm install
```

```sh
npm run dev
```

Trang hiển thị giao diện thành công và bạn có thể bắt đầu sử dụng các chức năng:

<p align="center">
  <img src="./src/assets/demo1.png" alt="Image 2" width="60%" />
</p>
<p align="center">
  <img src="./src/assets/demo2.png" alt="Image 1" width="60%" />
</p>

Sau khi thử nghiệm chức năng, kiểm tra data đã có trong DynamoDB hay chưa :

<p align="center">
  <img src="./src/assets/demo3.png" alt="Image 1" width="60%" />
</p>

# Demo:

<p align="center">
  <img src="path/to/image1.png" alt="Image 1" width="45%" />
  <img src="path/to/image2.png" alt="Image 2" width="45%" />
</p>
