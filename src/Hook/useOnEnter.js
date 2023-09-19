import { useEffect } from "react";

function useOnEnter(callback) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter" || event.keyCode === 13) {
        callback();
      }
    };

    // Thêm event listener khi hook được sử dụng
    document.addEventListener("keydown", handleKeyDown);

    // Hủy event listener khi component sử dụng hook này được unmount
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [callback]); // Chỉ re-run effect khi callback thay đổi
}

export default useOnEnter;
