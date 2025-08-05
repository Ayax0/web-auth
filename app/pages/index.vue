<script lang="ts" setup>
const { data, refresh } = useAPI("/api/data");
const { data: account, status: accountStatus } = useAPI("/api/account");

function logout() {
  $fetch("/api/auth", {
    method: "DELETE",
    onResponse({ response }) {
      if (!response.ok) return;
      useRouter().push("/dmz/login");
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
            <CardTitle class="text-xl">
              {{ account?.first_name }} {{ account?.last_name }}
            </CardTitle>
            <CardDescription>Willkommen zurück!</CardDescription>
          </CardHeader>
          <CardContent class="text-xs overflow-x-auto">
            <pre>{{ JSON.stringify(data, null, 2) }}</pre>
          </CardContent>
          <CardFooter class="grid gap-2">
            <Button variant="outline" @click="refresh">Refresh</Button>
            <Button variant="destructive" @click="logout">Logout</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  </div>
</template>
