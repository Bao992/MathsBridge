import { Component, type ComponentType, type ReactNode } from "react";
import { BrowserRouter, useLocation } from "./Router";
import { WelcomePage } from "../pages/WelcomePage";

interface StartupBoundaryState {
  failed: boolean;
}

class StartupErrorBoundary extends Component<{ children: ReactNode }, StartupBoundaryState> {
  state: StartupBoundaryState = { failed: false };

  static getDerivedStateFromError(): StartupBoundaryState {
    return { failed: true };
  }

  render() {
    if (this.state.failed) return <WelcomePage startupError />;
    return this.props.children;
  }
}

function PhaseOneRoutes() {
  const { pathname } = useLocation();
  const phaseOneRoutes: Record<string, ComponentType> = { "/": WelcomePage };
  const Screen = phaseOneRoutes[pathname] ?? WelcomePage;

  // S1 is the only implemented screen in Phase 1. Other routes fall back to S1
  // until their screen is delivered in its approved later phase.
  return <Screen />;
}

export function App() {
  return (
    <BrowserRouter>
      <StartupErrorBoundary>
        <PhaseOneRoutes />
      </StartupErrorBoundary>
    </BrowserRouter>
  );
}
