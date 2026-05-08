import { FaPhoneAlt } from "react-icons/fa";
import { toast } from "react-toastify";

const numbers = ["08182862824", "08183742775"];

const PhoneNumbers = () => {
  const copyNumber = (num) => {
    navigator.clipboard.writeText(num);
    toast.success("Number copied", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          className: "toastBad",
        },);
  };

  return (
    <div className="container">
      {numbers.map((num) => (
        <div key={num} className="phoneNumberContainer">
          
          {/* Call icon */}
          <a href={`tel:${num}`} className="icon">
            <FaPhoneAlt />
          </a>

          {/* Clickable number (copy) */}
          <span
            className="number"
            onClick={() => copyNumber(num)}
          >
            {num}
          </span>

        </div>
      ))}
    </div>
  );
};



export default PhoneNumbers;