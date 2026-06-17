import { createFileRoute } from "@tanstack/react-router";
import { DeskShell } from "../randy/DeskShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Meet Randy — your AI head of operations" },
      { name: "description", content: "An interactive portfolio demo of a personal command center run by Randy, a witty AI assistant. Click through a lived-in Desk with rooms for Today, Money, Clients, and more." },
      { property: "og:title", content: "Meet Randy — your AI head of operations" },
      { property: "og:description", content: "Explore a personal command center run by Randy, a clever AI assistant. Demo and Explore modes — no login required." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

function Index() {
  return <DeskShell />;
}
