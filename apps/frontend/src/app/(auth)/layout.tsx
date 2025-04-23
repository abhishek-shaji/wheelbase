import Image from 'next/image';

interface LayoutProps {
  children: React.ReactNode;
}

export default async function Layout({ children }: Readonly<LayoutProps>) {
  // const { data: session } = await getSession({
  //   fetchOptions: {
  //     headers: await headers(),
  //   },
  // });
  //
  // if (session) {
  //   return redirect('/');
  // }

  return (
    <div className="flex w-full min-h-screen">
      <div className="hidden lg:block relative w-1/2 overflow-hidden">
        <Image
          src="/images/174571.jpg"
          alt="Login Visual"
          width={4000}
          height={2250}
          className="w-full h-full object-cover min-h-screen"
        />
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">{children}</div>
      </div>
    </div>
  );
}
