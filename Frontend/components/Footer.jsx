import React from "react";

const Footer = () => {
  return (
    <footer className="w-full py-12 px-6 mt-auto bg-stone-100 text-sm tracking-wide">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 max-w-7xl mx-auto">
        <div className="text-lg font-bold text-stone-900">Heirloom Ledger</div>

        <div className="flex flex-wrap justify-center gap-8">
          <a
            href="#"
            className="text-stone-500 hover:text-stone-800 hover:underline transition-all duration-500"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="text-stone-500 hover:text-stone-800 hover:underline transition-all duration-500"
          >
            Terms of Service
          </a>
          <a
            href="#"
            className="text-stone-500 hover:text-stone-800 hover:underline transition-all duration-500"
          >
            Nutrition Disclosure
          </a>
          <a
            href="#"
            className="text-stone-500 hover:text-stone-800 hover:underline transition-all duration-500"
          >
            Contact Support
          </a>
        </div>

        <div className="text-orange-800">
          © 2024 Heirloom Ledger. Elevated Canteen Solutions.
        </div>
      </div>
    </footer>
  );
};

export default Footer;