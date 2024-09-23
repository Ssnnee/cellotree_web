# CelloTree
An application to create family trees. The UI is highly inspired by
[shadcn/ui](https://ui.shadcn.com/).

## Description
CelloTree is a web  application that allows users to create and share family trees.
Users can add family members, create relationships, and view their family tree.

>! Note:
> This project is still in development and may have some bugs and security issues.
> And the deployed version do not have any database connected to it.

## Content Table
- [How to use](#how-to-use)
    - [Technologies](#technologies)
    - [Features](#features)
- [Contributors](#contributing)



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

## Contributing

This project need a lot of improvement for security and features.
Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.
If you want to contribute, please fork the repository and create a new branch
with your changes and submit a pull request.
Please try at list the make sure the code is working and is buildable.

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
- [ ] Add a English version of the website

#### From me
I am still learning and I am open to any suggestion and help.
If the project help you, please give me a star and share it with your friends
