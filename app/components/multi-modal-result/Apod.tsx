import { APODResponse } from "@/types/nasa-api";
import Image from "next/image";
import Link from "next/link";

const APODResult = ({ result }: { result: APODResponse }) => {
    if ('error' in result || !result.url || result.url === '') return <span>Oops, something wrong happened when getting the picture...</span>;
    return (
      <div className='relative'>
        <div className='rounded-lg w-fit h-fit'>
          <Image
            alt={'title' in result ? result.title : 'Astronomy Picture of The Day'}
            src={'url' in result ? result.url : '/err_img.webp'}
            className='hero-image rounded-xl'
            width={0}
            height={0}
            sizes="responsive"
            style={{ width: "100%", height: "100%", minWidth: "20rem", minHeight: "20rem", objectFit: "cover" }}
            priority
            blurDataURL={'/1x1-767f7f7f.png'}
            placeholder='blur'
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.srcset = '/err_img.webp';
            }}
          />
        </div>
        <div className='absolute top-0 w-full h-full p-6 rounded-lg bg-black/65 opacity-0 hover:opacity-100 transition-opacity flex flex-col justify-end'>
          <h4 className='font-medium'>{result.title}</h4>
          <h5 className='text-white/60'>{result.date}</h5>
          <Link href={result.hdurl} target='_blank' rel="noopener noreferrer" className='cursor-pointer'>See HD Image {'->'}</Link>
        </div>
      </div>
    )
}

export default APODResult;