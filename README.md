# CelloTree
An application to create family trees

## Description
CelloTree is a web [mobile](https://github.com/Ssnnee/cello_mob) application
that allows users to create and share family trees.
Users can add family members, create relationships, and view their family tree.

## Content Table
    - [How to use](#how-to-use)
    - [Technologies](#technologies)
    - [Features](#features)
- [Contributors](#contributors)



## How to use

    1. Create a [Clerk account](https://dashboard.clerk.dev/sign-up)
    2. Copy `.env.example` and rename to `.env` and add your keys found in the dashboard.
    ```
    mv .env.example .env
    ```
    3. Run `pnpm install` or `npm install` to install dependencies
    ```
    pnpm install
    ```
    4. Once installed, ./start-database.sh will start the database
    --NOTE: You should have docker installed.
    ```
    ./start-database.sh
    ```
    5. Initialize the prisma database:
    ```
    pnpm db:push
    ```
    6. Start the server
    ```
    pnpm dev
    ```

## Technologies
    - [Next.js](https://nextjs.org/)
    - [Lucia](https://lucia-auth.com/)
    - [Prisma](https://www.prisma.io/)
    - [PostgreSQL](https://www.postgresql.org/)
    - [Shadcn/ui](https://ui.shadcn.com/)
    - [tRPC](https://trpc.io/)


## Main Features
    - Create family members
    - Visualise family tree
    - Share family tree
    - Grant access to family tree
    - Collaborate with family members on a tree if they have access
    - Search for family members and trees

## Todos

- [x] Add verification to the username (check if it is already taken)
- [x] Make the list of tree to reload on delete
- [x] Add a gobal search bar to search for family members and trees
- [x] Add a update
- [x] Find a solution for viewing a tree
- [x] Add a way to note display a private tree
- [x] Check access on acces page
- [x] Check if the tree is private or not before displaying it if someone has the link
- [x] Add a beautiful loading animations
- [ ] Hide routes that are not supposed to be accessed
- [x] Use the capitalize function to capitalize the first letter of the name
- [ ] Add a way to remove spouse relationship
- [ ] Fix errors on checking user authentication on the server from the header
- [ ] Custome 404 page
- [ ] May be add an admin dashboard

