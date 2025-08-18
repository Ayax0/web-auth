import type {
  NitroFetchRequest,
  NitroFetchOptions,
  AvailableRouterMethod,
} from "nitropack";

export default function api<ReqT extends NitroFetchRequest = NitroFetchRequest>(
  request: ReqT,
  opts?: NitroFetchOptions<ReqT, AvailableRouterMethod<ReqT>>
) {
  return $fetch(request, {
    ...opts,
    retry: 1,
    retryDelay: 1000,
    retryStatusCodes: [401, 403, 408, 409, 425, 429, 502, 503, 504],
    onResponseError: [
      async ({ request }) => {
        if (request === "/api/auth") return;

        await $fetch("/api/auth", {
          method: "PUT",
          async onResponseError() {
            await navigateTo("/dmz/login");
          },
        });
      },
      ...(opts?.onResponseError
        ? Array.isArray(opts.onResponseError)
          ? opts.onResponseError
          : [opts.onResponseError]
        : []),
    ],
  });
}
