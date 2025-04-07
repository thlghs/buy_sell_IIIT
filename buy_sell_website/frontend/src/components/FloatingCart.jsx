import { FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";

const FloatingCart = () => (
    <Link to="/cart" className="floating-cart">
        <FaShoppingCart size={28} color="white" />
    </Link>
);

export default FloatingCart;
