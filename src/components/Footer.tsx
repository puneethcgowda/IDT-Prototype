import { Leaf } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid gap-8 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 text-white font-semibold text-lg">
            <Leaf className="w-5 h-5 text-brand-400" /> AgriConnect
          </div>
          <p className="mt-3 text-sm text-gray-400">
            Empowering small landholders by connecting them directly with consumers,
            equipment, market intelligence and government support.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">Platform</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/marketplace" className="hover:text-white">Marketplace</Link></li>
            <li><Link to="/equipment" className="hover:text-white">Equipment Rental</Link></li>
            <li><Link to="/crops" className="hover:text-white">Crops & Prices</Link></li>
            <li><Link to="/schemes" className="hover:text-white">Government Schemes</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">For Users</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/signup" className="hover:text-white">Create Account</Link></li>
            <li><Link to="/login" className="hover:text-white">Log in</Link></li>
            <li><Link to="/about" className="hover:text-white">About the Project</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">Project</h4>
          <p className="text-sm text-gray-400">
            <strong>Topic:</strong> Agriculture as Livelihood
          </p>
          <p className="text-sm text-gray-400 mt-2">
            <strong>Problem statement:</strong> Small land holdings and challenges in
            increasing productivity.
          </p>
        </div>
      </div>
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 text-xs text-gray-500 flex flex-col md:flex-row justify-between gap-2">
          <span>© {new Date().getFullYear()} AgriConnect — Student Project Prototype.</span>
          <span>Built with React, TypeScript & Tailwind CSS.</span>
        </div>
      </div>
    </footer>
  );
}
