FROM node:22-alpine

WORKDIR /app

# Copy Firebase config and schema
COPY firebase.json .firebaserc package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

EXPOSE 3000
CMD ["serve", "-s", "dist", "-p", "3000"]