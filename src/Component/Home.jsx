import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // Nếu bạn có dùng React Router
import anh1 from "../assets/anh1.webp";
import anh2 from "../assets/anh2.webp";
import anh3 from "../assets/anh3.webp";
import anh4 from "../assets/anh4.webp";
import "./Home.css";

/** Thêm import zod & react-confetti **/
import { z } from "zod";
import Confetti from "react-confetti";

/** Định nghĩa schema cho form đặt hàng:
    - name, address, phone đều là string, không được bỏ trống.
    - phone có regex kiểm tra phải là chữ số (đơn giản). 
**/
const orderSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên người nhận."),
  address: z.string().min(1, "Vui lòng nhập địa chỉ."),
  phone: z
    .string()
    .min(1, "Vui lòng nhập số điện thoại.")
    .regex(/^[0-9]+$/, "Số điện thoại không hợp lệ (chỉ chứa chữ số)."),
});

// advertising text change in navbar
const arrAdvertising = [
  "Shop now before it's too late :)",
  "Free shipping on orders above 500.000 VND",
];

const arrCoffee = [
  {
    nameProduct: "Default Route",
    price: ["300.000 VND", "450.000 VND"],
    Image: anh1,
    Size: ["8OZ", "12OZ"],
    Note: "100% Natural notes of Berries, Chocolate, & Caramel! This coffee has strong berry notes with a sweet caramel finish. Scoring 85+. ",
  },
  {
    nameProduct: "On-call",
    price: ["300.000 VND", "450.000 VND"],
    Image: anh2,
    Size: ["8OZ", "12OZ"],
    Note: "100% Natural notes Cocoa, Cherry, and Maple Syrup! High quality single origin scoring 85+. ",
  },
  {
    nameProduct: "200 OK",
    price: ["300.000 VND", "450.000 VND"],
    Image: anh3,
    Size: ["8OZ", "12OZ"],
    Note: "Caramlized Honey, Chocolate, brown sugar - an excellent morning cup of coffee. ",
  },
  {
    nameProduct: "Sudo",
    price: ["300.000 VND", "450.000 VND"],
    Image: anh4,
    Size: ["8OZ", "12OZ"],
    Note: "Bright notes of peach, honey, with a juicy acidity.",
  },
];

// Component hiển thị mỗi sản phẩm ở homepage
function ProductCard({ coffee }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleDetails = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="ProductList_card" onClick={toggleDetails}>
      <div className="ProductContent">
        <img
          className="ProductList_card-image"
          src={coffee.Image}
          alt="product"
        />
        <h2>{coffee.nameProduct}</h2>
        <p className="Price">
          {coffee.price[0]} / {coffee.price[1]}
        </p>
      </div>
      <div
        className={`ProductDetails ${isOpen ? "open" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <p>
          <strong>Size:</strong> {coffee.Size.join(" / ")}
        </p>
        <p>
          <strong>Note:</strong> {coffee.Note}
        </p>
      </div>
    </div>
  );
}

function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const productListRef = useRef(null);

  // State để mở Form đặt hàng
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);

  // State để mở/đóng modal xác nhận cuối cùng
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // State để hiển thị thông báo đặt hàng thành công (và hiệu ứng pháo hoa)
  const [orderSuccess, setOrderSuccess] = useState(false);

  // State cho bật/tắt Confetti
  const [showConfetti, setShowConfetti] = useState(false);

  // Tạo state cho thông tin sản phẩm + số lượng
  // Vì mỗi sản phẩm có 2 size => "quantities" sẽ là 1 mảng [qtySize0, qtySize1]
  const [cart, setCart] = useState(
    arrCoffee.map(() => ({ quantities: [0, 0] }))
  );

  // Thông tin người nhận
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    address: "",
    phone: "",
  });

  // State lưu lỗi validate (nếu có)
  const [formErrors, setFormErrors] = useState([]);

  // Để chuyển trang (nếu dùng React Router)
  const navigate = useNavigate();

  // Quảng cáo chạy tự động
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % arrAdvertising.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Xử lý mỗi lần orderSuccess = true => cho pháo hoa, rồi 3s sau tắt, chuyển về trang chủ
  useEffect(() => {
    if (orderSuccess) {
      // Bật confetti
      setShowConfetti(true);

      // Tắt confetti và chuyển về homepage sau 3s
      const timer = setTimeout(() => {
        setShowConfetti(false);
        // Chuyển về trang chủ (nếu bạn đang ở Home rồi thì tuỳ ý,
        // có thể scrollTo top hoặc reload,...)
        navigate("/");
      }, 3000);

      // Dọn dẹp khi unmount
      return () => clearTimeout(timer);
    }
  }, [orderSuccess, navigate]);

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? arrAdvertising.length - 1 : prevIndex - 1
    );
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % arrAdvertising.length);
  };

  const handleShopCoffeeClick = () => {
    productListRef.current.scrollIntoView({ behavior: "smooth" });
  };

  // Xử lý mở Form đặt hàng
  const handleOrderNowClick = () => {
    setIsOrderFormOpen(true);
    setOrderSuccess(false); // Reset
  };

  // Tính tổng số lượng và tổng tiền
  const getTotalQuantity = () => {
    return cart.reduce((acc, item) => {
      return acc + item.quantities.reduce((a, b) => a + b, 0);
    }, 0);
  };

  const getTotalPrice = () => {
    let total = 0;
    cart.forEach((cartItem, indexProduct) => {
      cartItem.quantities.forEach((qty, sizeIdx) => {
        const priceString = arrCoffee[indexProduct].price[sizeIdx];
        const priceNumber = Number(
          priceString.replace(" VND", "").replace(/\./g, "")
        );
        total += priceNumber * qty;
      });
    });
    return total;
  };

  // Hàm tăng/giảm số lượng
  const handleIncrement = (productIndex, sizeIndex) => {
    const newCart = [...cart];
    newCart[productIndex].quantities[sizeIndex]++;
    setCart(newCart);
  };

  const handleDecrement = (productIndex, sizeIndex) => {
    const newCart = [...cart];
    if (newCart[productIndex].quantities[sizeIndex] > 0) {
      newCart[productIndex].quantities[sizeIndex]--;
    }
    setCart(newCart);
  };

  // Xử lý thay đổi thông tin người nhận
  const handleCustomerInfoChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Khi người dùng bấm "Xác nhận đặt hàng"
  const handleConfirmOrder = () => {
    // Bước 1: validate bằng zod
    const result = orderSchema.safeParse(customerInfo);

    // Bước 2: Kiểm tra người dùng đã chọn ít nhất 1 sản phẩm chưa
    const totalQty = getTotalQuantity();

    if (!result.success) {
      // Có lỗi validate => setFormErrors để hiển thị
      const zodErrors = result.error.errors.map((err) => err.message);
      setFormErrors(zodErrors);
      return;
    } else if (totalQty === 0) {
      // Không chọn món nào
      setFormErrors(["Bạn chưa chọn sản phẩm nào."]);
      return;
    }

    // Nếu qua được mọi kiểm tra => xoá lỗi cũ, mở modal xác nhận
    setFormErrors([]);
    setIsConfirmModalOpen(true);
  };

  // Người dùng bấm "Đồng ý" trong modal xác nhận
  const handleFinalConfirm = () => {
    setIsConfirmModalOpen(false); // đóng modal xác nhận
    setIsOrderFormOpen(false); // đóng form order

    // Bật cờ orderSuccess => sẽ trigger hiệu ứng pháo hoa + redirect (trong useEffect)
    setOrderSuccess(true);

    // Reset cart & thông tin
    setCart(arrCoffee.map(() => ({ quantities: [0, 0] })));
    setCustomerInfo({ name: "", address: "", phone: "" });
  };

  // Người dùng bấm "Hủy" trong modal xác nhận
  const handleCancelConfirm = () => {
    setIsConfirmModalOpen(false);
  };

  return (
    <>
      {/* Nếu orderSuccess + showConfetti => hiển thị Confetti */}
      {showConfetti && <Confetti />}

      {/* Section 1: Navbar */}
      <section>
        <div className="Navbar">
          <button className="Navbar_button" onClick={handlePrevClick}>
            <i className="fas fa-chevron-left"> </i>
          </button>
          <div className="Navbar_advertising">
            {arrAdvertising[currentIndex]}
          </div>
          <button className="Navbar_button" onClick={handleNextClick}>
            <i className="fas fa-chevron-right"> </i>
          </button>
        </div>
      </section>

      {/* Section 2: Banner */}
      <section>
        <div className="Banner">
          <h1 className="Banner_title">COFFEE, RIGHT NOW</h1>
          <button onClick={handleShopCoffeeClick}>SHOP COFFEE</button>
        </div>
      </section>

      {/* Section 3: Product List */}
      <section ref={productListRef}>
        <div className="ProductList">
          {arrCoffee.map((coffee) => (
            <ProductCard key={coffee.nameProduct} coffee={coffee} />
          ))}
        </div>
      </section>

      {/* Section 4: button for display form order */}
      <section>
        <div className="Order">
          <button onClick={handleOrderNowClick}>Order Now</button>
        </div>
      </section>

      {/* Hiển thị thông báo đặt hàng thành công (nếu có) */}
      {orderSuccess && (
        <div className="OrderSuccessModal">
          <p>Đơn hàng của bạn đã được đặt thành công!</p>
        </div>
      )}

      {/* Form đặt hàng (overlay / modal) */}
      {isOrderFormOpen && (
        <div className="OrderFormOverlay">
          <div className="OrderForm">
            <h2>Đặt hàng</h2>

            {/* Nếu có lỗi validate => hiển thị */}
            {formErrors.length > 0 && (
              <div style={{ color: "red", marginBottom: "10px" }}>
                {formErrors.map((err, idx) => (
                  <div key={idx}>{err}</div>
                ))}
              </div>
            )}

            <div className="OrderFormContainer">
              {/* Cột trái: Liệt kê sản phẩm + nút +/- */}
              <div className="OrderFormLeft">
                {arrCoffee.map((coffee, productIndex) => (
                  <div key={coffee.nameProduct} className="OrderFormProduct">
                    <img src={coffee.Image} alt={coffee.nameProduct} />
                    <div className="OrderFormProductDetails">
                      <h3>{coffee.nameProduct}</h3>
                      {coffee.Size.map((size, sizeIndex) => (
                        <div key={sizeIndex} className="OrderFormSizeRow">
                          <span>
                            {size} - {coffee.price[sizeIndex]}
                          </span>
                          <div className="QuantityButtons">
                            <button
                              onClick={() =>
                                handleDecrement(productIndex, sizeIndex)
                              }
                            >
                              -
                            </button>
                            <span>
                              {cart[productIndex].quantities[sizeIndex]}
                            </span>
                            <button
                              onClick={() =>
                                handleIncrement(productIndex, sizeIndex)
                              }
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Cột phải: Thông tin tổng hợp + Nhập thông tin người nhận */}
              <div className="OrderFormRight">
                <h3>Tổng quan</h3>
                <p>
                  Tổng số lượng: <strong>{getTotalQuantity()}</strong>
                </p>
                <p>
                  Tổng tiền:{" "}
                  <strong>{getTotalPrice().toLocaleString()} VND</strong>
                </p>

                <h3>Thông tin người nhận</h3>
                <div className="CustomerInfo">
                  <label>
                    Tên người nhận:
                    <input
                      type="text"
                      name="name"
                      value={customerInfo.name}
                      onChange={handleCustomerInfoChange}
                    />
                  </label>
                  <label>
                    Địa chỉ:
                    <input
                      type="text"
                      name="address"
                      value={customerInfo.address}
                      onChange={handleCustomerInfoChange}
                    />
                  </label>
                  <label>
                    Số điện thoại:
                    <input
                      type="text"
                      name="phone"
                      value={customerInfo.phone}
                      onChange={handleCustomerInfoChange}
                    />
                  </label>
                </div>

                <div className="OrderFormButtons">
                  <button onClick={handleConfirmOrder}>
                    Xác nhận đặt hàng
                  </button>
                  <button onClick={() => setIsOrderFormOpen(false)}>
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal xác nhận lần cuối */}
      {isConfirmModalOpen && (
        <div className="ConfirmModalOverlay">
          <div className="ConfirmModal">
            <p>Bạn có chắc chắn với đơn hàng này không?</p>
            <div className="ConfirmModalButtons">
              <button onClick={handleFinalConfirm}>Đồng ý</button>
              <button onClick={handleCancelConfirm}>Hủy</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Home;
