
GA - SEI // Project #3 // Bucketlist App - API
Sam Hawkins
Brandon Hukee

# Calendar

A Bucket list API that includes Users, and Bucket Lists  ( [Click HERE for Client](https://github.com/SEI-TeamMcFinn/bucketlist-app) )


## Structure

Dependencies are stored in [`package.json`](package.json).

The `app` directory contains all models and route files:

+ ./app/models/buckets.js : Defines the schema for creation and management of a users bucket list items
+ ./app/models/user.js : Defines the Schema for user creation and management

+ ./app/routes/bucket_routes.js : defines express routes for creation and managment of a users bucket list items
+ ./app/routes/user_routes.js : defines express routes for user creation and management


The `curl-scripts` directory hold curl script used for CRUD actions against testing the API

+ ./curl-scripts/auth/change-password.sh : Test password changes
+ ./curl-scripts/auth/sign-in.sh : Test Sign-in action
+ ./curl-scripts/auth/sign-out.sh : Test sign-out action
+ ./curl-scripts/auth/sign-up.sh : Test Registration / sign-up action

+ ./curl-scripts/buckets/create.sh : Test bucket list item creation
+ ./curl-scripts/buckets/destroy.sh : Test bucket list item deletion
+ ./curl-scripts/buckets/index.sh : Test indexing for all of a users bucket list items
+ ./curl-scripts/buckets/publicindex.sh : Test indexing for all public bucket list items
+ ./curl-scripts/buckets/show.sh : Test indexing for a single busket list item
+ ./curl-scripts/buckets/update.sh : Test Updates


The `lib` directory is for code that will be used in other places in the
application. The token authentication code is stored in `lib/auth.js`. The
other files in `lib` deal with error handling. `custom_errors.js` is where all
the different custom classes of errors are created. If you need some other kind
of error message, you can add it here. There are also some functions defined
here that are used elsewhere to check for errors. `lib/error_handler.js` is a
function that will be used in all your `.catch`es. It catches errors, and sets
the response status code based on what type of error got thrown.


## API

Scripts are included in [`curl-scripts`](curl-scripts) to test actions.
Add your own scripts to test your custom API.

## ERD

[0f2bb980-071a-11eb-987a-373c55a3c469](https://user-images.githubusercontent.com/21346239/95745277-c36d9880-0c62-11eb-9d4d-cc2f0cbeb744.png)


### Authentication

| Verb   | URI Pattern            | Controller#Action |
|--------|------------------------|-------------------|
| POST   | `/sign-up`             | `users#signup`    |
| POST   | `/sign-in`             | `users#signin`    |
| PATCH  | `/change-password/`    | `users#changepw`  |
| DELETE | `/sign-out/`           | `users#signout`   |

### Event Management
| Verb   | URI Pattern             | Controller#Action   |
|--------|-------------------------|---------------------|
| GET    | `/buckets`              | `buckets#getByOwner`|
| GET    | `/buckets/public`       | `buckets#getByOwner`|
| GET    | `/buckets/:id`          | `buckets#getByDate` |
| POST   | `/buckets`              | `buckets#create`    |
| PATCH  | `/buckets/:id`          | `buckets#update`    |
| DELETE | `/buckets/:id`          | `buckets#delete `   |
