import Sidebar from "./Sidebar";
import PageTransition from "./PageTransition";

const Layout = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const level = user.level || 1;

  const getThemeClass = () => {
    if (level >= 8) return "theme-advanced";
    if (level >= 4) return "theme-intermediate";
    return "theme-basic";
  };

  return (
    <div className={`flex min-h-screen transition-all duration-1000 ${getThemeClass()}`}>
      <Sidebar />
      <div className="flex-1 md:ml-72 p-6 overflow-hidden">
        <PageTransition>
          {children}
        </PageTransition>
      </div>
    </div>
  );
};

export default Layout;
