import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="fixed top-0 left-0 w-full bg-gray-800 text-white p-4 flex justify-between items-center">
        <div className="text-xl">How to Play</div>
        <Link className="text-2xl" to="/">Taphabet</Link>
        <div className="flex space-x-4">
          <div className="text-xl">Settings</div>
          <div className="text-xl">Login</div>
        </div>
    </div>
  );
}

export default Navbar