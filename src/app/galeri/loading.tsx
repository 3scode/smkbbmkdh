import { Skeleton } from "@/components/ui/Skeleton";

export default function GaleriLoading() {
  return (
    <div
      className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-4 py-10"
      aria-busy="true"
      aria-label="Memuat galeri"
    >
      <Skeleton className="h-8 w-2/5" />
      <div className="flex gap-2">
        <Skeleton className="h-10 w-24 rounded-full" />
        <Skeleton className="h-10 w-24 rounded-full" />
        <Skeleton className="h-10 w-24 rounded-full" />
      </div>
      <div className="columns-2 gap-4 md:columns-3 [&>*]:mb-4">
        {["h-48", "h-64", "h-56", "h-72", "h-52", "h-60", "h-68", "h-48"].map((h, i) => (
          <Skeleton key={i} className={`w-full rounded-md ${h}`} />
        ))}
      </div>
    </div>
  );
}
