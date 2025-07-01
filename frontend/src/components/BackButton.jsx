import { Link } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";

const BackButton = ({ destination = "/" }) => {
    return (
        <Link
            to={destination}
            className="inline-flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
            <BsArrowLeft className="text-lg" />
            <span>Back</span>
        </Link>
    );
};

export default BackButton;
