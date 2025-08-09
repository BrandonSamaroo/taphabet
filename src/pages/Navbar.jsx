import { Link } from "react-router-dom";
import { IoMdSettings } from "react-icons/io";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi2";

//npm install @headlessui/react@latest
//https://headlessui.com/react/dialog

function Navbar() {
  return (
    <div className="fixed top-0 left-0 w-full bg-gray-800 text-white p-4 flex justify-between items-center">
        <div className="text-2xl cursor-pointer ml-4"><HiOutlineQuestionMarkCircle/></div>
        <Link className="text-2xl cursor-pointer" to="/">Taphabet</Link>
        <div className="flex space-x-4 mr-4">
          <div className="text-2xl my-auto cursor-pointer"><IoMdSettings/></div>
          <div className="text-xl cursor-pointer">Login</div>
        </div>
    </div>
  );
}

export default Navbar