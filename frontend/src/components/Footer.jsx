import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-yellow-400 text-black">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">

          {/* Company Info */}
          <div className="flex flex-col items-start space-y-4 w-full md:w-1/5">
            <Link to="/" className="flex items-start">
              <img
                src="/images/Logos/MAR.png"
                alt="MAR_logo"
                className="w-24 h-18 transition-transform duration-300 hover:scale-105"
              />
            </Link>
            <h3 className="text-4xl font-bold">Ma Amma Ruchulu</h3>
            <p className="max-w-xs">
              Fresh pickle & products delivered to your doorstep.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-start w-full md:w-1/5">
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-left">
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/orders">Orders</Link></li>
            </ul>
          </div>

          {/* Policies */}
          <div className="flex flex-col items-start w-full md:w-1/5">
            <h4 className="text-lg font-semibold mb-4">Policies</h4>
            <ul className="space-y-3 text-left">
              <li><Link to="/terms-conditions">Terms & Conditions</Link></li>
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/refund-policy">Refund Policy</Link></li>
              <li><Link to="/shipping-policy">Shipping Policy</Link></li>
              <li><Link to="/cancellation-policy">Cancellation Policy</Link></li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="flex flex-col items-start w-full md:w-1/5">
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <ul className="space-y-3 text-left">

              {/* Facebook */}
              <li className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-primary-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook</span>
              </li>

              {/* Twitter */}
              <li className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-primary-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.954 4.569c-.885.392-1.83.656-2.825.775 1.014-.608 1.794-1.574 2.163-2.724-.949.564-2.005.974-3.127 1.195a4.92 4.92 0 00-8.38 4.482C7.69 8.094 4.067 6.13 1.64 3.162c-.517.886-.813 1.918-.813 3.022 0 2.084 1.065 3.92 2.682 4.998-.99-.031-1.918-.303-2.728-.755v.077c0 2.91 2.07 5.338 4.82 5.89-.504.137-1.034.211-1.58.211-.387 0-.763-.037-1.13-.107.763 2.381 2.977 4.115 5.6 4.165A9.867 9.867 0 010 21.543a13.94 13.94 0 007.548 2.212c9.057 0 14.01-7.496 14.01-13.986 0-.21-.006-.423-.016-.633A9.936 9.936 0 0024 4.59z"/>
                </svg>
                <span>Twitter</span>
              </li>

              {/* Instagram */}
              <li className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-primary-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.056 1.97.246 2.43.415a4.92 4.92 0 011.69 1.09 4.92 4.92 0 011.09 1.69c.169.46.359 1.26.415 2.43.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.056 1.17-.246 1.97-.415 2.43a4.902 4.902 0 01-2.78 2.78c-.46.169-1.26.359-2.43.415-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.056-1.97-.246-2.43-.415a4.92 4.92 0 01-1.69-1.09 4.92 4.92 0 01-1.09-1.69c-.169-.46-.359-1.26-.415-2.43C2.175 15.747 2.163 15.367 2.163 12s.012-3.584.07-4.85c.056-1.17.246-1.97.415-2.43a4.92 4.92 0 011.09-1.69 4.92 4.92 0 011.69-1.09c.46-.169 1.26-.359 2.43-.415C8.416 2.175 8.796 2.163 12 2.163z"/>
                </svg>
                <span>Instagram</span>
              </li>

            </ul>
          </div>

          {/* Contact Info (LAST) */}
          <div className="flex flex-col items-start w-full md:w-1/5">
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-4 text-left">
              <li className="flex items-start space-x-3">
  <span>
    <svg
      className="w-5 h-5 text-primary-400 flex-shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  </span>

  <a
    href="https://maps.google.com/maps?q=16.2681083%2C80.3582567&z=17&hl=en"
    target="_blank"
    rel="noopener noreferrer"
    className="hover:underline cursor-pointer"
  >
    <div className="leading-relaxed">
      <p className="font-medium">PS Sweets & Mart</p>
      <p>Naidu Peta, Potturu</p>
      <p>Andhra Pradesh – 522005</p>
    </div>
  </a>
</li>

              <li className="flex items-start space-x-3">
                <span>
                   <svg className="w-5 h-5 text-primary-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                </span>
                <span>+91 9121942070</span>
              </li>
              <li className="flex items-start space-x-3">
                <span> <svg className="w-5 h-5 text-primary-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg></span>
                <span>maammaruchulur@gmail.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="text-center text-sm">
            &copy; {new Date().getFullYear()} Ma Amma Ruchulu. All rights reserved. | Developed by{" "}
            <a href="https://www.buildyourvision.in" target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline">
              Build Your Vision
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
