import { Dialog, TextField, Select, Button, Callout } from "@upstart.gg/style-system/system";
import { useEditor } from "~/editor/hooks/use-editor";
import { PiMagnifyingGlass } from "react-icons/pi";
import { type FormEvent, useState } from "react";
import { tx, css } from "@upstart.gg/style-system/twind";

type Results = {
  total_pages: number;
  error: never;
  results: {
    id: string;
    slug: string;
    width: number;
    height: number;
    color: string;
    blur_hash: string;
    alt_description: string;
    urls: {
      raw: string;
      full: string;
      regular: string;
      small: string;
      thumb: string;
    };
    user: {
      name: string;
    };
  }[];
};

type SearchResponse = Results | { error: string };

type ModalSearchImageProps = {
  onChoose: (url: string, thumbnail?: string) => void;
  onClose: () => void;
  open: boolean;
};

export default function ModalSearchImage({ onChoose, onClose, open }: ModalSearchImageProps) {
  const editor = useEditor();
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<Results | null>(null);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [orientation, setOrientation] = useState("all");
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // form data
    const data = new FormData(e.currentTarget);
    setError(null);
    if (data.get("query")) {
      setQuery(data.get("query") as string);
      const res = await fetch(`/api/v1/search-images?query=${data.get("query")}&orientation=${orientation}`);
      const json = (await res.json()) as SearchResponse;
      setLoading(false);
      if (json.error) {
        return setError(json.error);
      }
      setSearchResults(json as Results);
    }
  };

  async function loadMore() {
    const nextPage = page + 1;
    setPage(nextPage);
    setLoading(true);
    const res = await fetch(
      `/api/v1/search-images?query=${query}&orientation=${orientation}&page=${nextPage}`,
    );
    setLoading(false);
    const json = (await res.json()) as SearchResponse;
    if (json.error) {
      return setError(json.error);
    }
    setSearchResults((existing) => {
      if (!existing) {
        console.log("No results");
        return null;
      }
      return {
        ...existing,
        results: [...(existing?.results ?? []), ...(json as Results).results],
      };
    });
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          // editor.hideModal();
          onClose();
        }
      }}
    >
      <Dialog.Content maxWidth="60dvw" className="overflow-y-clip">
        <Dialog.Title>Search images</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Search images with Unsplash!
        </Dialog.Description>

        <form className="flex items-center gap-x-2" onSubmit={submit}>
          <TextField.Root
            placeholder="Search images…"
            minLength={3}
            required
            name="query"
            className="basis-1/2"
          >
            <TextField.Slot>
              <PiMagnifyingGlass height="16" width="16" />
            </TextField.Slot>
          </TextField.Root>
          <Select.Root name="orientation" defaultValue="all" onValueChange={setOrientation}>
            <Select.Trigger />
            <Select.Content>
              <Select.Item value="all">All orientations</Select.Item>
              <Select.Item value="landscape">Landscape</Select.Item>
              <Select.Item value="portrait">Portrait</Select.Item>
              <Select.Item value="squarish">Squarish</Select.Item>
            </Select.Content>
          </Select.Root>
          <Button variant="solid" type="submit" className="invalid:opacity-50" loading={loading}>
            Search images
          </Button>
        </form>
        {searchResults !== null && searchResults.results.length === 0 && (
          <Callout.Root color="gray" className="my-3">
            <Callout.Text>No results found</Callout.Text>
          </Callout.Root>
        )}
        {error && (
          <Callout.Root color="red" className="mt-3">
            <Callout.Text>{error}</Callout.Text>
          </Callout.Root>
        )}
        <div
          className={tx(
            "py-2 mt-3 px-2 transition-all duration-300",
            css({
              columnCount: 5,
              columnGap: "1rem",
            }),
          )}
        >
          {searchResults?.results.map((result) => (
            <div
              key={result.id}
              style={{
                display: "grid",
                breakInside: "avoid",
                gridTemplateRows: "1fr auto",
                margin: "0",
                marginBottom: "1rem",
              }}
            >
              <img
                src={result.urls.small}
                alt={result.alt_description}
                className="rounded-sm
                hover:scale-105 shadow-sm transition hover:shadow-2xl cursor-pointer"
                style={{
                  gridRow: "1 / -1",
                  gridColumn: "1",
                }}
                onClick={() => {
                  console.log("Image results", result.urls);
                  editor.hideModal();
                  onChoose?.(result.urls.full, result.urls.thumb);
                }}
              />
              <p
                className="text-xs px-2 py-1 bg-black/60 text-white"
                style={{
                  gridRow: "2",
                  gridColumn: "1 / -1",
                }}
              >
                by {result.user.name}
              </p>
            </div>
          ))}
        </div>
        {searchResults && page < searchResults.total_pages && (
          <div className="flex justify-center mt-3">
            <Button loading={loading} variant="solid" size="3" onClick={loadMore}>
              Load more
            </Button>
          </div>
        )}
      </Dialog.Content>
    </Dialog.Root>
  );
}
