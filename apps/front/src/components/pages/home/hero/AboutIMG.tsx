interface ICompositionImg {
  imgUrl: string
  alt: string
  variant: 'p1' | 'p2' | 'p3'
  ext: string
  largeImgSuffix: string
}

const compositionImgs: Array<ICompositionImg> = [
  {
    imgUrl: 'afrihiqar-hero-1',
    alt: 'AfriHiqar hero 1',
    variant: 'p1',
    ext: 'jpg',
    largeImgSuffix: '-large',
  },
  {
    imgUrl: 'afrihiqar-hero-2',
    alt: 'AfriHiqar hero 2',
    variant: 'p2',
    ext: 'jpg',
    largeImgSuffix: '-large',
  },
  {
    imgUrl: 'afrihiqar-hero-3',
    alt: 'AfriHiqar hero 3',
    variant: 'p3',
    ext: 'jpg',
    largeImgSuffix: '-large',
  },
]

const imageStylesVariants = {
  p1: 'scale-[1.02]  md:scale-100 md:left-0 top-0 md:-top-3',
  p2: '-translate-y-3 md:-translate-y-0 scale-[1.18] md:scale-100 md:right-0 -top-2 md:top-3 z-20 md:z-auto',
  p3: 'scale-105 md:scale-100 left-0 md:left-[20%] top-0  md:top-24',
}

function ImageComposition({ imageData }: { imageData: ICompositionImg }) {
  /// Prep Images Url for large and small images
  const imgLargeUrl = `/images/${imageData.imgUrl}${imageData.largeImgSuffix}.${imageData.ext}`
  const imgNormalUrl = `/images/${imageData.imgUrl}.${imageData.ext}`

  return (
    <div
      className={`composition-img cursor-pointer w-[33.33333333%] md:w-[55%] relative md:absolute shadow-[0_1rem_3rem_rgba(0,0,0,0.2)] md:shadow-[0_1rem_2.5rem_rgba(0,0,0,0.4)] float-left md:float-none z-10 transition-all duration-200 rounded-sm overflow-hidden border border-accent-gold-8 hover:translate-y-[-5px] hover:shadow-[0_1.5rem_2.5rem_rgba(0,0,0,0.5)] hover:z-30 hover:scale-105 hover:outline hover:outline-4 hover:outline-offset-2 hover:md:outline-offset-4 hover:outline-accent-gold-8/75 hover:lg:outline-8 hover:lg:outline-offset-4 before:absolute before:top-0 before:left-0 before:w-full before:h-full before:z-[31] before:bg-gradient-to-tr before:from-primary-indigo-10/60 before:to-primary-indigo-1/5 ${
        imageStylesVariants[imageData.variant]
      }`}
    >
      <img
        srcSet={`${imgNormalUrl} 300w, ${imgLargeUrl} 1000w`}
        sizes="(max-width: 56.25em) 20vw, (max-width: 37.5em) 30vw, 300px"
        alt={imageData.alt}
        src={imgLargeUrl}
        className="w-full h-auto object-cover"
      />
    </div>
  )
}

export default function AboutIMG({ className }: { className?: string }) {
  return (
    <div
      className={`col-start-2 col-span-12 md:col-start-8  md:col-span-6 mb-8 mt-5 md:my-12 flex lg:flex-none items-start md:items-center lg:items-start
      ${className}`}
    >
      <div className="composition relative block w-full h-[50%] lg:mt-8 ">
        {compositionImgs.map(imageData => (
          <ImageComposition key={imageData.imgUrl} imageData={imageData} />
        ))}
      </div>
    </div>
  )
}
