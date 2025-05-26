import React from "react";

const Service = () => {
  return (
    <section className="bg-gray">
      <div className="container">
        <ul className="grid grid-cols-2 lg:grid-cols-4 gap-5 items-center py-14">
          <li className="flex items-center lg:justify-center lg:flex-1 gap-[15px]">
            <img src="images/ico_freeship.svg" alt="Free Shipping Icon" />
            <span className="text-sm lg:text-base font-semibold">
              Free Shipping Over $50
            </span>
          </li>

          <li className="flex items-center lg:justify-center lg:flex-1 gap-[15px]">
            <img src="images/ico_quality.svg" alt="Quality Assurance Icon" />
            <span className="text-sm lg:text-base font-semibold">
              Quality Assurance
            </span>
          </li>

          <li className="flex items-center lg:justify-center lg:flex-1 gap-[15px]">
            <img src="images/ico_return.svg" alt="Return Policy Icon" />
            <span className="text-sm lg:text-base font-semibold">
              Return within 14 days
            </span>
          </li>

          <li className="flex items-center lg:justify-center lg:flex-1 gap-[15px]">
            <img src="images/ico_support.svg" alt="Support 24/7 Icon" />
            <span className="text-sm lg:text-base font-semibold">
              Support 24/7
            </span>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default Service;
