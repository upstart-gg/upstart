import type { SiteContext } from "../shared/context";
import type { NavigateEvent } from "./NavigateEvent";

export class EnpageJavascriptAPI extends EventTarget {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  #ctx: SiteContext<any, any>;

  constructor(
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    ctx: SiteContext<any, any>,
    private pageIndex = 0,
    private pagesCount = 1,
    private pagesSlugs: string[] = [],
  ) {
    super();
    this.#ctx = ctx;
    this.setupListeners();
  }

  private setupListeners() {
    this.addEventListener("beforenavigate", (e) => {
      const evt = e as NavigateEvent;
      const oldIndex = evt.detail.from;
      const newIndex = evt.detail.to;
      const slug = this.pagesSlugs.at(newIndex - 1);

      this.pageIndex = newIndex;
      history.pushState({ page: newIndex }, "", newIndex === 0 ? "/" : slug ? `/${slug}` : undefined);

      this.dispatchEvent(
        new CustomEvent("afternavigate", {
          detail: { from: oldIndex, to: newIndex } satisfies NavigateEvent["detail"],
          bubbles: true,
        }),
      );
    });
  }

  get currentPage() {
    return this.pageIndex;
  }

  get totalPages() {
    return this.pagesCount;
  }

  get context() {
    return this.#ctx;
  }

  nextPage() {
    if (this.canGoForward) {
      this.dispatchEvent(
        new CustomEvent("beforenavigate", {
          detail: { from: this.currentPage, to: this.currentPage + 1 } satisfies NavigateEvent["detail"],
          bubbles: true,
          cancelable: true,
        }),
      );
    }
  }

  previousPage() {
    if (this.canGoBack) {
      this.dispatchEvent(
        new CustomEvent("beforenavigate", {
          detail: { from: this.currentPage, to: this.currentPage - 1 } satisfies NavigateEvent["detail"],
          bubbles: true,
          cancelable: true,
        }),
      );
    }
  }

  goToPage(index: number) {
    if (index < 0 || index >= this.pagesCount) {
      throw new RangeError(`Invalid page index: ${index}`);
    }
    this.dispatchEvent(
      new CustomEvent("beforenavigate", {
        detail: { from: this.currentPage, to: index },
        bubbles: true,
        cancelable: true,
      }),
    );
  }

  firstPage() {
    this.dispatchEvent(
      new CustomEvent("beforenavigate", {
        detail: { from: this.currentPage, to: 0 } satisfies NavigateEvent["detail"],
        bubbles: true,
        cancelable: true,
      }),
    );
  }

  lastPage() {
    this.dispatchEvent(
      new CustomEvent("beforenavigate", {
        detail: { from: this.currentPage, to: this.pagesCount - 1 },
        bubbles: true,
        cancelable: true,
      }),
    );
  }

  get canGoBack() {
    return this.pageIndex > 0;
  }

  get canGoForward() {
    return this.pageIndex < this.pagesCount - 1;
  }

  get slugs() {
    return this.pagesSlugs;
  }

  async saveDataRecord(dataRecordId: string, record: Record<string, unknown>) {
    const res = await fetch(`%ENPAGE_API_BASE_URL%/sites/%ENPAGE_SITE_ID%/data-records/${dataRecordId}`, {
      method: "POST",
      mode: "cors",
      body: JSON.stringify(record),
      headers: {
        "content-type": "application/json",
      },
    });
    if (res.ok) {
      return res.json();
    }
    throw new Error(`Failed to save data record: ${res.statusText}`);
  }
}
