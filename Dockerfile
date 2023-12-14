FROM node:20 AS base

FROM base AS deps
WORKDIR /dark-pref
COPY package*.json ./
RUN npm i
RUN npx playwright install-deps
RUN npx playwright install


# Copy over node modules for dev
FROM deps AS dev
WORKDIR /dark-pref
COPY --from=deps /dark-pref/node_modules ./node_modules
COPY . .
