export function Footer() {
  return (
    <footer className="mt-6 border-t border-border py-5">
      <div className="mx-auto max-w-6xl px-4 text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} AtioSport
      </div>
    </footer>
  );
}
