interface EditorLayoutProps {
  children?: React.ReactNode;
}

export default function EditorLayout({ children }: EditorLayoutProps) {
  return <div className="container mx-auto grid h-full max-w-[1400px] items-start gap-10 pt-8">{children}</div>;
}
