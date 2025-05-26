import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const ResultPage = () => {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");
  const navigate = useNavigate();

  useEffect(() => {
    if (!status) return;

    if (status === "success") {
      alert("Thanh toán thành công! Đơn hàng của bạn đã được ghi nhận.");
    } else if (status === "cancel") {
      alert("Bạn đã hủy thanh toán.");
    } else {
      alert("Thanh toán thất bại hoặc có lỗi xảy ra.");
    }

    // Điều hướng về trang chủ sau 3s
    setTimeout(() => {
      navigate("/home");
    }, 3000);
  }, [status, navigate]);

  return (
    <div className="text-center mt-10">
      <h2 className="text-2xl font-semibold mb-4">
        Đang xử lý kết quả thanh toán...
      </h2>
      <p>Bạn sẽ được chuyển hướng về trang chủ sau ít giây.</p>
    </div>
  );
};

export default ResultPage;
