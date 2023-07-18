# Sarah RP Manager

## Introduction 

This projects aim for Sarah to be able to host RP sessions with the best experience possible. 

## Stack

The project runs with Nuxt 3, hosted on Vercel. The backend / database is handled by Supabase. I chose Tailwind and DaisyUI as CSS frameworks to gain some time.

## Features

### Users

A user can create an account, edit their informations, change their profile picture, email, password, etc

### Sarah

Sarah is a role on her own. She can create a RP, add infos in it (title, description, roles (name and how many people can have this role). She obviously can do what other admins can do too.

### Admins

Admins are elected by Sarah. They can manage (edit infos, delete) users, assign roles to users and make a user switch roles. Admins cannot add other admins nor remove the admin role from other users. Only Sarah is able to do so.

### Discussion channels

Once a RP is created, 2 channels are automatically created too. One is aimed for the scenario itself, the other for members to discuss what to do next, react, etc. Sarah and the administrators can create other channels related to the RP with the person of their choice (ie: for better coordination, to signal a problem, etc).

In the disccusion channel, people with multiple roles can switch between them, and other members can see the switching in real time. Administrators can also lock out members that don't have the corresponding roles. For example, if admins decide that only the juge, the lawyers, the defendant and the victim can talk, then the members with any other active role won't be able to speak (the textarea used for sending messages will be disabled, and a role verification will be made before sending each message to the backend)

Also, every informations will be available: the RP's title and descriptions, but also each user's profile + roles to easily see who's who and who's supposed to do what.

## An email should be sent when:

- [ ] Sarah makes the call to see who's here or not
- [ ] The delay for the call is over and users with the "Plan B" role are asked to join

