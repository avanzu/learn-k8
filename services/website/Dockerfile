FROM node:lts-alpine as install
WORKDIR /app
ADD package.json . 
ADD package-lock.json . 
RUN npm ci

FROM node:lts-alpine as build
WORKDIR /app
ADD . .
COPY --from=install /app/node_modules ./node_modules 
RUN npm run build --production

FROM nginx:stable-alpine
ADD ./docker/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /var/www/html
EXPOSE 80
