export function Testimonial({
  citat,
  navn,
  titel,
}: {
  citat: string;
  navn: string;
  titel: string;
}) {
  return (
    <figure className="flex h-full flex-col border border-grey-800 p-8 md:p-10">
      <blockquote className="flex-1 text-lead text-balance">
        <p>&bdquo;{citat}&ldquo;</p>
      </blockquote>
      <figcaption className="mt-8 border-t border-grey-800 pt-6 text-sm">
        <span className="block font-medium">{navn}</span>
        <span className="mt-1 block text-grey-400">{titel}</span>
      </figcaption>
    </figure>
  );
}
