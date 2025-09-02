import fs from "node:fs/promises";
import express from "express";

// Constants
const PORT = process.env.PORT || "3008";
const base = process.env.BASE || "/";

// Create http server
const app = express();

// Add Vite or respective production middlewares
const { createServer } = await import("vite");
const vite = await createServer({
  server: {
    middlewareMode: true,
    warmup: true,
  },
  appType: "custom",
  base,
});

app.use(vite.middlewares);

// Local image search for testing
app.get("/api/v1/search-images", (req, res) => {
  if (!process.env.UNSPLASH_ACCESS_KEY) {
    console.error("UNSPLASH_ACCESS_KEY is not set");
  }
  if (req.query.orientation === "all") {
    // biome-ignore lint/performance/noDelete: <explanation>
    delete req.query.orientation;
  }
  const params = new URLSearchParams({
    per_page: "20",
    content_filter: "high",
    ...req.query,
  });

  params.set("client_id", process.env.UNSPLASH_ACCESS_KEY);

  fetch(`https://api.unsplash.com/search/photos?${params}`, {
    headers: {
      "Accept-Version": "v1",
    },
  })
    .then(async (response) => {
      const data = await response.json();
      if (data.errors) {
        return res.json({ error: data.errors[0] });
      }
      res.json(data);
    })
    .catch((error) => {
      res.json({ error });
    });
});

// Serve HTML
app.use("*", async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, "");
    // Always read fresh template in development
    let template = await fs.readFile("./index.html", "utf-8");
    template = await vite.transformIndexHtml(url, template);
    const render = (await vite.ssrLoadModule("/src/editor/demo/entry-server.tsx")).render;
    const fullUrl = new URL(`http://localhost:${PORT}${req.originalUrl}`);
    const rendered = await render(fullUrl);
    const html = template.replace(`<!--ssr-outlet-->`, rendered);
    res.status(200).set({ "Content-Type": "text/html" }).send(html);
  } catch (e) {
    vite?.ssrFixStacktrace(e);
    console.log(e.stack);
    res.status(500).end(e.message);
  }
});

// Start http server
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
