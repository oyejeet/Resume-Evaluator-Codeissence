import {Link, useLocation} from "react-router";

const TABS = [
    { to: "/", label: "Home" },
    { to: "/upload", label: "ATS" },
    { to: "/jobs", label: "Swipe" },
    { to: "/applied", label: "Applied" },
];

const HIDE_ON = new Set(["/auth"]);

const BottomNav = () => {
    const location = useLocation();
    if (HIDE_ON.has(location.pathname)) return null;

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50">
            <div className="mx-auto max-w-[1200px] px-4 pb-safe">
                <div className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-2xl shadow-lg mb-4 px-2">
                    <ul className="flex items-center justify-between">
                        {TABS.map((tab) => {
                            const active = location.pathname === tab.to;
                            return (
                                <li key={tab.to} className="w-full">
                                    <Link
                                        to={tab.to}
                                        className={
                                            active
                                                ? "flex flex-col items-center gap-1 py-3 text-[#606beb] font-semibold"
                                                : "flex flex-col items-center gap-1 py-3 text-dark-200"
                                        }
                                    >
                                        <span>{tab.label}</span>
                                        {active && <span className="block h-1 w-8 rounded-full primary-gradient" />}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default BottomNav;


