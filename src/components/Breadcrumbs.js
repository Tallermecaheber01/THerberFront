import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrumbs = ({ paths, onCrumbClick }) => {
  return (
    <nav className="p-4 mt-4 mb-0 flex justify-start">
      <ul className="flex items-center space-x-2 text-2xl">
        {paths.map((path, index) => {
          const handleClick = (e) => {
            // Evita la navegación por defecto si se provee el callback
            if (onCrumbClick) {
              e.preventDefault();
              onCrumbClick(index);
            }
          };

          return (
            <li key={index} className="flex items-center">
              {index < paths.length - 1 ? (
                // Si es un breadcrumb que tiene link, usamos Link y le agregamos onClick
                <Link
                  to={path.link}
                  onClick={handleClick}
                  className="text-white hover:underline dark:text-blue-400"
                >
                  {path.name}
                </Link>
              ) : (
                // Último breadcrumb, normalmente no es clickable
                <span
                  onClick={handleClick}
                  className="text-gray-500 dark:text-gray-500"
                >
                  {path.name}
                </span>
              )}
              {index < paths.length - 1 && (
                <span className="mx-1 text-gray-500 dark:text-gray-400">
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
