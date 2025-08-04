<script lang="ts" setup>
import type { GenericObject } from "vee-validate";

import { toast } from "vue-sonner";
import { toTypedSchema } from "@vee-validate/zod";
import { schema as registerSchema } from "~~/shared/schema/register";

const schema = toTypedSchema(registerSchema);

async function submit(body: GenericObject) {
  await $fetch("/api/account", {
    method: "POST",
    body,
    onResponse({ response }) {
      if (!response.ok) return;

      navigateTo("/dmz/login");
      toast.success("Registrierung erfolgreich", {
        description: "Sie können sich jetzt einloggen.",
      });
    },
    onResponseError({ response }) {
      if (response.status === 409)
        toast.error("Benutzername bereits vergeben", {
          description: "Bitte wählen Sie einen anderen Benutzernamen.",
        });
      else
        toast.error("Fehler beim Registrieren", {
          description:
            "Bitte überprüfen Sie Ihre Eingaben und versuchen Sie es erneut.",
        });
    },
  });
}
</script>

<template>
  <div
    class="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10"
  >
    <div class="flex w-full max-w-sm flex-col gap-6">
      <div class="flex flex-col gap-6">
        <Card>
          <CardHeader class="text-center">
            <CardTitle class="text-xl">Registrieren</CardTitle>
            <CardDescription> Erstellen Sie ein neues Konto </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid gap-6">
              <Form
                :validation-schema="schema"
                class="space-y-4"
                @submit="submit"
              >
                <FormField v-slot="{ componentField }" name="username">
                  <FormItem>
                    <FormLabel>Benutzername</FormLabel>
                    <FormControl>
                      <Input type="text" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="password">
                  <FormItem>
                    <FormLabel>Passwort</FormLabel>
                    <FormControl>
                      <Input type="password" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <div class="flex gap-4">
                  <FormField
                    v-slot="{ componentField }"
                    name="first_name"
                    class="flex-1"
                  >
                    <FormItem>
                      <FormLabel>Vorname</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Max"
                          v-bind="componentField"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <FormField
                    v-slot="{ componentField }"
                    name="last_name"
                    class="flex-1"
                  >
                    <FormItem>
                      <FormLabel>Nachname</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Mustermann"
                          v-bind="componentField"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                </div>
                <FormField v-slot="{ componentField }" name="email">
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="name@example.com"
                        v-bind="componentField"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <Button type="submit" class="w-full">Registrieren</Button>
              </Form>
              <div class="text-center text-sm">
                Sie haben bereits ein Konto?
                <NuxtLink to="/dmz/login" class="underline underline-offset-4">
                  Login
                </NuxtLink>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
