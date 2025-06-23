import { useNavigate } from "react-router-dom";

const NavigationButton = ({ buttonName, navigation, className, icon }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(navigation)}
      className={className || "flex items-center justify-center gap-2 m-2 p-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"}
    >
      {icon && <span>{icon}</span>}
      <span>{buttonName}</span>
    </button>
  );
};

export default NavigationButton;