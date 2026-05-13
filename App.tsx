import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SpeciesDetail from "./pages/SpeciesDetail";
import Atlas from "./pages/Atlas";
import OrchidZoo from "./pages/OrchidZoo";
import OACS from "./pages/OACS";
import Widgets from "./pages/Widgets";
import Explore from "./pages/Explore";
import Species from "./pages/Species";
import MyCollection from "./pages/MyCollection";
import ResearchCenter from "./pages/ResearchCenter";
import Education from "./pages/Education";
import Partners from "./pages/Partners";
import GetInvolved from "./pages/GetInvolved";
import Ecosystems from "./pages/Ecosystems";
import ConservationHub from "./pages/ConservationHub";
import OrchidUniversity from "./pages/OrchidUniversity";
import Classroom from "./pages/Classroom";
import Societies from "./pages/Societies";
import OrganizationProfile from "./pages/OrganizationProfile";
import ProjectWorkspace from "./pages/ProjectWorkspace";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="light">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/species" element={<Species />} />
            <Route path="/species/:slug" element={<SpeciesDetail />} />
            <Route path="/atlas" element={<Atlas />} />
            <Route path="/collection" element={<MyCollection />} />
            <Route path="/oacs" element={<OACS />} />
            <Route path="/zoo" element={<OrchidZoo />} />
            <Route path="/research" element={<ResearchCenter />} />
            <Route path="/widgets" element={<Widgets />} />
            <Route path="/education" element={<Education />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/get-involved" element={<GetInvolved />} />

            {/* Communities of practice — audience-aware hubs */}
            <Route path="/ecosystems" element={<Ecosystems />} />
            <Route path="/conservation" element={<ConservationHub />} />
            <Route path="/societies" element={<Societies />} />
            <Route path="/university" element={<OrchidUniversity />} />
            <Route path="/classroom" element={<Classroom />} />

            {/* Dynamic profiles & workspaces */}
            <Route path="/org/:slug" element={<OrganizationProfile />} />
            <Route path="/project/:slug" element={<ProjectWorkspace />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
