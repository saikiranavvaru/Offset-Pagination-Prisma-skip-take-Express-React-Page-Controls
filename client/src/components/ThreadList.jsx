
import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getThreads } from "../services/threads.service";
import ThreadItem from "./ThreadItem.jsx";

export default function ThreadList() {
  const [page, setPage] = useState(1);

  const {
    data,
    isPending,
    isError,
    error,
    isPlaceholderData,
  } = useQuery({
    queryKey: ["threads", { page }],
    queryFn: () => getThreads(page),
    placeholderData: keepPreviousData,
  });

  if (isPending) return <p className="muted">Loading threads…</p>;

  if (isError) {
    return (
      <p className="error">
        Could not load threads: {error.message}
      </p>
    );
  }

  const threads = data?.threads ?? [];

  return (
    <>
      {threads.length === 0 ? (
        <p className="muted">No threads found.</p>
      ) : (
        <ul className="threads">
          {threads.map((thread) => (
            <ThreadItem key={thread.id} thread={thread} />
          ))}
        </ul>
      )}

      <div className="pagination">
        <button
          type="button"
          onClick={() => setPage((oldPage) => Math.max(oldPage - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>

        <span>
          Page {page} of {Math.max(1, Math.ceil((data?.total ?? 0) / 10))}
        </span>

        <button
          type="button"
          onClick={() => setPage((oldPage) => oldPage + 1)}
          disabled={!data?.hasMore || isPlaceholderData}
        >
          Next
        </button>
      </div>
    </>
  );
}
