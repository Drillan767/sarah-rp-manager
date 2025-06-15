FROM node:22-alpine

# Copy Firebase config and schema
COPY firebase.json .firebaserc dataconnect/ .dataconnect/ package.json yarn.lock ./

RUN yarn add firebase-tools --dev
RUN npx firebase dataconnect:sdk:generate

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

EXPOSE 3000
CMD ["yarn", "start"]