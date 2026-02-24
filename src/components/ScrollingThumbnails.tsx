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

// Rows 2 and 3 are placeholders for now
const placeholderThumb = (i: number) => (
  <div
    key={`ph-${i}`}
    className="flex-shrink-0 w-[320px] h-[180px] rounded-lg bg-secondary/60 border border-border"
  />
);

interface ScrollRowProps {
  images: string[];
  direction: "left" | "right";
  placeholders?: boolean;
}

const ScrollRow = ({ images, direction, placeholders }: ScrollRowProps) => {
  const animClass = direction === "left" ? "animate-scroll-left" : "animate-scroll-right";

  if (placeholders) {
    const items = Array.from({ length: 8 });
    return (
      <div className="overflow-hidden w-full">
        <div className={`flex gap-4 ${animClass}`} style={{ width: "max-content" }}>
          {[...items, ...items].map((_, i) => placeholderThumb(i))}
        </div>
      </div>
    );
  }

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
      <ScrollRow images={[]} direction="right" placeholders />
      <ScrollRow images={[]} direction="left" placeholders />
    </div>
  );
};

export default ScrollingThumbnails;
