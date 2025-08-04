import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["shadcn-nuxt", "@vueuse/nuxt", "@nuxt/icon", "@nuxtjs/color-mode"],
  runtimeConfig: {
    tokenSecret: "",
    disableAuth: "FALSE",
    public: {
      accessTokenTimeout: "900000",
      refreshTokenTimeout: "2592000000",
      msalClientId: "",
      msalAuthority: "",
      msalRedirectUri: "",
    },
  },
  css: ["~/assets/css/tailwind.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  shadcn: {
    prefix: "",
    componentDir: "./app/components/ui",
  },
  colorMode: {
    classSuffix: "",
  },
});
