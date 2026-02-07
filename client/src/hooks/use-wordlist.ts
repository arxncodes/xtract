import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import type { GenerateWordlistRequest, WordlistResponse } from "@shared/schema";

/**
 * Use same-origin requests.
 * On Render, frontend + backend share the same domain.
 */
async function fetchJSON<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include",
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Request failed");
  }

  return res.json();
}

/* GET /api/history */
export function useHistory() {
  return useQuery({
    queryKey: ["wordlist-history"],
    queryFn: () =>
      fetchJSON<WordlistResponse[]>(api.wordlist.history.path),
  });
}

/* POST /api/generate */
export function useGenerateWordlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GenerateWordlistRequest) =>
      fetchJSON<WordlistResponse>(api.wordlist.generate.path, {
        method: "POST",
        body: JSON.stringify(data),
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wordlist-history"] });
    },
  });
}
