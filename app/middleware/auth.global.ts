export default defineNuxtRouteMiddleware((to) => {
  if (!import.meta.server) return;
  if (to.path.startsWith("/dmz/")) return;
  if (to.path.startsWith("/api/saml/")) return;

  const { value: access_token } = useCookie("access_token");
  if (!access_token)
    return navigateTo(
      `/dmz/redirect?origin=${encodeURIComponent(to.fullPath)}`,
      { redirectCode: 303 }
    );
});
