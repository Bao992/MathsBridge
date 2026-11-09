import {
  createContext,
  use,
  useCallback,
  useEffect,
  useState,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type PropsWithChildren,
} from "react";

interface RouterContextValue {
  pathname: string;
  navigate: (to: string) => void;
}

const RouterContext = createContext<RouterContextValue | null>(null);

function currentPathname(): string {
  return window.location.pathname;
}

export function BrowserRouter({ children }: PropsWithChildren) {
  const [pathname, setPathname] = useState(currentPathname);

  useEffect(() => {
    const handlePopState = () => setPathname(currentPathname());
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = useCallback((to: string) => {
    const destination = new URL(to, window.location.origin);
    if (destination.origin !== window.location.origin) {
      window.location.assign(destination.href);
      return;
    }

    window.history.pushState({}, "", `${destination.pathname}${destination.search}${destination.hash}`);
    setPathname(destination.pathname);
  }, []);

  return (
    <RouterContext value={{ pathname, navigate }}>
      {children}
    </RouterContext>
  );
}

export function useLocation(): RouterContextValue {
  const location = use(RouterContext);
  if (!location) throw new Error("useLocation must be used within BrowserRouter.");
  return location;
}

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
}

export function Link({ to, onClick, target, download, ...props }: LinkProps) {
  const { navigate } = useLocation();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      target === "_blank" ||
      download !== undefined
    ) {
      return;
    }

    const destination = new URL(to, window.location.origin);
    if (destination.origin !== window.location.origin) return;

    event.preventDefault();
    navigate(`${destination.pathname}${destination.search}${destination.hash}`);
  }

  return <a {...props} href={to} target={target} download={download} onClick={handleClick} />;
}
