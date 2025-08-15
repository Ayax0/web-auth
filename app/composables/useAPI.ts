import type {
  NitroFetchRequest,
  AvailableRouterMethod as _AvailableRouterMethod,
} from "nitropack/types";
import type { FetchResult, UseFetchOptions } from "#app";

export type KeysOf<T> = Array<
  T extends T ? (keyof T extends string ? keyof T : never) : never
>;

type AvailableRouterMethod<R extends NitroFetchRequest> =
  | _AvailableRouterMethod<R>
  | Uppercase<_AvailableRouterMethod<R>>;

export default function <
  ResT = void,
  ReqT extends NitroFetchRequest = NitroFetchRequest,
  Method extends AvailableRouterMethod<ReqT> = ResT extends void
    ? "get" extends AvailableRouterMethod<ReqT>
      ? "get"
      : AvailableRouterMethod<ReqT>
    : AvailableRouterMethod<ReqT>,
  _ResT = ResT extends void ? FetchResult<ReqT, Method> : ResT,
  DataT = _ResT,
  PickKeys extends KeysOf<DataT> = KeysOf<DataT>,
  DefaultT = undefined
>(
  req: Ref<ReqT> | ReqT | (() => ReqT),
  opts?: UseFetchOptions<_ResT, DataT, PickKeys, DefaultT, ReqT, Method>
) {
  const _request = useFetch(req, {
    ...opts,
    onResponseError: [
      async ({ request }) => {
        if (request === "/api/auth") return;
        
        await $fetch("/api/auth", {
          method: "PUT",
          async onResponse({ response }) {
            if (!response.ok) return;
            await _request.refresh();
          },
          async onResponseError() {
            await navigateTo("/dmz/login");
          },
        });
      },
      ...(opts?.onResponseError ? [opts.onResponseError] : []),
    ],
  });

  return _request;
}
