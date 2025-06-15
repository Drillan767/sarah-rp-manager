FROM node:22-alpine

WORKDIR /app

# Copy Firebase config and schema
COPY firebase.json .firebaserc package.json yarn.lock ./

COPY dataconnect/ ./dataconnect/

RUN npm i -g firebase-tools@latest
RUN npx -y firebase-tools@latest dataconnect:sdk:generate

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

EXPOSE 3000
CMD ["yarn", "start"]