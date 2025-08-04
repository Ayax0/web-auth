FROM node:slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
WORKDIR /app

COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

RUN mkdir .data
RUN touch .data/db.sqlite
RUN pnpm run db:migrate

FROM base
WORKDIR /app
COPY --from=build /app/.output .
COPY --from=build /app/.data/db.sqlite .data/db.sqlite

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "server/index.mjs"]
