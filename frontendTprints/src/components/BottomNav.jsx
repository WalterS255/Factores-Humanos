import { NavLink } from "react-router-dom";
import { navItems } from "./navItems";

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 dark:bg-background-dark dark:border-gray-700">
      <ul className="flex justify-around py-2">
        {navItems.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                [
                  "flex flex-col items-center gap-1 px-3 py-1 rounded-lg text-xs",
                  isActive ? "text-primary" : "text-gray-500 dark:text-gray-300",
                ].join(" ")
              }
            >
              <img
                src={item.icon}
                alt={item.label}
                className="w-6 h-6"
              />

              <span className="font-medium">{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}