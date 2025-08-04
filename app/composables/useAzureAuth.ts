import type { GenericObject } from "vee-validate";
import { toast } from "vue-sonner";

export default async function (body: GenericObject) {
  const { accessToken } = await useMSALToken();

  await $fetch("/api/auth/token", {
    method: "POST",
    retry: false,
    onRequest({ options }) {
      options.headers = new Headers(options.headers);
      options.headers.append("Authorization", `Bearer ${accessToken}`);
    },
    async onResponse({ response }) {
      if (!response.ok) return;

      await $fetch("/api/auth", {
        method: "PUT",
        onResponse({ response }) {
          if (!response.ok) return;
          navigateTo("/");
        },
        onResponseError() {
          toast.error("Authentifizierung fehlgeschlagen", {
            description:
              "Bitte wenden Sie sich an den Support, wenn das Problem weiterhin besteht.",
          });
        },
      });
    },
    onResponseError() {
      toast.error("Login fehlgeschlagen", {
        description: "Ungültiger Vorgang. Bitte versuchen Sie es erneut.",
      });
    },
  });
}
