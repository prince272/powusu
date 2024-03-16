interface EditorLayoutProps {
  children?: React.ReactNode;
}

export default function EditorLayout({ children }: EditorLayoutProps) {
  return <div className="container max-w-[1400px] mx-auto grid h-full items-start gap-10 pt-8">{children}</div>;
}
