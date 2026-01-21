export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Return children directly without the admin sidebar layout
  return <>{children}</>
}
