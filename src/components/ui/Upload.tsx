import {
  forwardRef,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type InputHTMLAttributes,
} from "react";
import { FileUp, Loader2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

export interface UploadProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value"> {
  error?: string;
  uploading?: boolean;
  progress?: number;
  fileName?: string | null;
  onClearFile?: () => void;
}

export const Upload = forwardRef<HTMLInputElement, UploadProps>(
  (
    {
      error,
      uploading = false,
      progress,
      fileName = null,
      onClearFile,
      className,
      id,
      onChange,
      ...rest
    },
    ref,
  ) => {
    const [dragging, setDragging] = useState(false);
    const innerRef = useRef<HTMLInputElement | null>(null);

    const setRefs = (el: HTMLInputElement | null) => {
      innerRef.current = el;
      if (typeof ref === "function") ref(el);
      else if (ref) ref.current = el;
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (!file || !innerRef.current) return;
      const dt = new DataTransfer();
      dt.items.add(file);
      innerRef.current.files = dt.files;
      innerRef.current.dispatchEvent(new Event("change", { bubbles: true }));
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
    };

    return (
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => innerRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            innerRef.current?.click();
          }
        }}
        role="button"
        tabIndex={0}
        aria-describedby={rest["aria-describedby"]}
        className={cn(
          "flex cursor-pointer flex-col items-center gap-2 rounded-md border-2 border-dashed border-border bg-surface px-4 py-6 text-center transition-colors",
          "hover:border-text-secondary focus-visible:border-primary focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary-soft",
          dragging && "border-primary bg-primary-soft",
          error && "border-error bg-[#FEF2F2]",
          className,
        )}
      >
        <input
          ref={setRefs}
          id={id}
          type="file"
          className="sr-only"
          aria-invalid={Boolean(error) || undefined}
          onChange={handleChange}
          {...rest}
        />
        {uploading ? (
          <>
            <Loader2 className="size-8 animate-spin text-primary" aria-hidden />
            <p className="text-sm text-text-secondary">
              Mengunggah... {progress ?? ""}
              {progress !== undefined ? "%" : ""}
            </p>
          </>
        ) : fileName ? (
          <>
            <p className="max-w-full truncate text-sm font-semibold text-text-primary">
              {fileName}
            </p>
            {onClearFile && (
              <Button
                variant="danger"
                size="sm"
                icon={<Trash2 className="size-4" aria-hidden />}
                onClick={(e) => {
                  e.stopPropagation();
                  onClearFile();
                }}
              >
                Hapus file
              </Button>
            )}
          </>
        ) : (
          <>
            <FileUp className="size-8 text-text-secondary" aria-hidden />
            <p className="text-sm text-text-secondary">
              <span className="font-semibold text-primary">Klik atau seret file ke sini</span>
              <br />
              JPG / PDF, maks 2MB
            </p>
          </>
        )}
      </div>
    );
  },
);
Upload.displayName = "Upload";
