<script lang="ts" setup>
import { toTypedSchema } from "@vee-validate/zod";
import { schema as loginSchema } from "~~/shared/schema/login";

const schema = toTypedSchema(loginSchema);
</script>

<template>
  <div
    class="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10"
  >
    <div class="flex w-full max-w-sm flex-col gap-6">
      <div class="flex flex-col gap-6">
        <Card>
          <CardHeader class="text-center">
            <CardTitle class="text-xl">Willkommen zurück</CardTitle>
            <CardDescription>
              Melden Sie sich mit Ihrem Konto an
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid gap-6">
              <div class="flex flex-col gap-4">
                <Button variant="outline" class="w-full" @click="useAzureAuth">
                  <Icon name="logos:microsoft-icon" />
                  Login mit Microsoft
                </Button>
              </div>
              <div
                class="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t"
              >
                <span class="bg-card text-muted-foreground relative z-10 px-2">
                  Oder fortfahren mit
                </span>
              </div>
              <Form
                :validation-schema="schema"
                class="space-y-4"
                @submit="useBasicAuth"
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
                    <div class="flex">
                      <FormLabel class="flex-1">Passwort</FormLabel>
                      <FormDescription class="text-end">
                        <a href="#" class="underline-offset-4 hover:underline">
                          Passwort vergessen?
                        </a>
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Input type="password" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <Button type="submit" class="w-full">Login</Button>
              </Form>
              <div class="text-center text-sm">
                Sie haben noch kein Konto?
                <NuxtLink
                  to="/dmz/register"
                  class="underline underline-offset-4"
                >
                  Registrieren
                </NuxtLink>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
