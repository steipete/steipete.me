---
title: "Database Transactions with Ecto"
description: "How to use database transactions and Ecto.Multi in Elixir"
preview_image: /images/blog/2018/database-transactions-with-ecto/article-header.png
section: blog
author:
  - Nicolas Dular
author_url:
  - https://twitter.com/NicolasDular
date: 2018-08-14 11:00 UTC
tags: Development, Elixir, Tips
published: true
---

Let’s talk about transactions for a moment. Imagine this: You’re out with a friend and they need some money because they haven’t had time to stop by the bank. You have 10 dollars in your wallet, which you kindly give to them, but when you go to close your wallet, you notice you have 10 dollars in there, which you definitely already took out and gave to your friend. This results in both of you having 10 dollars in your wallets.

Wait... you don’t know about this issue? Well yes, it’s true that this doesn’t really happen in the real world, but with software, anything is possible.

Although it’s nice to have some extra money appear in your wallet, the truth is, it doesn’t really exist. Rather, it was created by an error — an error that could have been prevented with, as you might guess by the title, database transactions!

Today we will explore what database transactions are, what are they used for, and how you can use them nicely in Elixir with `Ecto.Multi`.

## What Are Database Transactions?

Let’s start with an overview of what database transactions are and why we need them. To do this, we’ll continue with an example of transferring money.

In our example database, we have stored how much money two of our users have. It looks like this:

| ID | name | balance |
| -- | ---- | ----- |
| 1  | Alice| 50   |
| 2  | Bob  | 30   |

Now imagine that Bob wants to transfer 10 dollars to Alice. We would need two update statements: one for adding 10 dollars to Alice’s account, and one for subtracting 10 dollars from Bob’s account:

```sql
UPDATE users SET balance = balance + 10 WHERE name = 'Alice';
UPDATE users SET balance = balance - 10 WHERE name = 'Bob';
```

In a perfect world, this would work as expected, resulting in 60 dollars in Alice’s account and 20 dollars in Bob’s account. However, what if one of these update statements produces an error? What if there was, for example, a constraint that no one is allowed to have less than 30 dollars in their account, which would make Bob’s update statement fail? Well, the result would be the following: Alice would gain 10 dollars even though Bob didn’t transfer anything. We just produced 10 dollars that don’t exist.


### Database Transactions to the Rescue!

The above scenario is an old and common problem for database systems, and it can be easily solved by using database transactions. A database transaction is an atomic operation, which means that either every operation within the transaction gets executed, or none of them do.

## How to Do Database Transactions with Ecto

Let’s use the above example and wrap our operations, updating the money from Alice and Bob, within `Repo.transaction`:

```elixir
import Ecto.Changeset, only: [change: 2]

alice = Repo.get!(User, 1)
bob = Repo.get!(User, 2)

Repo.transaction(fn ->
  Repo.update!(change(bob, balance: bob.balance - 10))
  Repo.update!(change(alice, balance: alice.balance + 10))
end)
```

If any part of this transaction were to fail, we would receive an exception (because we’re using the `update` with `!`), and the transaction would roll back. This means neither Bob nor Alice would send or receive money.

However, the famous Alice and Bob example is not something we encounter often in the real world. A more realistic example would be a user registration, where you need to create multiple entities and maybe even send an email. This is what we will look at in our next example where we will also use `Ecto.Multi`.


## Using Ecto.Multi

Most applications have some sort of signup form. But when there are multiple entities you need to create in your database when a user signs up, this can get complex. In the following example, we have two entities in our service: organizations and users (each organization can have multiple users). When a user signs up for our service, we need to create a new organization, create a new user, add the user to the organization, and send the user a confirmation email.

This all would be possible to do with `Repo.transaction`; however, `Repo.transaction` only returns an `:ok` tuple with the last statement of the function. To make it nicer to receive each entity of our transaction, we can use `Ecto.Multi`, which is a structure for multiple repo operations.

With `Ecto.Multi.new`, we create a new `Ecto.Multi` struct where we can add other Ecto operations (like `insert`, `update`, and `delete`) with a changeset. When we want to create a user in the new organization, we can use `Multi.run`, which executes a function that receives all the already inserted entries as a parameter. In the end, we will send a confirmation email, where we call another function that returns `{:ok, email}` or `{:error, reason}`. If any operation of the multi struct returns an `:error`, every operation gets rolled back.

In the end, we call `Repo.transaction` with the multi struct and receive either `:ok` with a map of each operation, or an `error` with the `failed_operation`, `failed_value`, and changes that would have gone through:

```elixir
alias Ecto.Multi

multi_struct = Multi.new
|> Multi.insert(:organisation, Organisation.changeset(%{name: "PSPDFKit"}))
|> Multi.run(:user, fn %{organisation: organisation} ->
    User.changeset(User, user_params)
    |> Ecto.Changeset.put_assoc(organisation)
    |> Repo.insert # returns a {:ok, user} or {:error, changeset}
  end)
|> Multi.run(:confirmation_email, fn %{user: user} ->
    send_confirmation_email(user) # also returns {:ok, email} or {:error, reason}
  end)


case Repo.transaction(multi_struct) do
  {:ok, %{organisation: organisation, user: user, confirmation_email: email}} ->
    # The operation was sucessful and we can access the results via the keys of each operation.

  {:error, :user, user_changeset, _changes_so_far} ->
    # Inserting the new user failed. We receive the errors as a changeset and can
    # return those errors to our UI.

  {:error, :org, org_changeset, _changes_so_far} ->
    # Something went wrong with inserting the organization.

  {:error, :confirmation_email, error, _changes_so_far} ->
    # Something went wrong with sending the confirmation email.
end

```

# Conclusion

While other libraries also give us the ability to handle database transactions, Ecto really shines in the way it abstracts transactions through `Ecto.Multi`. It not only handles a transaction itself, but it also provides us with an easy way to handle errors for specific operations within the transaction.
