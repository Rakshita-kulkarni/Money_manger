import { HiBars3, HiComputerDesktop, HiMoon, HiSun } from "react-icons/hi2";
import { useTheme } from "../context/ThemeContext";

const THEMES = [
  { value: "light", icon: HiSun, label: "Light" },
  { value: "dark", icon: HiMoon, label: "Dark" },
  { value: "system", icon: HiComputerDesktop, label: "System" },
];

const Navbar = ({ onMenuClick, title }) => {
  const { theme, setTheme } = useTheme();

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center px-4 gap-4 sticky top-0 z-10">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <HiBars3 className="w-6 h-6" />
      </button>
      <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex-1">{title}</h1>

      {/* Theme Toggle */}
      <div className="flex items-center gap-0.5 bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
        {THEMES.map(({ value, icon: Icon, label }) => (
          <button
            key={value}
            onClick={() => setTheme(value)}
            title={label}
            className={`p-1.5 rounded-md transition-colors ${
              theme === value
                ? "bg-white dark:bg-gray-700 text-blue-600 shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            <Icon className="w-4 h-4" />
          </button>
        ))}
      </div>
    </header>
  );
};

export default Navbar;
