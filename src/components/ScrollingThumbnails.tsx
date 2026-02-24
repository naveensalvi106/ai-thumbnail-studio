const row1Thumbs = [
  "/images/thumb1.jpg",
  "/images/thumb2.jpg",
  "/images/thumb3.jpg",
  "/images/thumb4.jpg",
  "/images/thumb5.jpg",
  "/images/thumb6.jpg",
  "/images/thumb7.jpg",
  "/images/thumb8.avif",
  "/images/thumb9.avif",
  "/images/thumb10.avif",
];

const row2Thumbs = [
  "/images/row2-1.avif",
  "/images/row2-2.avif",
  "/images/row2-3.avif",
  "/images/row2-4.avif",
  "/images/row2-5.avif",
  "/images/row2-6.avif",
  "/images/row2-7.avif",
  "/images/row2-8.avif",
  "/images/row2-9.avif",
];

const row3Thumbs = [
  "/images/row3-1.jpg",
  "/images/row3-2.jpg",
  "/images/row3-3.jpg",
  "/images/row3-4.jpg",
  "/images/row3-5.jpg",
  "/images/row3-6.jpg",
  "/images/row3-7.jpg",
  "/images/row3-8.jpg",
  "/images/row3-9.jpg",
  "/images/row3-10.jpg",
];

interface ScrollRowProps {
  images: string[];
  direction: "left" | "right";
}

const ScrollRow = ({ images, direction }: ScrollRowProps) => {
  const animClass = direction === "left" ? "animate-scroll-left" : "animate-scroll-right";

  return (
    <div className="overflow-hidden w-full">
      <div className={`flex gap-4 ${animClass}`} style={{ width: "max-content" }}>
        {[...images, ...images].map((src, i) => (
          <img
            key={i}
            src={src}
            alt="YouTube thumbnail"
            className="flex-shrink-0 w-[320px] h-[180px] rounded-lg object-cover"
            loading="lazy"
          />
        ))}
      </div>
    </div>
  );
};

const ScrollingThumbnails = () => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <ScrollRow images={row1Thumbs} direction="left" />
      <ScrollRow images={row2Thumbs} direction="right" />
      <ScrollRow images={row3Thumbs} direction="left" />
    </div>
  );
};

export default ScrollingThumbnails;
