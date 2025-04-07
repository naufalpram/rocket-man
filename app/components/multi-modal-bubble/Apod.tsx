import { APODResponse } from "@/types/nasa-api";
import Image from "next/image";
import Link from "next/link";
import { memo, useCallback } from "react";
import LoadingIndicator from "../loading-multi-modal/LoadingIndicator";
import * as m from 'motion/react-m';
import { LazyMotion, domAnimation } from 'motion/react';
import { useChat } from "@ai-sdk/react";

type SuccessfulAPODResponse = {
  date: string;
  explanation: string;
  hdurl: string;
  media_type: string;
  service_version: string;
  title: string;
  url: string;
};

const APODMedia = memo(({ result }: { result: SuccessfulAPODResponse }) => {
  const renderMedia = useCallback((mediaType: string) => {
    switch (mediaType) {
      case 'image':
        return (
          <>
          <div className='rounded-lg w-fit h-fit'>
            <Image
              alt={result.title}
              src={result.url}
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
          </>
        )
      case 'video':
        return (
          <div className='rounded-lg w-fit h-fit'>
            <iframe src={result.url} allowFullScreen className="w-full h-full min-w-[20rem] min-h-[20rem] object-cover rounded-xl" />
          </div>
        )
      default:
        return null;
    }
  }, [result])

  return (
    <LazyMotion features={domAnimation} strict>
      <m.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className='relative'>
        {renderMedia(result.media_type)}
      </m.div>
    </LazyMotion>
  );
});

APODMedia.displayName = 'APODMedia';

const APODResult = ({ result }: { result: APODResponse }) => {
  const { status } = useChat({
    id: 'chat',
    maxSteps: 5
  });

  if (!result && status === 'streaming') return <LoadingIndicator size="md" />;
  if (!result && status === 'error') return <span>Oops, something wrong happened while getting the content...</span>;
  if ('error' in result) return <span>Error: {result.error.message}</span>;
  return <APODMedia result={result} />;
}

export default APODResult;