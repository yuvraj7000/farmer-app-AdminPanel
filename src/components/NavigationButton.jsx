import { useNavigate } from "react-router-dom";

const NavigationButton = ({buttonName, navigation}) => {
  const navigate = useNavigate();
  const handleNavigation = () => {
    navigate(navigation);
  }
  return (
    
    <div className="flex justify-center items-center h-screen">
      <button className="text-2xl h-18 w-50 bg-red-100" onClick={handleNavigation}>{buttonName}</button>
    </div>
  )  
}

export default NavigationButton;