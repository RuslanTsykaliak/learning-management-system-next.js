import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { Sidebar } from "./Sidebar"

export const MobileSidebar = () => {
  return (
    // Create a sidebar component that can be shown or hidden on small screens
    <Sheet>
      <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
        {/* Display a menu icon for triggering the sidebar */}
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-white">
        {/* The content of the sidebar, typically containing navigation links */}
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
}
