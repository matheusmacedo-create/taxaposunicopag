import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Icon } from "@/components/ui/icon";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <img 
              src="/logo-unicopag.png" 
              alt="UnicoPag" 
              className="h-8 w-auto object-contain logo-unicopag"
            />
            <span className="text-sm text-gray-500 ml-2">PoS</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link to="/" className="transition-colors hover:text-primary">
              Propostas
            </Link>
            <Link to="/dashboard" className="transition-colors hover:text-primary">
              Dashboard
            </Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <Icon name="user" className="h-4 w-4" />
                <span className="hidden md:inline">{user?.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleLogout}>
                <Icon name="logout" className="mr-2 h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
              >
                <Icon name="menu" size={24} />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col space-y-4 pt-6">
                <Link to="/" className="text-lg font-medium hover:text-primary">
                  Propostas
                </Link>
                <Link to="/dashboard" className="text-lg font-medium hover:text-primary">
                  Dashboard
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;