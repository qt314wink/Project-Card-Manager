import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import PaintSwirl from "@/pages/PaintSwirl";
import Projects from "@/pages/Projects";
import ProjectDetail from "@/pages/ProjectDetail";
import Nav from "@/components/Nav";
import { ThemeProvider } from "@/components/ThemeProvider";
import { PageTransition } from "@/components/PageTransition";

const queryClient = new QueryClient();

function Router() {
  return (
    <>
      <Nav />
      <PageTransition>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/paint-swirl" component={PaintSwirl} />
          <Route path="/projects" component={Projects} />
          <Route path="/project/:slug" component={ProjectDetail} />
          <Route component={NotFound} />
        </Switch>
      </PageTransition>
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
