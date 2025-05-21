import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrumbs = ({ paths, onCrumbClick }) => {
  return (
    <nav className="p-4 mt-4 mb-0 flex justify-start">
      <ul className="flex items-center space-x-2 text-2xl">
        {paths.map((path, index) => {
          const handleClick = (e) => {
            
            if (onCrumbClick) {
              e.preventDefault();
              onCrumbClick(index);
            }
          };

          return (
            <li key={index} className="flex items-center">
              {index < paths.length - 1 ? (
                
                <Link
                  to={path.link}
                  onClick={handleClick}
                  className="text-[#2C75B2] hover:underline dark:text-blue-300"
                >
                  {path.name}
                </Link>
              ) : (
                
                <span
                  onClick={handleClick}
                  className="text-black dark:text-white"
                >
                  {path.name}
                </span>
              )}
              {index < paths.length - 1 && (
                <span className="mx-1 text-black dark:text-white">
                  &gt;
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Breadcrumbs;
