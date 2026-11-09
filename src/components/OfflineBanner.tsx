interface OfflineBannerProps {
  offline: boolean;
}

export function OfflineBanner({ offline }: OfflineBannerProps) {
  if (!offline) return null;

  return (
    <p className="offline-banner" role="status">
      You’re offline. Sign in requires an internet connection.
    </p>
  );
}
