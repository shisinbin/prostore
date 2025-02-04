export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='grid place-content-center min-h-screen w-full p-4'>
      {children}
    </div>
  );
}
