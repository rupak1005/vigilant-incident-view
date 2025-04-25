
import IncidentDashboard from "@/components/IncidentDashboard";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-300">
      <IncidentDashboard />
      <SonnerToaster position="top-right" />
    </div>
  );
};

export default Index;
