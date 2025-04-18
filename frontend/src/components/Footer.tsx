
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">
              <span className="text-checkme-pink">Check</span>
              <span className="text-checkme-purple">Me</span>
            </h3>
            <p className="text-gray-400">
              Empowering African women in the fight against breast cancer through accessible screening and education.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white">About</Link></li>
              <li><Link to="/services" className="text-gray-400 hover:text-white">Services</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Patient Resources</h4>
            <ul className="space-y-2">
              <li><Link to="/faq" className="text-gray-400 hover:text-white">FAQs</Link></li>
              <li><Link to="/education" className="text-gray-400 hover:text-white">Education</Link></li>
              <li><Link to="/support" className="text-gray-400 hover:text-white">Support Groups</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Contact Us</h4>
            <p className="text-gray-400">info@checkme.health</p>
            <p className="text-gray-400">+234 800 CHECK ME</p>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Checkme. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
