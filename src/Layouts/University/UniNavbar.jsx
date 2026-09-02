import { LogOut } from "lucide-react";
import { useDispatch } from "react-redux";
import { logOut } from "../../features/authSlice";
import { useNavigate } from "react-router-dom";

export default function UniNavbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logOut());
    navigate("/login-page");
  };
  return (
    <nav className="bg-white shadow-sm border-b w-full">
      <div className="flex items-center justify-end px-8 py-4">

        <div className="flex items-center gap-4">
          <button onClick={handleLogout} className="flex items-center gap-2 hover:shadow-lg hover:scale-105 transition-transform px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">
            <LogOut size={18} />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  );
}
