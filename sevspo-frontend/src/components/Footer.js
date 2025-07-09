import React from "react";
const Footer = () => {
  return (
    <footer className="bg-orange-600 text-sevspo-light mt-16">
      <div className="container mx-auto px-4 py-6 text-center">
        <p>&copy; {new Date().getFullYear()} Sevspo. All Rights Reserved.</p>
        <p className="text-sm text-sevspo-light mt-1">MAXIMUM PERFORMANCE</p>
      </div>
    </footer>
  );
};
export default Footer;
