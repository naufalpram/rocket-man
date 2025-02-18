import { APODResponse } from "@/types/nasa-api";
import { Message } from "ai";
import Image from "next/image";
import Link from "next/link";
import { useCallback } from "react";

const APODResult = ({ message, result }: { message: Message, result: APODResponse }) => {
  const renderMedia = useCallback((mediaType: string) => {
    switch (mediaType) {
      case 'image':
        return (
          <>
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
            <h4 className='font-medium'>{'title' in result ? result.title : null}</h4>
            <h5 className='text-white/60'>{'date' in result ? result.date : null}</h5>
            {"hdurl" in result && <Link href={result.hdurl} target='_blank' rel="noopener noreferrer" className='cursor-pointer'>See HD Image {'->'}</Link>}
          </div>
          </>
        )
      case 'video':
        return (
          <div className='rounded-lg w-fit h-fit'>
            {'url' in result ? (<iframe src={result.url} allowFullScreen className="w-full h-full min-w-[20rem] min-h-[20rem] object-cover rounded-xl" />) : (
              <Image
                alt="Astronomy Picture of The Day"
                src="/err_img.webp"
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
            )}
          </div>
        )
      default:
        return null;
    }
  }, [result])

  if (!result) return <span>Getting there...</span>
  if ('error' in result || !result.url || result.url === '') return <span>Oops, something wrong happened while getting the content...</span>;
  return (
    <>
    <div className="mb-3">{message.content}</div>
    <div className='relative'>
      {renderMedia(result.media_type)}
    </div>
    </>
  )
}

export default APODResult;