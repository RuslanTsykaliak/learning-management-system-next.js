import { Logo } from "./Logo"
import { SidebarRoutes } from "./SidebarRoutes"

// The Sidebar component renders a sidebar for navigation within the application.
export const Sidebar = () => {
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto bg-white shadow-sm">
      {/* Render the application's logo */}
      <div className="p-6">
        <Logo />
      </div>
      {/* Render the sidebar navigation routes */}
      <div className="flex flex-col w-full">
        <SidebarRoutes />
      </div>
    </div>
  )
}
