type SectionHeadingProps = { label: string; title: string };

export function SectionHeading({ label, title }: SectionHeadingProps) {
  return (
    <>
      <p className="mb-3.5 text-[14px] text-faint">{label}</p>
      <h2 className="max-w-[20em] text-[26px] leading-[1.15] font-medium tracking-[-0.01em] sm:text-[30px]">
        {title}
      </h2>
    </>
  );
}
