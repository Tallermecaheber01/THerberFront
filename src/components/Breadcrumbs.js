import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrumbs = ({ paths }) => {
  return (
    <nav className="p-4 mt-4 mb-0"> 
      <ul className="flex items-center space-x-2 text-2xl"> 
        {paths.map((path, index) => (
          <li key={index} className="flex items-center">
            {index < paths.length - 1 ? (
              <Link
                to={path.link}
                className="text-white hover:underline dark:text-blue-400"> 
                {path.name}
              </Link>
            ) : (
              <span className="text-gray-500 dark:text-gray-500"> 
                {path.name}
              </span>
            )}
            {index < paths.length - 1 && (
              <span className="mx-1 text-gray-500 dark:text-gray-400">
                &gt;
              </span>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Breadcrumbs;
