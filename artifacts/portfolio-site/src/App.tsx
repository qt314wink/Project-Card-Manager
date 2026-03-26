import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import PaintSwirl from "@/pages/PaintSwirl";
import Projects from "@/pages/Projects";
import ProjectDetail from "@/pages/ProjectDetail";
import About from "@/pages/About";
import Blog from "@/pages/Blog";
import Nav from "@/components/Nav";
import { ThemeProvider } from "@/components/ThemeProvider";
import { PageTransition } from "@/components/PageTransition";
import { MusicPlayer } from "@/components/MusicPlayer";
import { MusicProvider } from "@/contexts/MusicContext";
import { CreatorProvider } from "@/contexts/CreatorContext";

const queryClient = new QueryClient();

function Router() {
  return (
    <>
      <Nav />
      <PageTransition>
        <Switch>
          <Route path="/"              component={Home}         />
          <Route path="/paint-swirl"   component={PaintSwirl}   />
          <Route path="/projects"      component={Projects}     />
          <Route path="/project/:slug" component={ProjectDetail}/>
          <Route path="/blog"          component={Blog}         />
          <Route path="/about"         component={About}        />
          <Route                       component={NotFound}     />
        </Switch>
      </PageTransition>
      <MusicPlayer />
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <MusicProvider>
        <CreatorProvider>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
                <Router />
              </WouterRouter>
              <Toaster />
            </TooltipProvider>
          </QueryClientProvider>
        </CreatorProvider>
      </MusicProvider>
    </ThemeProvider>
  );
}

export default App;
