import { Image } from '@nextui-org/react';
import React from 'react';
import { PhotoProvider, PhotoView } from 'react-photo-view';

type Props = {
  images: string[];
  shift?: boolean;
};

const ImageViewer = (props: Props) => {
  return (
    <div
      onClick={e => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <PhotoProvider speed={() => 300}>
        <div className="flex min-w-full gap-3 overflow-x-scroll my-3 scrollbar-hide snap-x">
          {props.shift ? <div className="sm:ml-[52px] ml-11"></div> : null}
          {props.images.map((image, index) => (
            <PhotoView key={index} src={image}>
              <img
                src={image}
                alt="Tweepspace"
                className="max-h-80 min-w-fit rounded-xl snap-center"
              ></img>
            </PhotoView>
          ))}
        </div>
      </PhotoProvider>
    </div>
  );
};

export default ImageViewer;
