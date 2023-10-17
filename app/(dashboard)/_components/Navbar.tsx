import { NavbarRoutes } from "@/components/NavbarRoutes"
import { MobileSidebar } from "./MobileSidebar"

export const Navbar = () => {
  return (
    // Create a navigation bar component
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
      <MobileSidebar />
      <NavbarRoutes />
    </div>
  );
}
