import Image from 'next/image';
import loader from '@/assets/loader.gif';

function LoadingPage() {
  return (
    <div className='h-screen w-screen grid place-content-center'>
      <Image src={loader} alt='Loading...' height={150} width={150} />
    </div>
  );
}

export default LoadingPage;
