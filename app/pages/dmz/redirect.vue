<script lang="ts" setup>
import { toast } from "vue-sonner";

const { query } = useRoute();
const origin = computed(() => {
  const _origin = query.origin?.toString();
  if (
    _origin &&
    _origin.startsWith("/") &&
    !_origin.startsWith("//") &&
    !_origin.includes("://")
  )
    return _origin;
  return "/";
});

useFetch("/api/auth", {
  method: "PUT",
  server: false,
  onResponse({ response }) {
    if (!response.ok) return;
    navigateTo(origin.value, { redirectCode: 303 });
  },
  onResponseError() {
    navigateTo("/dmz/login", { redirectCode: 303 });
    toast.error("Authentifizierung fehlgeschlagen", {
      description:
        "Ihre Session ist abgelaufen. Bitte melden Sie sich erneut an.",
    });
  },
});
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <Card class="max-w-md w-full text-center shadow-xl">
      <CardContent class="py-10">
        <div class="flex justify-center mb-6">
          <SvgRedirect class="h-32" />
        </div>
        <h1 class="text-xl font-semibold mb-2">Weiterleitung läuft...</h1>
        <p class="text-muted-foreground mb-4">
          Sollten Sie nicht weitergeleitet werden:
        </p>
        <NuxtLink :to="origin">
          <Button variant="link">Hier klicken</Button>
        </NuxtLink>
      </CardContent>
    </Card>
  </div>
</template>
